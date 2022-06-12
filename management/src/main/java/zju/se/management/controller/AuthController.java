package zju.se.management.controller;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.google.code.kaptcha.Producer;
import io.swagger.annotations.*;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.async.WebAsyncTask;
import zju.se.management.authentication.CryptoUtil;
import zju.se.management.authentication.TokenUtil;
import zju.se.management.entity.User;
import zju.se.management.service.UserService;
import zju.se.management.utils.*;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.Date;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/oauth")
@ResponseStatus(HttpStatus.OK)
@Api(protocols = "http", consumes = "application/json", produces = "application/json", tags = "认证接口")
public class AuthController extends BaseController {

    private final Producer captchaProducer;
    private final UserService userService;
    private final StringRedisTemplate redisTemplate;

    private final String JWT_NAMESPACE = "jwt:";

    @Autowired
    public AuthController(UserService userService, Producer captchaProducer, StringRedisTemplate redisTemplate) {
        this.userService = userService;
        this.captchaProducer = captchaProducer;
        this.redisTemplate = redisTemplate;
    }

    private String getJwtKey(String key) {
        return JWT_NAMESPACE + key;
    }

    private synchronized void addToWhitelist(String token) {
        try {
            Date expiry = TokenUtil.getExpireDate(token);
            long expirySeconds = expiry.getTime() / 1000;
            long currentSeconds = System.currentTimeMillis() / 1000;
            assert(expirySeconds >= currentSeconds);
            redisTemplate.opsForValue()
                    .set(getJwtKey(TokenUtil.getSignature(token)),
                            token, expirySeconds - currentSeconds, TimeUnit.SECONDS);
        } catch (Exception ignored) {

        }
    }

    public boolean checkWhitelist(String token) {
        try {
            String key = getJwtKey(TokenUtil.getSignature(token));
            if(Boolean.FALSE.equals(redisTemplate.hasKey(key))) {
                return false;
            }
            String storedToken = redisTemplate.opsForValue().get(key);
            if(storedToken != null && storedToken.equals(token)) {
                return true;
            }
        } catch (Exception ignored) {

        }
        return false;
    }

    private synchronized void removeFromWhitelist(String token) {
        try {
            String key = getJwtKey(TokenUtil.getSignature(token));
            if(Boolean.FALSE.equals(redisTemplate.hasKey(key))) {
                return;
            }
            redisTemplate.expire(key, 0, TimeUnit.SECONDS);
        } catch (Exception ignored){

        }
    }

    @PostMapping("/login")
    @ApiOperation(value = "用户登录", notes = "管理前端使用")
    public Response<?> login(
            @RequestParam(value = "userName") String userName,
            @RequestParam(value = "password") String password,
            @RequestParam(value = "captchaKey") String captchaKey,
            @RequestParam(value = "captchaCode") String captchaCode) throws BaseException {
        Response<?> captchaResult = captcha(captchaKey, captchaCode);
        if (captchaResult.getCode() < 0) {
            return captchaResult;
        } else {
            boolean validationResult = CryptoUtil.validate(password, userService.getPasswordByName(userName));
            if (!validationResult) {
                throw new AuthErrorException("密码错误");
            }
            User user = userService.getUserByName(userName);
            String token = TokenUtil.getToken(user);
            addToWhitelist(token);
            return ResponseOK(new TokenResponseData(user.getId(), userName, token), "登录成功");
        }
    }

    @PostMapping("/register")
    @ApiOperation(value = "用户注册", notes = "管理前端使用")
    public Response<?> register(
            @RequestParam(value = "userName") String userName,
            @RequestParam(value = "realName") String realName,
            @RequestParam(value = "password") String password,
            @RequestParam(value = "captchaKey") String captchaKey,
            @RequestParam(value = "captchaCode") String captchaCode) throws UserAlreadyExistsException {
        Response<?> captchaResult = captcha(captchaKey, captchaCode);
        if (captchaResult.getCode() < 0) {
            return captchaResult;
        } else {
            User user = new User();
            user.setUserName(userName);
            user.setRealName(realName);
            user.setPassword(CryptoUtil.encrypt(password));
            user.setRole(User.userType.PATIENT);
            userService.addUser(user);
            return ResponseOK("注册成功");
        }
    }

