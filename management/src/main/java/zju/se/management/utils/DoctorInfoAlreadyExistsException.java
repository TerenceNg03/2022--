package zju.se.management.utils;

public class DoctorInfoAlreadyExistsException extends BaseException {
    private static final String errorMessage = "该用户信息已存在";

    public DoctorInfoAlreadyExistsException() {
        super(errorMessage);
    }

}
