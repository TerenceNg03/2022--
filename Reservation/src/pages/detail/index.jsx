import {
  Input,
  Form,
  Badge,
  DatePicker,
  Button,
  Card,
  Statistic,
  Descriptions,
  Popover,
  Steps,
  message,
} from 'antd';
import { GridContent, PageContainer, RouteContext } from '@ant-design/pro-layout';
import { useState } from 'react';
import classNames from 'classnames';
import { useRequest, history } from 'umi';
import { queryPatientInfo, changeStatus, writeDiagnosis } from './service';
import styles from './style.less';
import moment from 'moment';

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
    <Descriptions.Item label="预约时间">{patientData.reserveTime}</Descriptions.Item>
  </Descriptions>
);

const processTime = (time) => (
  <div className={classNames(styles.textSecondary, styles.stepDescription)}>
    <div>{time}</div>
  </div>
);

// const popoverContent = (
//   <div
//     style={{
//       width: 160,
//     }}
//   >
//     吴加号
//     <span
//       className={styles.textSecondary}
//       style={{
//         float: 'right',
//       }}
//     >
//       <Badge
//         status="default"
//         text={
//           <span
//             style={{
//               color: 'rgba(0, 0, 0, 0.45)',
//             }}
//           >
//             未响应
//           </span>
//         }
//       />
//     </span>
//     <div
//       className={styles.textSecondary}
//       style={{
//         marginTop: 4,
//       }}
//     >
//       耗时：2小时25分钟
//     </div>
//   </div>
// );

// const customDot = (dot, { status }) => {
//   if (status === 'process') {
//     return (
//       <Popover placement="topLeft" arrowPointAtCenter content={popoverContent}>
//         <span>{dot}</span>
//       </Popover>
//     );
//   }

//   return dot;
// };

const Detail = (props) => {
  const [tabStatus, setTabStatus] = useState({
    tabActiveKey: 'detail',
  });
  const [status, setStatus] = useState(props.location.state?.record.status);
  const [endTime, setEndTime] = useState(props.location.state?.record.end_time);

  const { app_id: id, patient_id: pid, start_time: startTime, description } = props.location.state?.record;

  const onTabChange = (tabActiveKey) => {
    setTabStatus({ ...tabStatus, tabActiveKey });
  };

  const { data: _patientData } = useRequest(() => {
      return queryPatientInfo({
        id: pid,
      });
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
  //       id: pid,
  //       reserveId: id,
  //       diagDate: startTime,
  //       diagnosis: diagnosis,
  //     };
  //     // let res = await postDiagnosis({ pId: patientData.id, rId: patientData.reserveId });//同时改变state
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
      {/*<Card
        style={{
          marginBottom: 24,
        }}
      >
        <div
        // className={styles.coverCardList}
        >
          <div
            // className={styles.cardList}
            style={{
              marginLeft: 0,
              marginRight: 500,
            }}
          >
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              initialValues={{ remember: true }}
              onFinish={confirmDiagnosis}
              autoComplete="off"
            >
              <Form.Item label="姓名" name="username">
                <Input defaultValue={patientData.name} />
              </Form.Item>
              <Form.Item label="性别" name="sex">
                <Input defaultValue={patientData.sex} />
              </Form.Item>
              <Form.Item label="预约号" name="diagNumber" rules={[{ type: 'number' }]}>
                <Input defaultValue={patientData.diagNumber} />
              </Form.Item>
              <Form.Item label="日期" name="diagDate" rules={[{ required: true }]}>
                <DatePicker />
              </Form.Item>
              <Form.Item label="诊断" name="diagnosis" rules={[{ required: true }]}>
                <TextArea showCount maxLength={200} />
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Card>*/}
    </GridContent>
  );

  const diagProcess = (
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
              <Step title="预约成功" description={processTime(startTime)} />
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
        <Descriptions
          style={{
            marginBottom: 40,
          }}
        >
          <Descriptions.Item label="患者预约自述">{description}</Descriptions.Item>
        </Descriptions>
      </Card>
    </GridContent>
  );

  const content = {
    diagnosis: diagMake,
    detail: diagProcess,
  };

  return (
    <>
      <PageContainer
        title={'患者：' + patientData.name}
        extra={action}
        className={styles.pageHeader}
        content={getDescription({ ...patientData, reserveTime: startTime})}
        extraContent={extra(statusInfos[status].text)}
        tabActiveKey={tabStatus.tabActiveKey}
        onTabChange={onTabChange}
        tabList={[
          {
            key: 'detail',
            tab: '详情',
          },
          // {
          //   key: 'diagnosis',
          //   tab: '诊断单',
          // },
        ]}
      >
        {content[tabStatus.tabActiveKey]}
      </PageContainer>
    </>
  );
};

export default Detail;
