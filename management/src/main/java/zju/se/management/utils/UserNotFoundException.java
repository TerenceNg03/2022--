package zju.se.management.utils;

public class UserNotFoundException extends BaseException {
    private static final String exceptionMessage = "用户名不存在";

    public UserNotFoundException() {
        this(exceptionMessage);
    }

    public UserNotFoundException(String message) {
        super(message);
    }
}
