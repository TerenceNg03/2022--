import { LogoutOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import { stringify } from 'querystring';
import { useCallback } from 'react';
import { history, useModel } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

const AvatarDropdown = ({ menu }) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const onMenuClick = useCallback(
    (event) => {
      const { key } = event;

      if(key === 'center') {
        history.push('/center');
      }

      if (key === 'return') {
        window.location.href = 'http://124.220.171.17:3000';
        return;
      }

      if (key === 'logout') {
        localStorage.removeItem('user');
        window.location.href = 'http://124.220.171.17:3000/logout';
        return;
      }
    },
    [setInitialState],
  );
  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.name) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {menu && (
        <Menu.Item key="center">
          <UserOutlined />
          个人中心
        </Menu.Item>
      )}
      {menu && <Menu.Divider />}
      <Menu.Item key="return">
        <HomeOutlined />
        回到主页
      </Menu.Item>
      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
        <span className={`${styles.name} anticon`}>{currentUser.name}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
