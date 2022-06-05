import { PageContainer } from '@ant-design/pro-layout';
import { Select, Avatar, Card, Input, List, message } from 'antd';
import { useState } from 'react';
import { useRequest, useModel } from 'umi';
import OperationModal from './components/OperationModal';
import { queryHospitalList, queryDepartmentList, queryDoctorList } from '@/services/management';
import { reserveDoctor } from '@/services/reservation';
import { currentUser as queryCurrentUser } from '@/services/ant-design-pro/api';
import styles from './style.less';

const Option = Select.Option;
const { Search } = Input;

const DoctorList = () => {
  const [done, setDone] = useState(false);
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState({id: 0});
  const [doctors, setDoctors] = useState([]);
  const [hospital, setHospital] = useState();
  const [department, setDepartment] = useState();
  const { initialState, setInitialState } = useModel('@@initialState');

  //const { data: currentUser } = useRequest(queryCurrentUser);
  const currentUser = initialState.currentUser;

  const { data: hospitals } = useRequest(queryHospitalList);

  const { data: departments } = useRequest(queryDepartmentList);

  const { data, loading, mutate } = useRequest(
    () => {
      return queryDoctorList({
        hospital,
        department,
      });
    },
    {
      refreshDeps: [hospital, department],
      onSuccess: () => {
        setDoctors(data.doctorInfos);
      }
    },
  );

  const { run: reserve } = useRequest(
    (params) => {
      return reserveDoctor(params);
    },
    {
      manual: true,
      onSuccess: (result, params) => {
        if(result.success){
          //mutate(result);
          setDone(true);
        } else {
          message.error(`预约失败：${result.message}`);
        }
      },
      onError: (error) => {
        message.error(`出现错误：${error}`);
      }
    },
  );

  const showEditModal = (item) => {
    setVisible(true);
    setCurrent(item);
  };

  const handelReturn = () => {
    setDone(false);
    setVisible(false);
  };

  const handleSubmit = (values) => {
    if(!currentUser) {
      message.error("网络不佳，请稍后再试。");
      return;
    }
    reserve({ "patient_id" : currentUser.id , ...values});
  };

  const handleSearch = (value) => {
    setDoctors(data.filter(item => item.name.includes(value)));
  }

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    defaultPageSize: 5,
    pageSizeOptions: [5, 10, 20, 50],
  };

  const extraContent = (
    <div className={styles.extraContent}>
      <Search className={styles.extraContentSearch} placeholder="通过名字查询" onSearch={handleSearch} />
    </div>
  );

  return (
    <div>
      <PageContainer>
        <div className={styles.standardList}>
          <Select
            allowClear
            placeholder="选择医院"
            style={{
              width: 240,
            }}
            onChange={(value) => {setHospital(value);}}
          >
            { hospitals &&
              hospitals.names.map((item) => {
                return <Option value={item} key={item}> {item} </Option>;
              })
            }
          </Select>

          <Select
            allowClear
            placeholder="选择科室"
            style={{
              width: 120,
            }}
            onChange={(value) => {setDepartment(value);}}
          >
            { departments &&
              departments.names.map((item) => {
                return <Option value={item} key={item}> {item} </Option>;
              })
            }
          </Select>

          <Card
            className={styles.listCard}
            bordered={false}
            title="医生列表"
            style={{
              marginTop: 24,
            }}
            bodyStyle={{
              padding: '0 32px 40px 32px',
            }}
            extra={extraContent}
          >
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={{total: doctors.length, ...paginationProps}}
              dataSource={doctors}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <a
                      key="edit"
                      onClick={(e) => {
                        e.preventDefault();
                        showEditModal(item);
                      }}
                    >
                      预约
                    </a>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} shape="square" size="large" />}
                    title={item.realName}
                    description={`${item.hospital} ${item.department}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageContainer>
      <OperationModal
        done={done}
        visible={visible}
        current={current}
        onReturn={handelReturn}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
export default DoctorList;