package zju.se.management.utils;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ApiModel(value = "Response", description = "返回结果")
public class Response<T> {
    public static final int OK = 0;
    public static final int ERROR = -1;

    @ApiModelProperty(value = "返回值，整数，0表示成功，-1表示失败")
    private int code;
    @ApiModelProperty(value = "接口实际数据, JSON {}, 可能为空")
    private T data;
    @ApiModelProperty(value = "返回消息")
    private String message;
}
