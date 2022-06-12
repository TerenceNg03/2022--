package zju.se.management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import zju.se.management.entity.DoctorInfo;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorInfoRepository extends JpaRepository<DoctorInfo, Integer> {
    void deleteById(int id);
    void deleteByUserId(int userId);
    void deleteAllByUserId(int userId);
    boolean existsById(int id);
    List<DoctorInfo> findByDepartment(String department);
    List<DoctorInfo> findByHospital(String hospital);
    List<DoctorInfo> findByHospitalAndDepartment(String hospital, String department);
    List<DoctorInfo> findByUserId(int userId);

    List<DoctorInfo> findById(int id);

}
