package zju.se.management.utils;

import lombok.*;
import zju.se.management.entity.User;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class UserListResponseData extends ResponseData {
    private final List<UserResponseData> users;

    public UserListResponseData(List<User> users){
        this.users = new ArrayList<>(users.size());
        for (User user : users) {
            this.users.add(new UserResponseData(user));
        }
    }
}
