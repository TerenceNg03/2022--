package zju.se.management.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import zju.se.management.entity.APILog;
import zju.se.management.repository.APILogRepository;

import java.util.List;

@Service
public class APILogService {
    private final APILogRepository apiLogRepository;

    @Autowired
    public APILogService(APILogRepository apiLogRepository) {
        this.apiLogRepository = apiLogRepository;
    }

    public synchronized void addAPILog(APILog apiLog) {
        apiLogRepository.save(apiLog);
    }

    public List<APILog> findAll() {
        return apiLogRepository.findAll();
    }

    public int countAll() {
        return apiLogRepository.countAll();
    }

    public List<APILog> findByStatus(String status) {
        return apiLogRepository.findAPILogsByStatus(status);
    }

    public int countByStatus(String status) {
        return apiLogRepository.countAPILogsByStatus(status);
    }

    public synchronized void deleteAll() {
        apiLogRepository.deleteAll();
    }
}
