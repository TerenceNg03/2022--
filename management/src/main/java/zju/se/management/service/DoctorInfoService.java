package zju.se.management.service;

import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import zju.se.management.entity.DoctorInfo;
import zju.se.management.repository.DoctorInfoRepository;
import zju.se.management.utils.DoctorInfoAlreadyExistsException;
import zju.se.management.utils.DoctorInfoNotFoundException;

import java.util.List;

@Service
public class DoctorInfoService {

    private final DoctorInfoRepository doctorInfoRepository;

    @Autowired
    public DoctorInfoService(DoctorInfoRepository doctorInfoRepository) {
        this.doctorInfoRepository = doctorInfoRepository;
    }

    public List<DoctorInfo> getAllDoctorInfos() {
        return doctorInfoRepository.findAll();
    }

    public List<DoctorInfo> getDoctorInfoById(int id) throws DoctorInfoNotFoundException {
        return doctorInfoRepository.findById(id);
    }
    public List<DoctorInfo> getDoctorInfoByUserId(int userId) throws DoctorInfoNotFoundException {
        return doctorInfoRepository.findByUserId(userId);
    }

    public List<DoctorInfo> getDoctorInfoByDepartment(String department) {
        return doctorInfoRepository.findByDepartment(department);
    }

    public List<DoctorInfo> getDoctorInfoByHospital(String hospital) {
        return doctorInfoRepository.findByHospital(hospital);
    }

    public List<DoctorInfo> getDoctorInfoByHospitalAndDepartment(String hospital, String department) {
        return doctorInfoRepository.findByHospitalAndDepartment(hospital, department);
    }

    public synchronized void deleteDoctorInfoById(int id) throws DoctorInfoNotFoundException {
        doctorInfoRepository.deleteByUserId(id);
    }

    public synchronized void addDoctorInfo(@NotNull DoctorInfo doctorInfo) throws DoctorInfoAlreadyExistsException{
        if(isExist(doctorInfo.getId())) {
            throw new DoctorInfoAlreadyExistsException();
        }
        doctorInfoRepository.save(doctorInfo);
    }

    private boolean isExist(int id) {
        return doctorInfoRepository.existsById(id);
    }
}
