import React, { useState } from 'react';
import 'antd/dist/antd.css';
import './index.less';
import { Drawer, List, Avatar, Divider, Col, Row } from 'antd';
import ViewScript from '@/components/Dignosis/ViewScript';

const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);

const Records = () => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      <List
        dataSource={[
          {
            id: 1,
            Doctor_name: '张小丽',
            description: '腹胀腹泻腹痛伴呕吐1天',
          },
          {
            id: 2,
            Doctor_name: '胡英俊',
            description: '腹胀腹泻腹痛伴呕吐1天',
          },
        ]}
        bordered
        renderItem={(item) => (
          <List.Item
            key={item.id}
            actions={[
              <a onClick={showDrawer} key={`a-${item.id}`}>
                查看详情
              </a>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />
              }
              title={
                <a href="https://ant.design/index-cn">{item.Doctor_name}</a>
              }
              description={item.description}
            />
          </List.Item>
        )}
      />
      <Drawer
        width={640}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        <ViewScript />
      </Drawer>
    </>
  );
};

export default Records;
