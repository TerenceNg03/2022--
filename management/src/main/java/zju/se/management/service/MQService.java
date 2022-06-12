package zju.se.management.service;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class MQService {

    private static final String MQ_KEY = "message:queue:";

    @Resource
    private RedisTemplate<String, Map<String, String>> redisTemplate;

    public synchronized void produce(String userName, Map<String, String> object) {
        redisTemplate.opsForList().leftPush(MQ_KEY + userName, object);
    }

    public synchronized List<Map<String, String>> consume(String userName) {
        var result = redisTemplate.opsForList().range(MQ_KEY + userName, 0, -1);
        assert result != null;
        if(!result.isEmpty()) {
            Collections.reverse(result);
        }
        redisTemplate.delete(MQ_KEY + userName);
        return result;
    }

}
