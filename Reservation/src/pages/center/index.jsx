import { HomeOutlined, PlusOutlined } from '@ant-design/icons';
import { GridContent } from '@ant-design/pro-layout';
import { Avatar, Card, Col, Divider, Input, Row, Tag, message } from 'antd';
import { useRef, useState } from 'react';
import { Link, useRequest, useModel } from 'umi';
import moment from 'moment';
import styles from './style.less';
import Reservations from './components/Reservations';
import Records from './components/Records';
import Bills from './components/Bills';
import Schedule from './components/Schedule';
import { queryReservations, changeStatus } from '@/services/reservation';
import { querySchedule } from '@/services/management';
import { queryRecords } from '@/services/record';
import { queryBills } from '@/services/pharmacy';

const Center = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const currentUser = initialState.currentUser;

  const isPatient = currentUser.access === 'PATIENT';
  const isDoctor = currentUser.access === 'DOCTOR';

  const [tabKey, setTabKey] = useState(isPatient ? 'reservations' : 'schedule');

  const { data: reservations, refresh } = isPatient ?
    useRequest(() => {
        return queryReservations({
          patient_id: currentUser.id,
        });
      },
      {
        pollingInterval: 1000 * 1000,
      }
    ) : {};

  const { data: records } = isPatient ? 
    useRequest(() => {
        return queryRecords({
          patient_id: currentUser.id,
        });
      },
      {
        formatResult: res => res.data.data,
      }
    ) : {};

  const { data: bills } = isPatient ? 
    useRequest(() => {
        return queryBills({
          patient_id: currentUser.id,
        });
      },
      {
        formatResult: res => res.BillList,
      }
    ) : {};

  const { data: arrangements } = isDoctor ?
    useRequest(() => {
        return querySchedule({
          doctor_id: currentUser.id,
        });
      },
      {
        formatResult: (res) => {
          const arranges = res?.data?.arranges || [];
          return arranges.map((item, index) => {
            var arrs = [];
            for(var i = 0; i < item.length; i+=2) {
              arrs.push({
                start: item[i],
                end: item[i+1],
              });
            }
            return {
              id: index,
              ranges: arrs,
            };
          });
        },
      }
    ) : {};

  const { run: cancel } = useRequest(
    (id) => {
      const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
      return changeStatus({
        aid: id,
        action:
        {
          status: 'cancelled',
          end_time: currentTime,
        }
      });
    },
    {
      manual: true,
      onSuccess: (result, params) => {
        if(result.success){
          message.success(`预约取消成功`);
          refresh();
        } else {
          message.error(`预约取消失败：${result.message}`);
        }
      },
      onError: (error) => {
        message.error(`出现错误：${error}`);
      }
    },
  );

  const getTabList = (user) => (
    user.access === 'PATIENT' ?
    [
      {
        key: 'reservations',
        tab: ( <span>预约记录</span> ),
      },
      {
        key: 'records',
        tab: ( <span>病历</span> ),
      },
      {
        key: 'bills',
        tab: ( <span>账单</span> ),
      },
    ]
    :
    [
      {
        key: 'schedule',
        tab: ( <span>我的排班</span> ),
      },
    ]
  );

  const renderUserInfo = ({ geographic }) => {
    return (
      <div className={styles.detail}>
        <p>
          <HomeOutlined
            style={{
              marginRight: 8,
            }}
          />
          { geographic?.province || '' } 
          { geographic?.city || '' }
          { geographic?.address || '' }
        </p>
      </div>
    );
  };

  const renderChildrenByTabKey = (tabValue) => {

    if(!currentUser) {
      return false;
    }

    if (tabValue === 'reservations') { //预约记录
      return <Reservations data={reservations} onCancel={cancel}/>;
    }

    if (tabValue === 'records') { //过往病历
      return <Records data={records}/>;
    }

    if (tabValue === 'bills') { //账单
      return <Bills data={bills}/>;
    }

    if (tabValue === 'schedule') { //账单
      return <Schedule data={arrangements}/>;
    }

    return null;
  };

  return (
    <GridContent>
      <Row gutter={24}>
        <Col lg={6} md={24}>
          <Card
            bordered={false}
            style={{
              marginBottom: 24,
            }}
          >
            {currentUser && (
              <div>
                <div className={styles.avatarHolder}>
                  <img alt="" src={currentUser.avatar} />
                  <div className={styles.name}>{currentUser.name}</div>
                </div>
                {renderUserInfo(currentUser)}
                <Divider dashed />
                <Divider
                  style={{
                    marginTop: 16,
                  }}
                  dashed
                />
              </div>
            )}
          </Card>
        </Col>
        <Col lg={18} md={24}>
          <Card
            className={styles.tabsCard}
            bordered={false}
            tabList={getTabList(currentUser)}
            activeTabKey={tabKey}
            onTabChange={(_tabKey) => {
              setTabKey(_tabKey);
            }}
          >
            {renderChildrenByTabKey(tabKey)}
          </Card>
        </Col>
      </Row>
    </GridContent>
  );
};

export default Center;
