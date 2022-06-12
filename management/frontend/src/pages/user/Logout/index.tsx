import React, {useEffect} from "react";
import {logout} from "@/services/ant-design-pro/api";

const Logout : React.FC = () => {

    const LogoutWrapper = async () => {
        await logout();
        localStorage.clear();
        window.location.href = "/";
    }

    useEffect(() => {
        LogoutWrapper();
    }, []);

    return (<div/>);
};

export default Logout;