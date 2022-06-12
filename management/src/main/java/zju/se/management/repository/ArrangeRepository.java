package zju.se.management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import zju.se.management.entity.Arrange;
import zju.se.management.entity.DoctorInfo;
import zju.se.management.entity.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArrangeRepository extends JpaRepository<Arrange, Integer> {
    boolean existsById(int id);
    void deleteById(int id);
    void deleteAllByUserId(int userId);
    void deleteAllByUserIdAndDayType(int userId, Arrange.dayEnum dayType);
    List<Arrange> findAllByDayType(Arrange.dayEnum dayType);
    List<Arrange> findAllByUserId(int userId);
    List<Arrange> findAllByUserIdAndDayType(int userId,Arrange.dayEnum dayType);
}
