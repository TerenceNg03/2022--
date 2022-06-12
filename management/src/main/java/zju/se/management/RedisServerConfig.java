package zju.se.management;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import redis.embedded.RedisServer;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.io.IOException;

@Component
public class RedisServerConfig {

    private RedisServer redisServer;

    @Value("${spring.redis.port}")
    private int PORT;

    @Value("${spring.redis.host}")
    private String HOST;

    @PostConstruct
    public void startRedis() throws IOException {
        redisServer = RedisServer.builder()
                .port(PORT) //端口
                .setting("maxmemory 200m")
                .setting("bind " + HOST) //绑定ip
                .build();
        redisServer.start();
    }

    @PreDestroy
    public void stopRedis() {
        redisServer.stop();
    }
}