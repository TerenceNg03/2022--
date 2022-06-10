import React, { useState } from 'react';
import 'antd/dist/antd.css';

import { Drawer, List, Avatar } from 'antd';
import ViewRecord from '@/components/Diagnosis/ViewRecord';

const Records = (props) => {
  const [visible, setVisible] = useState(false);
  const [recordID, setRecordID] = useState(0);

  const { data } = props;

  const showDrawer = () => {
    setVisible(true);
  };

  const hideDrawer = () => {
    setVisible(false);
  };

  return (
    <>
      { data?.length > 0 &&
        <List
          dataSource={data}
          style={{width:'100%'}}
          bordered
          renderItem={(item) => (
            <List.Item
              key={item.recordID}
              actions={[
                <a
                  onClick={() => {
                    setRecordID(item.recordID);
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
      }
      <Drawer
        width={640}
        placement="right"
        closable={false}
        onClose={hideDrawer}
        visible={visible}
      >
        <ViewRecord recordID={recordID}/>
      </Drawer>
    </>
  );
};

export default Records;
