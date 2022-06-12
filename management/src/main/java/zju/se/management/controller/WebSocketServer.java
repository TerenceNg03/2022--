package zju.se.management.controller;

import org.springframework.stereotype.Component;
import zju.se.management.entity.User;
import zju.se.management.service.MQService;
import zju.se.management.service.UserService;
import zju.se.management.utils.HashMapSerializer;

import javax.annotation.Resource;
import javax.websocket.EncodeException;
import javax.websocket.OnClose;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
@ServerEndpoint(value = "/message/{userName}", encoders = {HashMapSerializer.class})
public class WebSocketServer {
    private static final ConcurrentHashMap<String, WebSocketServer> clients = new ConcurrentHashMap<>();
    private static final CopyOnWriteArraySet<WebSocketServer> webSocketSet = new CopyOnWriteArraySet<>();

    public static Set<WebSocketServer> getWebSocketSet() {
        return webSocketSet;
    }

    @Resource
    private MQService mqService;

    @Resource
    private UserService userService;

    private Session session;

    @OnOpen
    public void onOpen(@PathParam(value = "userName") String userName, Session session) {
        this.session = session;
        clients.put(userName, this);
        webSocketSet.add(this);
    }

    @OnClose
    public void onClose(@PathParam(value = "userName") String userName) {
        clients.remove(userName);
        webSocketSet.remove(this);
    }

    public void unicastObject(String userName, HashMap<String, String> object) throws IOException, EncodeException {
        WebSocketServer webSocketServer = clients.get(userName);
        if(webSocketServer != null) {
            if(webSocketServer.session.isOpen()) {
                webSocketServer.session.getAsyncRemote().sendObject(object);
            }
        } else {
            mqService.produce(userName, object);
        }
    }

    public void broadcastObject(HashMap<String, String> object) throws IOException, EncodeException {
        List<User> userList = userService.getAllUsers();
        for(User user : userList) {
            unicastObject(user.getUserName(), object);
        }
    }
}
