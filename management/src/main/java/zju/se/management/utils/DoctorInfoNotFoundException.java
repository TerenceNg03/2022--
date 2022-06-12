package zju.se.management.utils;

public class DoctorInfoNotFoundException extends BaseException {
    private static final String exceptionMessage = "该医生不存在";

    public DoctorInfoNotFoundException() {
        this(exceptionMessage);
    }

    public DoctorInfoNotFoundException(String message) {
        super(message);
    }
}
