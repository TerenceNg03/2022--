package zju.se.management.authentication;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import zju.se.management.entity.User;

import java.util.Calendar;
import java.util.Date;

public class TokenUtil {

    private static final String secret = "CA706F69-6E57-A237-7CD8-CCC6BD1C8B6B";
    private static final int expireDate = 1;

    public static String getToken(User user) {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DATE, expireDate);
        JWTCreator.Builder builder = JWT.create();
        builder.withClaim("id", user.getId())
                .withClaim("userName", user.getUserName())
                .withClaim("role", user.getRole().toString())
                .withExpiresAt(calendar.getTime());
        return builder.sign(Algorithm.HMAC256(secret));
    }

    public static DecodedJWT decodeToken(String token) {
        JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secret)).build();
        return verifier.verify(token);
    }

    public static Date getExpireDate(String token) {
        DecodedJWT decodedJWT = decodeToken(token);
        return decodedJWT.getExpiresAt();
    }

    public static String getSignature(String token) {
        DecodedJWT decodedJWT = decodeToken(token);
        return decodedJWT.getSignature();
    }

}
