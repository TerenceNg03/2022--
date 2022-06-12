package zju.se.management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import zju.se.management.entity.APILog;

import java.util.List;

public interface APILogRepository extends JpaRepository<APILog, Integer> {
    List<APILog> findAPILogsByStatus(String status);
    int countAPILogsByStatus(String status);

    @Query(value = "SELECT COUNT(*) FROM apilog", nativeQuery = true)
    int countAll();
}
