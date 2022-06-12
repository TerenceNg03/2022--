package zju.se.management.utils;

import lombok.Getter;
import lombok.Setter;
import zju.se.management.entity.Arrange;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
public class ArrangeListResponseData extends ResponseData {
    private final List<List<Date>> arranges;

    public ArrangeListResponseData(List<List<Date>> arranges){
        this.arranges = arranges;
    }
}
