package zju.se.management.authentication;

import org.jetbrains.annotations.NotNull;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.util.DigestUtils;

import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

public class CryptoUtil {

    private static final Charset charset = StandardCharsets.UTF_8;

    private static @NotNull String hash(@NotNull String plaintext) {
        return DigestUtils.md5DigestAsHex(plaintext.getBytes(charset));
    }

    public static @NotNull String encrypt(String plaintext) {
        return BCrypt.hashpw(hash(plaintext), BCrypt.gensalt());
    }

    public static boolean validate(String plaintext, String hashed) {
        return BCrypt.checkpw(hash(plaintext), hashed);
    }

}
