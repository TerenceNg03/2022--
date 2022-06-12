package zju.se.management.utils;

import lombok.*;

@AllArgsConstructor
@Getter
@Setter
public class TokenResponseData extends ResponseData {
    private int userId;
    private String userName;
    private String token;
}
