package zju.se.management.utils;

import lombok.Getter;
import lombok.Setter;
import zju.se.management.entity.DoctorInfo;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class DoctorInfoListResponseData extends ResponseData {
    private final List<DoctorInfoResponseData> doctorInfos;

    public DoctorInfoListResponseData(List<DoctorInfo> doctorInfos){
        this.doctorInfos = new ArrayList<>(doctorInfos.size());
        for (DoctorInfo doctorInfo : doctorInfos) {
            this.doctorInfos.add(new DoctorInfoResponseData(doctorInfo));
        }
    }
}
