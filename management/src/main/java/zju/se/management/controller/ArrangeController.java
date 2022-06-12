package zju.se.management.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.async.WebAsyncTask;
import zju.se.management.entity.Arrange;
import zju.se.management.entity.User;
import zju.se.management.service.ArrangeService;
import zju.se.management.service.UserService;
import zju.se.management.utils.ArrangeListResponseData;
import zju.se.management.utils.BaseException;
import zju.se.management.utils.Response;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api")
@ResponseStatus(HttpStatus.OK)
@Api(protocols = "http", consumes = "application/json", produces = "application/json", tags = "排班接口")
public class ArrangeController extends BaseController {

    private final ArrangeService arrangeService;
    private final UserService userService;
    @Autowired
    public ArrangeController(ArrangeService arrangeService, UserService userService) {
        this.arrangeService = arrangeService;
        this.userService=userService;
    }

    @GetMapping("/arrange/{id}")
    @CrossOrigin(origins = "*")
    @ApiOperation(value = "获取某个医生的排班信息",
            notes = "data: 二维数组，第一维用星期索引，从周日(0)到周六(6)，第二维包含偶数个时间信息，对应若干对起始和结束时间")
    public WebAsyncTask<Response<?>> getArrange(@PathVariable("id") int id) {
        return async(() -> ResponseOK(new ArrangeListResponseData(arrangeService.getArrangesByDoctorId(id)), "查询成功"));
    }

    @PostMapping("/arrange")
    @ApiOperation(value = "添加排班信息", notes = "内部接口")
    public WebAsyncTask<Response<?>> addArrange(
            @RequestParam(value = "id") int id,
            @RequestParam(value = "start_time") String start_time,
            @RequestParam(value = "end_time") String end_time,
            @RequestParam(value = "dayType") String dayType) throws BaseException {
        return async(() -> {
            Arrange arrange = new Arrange();
            User user = userService.getUserById(id);
            arrange.setUser(user);
            SimpleDateFormat format = new SimpleDateFormat("HH:mm:ss");
            try{
                arrange.setStart_time(format.parse(start_time));
                arrange.setEnd_time(format.parse(end_time));
            }
            catch (Exception e){
                throw new BaseException("时间格式错误");
            }
            arrange.setDayType(Arrange.dayEnum.valueOf(dayType.toUpperCase()));
            arrangeService.addArrange(id, arrange);
            return ResponseOK("添加成功");
        });
    }

    @PostMapping("/arrange/reset/{day}")
    @ApiOperation(value = "重置排班信息", notes = "内部接口. day: all, 重置该用户所有排班；day: SUNDAY - SATURDAY, 重置该用户某一天的排班")
    public WebAsyncTask<Response<?>> resetArrange(
            @RequestParam(value = "id") int id,
            @PathVariable("day") String day) throws BaseException {
        return async(() -> {
            if(day.equals("all")){
                arrangeService.deleteArrangeByUserId(id);
            } else {
                arrangeService.resetArrange(id, Arrange.dayEnum.valueOf(day));
            }
            return ResponseOK("重置成功");
        });
    }

}
