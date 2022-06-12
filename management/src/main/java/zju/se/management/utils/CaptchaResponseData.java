package zju.se.management.utils;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CaptchaResponseData extends ResponseData {
    private String key;
    private String image;
}
