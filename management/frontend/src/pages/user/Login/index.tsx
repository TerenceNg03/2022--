import {LockOutlined, UserOutlined, SafetyCertificateOutlined} from '@ant-design/icons';
import {message, Tabs, Result, Form, Image, Input} from 'antd';
import React, {useEffect, useState} from 'react';
import {ProFormText, LoginForm, ProFormCaptcha} from '@ant-design/pro-form';
import { history } from 'umi';
import Footer from '@/components/Footer';
import CaptchaInput from "@/components/CaptchaInput";
import {login, logout, patientRegister, getCaptcha} from '@/services/ant-design-pro/api';
import {api} from '@/config';
import qs from 'qs';

import styles from './index.less';

const Login: React.FC = () => {
    const isLogin =
        localStorage.getItem('userName') != null && localStorage.getItem('userName') != undefined;
    const [type, setType] = useState<string>('login');
    const [captchaKey, setCaptchaKey] = useState<string>('');
    const [captchaImage, setCaptchaImage] = useState<string>('');
    const [captchaCode, setCaptchaCode] = useState<string>('');
    const { redir } = qs.parse(window.location.href.split('?')[1]);

    useEffect(() => {
        if (isLogin && redir != null) {
            message.info("您已登录，将跳转至原页面");
            setTimeout(()=>{
                window.location.href=`http://${decodeURIComponent(redir as string)}?userId=${encodeURIComponent(localStorage.getItem('userId') || '')}&userName=${encodeURIComponent(localStorage.getItem('userName') || '')}&token=${encodeURIComponent(localStorage.getItem('token') || '')}`;
            }, 2000);
        }
    }, []);

    useEffect(()=>{
        getCaptcha().then(res => {
            setCaptchaKey(res.data.key);
            setCaptchaImage(res.data.image);
        });
    },[type, setType]);

    const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const code = e.target.value || '';
        if (code.length > 0) {
            setCaptchaCode(code);
        }
    }

    const onClickImage = async () => {
        let res = await getCaptcha();
        if(res.code < 0) {
            message.error('验证码获取失败');
        } else {
            setCaptchaKey(res.data.key);
            setCaptchaImage(res.data.image);
        }
    }


    const handleSubmit = async (values: Record<string, any>) => {
        if (isLogin && type === 'login') {
            await logout();
            window.location.href=`http://${api.host}:${api.port}/`;
            return;
        }
        if(captchaCode.length === 0){
            message.error('请输入验证码');
            return;
        }
        try {
            if (type === 'register') {
                const msg = await patientRegister({
                    userName: values.regUserName,
                    password: values.regPassword,
                    realName: values.regRealName,
                    captchaKey: captchaKey,
                    captchaCode: captchaCode
                });

                if (msg.code === 0) {
                    message.success('注册成功');
                    history.push('/login');
                } else {
                    message.error(msg.message);
                }
            } else {
                const msg = await login({
                    userName: values.userName,
                    password: values.password,
                    captchaKey: captchaKey,
                    captchaCode: captchaCode
                });
                if (msg.code === 0) {
                    message.success('登录成功');
                    localStorage.setItem('userName', msg.data.userName);
                    localStorage.setItem('token', msg.data.token);
                    localStorage.setItem('userId', msg.data.userId);
                    if(redir != null) {
                        window.location.href=`http://${decodeURIComponent(redir as string)}?userId=${encodeURIComponent(msg.data.userId)}&userName=${encodeURIComponent(msg.data.userName)}&token=${encodeURIComponent(msg.data.token)}`;
                    } else{
                        window.location.href=`http://${api.host}:${api.port}/`;
                    }
                } else {
                    message.error(msg.message);
                }
            }
        } catch (error) {
            message.error('网络错误');
        }
        await onClickImage();
    };

    return (
        <div className={styles.container}>
            <div className={styles.content} style={{ marginBottom: 24 }}>
                <LoginForm
                    logo={<img alt="logo" src="/logo.svg" />}
                    title="统一认证平台"
                    subTitle=" "
                    onFinish={async (values) => {
                        await handleSubmit(values);
                    }}
                    submitter={{
                        searchConfig: {
                            submitText:
                                type === 'login'
                                    ? isLogin === false
                                        ? '登录'
                                        : '退出登录'
                                    : '注册',
                            resetText: '重置',
                        },
                    }}
                >
                    <Tabs activeKey={type} onChange={setType}>
                        <Tabs.TabPane key="login" tab="登录" />
                        <Tabs.TabPane key="register" tab="注册" />
                    </Tabs>

                    {type === 'login' && isLogin === false && (
                        <>
                            <ProFormText
                                name="userName"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <UserOutlined className={styles.prefixIcon} />,
                                }}
                                placeholder="用户名"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入用户名',
                                    },
                                ]}
                            />
                            <ProFormText.Password
                                name="password"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined className={styles.prefixIcon} />,

                                }}
                                placeholder="密码"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入密码',
                                    },
                                ]}
                            />
                            <div role="row" className="ant-row ant-form-item">
                            <span style={{marginBottom: 5}}>
                                <Input.Group compact>
                                    <Input
                                        size='large'
                                        prefix={<SafetyCertificateOutlined/>}
                                        placeholder="请输入验证码"
                                        onChange={onChangeInput}
                                        style={{width: '60%', marginRight: 10, padding: '6.5px 11px 6.5px 11px', verticalAlign: 'middle'}}
                                    />
                                    <img
                                        alt="验证码"
                                        style={{width: '30%', height: '35px', verticalAlign: 'middle', padding: '0px 0px 0px 0px'}}
                                        src={captchaImage}
                                        onClick={onClickImage}
                                    />
                                </Input.Group>
                            </span>
                            </div>
                        </>
                    )}

                    {type === 'login' && isLogin === true && (
                        <>
                            <Result title="您已登录" />
                        </>
                    )}

                    {type === 'register' && (
                        <>
                            <p>仅支持病人用户自助注册</p>
                            <ProFormText
                                name="regUserName"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <UserOutlined className={styles.prefixIcon} />,
                                }}
                                placeholder="用户名"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入用户名',
                                    },
                                ]}
                            />
                            <ProFormText
                                name="regRealName"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <UserOutlined className={styles.prefixIcon} />,
                                }}
                                placeholder="真实姓名"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入姓名',
                                    },
                                ]}
                            />
                            <ProFormText.Password
                                name="regPassword"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined className={styles.prefixIcon} />,
                                }}
                                placeholder="密码"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入密码',
                                    },
                                    {
                                        min: 8,
                                        message: '密码长度不能小于8',
                                    },
                                ]}
                            />
                            <ProFormText.Password
                                name="regConfirmPassword"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined className={styles.prefixIcon} />,
                                }}
                                placeholder="确认密码"
                                rules={[
                                    {
                                        required: true,
                                        message: '请确认密码',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('regPassword') == value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject('两次密码输入不一致');
                                        },
                                    }),
                                ]}
                            />
                            <div role="row" className="ant-row ant-form-item">
                            <span style={{marginBottom: 5}}>
                                <Input.Group compact>
                                    <Input
                                        size='large'
                                        prefix={<SafetyCertificateOutlined/>}
                                        placeholder="请输入验证码"
                                        onChange={onChangeInput}
                                        style={{width: '60%', marginRight: 10, padding: '6.5px 11px 6.5px 11px', verticalAlign: 'middle'}}
                                    />
                                    <img
                                        alt="验证码"
                                        style={{width: '30%', height: '35px', verticalAlign: 'middle', padding: '0px 0px 0px 0px'}}
                                        src={captchaImage}
                                        onClick={onClickImage}
                                    />
                                </Input.Group>
                            </span>
                            </div>
                        </>
                    )}
                </LoginForm>
            </div>
            <Footer />
        </div>
    );
};

export default Login;
