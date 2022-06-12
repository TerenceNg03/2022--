package zju.se.management;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import zju.se.management.entity.APILog;
import zju.se.management.service.APILogService;

import java.util.Calendar;
import java.util.concurrent.atomic.AtomicInteger;

@Component
@Aspect
public class APIVisitHistory {

    private final APILogService apiLogService;

    private final ThreadLocal<Long> startTime = new ThreadLocal<>();

    private final AtomicInteger counter = new AtomicInteger();

    @Autowired
    public APIVisitHistory(APILogService apiLogService) {
        this.apiLogService = apiLogService;
    }

    @Pointcut("execution(* zju.se.management.controller..*.*(..)) " +
            "&& !execution(* zju.se.management.controller.WebSocketServer.*(..))" +
            "&& !execution(* zju.se.management.controller.StatisticsController.*(..))"
    )
    public void pointCut(){

    }

    @Before("pointCut()")
    public void doBefore(JoinPoint joinPoint) {
        startTime.set(System.currentTimeMillis());
    }

    @AfterReturning(returning = "returnVal", pointcut = "pointCut()")
    public void doAfterReturning(JoinPoint joinPoint, Object returnVal) {

        APILog apiLog = new APILog();
        apiLog.setClassName(joinPoint.getSignature().getDeclaringType().getSimpleName());
        apiLog.setMethodName(joinPoint.getSignature().getName());
        apiLog.setExecutionTime(System.currentTimeMillis() - startTime.get());
        apiLog.setStatus("SUCCESS");
        apiLog.setTime(Calendar.getInstance().getTime());

        apiLogService.addAPILog(apiLog);
    }

    @AfterThrowing(pointcut = "pointCut()")
    public void doAfterThrowing(JoinPoint joinPoint) {

        APILog apiLog = new APILog();
        apiLog.setClassName(joinPoint.getSignature().getDeclaringType().getSimpleName());
        apiLog.setMethodName(joinPoint.getSignature().getName());
        apiLog.setExecutionTime(System.currentTimeMillis() - startTime.get());
        apiLog.setStatus("FAILURE");
        apiLog.setTime(Calendar.getInstance().getTime());

        apiLogService.addAPILog(apiLog);
    }
}
