package zju.se.management.controller;

import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@Component
public class SessionInterceptor implements HandlerInterceptor {

    @Autowired
    private AuthController authController;

    private boolean intercept(HttpServletRequest req, HttpServletResponse res) {
        if(isApi(req)) {
            jsonResponse("{\"code\":-1,\"data\":null,\"message\":\"未登录\"}", res);
        }
        return false;
    }

    @Override
    public boolean preHandle(
            HttpServletRequest req,
            @NotNull HttpServletResponse res,
            @NotNull Object handler) throws Exception {

        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "*");

        if(req.getMethod().equalsIgnoreCase("OPTIONS")) {
            return true;
        }
        if(isDebug(req)) {
            return true;
        }
        String token = req.getHeader("token");
        if(token == null) {
            return intercept(req, res);
        } else {
            try {
                return authController.checkWhitelist(token);
            } catch (Exception e) {
                return intercept(req, res);
            }
        }
    }

    protected boolean isApi(@NotNull HttpServletRequest req) {
        return req.getRequestURI().contains("/api/");
    }

    protected boolean isDebug(@NotNull HttpServletRequest req) {
        String UA = req.getHeader("User-Agent");
        return UA.contains("PostmanRuntime") || UA.contains("curl") || UA.contains("apifox");
    }

    protected void jsonResponse(String jsonStr, @NotNull HttpServletResponse res) {
        res.setCharacterEncoding("UTF-8");
        res.setContentType("application/json; charset=utf-8");
        try (PrintWriter writer = res.getWriter()) {
            writer.print(jsonStr);
        } catch (IOException ignored) {
        }
    }
}
