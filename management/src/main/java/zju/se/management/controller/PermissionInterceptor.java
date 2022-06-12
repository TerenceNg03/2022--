package zju.se.management.controller;

import com.auth0.jwt.interfaces.DecodedJWT;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;
import zju.se.management.authentication.TokenUtil;
import zju.se.management.entity.User;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.net.URI;

@Component
public class PermissionInterceptor extends SessionInterceptor {
    @Override
    public boolean preHandle(
            HttpServletRequest req,
            @NotNull HttpServletResponse res,
            @NotNull Object handler) throws Exception {
        if(isDebug(req)) {
            return true;
        }
        // Check if logged in
        if(!super.preHandle(req, res, handler)){
            return false;
        }
        // Check permission
        if(isApi(req)) {
            URI uri = new URI(req.getRequestURI());
            String[] URIComponents = uri.getPath().split("/");
            /* URI: protocol://domain:port/api/xxx/...
             * We extract the part next to /api/
             * to determine the permission needed
             * For now only ADMIN role has access to privilege APIs,
             * this string is reserved for future use
             **/
            String service = URIComponents[2];
            try{
                return getPermission(req);
            } catch (Exception e) {
                jsonResponse("{\"code\":-1,\"data\":null,\"message\":\"没有访问权限\"}", res);
                return false;
            }
        } else {
            try {
                return getPermission(req);
            } catch (Exception e) {
                res.sendRedirect("/login");
                return false;
            }
        }
    }

    protected boolean getPermission(HttpServletRequest req) throws Exception {
//        HttpSession session = req.getSession();
        String token = req.getHeader("token");
        DecodedJWT decodedJWT = TokenUtil.decodeToken(token);
        if(decodedJWT.getClaim("role").asString().equals(User.userType.ADMIN.toString())) {
            return true;
        } else {
            throw new Exception("No permission");
        }
    }
}
