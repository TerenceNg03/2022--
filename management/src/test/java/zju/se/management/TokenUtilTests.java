package zju.se.management;

import com.auth0.jwt.interfaces.DecodedJWT;
import org.junit.jupiter.api.Test;
import org.springframework.stereotype.Component;
import zju.se.management.entity.User;
import zju.se.management.authentication.TokenUtil;

@Component
public class TokenUtilTests {

    @Test
    public void test() throws Exception {
        User user = new User();
        user.setId(1);
        user.setUserName("admin");
        user.setPassword("123456");
        user.setRole(User.userType.ADMIN);
        String token = TokenUtil.getToken(user);
        System.out.println(token);
        DecodedJWT decodedJWT = TokenUtil.decodeToken(token);
        System.out.println("pass decode");
        System.out.println(decodedJWT.getSignature());
    }
}
