import React, {useEffect, useState} from "react";
import {Card, Layout, Carousel, Divider} from 'antd';
import Footer from '../components/Footer';
import {api} from '@/config';

import styles from './Index.less';
import ProCard from "@ant-design/pro-card";
import Meta from "antd/es/card/Meta";

const baseUrl = `${api.protocol}://${api.host}`;
const reservationUrl = `${baseUrl}:${api.reservation.port}/`;
const pharmacyUrl = `${baseUrl}:${api.pharmacy.port}/${api.pharmacy.prefix}/`;
const doctorUrl = `${baseUrl}:${api.doctor.port}/`;

const Index : React.FC = () => {
    const isLogin =
        localStorage.getItem('userName') != null && localStorage.getItem('userName') != undefined;

    return (
        <div className={styles.container}>
            <Layout>
                <Layout.Header>
                    <div className="ant-pro-global-header-logo">
                        <img src="logo.svg" alt="logo" height="35" style={{paddingRight:"15px"}}/>
                        <span style={{color:"white", fontSize:"20px", fontWeight:"bold"}}>
                            互联网医院管理系统
                        </span>
                        {isLogin &&
                            <span style={{position:"fixed", right:"30px", fontWeight:"bold", fontSize:"16px"}}>
                                <a href={'/dashboard'} style={{color:"white"}}>欢迎您，{localStorage.getItem('userName')}！</a>
                            </span>
                        }
                        {!isLogin &&
                            <span style={{position:"fixed", right:"30px", fontWeight:"bold", fontSize:"16px"}}>
                                <a href={'/login'}>登录/注册</a>
                            </span>}
                    </div>
                </Layout.Header>
                <Layout.Content>
                    <Carousel autoplay effect='fade' style={{height:400}}>
                        <div>
                            <img src="carousel_1.jpeg"  alt="carousel" width="100%"/>
                        </div>
                        <div>
                            <img src="carousel_2.jpeg"  alt="carousel" width="100%"/>
                        </div>
                        <div>
                            <img src="carousel_3.jpeg"  alt="carousel" width="100%"/>
                        </div>
                    </Carousel>
                    <ProCard
                        layout={"center"}
                        style={{
                            background:"transparent",
                            marginTop: "20px"
                    }}
                    >
                        <Card style={{background:"transparent", padding:"0px 10px", cursor:"pointer"}} bordered={false}
                              onClick={() => {
                                  window.location.href = reservationUrl;
                              }}
                        >
                            <Card
                                style={{
                                    background: "#5959ff url(sn-icon02.png) no-repeat center",
                                    borderRadius: "50%",
                                    width:"60px",
                                    height:"60px",
                                    marginBottom:"5px"
                                }}
                            >
                            </Card>
                            <Meta title="挂号预约"/>
                        </Card>
                        <Card style={{background:"transparent", padding:"0px 10px", cursor:"pointer"}} bordered={false}
                              onClick={() => {
                                  window.location.href = pharmacyUrl;
                              }}
                        >
                            <Card
                                style={{
                                    background: "#71ae88 url(sn-icon05.png) no-repeat center",
                                    borderRadius: "50%",
                                    width:"60px",
                                    height:"60px",
                                    marginBottom:"5px"
                                }}
                            >
                            </Card>
                            <Meta title="药房系统"/>
                        </Card>
                        <Card style={{background:"transparent", padding:"0px 10px", cursor:"pointer"}} bordered={false}
                              onClick={() => {
                                  window.location.href = doctorUrl;
                              }}
                        >
                            <Card
                                style={{
                                    background: "#42bcb2 url(sn-icon06.png) no-repeat center",
                                    borderRadius: "50%",
                                    width:"60px",
                                    height:"60px",
                                    marginBottom:"5px"
                                }}
                            >
                            </Card>
                            <Meta title="医生查询"/>
                        </Card>
                        <Card style={{background:"transparent", padding:"0px 10px", cursor:"pointer"}} bordered={false}
                              onClick={() => {
                                  window.location.href = '/dashboard';
                              }}
                        >
                            <Card
                                style={{
                                    background: "#5994ff url(sn-icon03.png) no-repeat center",
                                    borderRadius: "50%",
                                    width:"60px",
                                    height:"60px",
                                    marginBottom:"5px"
                                }}
                            >
                            </Card>
                            <Meta title="后台管理"/>
                        </Card>
                    </ProCard>
                </Layout.Content>
                <Layout.Footer>
                    <Footer />
                </Layout.Footer>
            </Layout>
        </div>
    )
}

export default Index;