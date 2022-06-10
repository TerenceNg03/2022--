import {
  Input,
  Form,
  Button,
  Card,
  Statistic,
  Descriptions,
  Steps,
  message,
} from 'antd';
import { GridContent, PageContainer, RouteContext } from '@ant-design/pro-layout';
import { useState } from 'react';
import { useRequest } from 'umi';
import classNames from 'classnames';
import moment from 'moment';
import Records from '../center/components/Records';
import UpdateRecord from '../../components/Diagnosis/UpdateRecord';
import { queryPatientInfo } from '@/services/management';
import { changeStatus } from '@/services/reservation';
import { queryRecords, writeDiagnosis } from '@/services/record';
import styles from './style.less';

const { Step } = Steps;
const { TextArea } = Input;

const extra = (value) => (
  <div className={styles.moreInfo}>
    <Statistic title="状态" value={value} />
  </div>
);

const getDescription = (patientData) => (
  <Descriptions className={styles.headerList} size="small" column={2}>
    <Descriptions.Item label="性别">{patientData.sex}</Descriptions.Item>
    <Descriptions.Item label="身份证号">{patientData.IDCardNumber}</Descriptions.Item>
    <Descriptions.Item label="手机号">{patientData.diagNumber}</Descriptions.Item>
    <Descriptions.Item label="预约日期">
      {moment(patientData.reserveTime).format('YYYY-MM-DD')}
    </Descriptions.Item>
    <Descriptions.Item label="预约时间">
      {moment(patientData.reserveTime).format('HH:mm:ss')}~{moment(patientData.expireTime).format('HH:mm:ss')}
    </Descriptions.Item>
  </Descriptions>
);

const processTime = (time) => (
  <div className={classNames(styles.textSecondary, styles.stepDescription)}>
    <div>{time}</div>
  </div>
);

const Detail = (props) => {
  const [tabStatus, setTabStatus] = useState({
    tabActiveKey: 'detail',
  });
  const [status, setStatus] = useState(props.location.state?.record.status);
  const [endTime, setEndTime] = useState(props.location.state?.record.end_time);

  const {
    app_id: id,
    patient_id,
    patient_name,
    start_time: reserveTime,
    expire_time: expireTime,
    description
  } = props.location.state?.record;

  const onTabChange = (tabActiveKey) => {
    setTabStatus({ ...tabStatus, tabActiveKey });
  };

  const { data: _patientData } = useRequest(() => {
      return queryPatientInfo({
        id: patient_id,
      });
    }
  );

  const { data: records } = useRequest(() => {
      return queryRecords({ patient_id });
    },
    {
      formatResult: res => res.data.data,
    }
  );
  
  const patientData = _patientData || {};

  const statusInfos = {
    booked: {
      text: '尚未就诊',
      buttonText: '开始接诊',
      step: 0,
    },
    started: {
      text: '就诊中',
      buttonText: '就诊中',
      step: 1,
    },
    done: {
      text: '就诊结束',
      buttonText: '已结束',
      step: 2,
    },
    cancelled: {
      text: '预约取消',
      buttonText: '已取消',
      step: 1,
    }
  }

  // const confirmDiagnosis = async (values) => {
  //   const { diagDate, diagnosis } = values;
  //   try {
  //     let data = {
  //       id: patient_id,
  //       reserveId: id,
  //       diagDate: reserveTime,
  //       diagnosis: diagnosis,
  //     };
  //     // let res = await postDiagnosis({ patient_id: patientData.id, rId: patientData.reserveId });//同时改变state
  //   } catch (error) {
  //     console.log('error', error);
  //   }
  // };

  const action = (
    <RouteContext.Consumer>
      {() => {
        return (
          <Button
            onClick={async () => {
              const { data } = await changeStatus({ aid: id, action : { status : 'started' } });
              if(data.success){
                setStatus('started');
                message.success('开始就诊');
              } else {
                message.error(data.message || '操作失败');
              }
            }}
            type="primary"
            disabled={status != 'booked'}
          >
            {statusInfos[status].buttonText}
          </Button>
        );
      }}
    </RouteContext.Consumer>
  );

  const diagnose = (
    <Button
      type="primary"
      onClick={async () => {
        const { data } = await writeDiagnosis();
        if(data.success) {
          const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
          const { data : result } = await changeStatus({
            aid: id,
            action:
            {
              status: 'done',
              record_id: data.id,
              end_time: currentTime,
            }
          });
          if(result.success) {
            setEndTime(currentTime);
            setStatus('done');
            message.success('病历提交成功');
          } else {
            message.error('提交病历失败');
          }
        } else {
          message.error('病历未提交');
        }
      }}
    >
      填写病历
    </Button>
  );

  const diagMake = (
    <GridContent> 
      <Card>
        <h1>
          病历单
          {/* <p className="example-description">{item.description}</p> */}
        </h1>
        <UpdateRecord/>
      </Card>
    </GridContent>
  );

  const diagDetail = (
    <GridContent>
      <Card
        title="流程进度"
        style={{
          marginBottom: 24,
        }}
      >
        <RouteContext.Consumer>
          {({ isMobile }) => (
            <Steps
              direction={isMobile ? 'vertical' : 'horizontal'}
              progressDot={<></>}
              current={statusInfos[status].step}
            >
              <Step title="就诊开始" description={processTime(reserveTime)} />
              {
                status == 'cancelled'
                ?
                <>
                  <Step title="已取消" description={processTime(endTime)}/>
                </>
                :
                <>
                  <Step title="就诊中" description={status === 'started' ? diagnose : ''} />
                  <Step title="就诊结束" description={status === 'done' ? processTime(endTime) : ''}/>
                </>
              }
            </Steps>
          )}
        </RouteContext.Consumer>
      </Card>
      <Card
        title="详细信息"
        style={{
          marginBottom: 24,
        }}
        bordered={false}
      >
        <Descriptions column={1}>
          <Descriptions.Item label="患者自述">{description}</Descriptions.Item>
          <Descriptions.Item label="过往病历">
            <Records data={records}/>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </GridContent>
  );

  const content = {
    diagnosis: diagMake,
    detail: diagDetail,
  };

  return (
    <>
      <PageContainer
        title={'患者：' + patient_name}
        extra={action}
        className={styles.pageHeader}
        content={getDescription({ ...patientData, reserveTime, expireTime})}
        extraContent={extra(statusInfos[status].text)}
        tabActiveKey={tabStatus.tabActiveKey}
        onTabChange={onTabChange}
        tabList={[
          {
            key: 'detail',
            tab: '详情',
          },
          {
            key: 'diagnosis',
            tab: '诊断单',
          },
        ]}
      >
        {content[tabStatus.tabActiveKey]}
      </PageContainer>
    </>
  );
};

export default Detail;
