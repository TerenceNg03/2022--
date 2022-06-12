package zju.se.management.controller;

import io.swagger.annotations.Api;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.async.WebAsyncTask;
import zju.se.management.entity.APILog;
import zju.se.management.entity.User;
import zju.se.management.service.APILogService;
import zju.se.management.service.UserService;
import zju.se.management.utils.Response;
import zju.se.management.utils.ResponseData;

import java.util.List;

@RestController
@RequestMapping("/api/statistics")
@ResponseStatus(HttpStatus.OK)
@Api(protocols = "http", consumes = "application/json", produces = "application/json", tags = "统计数据接口")
public class StatisticsController extends BaseController {

    private final UserService userService;
    private final APILogService apiLogService;

    @Autowired
    public StatisticsController(UserService userService, APILogService apiLogService) {
        this.userService = userService;
        this.apiLogService = apiLogService;
    }

    @AllArgsConstructor
    @Getter
    @Setter
    public static class Statistics extends ResponseData {
        private int number;
    }

    @AllArgsConstructor
    @Getter
    @Setter
    public static class ListAPILogs extends ResponseData {
        private List<APILog> logs;
    }

    @GetMapping("/doctors")
    public WebAsyncTask<Response<?>> getDoctorsNumber() {
        return async(() -> ResponseOK(new Statistics(userService.countByRole(User.userType.DOCTOR)),"查询成功"));
    }

    @GetMapping("/patients")
    public WebAsyncTask<Response<?>> getPatientsNumber() {
        return async(() -> ResponseOK(new Statistics(userService.countByRole(User.userType.PATIENT)),"查询成功"));
    }

    @GetMapping("/admins")
    public WebAsyncTask<Response<?>> getAdminsNumber() {
        return async(() -> ResponseOK(new Statistics(userService.countByRole(User.userType.ADMIN)),"查询成功"));
    }

    @GetMapping("/users")
    public WebAsyncTask<Response<?>> getUsersNumber() {
        return async(() -> ResponseOK(new Statistics(userService.countAll()),"查询成功"));
    }

    @GetMapping("/apicounts")
    public WebAsyncTask<Response<?>> getApiCounts() {
        return async(() -> ResponseOK(new Statistics(apiLogService.countAll()),"查询成功"));
    }

    @GetMapping("/apicounts/{type}")
    public WebAsyncTask<Response<?>> getApiCountsByType(@PathVariable String type) {
        return async(() -> ResponseOK(new Statistics(apiLogService.countByStatus(type.toUpperCase())),"查询成功"));
    }

    @GetMapping("/apilogs")
    public WebAsyncTask<Response<?>> getApiLogs() {
        return async(() -> ResponseOK(new ListAPILogs(apiLogService.findAll()),"查询成功"));
    }

    @DeleteMapping("/apilogs")
    @Transactional
    public WebAsyncTask<Response<?>> deleteApiLogs() {
        return async(() -> {
            apiLogService.deleteAll();
            return ResponseOK("删除成功");
        });
    }

}
