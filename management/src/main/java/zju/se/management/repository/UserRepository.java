package zju.se.management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import zju.se.management.entity.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findDistinctByUserName(String userName);
    List<User> findByRole(User.userType role);
    void deleteByUserName(String userName);
    boolean existsById(int id);
    boolean existsByUserName(String userName);
    int countByRole(User.userType role);

    @Query(value = "SELECT COUNT(*) FROM user", nativeQuery = true)
    int countAll();
}
