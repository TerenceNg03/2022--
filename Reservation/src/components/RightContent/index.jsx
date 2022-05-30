import { QuestionCircleOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import { SelectLang, useModel } from 'umi';
import HeaderSearch from '../HeaderSearch';
import NoticeIconView from '../NoticeIcon';
import Avatar from './AvatarDropdown';
import styles from './index.less';

const GlobalHeaderRight = () => {
  const { initialState } = useModel('@@initialState');

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <Space className={className}>
      {/*<NoticeIconView />*/}
      <Avatar menu />
      <SelectLang className={styles.action} />
    </Space>
  );
};

export default GlobalHeaderRight;
