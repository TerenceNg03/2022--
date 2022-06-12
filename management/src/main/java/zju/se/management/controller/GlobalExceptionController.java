package zju.se.management.controller;

import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import zju.se.management.utils.Response;

import javax.servlet.http.HttpServletResponse;

@RestControllerAdvice
public class GlobalExceptionController extends BaseController {

    @ExceptionHandler
    public <T> Response<T> exceptionHandler(HttpServletResponse res, Exception e) {
        if(e instanceof HttpRequestMethodNotSupportedException) {
            res.setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
        }
        return ResponseError(e.getMessage());
    }

}
