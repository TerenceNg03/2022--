package zju.se.management.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.async.WebAsyncTask;
import zju.se.management.authentication.CryptoUtil;
import zju.se.management.entity.DoctorInfo;
import zju.se.management.entity.User;
import zju.se.management.service.DoctorInfoService;
import zju.se.management.service.UserService;
import zju.se.management.utils.*;

import javax.transaction.Transactional;
import java.util.HashSet;
import java.util.List;

@RestController
@RequestMapping("/api")
@ResponseStatus(HttpStatus.OK)
@Api(protocols = "http", consumes = "application/json", produces = "application/json", tags = "医生接口")
public class DoctorInfoController extends BaseController {

    private final DoctorInfoService doctorInfoService;
    private final UserService userService;

    @Autowired
    public DoctorInfoController(DoctorInfoService doctorInfoService, UserService userService) {
        this.doctorInfoService = doctorInfoService;
        this.userService = userService;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    private static class nameList extends ResponseData {
        List<String> names;
    }

    @GetMapping("/hospital")
    @CrossOrigin(origins = "*")
    @ApiOperation(value = "获取所有医院名称")
    public WebAsyncTask<Response<?>> getHospital() {
        return async(() -> {
            HashSet<String> hospitals = new HashSet<>();
            doctorInfoService.getAllDoctorInfos()
                    .forEach(doctorInfo -> hospitals.add(doctorInfo.getHospital()));
            return ResponseOK(new nameList(hospitals.stream().toList()), "查询成功");
        });
    }

    @GetMapping("/dept")
    @CrossOrigin(origins = "*")
    @ApiOperation(value = "获取所有科室名称")
    public WebAsyncTask<Response<?>> getDepartment() {
        return async(() -> {
            HashSet<String> departments = new HashSet<>();
            doctorInfoService.getAllDoctorInfos()
                    .forEach(doctorInfo -> departments.add(doctorInfo.getDepartment()));
            return ResponseOK(new nameList(departments.stream().toList()), "查询成功");
        });
    }

    @GetMapping("/doctor/all")
    @CrossOrigin(origins = "*")
    @ApiOperation(value = "获取所有医生信息")
    public WebAsyncTask<Response<?>> getDoctorInfo() {
        return async(() -> ResponseOK(new DoctorInfoListResponseData(doctorInfoService.getAllDoctorInfos()),
                "查询成功"));
    }

    @GetMapping("/doctor/dept/{dept}")
    @CrossOrigin(origins = "*")
    @ApiOperation(value = "获取某个科室的所有医生")
    public WebAsyncTask<Response<?>> getDoctorInfoByDept(@PathVariable("dept") String dept) {
        return async(() -> ResponseOK(new DoctorInfoListResponseData(doctorInfoService.getDoctorInfoByDepartment(dept)),
                "查询成功"));
    }

    @GetMapping("/doctor/hospital/{hospital}")
    @CrossOrigin(origins = "*")
    @ApiOperation(value = "获取某个医院的所有医生")
    public WebAsyncTask<Response<?>> getDoctorInfoByHospital(@PathVariable("hospital") String hospital) {
        return async(() -> ResponseOK(new DoctorInfoListResponseData(doctorInfoService.getDoctorInfoByHospital(hospital)),
                "查询成功"));
    }

    @GetMapping("/doctor")
    @CrossOrigin(origins = "*")
    @ApiOperation(value = "获取某个医院的某个科室所有医生的信息", notes = "医院和科室如果有一项为空,则返回所有医生信息")
    public WebAsyncTask<Response<?>> getDoctorInfoByHospitalAndDept(
            @RequestParam("hospital") String hospital,
            @RequestParam("department") String department) {
        if(hospital == null || department == null) {
            return getDoctorInfo();
        }
        return async(() -> ResponseOK(new DoctorInfoListResponseData(doctorInfoService.getDoctorInfoByHospitalAndDepartment(hospital, department)),
                "查询成功"));
    }

    @PostMapping("/doctor")
    @ApiOperation(value = "添加医生信息", notes = "管理前端使用")
    public WebAsyncTask<Response<?>> addDoctorInfo(
            @RequestParam(value = "userName") String userName,
            @RequestParam(value = "realName") String realName,
            @RequestParam(value = "password") String password,
            @RequestParam(value = "department") String department,
            @RequestParam(value = "hospital") String hospital) throws BaseException {
        return async(() -> {
            DoctorInfo doctorInfo = new DoctorInfo();
            User user = new User();
            user.setUserName(userName);
            user.setRealName(realName);
            user.setRole(User.userType.DOCTOR);
            user.setPassword(CryptoUtil.encrypt(password));
            userService.addUser(user);
            doctorInfo.setUser(user);
            doctorInfo.setDepartment(department);
            doctorInfo.setHospital(hospital);
            doctorInfoService.addDoctorInfo(doctorInfo);
            return ResponseOK("添加成功");
        });
    }

    @Transactional
    @DeleteMapping("/doctor/{id}")
    @ApiOperation(value = "删除医生信息", notes = "管理前端使用")
    public WebAsyncTask<Response<?>> deleteDoctorInfo(@PathVariable("id") String id) {
        return async(() -> {
            doctorInfoService.deleteDoctorInfoById(Integer.parseInt(id));
            userService.deleteUserById(Integer.parseInt(id));
            return ResponseOK("删除成功");
        });
    }

    @Transactional
    @DeleteMapping("/doctor")
    @ApiOperation(value = "删除医生信息", notes = "管理前端使用")
    public WebAsyncTask<Response<?>> deleteDoctorInfo(
            @RequestParam(value = "id") String[] id) {
        return async(() -> {
            for(String s : id) {
                doctorInfoService.deleteDoctorInfoById(Integer.parseInt(s));
                userService.deleteUserById(Integer.parseInt(s));
            }
            return ResponseOK("删除成功");
        });
    }

}
