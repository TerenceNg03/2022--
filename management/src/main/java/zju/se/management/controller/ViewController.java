package zju.se.management.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@CrossOrigin(origins = "*")
public class ViewController {

    @RequestMapping(value = {
            "/login"
    })
    public String login() {
        return "login/index";
    }

    @RequestMapping(value = {
            "/dashboard",
    })
    public String welcome() { return "dashboard/index"; }

    @RequestMapping(value = {
            "/doctors"
    })
    public String doctors() { return "doctors/index"; }

    @RequestMapping(value = {
            "/logout"
    })
    public String logout() { return "logout/index"; }

}
