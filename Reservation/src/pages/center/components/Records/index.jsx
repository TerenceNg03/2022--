import React, { useState } from 'react';
import 'antd/dist/antd.css';
import './index.less';
import { Drawer, List, Avatar } from 'antd';
import ViewRecord from '@/components/Dignosis/ViewRecord';

const Records = (props) => {
  const [visible, setVisible] = useState(false);
  const [recordID, setRecordID] = useState(0);
  const [doctorName, setDoctorName] = useState('');

  const { data, user } = props;

  const showDrawer = () => {
    setVisible(true);
  };

  const hideDrawer = () => {
    setVisible(false);
  };

  return (
    <>
      <List
        dataSource={data}
        bordered
        renderItem={(item) => (
          <List.Item
            key={item.recordID}
            actions={[
              <a
                onClick={() => {
                  setRecordID(item.recordID);
                  setDoctorName(item.doctorName);
                  showDrawer();
                }}
                key={`a-${item.recordID}`}
              >
                查看详情
              </a>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />
              }
              title={
                <a href="https://ant.design/index-cn">{item.doctorName}</a>
              }
              description={item.discription}
            />
          </List.Item>
        )}
      />
      <Drawer
        width={640}
        placement="right"
        closable={false}
        onClose={hideDrawer}
        visible={visible}
      >
        <ViewRecord
          recordID={recordID}
          doctorData={{ doctorName }}
          patientData={{ name: user.name }}
        />
      </Drawer>
    </>
  );
};

export default Records;
