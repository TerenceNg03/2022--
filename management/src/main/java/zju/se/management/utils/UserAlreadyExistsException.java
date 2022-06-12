package zju.se.management.utils;

public class UserAlreadyExistsException extends BaseException {
    private static final String errorMessage = "用户名已被使用";

    public UserAlreadyExistsException() {
        super(errorMessage);
    }

}
