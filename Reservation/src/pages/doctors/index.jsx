import { PageContainer } from '@ant-design/pro-layout';
import { Select, Avatar, Card, Input, List, message } from 'antd';
import { useState } from 'react';
import { useRequest } from 'umi';
import OperationModal from './components/OperationModal';
import { queryDoctorList, reserveDoctor } from './service';
import { currentUser as queryCurrentUser } from '@/services/ant-design-pro/api';
import styles from './style.less';

const Option = Select.Option;
const { Search } = Input;

export const BasicList = () => {
  const [done, setDone] = useState(false);
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(undefined);
  const [doctors, setDoctors] = useState([]);

  const { data: currentUser } = useRequest(() => {
    return queryCurrentUser();
  });

  const { data, loading, mutate } = useRequest(
    () => {
      return queryDoctorList({

      });
    },
    {
      onSuccess: () => {
        setDoctors(data);
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
        message.error(`出现错误：${result.message}`);
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

  const handleHospitalChange = (value) => {
    
  };

  const handleDepartmentChange = (value) => {
    
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
            showSearch
            placeholder="选择医院"
            style={{
              width: 240,
            }}
            onChange={handleHospitalChange}
          >
            <Option value="浙江大学附属第一医院">浙江大学附属第一医院</Option>
            <Option value="浙大二院">浙大二院</Option>
            <Option value="浙江省立同德医院">浙江省立同德医院</Option>
          </Select>

          <Select
            showSearch
            placeholder="选择科室"
            style={{
              width: 120,
            }}
            onChange={handleDepartmentChange}
          >
            <Option value="外科">外科</Option>
            <Option value="内科">内科</Option>
            <Option value="小儿科">小儿科</Option>
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
                    title={<a href={item.href}>{item.name}</a>}
                    description={item.description}
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
export default BasicList;