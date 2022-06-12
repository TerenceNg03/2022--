package zju.se.management;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.support.BeanDefinitionBuilder;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.beans.factory.support.BeanDefinitionRegistryPostProcessor;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.EnvironmentAware;
import org.springframework.core.env.Environment;

import com.google.common.collect.ImmutableMap;
import org.mitre.dsmiley.httpproxy.ProxyServlet;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


import javax.servlet.Servlet;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.Set;


@Configuration
public class ProxyServletConfiguration implements BeanDefinitionRegistryPostProcessor, EnvironmentAware {

    Environment env;

    @Bean
    public Servlet createProxyServlet() {
        // 创建新的ProxyServlet
        return new ProxyServlet();
    }

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
    }

    @Override
    public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) throws BeansException {

        //获取需要反向代理的路径字符串集合
        String proxyUrlStr = env.getProperty("proxy.url");
        //拆分
        assert proxyUrlStr != null;
        String[] proxyUrls = proxyUrlStr.split(",");
        //遍历注入bean
        for (int i = 0; i < proxyUrls.length; i++) {
            String proxyUrl = proxyUrls[i];
            String[] urls = proxyUrl.split("\\|");
            //访问地址
            String servlet_url = urls[0];
            //转发地址
            String target_url = urls[1];
            //动态设置bean
            BeanDefinitionBuilder beanDefinitionBuilder = BeanDefinitionBuilder.rootBeanDefinition(ServletRegistrationBean.class);
            //设置参数
            beanDefinitionBuilder.addPropertyValue("name", "suit" + i);
            beanDefinitionBuilder.addPropertyValue("initParameters", new LinkedHashMap(ImmutableMap.of("targetUri", target_url, "log", "true")));
            Set<String> urlMappings = new HashSet<>();
            urlMappings.add(servlet_url);
            beanDefinitionBuilder.addPropertyValue("urlMappings", urlMappings);
            beanDefinitionBuilder.addPropertyValue("servlet", createProxyServlet());
            //注入
            registry.registerBeanDefinition("proxy" + i, beanDefinitionBuilder.getBeanDefinition());
        }
    }

    @Override
    public void setEnvironment(Environment environment) {
        this.env = environment;
    }
}

