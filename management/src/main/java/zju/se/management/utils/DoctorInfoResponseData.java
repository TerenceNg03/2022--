package zju.se.management.utils;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;
import org.jetbrains.annotations.NotNull;
import zju.se.management.entity.DoctorInfo;

@Getter
@Setter
@ApiModel(description = "医生信息响应")
public class DoctorInfoResponseData extends ResponseData {
    @ApiModelProperty(value = "医生的用户ID")
    private final int id;
    private final String userName;
    private final String realName;
    private final String hospital;
    private final String department;

    public DoctorInfoResponseData(@NotNull DoctorInfo doctorInfo) {
        this.id = doctorInfo.getUser().getId();
        this.userName = doctorInfo.getUser().getUserName();
        this.realName = doctorInfo.getUser().getRealName();
        this.department = doctorInfo.getDepartment();
        this.hospital = doctorInfo.getHospital();
    }
}
