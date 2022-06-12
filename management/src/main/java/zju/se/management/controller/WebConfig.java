package zju.se.management.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    private final SessionInterceptor sessionInterceptor;
    private final PermissionInterceptor permissionInterceptor;

    private final String[] staticResources = {
            "/swagger-ui.html",
            "/swagger-ui/**",
            "/swagger-resources/**",
            "/v2/api-docs",
            "/**/*.js",
            "/**/*.css",
            "/**/*.png",
            "/**/*.jpg",
            "/**/*.jpeg",
            "/**/*.gif",
            "/**/*.svg",
            "/**/*.ttf",
            "/**/*.woff",
            "/**/*.woff2",
            "/**/*.eot",
            "/**/*.ico",
            "/**/*.js.map",
            "/**/*.css.map"
    };

    @Autowired
    public WebConfig(SessionInterceptor sessionInterceptor, PermissionInterceptor permissionInterceptor) {
        this.sessionInterceptor = sessionInterceptor;
        this.permissionInterceptor = permissionInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 需要管理员权限的URI
        registry.addInterceptor(permissionInterceptor)
                .addPathPatterns(
                        "/api/user/**",
                        "/api/statistics/**"
                );
        // 需要登录的URI
        registry.addInterceptor(sessionInterceptor)
                .addPathPatterns(
                        "/api/arrange/**",
                        "/api/doctor/**",
                        "/api/ws/**"
                ).excludePathPatterns(
                        "/api/oauth/**"
                ).excludePathPatterns(staticResources);
    }
}
