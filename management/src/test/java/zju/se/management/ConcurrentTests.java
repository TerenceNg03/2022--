package zju.se.management;

import com.auth0.jwt.interfaces.DecodedJWT;
import org.databene.contiperf.PerfTest;
import org.databene.contiperf.junit.ContiPerfRule;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import zju.se.management.authentication.TokenUtil;
import zju.se.management.service.ArrangeService;
import zju.se.management.service.DoctorInfoService;
import zju.se.management.service.UserService;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ConcurrentTests {

    @Autowired
    private UserService userService;

    @Autowired
    private ArrangeService arrangeService;

    @Autowired
    private DoctorInfoService doctorInfoService;

    public void contextLoads() {
    }

    @Rule
    public ContiPerfRule contiPerfRule = new ContiPerfRule();

    @Test
    @PerfTest(duration = 10*1000)
    public void userVerifyTest() {
        try {
            String token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJpZCI6MSwidXNlck5hbWUiOiJhZG1pbiIsImV4cCI6MTY1NDk0NjM4M30.YGD53prpGuMYjti5BELaeqINvtF4SPLjBY5PHUaACK4";
            DecodedJWT decodedJWT = TokenUtil.decodeToken(token);
            String userName = decodedJWT.getClaim("userName").asString();
            String role = decodedJWT.getClaim("role").asString();
            int userId = decodedJWT.getClaim("id").asInt();
        } catch (Exception ignored){
        }
    }

    @Test
    @PerfTest(duration = 10*1000)
    public void databaseTest(){
        try{
            arrangeService.getAllArranges();
            userService.getAllUsers();
            doctorInfoService.getAllDoctorInfos();
        }catch (Exception ignored){
        }
    }


}
