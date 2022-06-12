package zju.se.management.utils;

import lombok.*;
import zju.se.management.entity.Arrange;

import java.util.Date;

@Getter
@Setter
public class ArrangeResponseData extends ResponseData {
    private final int id;
    private final Date start_time;
    private final Date end_time;

    public ArrangeResponseData(Arrange arrange) {
        this.id = arrange.getId();
        this.start_time = arrange.getStart_time();
        this.end_time = arrange.getEnd_time();
    }
}