    @GetMapping("/verify")
    @CrossOrigin(origins = "*")
    @ApiOperation(value = "鉴权，验证登录是否有效")
    public WebAsyncTask<Response<?>> verify(
            HttpServletRequest req, HttpServletResponse res) throws BaseException {
        return async(() -> {
            res.setHeader("Cache-Control", "no-cache, no-store");
            String token = req.getHeader("token");
            if(token == null || token.equals("") || !checkWhitelist(token)) {
                throw new AuthErrorException("未登录");
            }
            DecodedJWT decodedJWT = TokenUtil.decodeToken(token);
            String userName = decodedJWT.getClaim("userName").asString();
            String role = decodedJWT.getClaim("role").asString();
            int userId = decodedJWT.getClaim("id").asInt();
            return ResponseOK(new AccessControlResponseData(userId, userName, role.toUpperCase()), "验证成功");
        });
    }

    @GetMapping("/logout")
    @CrossOrigin(origins = "*")
    @ApiOperation(value = "用户登出", notes = "各系统可用")
    public WebAsyncTask<Response<?>> logout(HttpServletRequest req) {
        return async(() -> {
            String token = req.getHeader("token");
            removeFromWhitelist(token);
            return ResponseOK("登出成功");
        });
    }

    @GetMapping("/captcha")
    @ApiOperation(value = "获取验证码", notes = "管理前端使用")
    public WebAsyncTask<Response<?>> captcha(HttpServletResponse res) throws IOException {
        return async(() -> {
            res.setHeader("Cache-Control", "no-cache, no-store");
            String key = UUID.randomUUID().toString();
            String code = captchaProducer.createText();
            BufferedImage image = captchaProducer.createImage(code);
            ByteArrayOutputStream os = new ByteArrayOutputStream();
            ImageIO.write(image, "jpg", os);
            Base64.Encoder base64 = Base64.getEncoder();
            String base64Img = "data:image/jpeg;base64," + base64.encodeToString(os.toByteArray());
            redisTemplate.opsForValue().set(key, code);
            redisTemplate.expire(key, 3, TimeUnit.MINUTES);
            return ResponseOK(new CaptchaResponseData(key, base64Img),"生成成功");
        });
    }

    @PostMapping("/captcha")
    @ApiOperation(value = "验证验证码", notes = "管理前端使用")
    public Response<?> captcha(
            @RequestParam(value = "key") @NotNull String key,
            @RequestParam(value = "code") String code) {
        if(Boolean.FALSE.equals(redisTemplate.hasKey(key))){
            return ResponseError("验证码已过期");
        } else {
            String answer = redisTemplate.opsForValue().get(key);
            redisTemplate.expire(key, 0, TimeUnit.SECONDS);
            assert answer != null;
            if (!answer.equals(code)) {
                return ResponseError("验证码错误");
            } else {
                return ResponseOK("验证成功");
            }
        }
    }

    @PostMapping("/changePassword")
    @CrossOrigin(origins = "*")
    @ApiOperation(value = "修改密码", notes = "管理前端使用")
    public Response<?> changePassword(
            @RequestParam(value = "userName") @NotNull String userName,
            @RequestParam(value = "oldPassword") @NotNull String oldPassword,
            @RequestParam(value = "newPassword") @NotNull String newPassword) throws UserNotFoundException, AuthErrorException {
        boolean validationResult = CryptoUtil.validate(oldPassword, userService.getPasswordByName(userName));
        if (!validationResult) {
            throw new AuthErrorException("密码错误");
        }
        userService.setPasswordByName(userName, CryptoUtil.encrypt(newPassword));
        return ResponseOK("修改成功");
    }

}
