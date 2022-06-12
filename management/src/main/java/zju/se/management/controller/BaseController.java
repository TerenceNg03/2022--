package zju.se.management.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.async.WebAsyncTask;
import zju.se.management.utils.Response;
import zju.se.management.utils.ResponseData;

import java.util.List;
import java.util.concurrent.Callable;

@RestController
public class BaseController {

    private final long asyncTimeout = 30 * 1000L;

    @Autowired
    @Qualifier("asyncExecutor")
    private ThreadPoolTaskExecutor executor;

    public WebAsyncTask<Response<?>> async(Callable<Response<?>> callable) {
        return new WebAsyncTask<>(asyncTimeout, executor, callable);
    }

    public <T extends ResponseData> Response<T> ResponseOK(T data, String message) {
        return new Response<>(Response.OK, data, message);
    }

    public <T> Response<T> ResponseOK(String message) {
        return new Response<>(Response.OK, null, message);
    }

    public <T extends ResponseData> Response<T> ResponseError(T data, String message) {
        return new Response<>(Response.ERROR, data, message);
    }

    public <T> Response<T> ResponseError(String message) {
        return new Response<>(Response.ERROR, null, message);
    }
}
