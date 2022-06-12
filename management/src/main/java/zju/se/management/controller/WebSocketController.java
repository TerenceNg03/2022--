package zju.se.management.controller;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import zju.se.management.service.MQService;
import zju.se.management.service.UserService;
import zju.se.management.utils.Response;
import zju.se.management.utils.ResponseData;

import javax.annotation.Resource;
import javax.websocket.EncodeException;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ws")
@CrossOrigin(origins = "*")
public class WebSocketController extends BaseController {
    private final WebSocketServer webSocketServer;

    @Resource
    private MQService mqService;

    @Resource
    private UserService userService;

    @Autowired
    public WebSocketController(WebSocketServer webSocketServer) {
        this.webSocketServer = webSocketServer;
    }

    @PostMapping("/broadcast")
    public Response<?> wsBroadcast (
            @RequestParam(value = "title") String title,
            @RequestParam(value = "content") String content) throws IOException, EncodeException {
        HashMap<String, String> wsMessage = new HashMap<>();
        wsMessage.put("title", title);
        wsMessage.put("content", content);
        webSocketServer.broadcastObject(wsMessage);
        return ResponseOK("发送成功");
    }

    @PostMapping("/unicast/{userName}")
    public Response<?> wsUnicast (
            @RequestParam(value = "title") String title,
            @RequestParam(value = "content") String content,
            @PathVariable(value = "userName") String userName) throws IOException, EncodeException {
        if(!userService.isExist(userName)) {
            return ResponseError("用户不存在");
        }
        HashMap<String, String> wsMessage = new HashMap<>();
        wsMessage.put("title", title);
        wsMessage.put("content", content);
        webSocketServer.unicastObject(userName, wsMessage);
        return ResponseOK("发送成功");
    }

    @Getter
    @Setter
    @AllArgsConstructor
    static class MQResponseData extends ResponseData {
        private List<Map<String, String>> mqList;
    }

    @GetMapping("/mq/{userName}")
    public Response<MQResponseData> consume(
            @PathVariable(value = "userName") String userName) {
        return ResponseOK(new MQResponseData(mqService.consume(userName)),"获取成功");
    }

}
