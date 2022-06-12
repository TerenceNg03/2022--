import React, {useEffect, useState} from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { StatisticCard } from "@ant-design/pro-card";
import { Card, Avatar } from 'antd';
import { SettingOutlined, EllipsisOutlined, EditOutlined} from "@ant-design/icons";
import ProCard from "@ant-design/pro-card";
import { getDoctorNumbers, getPatientNumbers, getAdminNumbers,
    getUserNumbers, getAPINumbers, getAPIFailNumbers, getAPISuccessNumbers } from '@/services/ant-design-pro/api';


const { Meta } = Card;
const { Operation } = StatisticCard;

const Welcome: React.FC = () => {
    const user = localStorage.getItem('userName') ;

    // const [type, setType] = useState<string>('welcome') ;
    const [doctorsNumber, setDoctorsNumber] = useState<number>(0) ;
    const [patientNumber, setPatientNumber] = useState<number>(0) ;
    const [adminNumber, setAdminNumber] = useState<number>(0) ;
    const [userNumber, setUserNumber] = useState<number>(0) ;
    const [APINumber, setAPINumber] = useState<number>(0) ;
    const [APISuccessNumber, setAPISuccessNumber] = useState<number>(0) ;
    const [APIFailNumber, setAPIFailNumber] = useState<number>(0) ;

    const initDoctorNumber = async () => {
        const result = await getDoctorNumbers();
        setDoctorsNumber(result);
    }

    const initPatientNumber = async () => {
        const result = await getPatientNumbers();
        setPatientNumber(result);
    }

    const initAdminNumber = async () => {
        const result = await getAdminNumbers();
        setAdminNumber(result);
    }

    const initUserNumber = async () => {
        const result = await getUserNumbers();
        setUserNumber(result);
    }

    const initAPINumber = async () => {
        const result = await getAPINumbers();
        setAPINumber(result);
    }

    const initAPISuccessNumber = async () => {
        const result = await getAPISuccessNumbers();
        setAPISuccessNumber(result);
    }

    const initAPIFailNumber = async () => {
        const result = await getAPIFailNumbers();
        setAPIFailNumber(result);
    }

    useEffect(()=>{
        initDoctorNumber();
        initPatientNumber();
        initAdminNumber();
        initUserNumber();
        initAPINumber();
        initAPISuccessNumber();
        initAPIFailNumber();
    },[]) ;

    return (
        <div>

            <PageContainer>
                <ProCard split="vertical" style={{maxHeight:1000}}>

                    <ProCard title="管理员 " colSpan="30%" >
                        <Card
                            style={{ width: 300 }}
                            cover={
                                <img
                                    alt="example"
                                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                                />
                            }
                            actions={[
                                <SettingOutlined key="setting" />,
                                <EditOutlined key="edit" />,
                                <EllipsisOutlined key="ellipsis" />,
                            ]}
                        >
                            <Meta
                                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                                title={user}
                                description="管理员账户"
                            />
                        </Card>
                    </ProCard>

                    <ProCard title="统计信息">
                        <ProCard split='horizontal'>
                            <ProCard>
                                <StatisticCard.Group>
                                    <StatisticCard
                                        statistic={{
                                            title: '用户总数',
                                            value: userNumber,
                                        }}
                                    />
                                    <Operation>=</Operation>
                                    <StatisticCard
                                        statistic={{
                                            title: '病人',
                                            value: patientNumber,
                                        }}
                                    />
                                    <Operation>+</Operation>
                                    <StatisticCard
                                        statistic={{
                                            title: '医生',
                                            value: doctorsNumber,
                                        }}
                                    />
                                    <Operation>+</Operation>
                                    <StatisticCard
                                        statistic={{
                                            title: '管理员',
                                            value: adminNumber,
                                        }}
                                    />
                                </StatisticCard.Group>
                            </ProCard>
                            <ProCard>
                                <StatisticCard.Group>
                                    <StatisticCard
                                        statistic={{
                                            title: 'API访问量',
                                            tip: '仅统计管理系统',
                                            value: APINumber,
                                        }}
                                    />
                                    <StatisticCard
                                        statistic={{
                                            title: '成功请求',
                                            value: APISuccessNumber,
                                            status: 'processing',
                                        }}
                                    />
                                    <StatisticCard
                                        statistic={{
                                            title: '失败请求',
                                            value: APIFailNumber,
                                            status: 'error',
                                        }}
                                    />
                                </StatisticCard.Group>
                            </ProCard>
                        </ProCard>
                    </ProCard>

                </ProCard>
            </PageContainer>
        </div>
    );
};

export default Welcome;
