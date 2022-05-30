import { Avatar } from 'antd';
import styles from './index.less';

const ArticleListContent = ({ data: { content, updatedAt, avatar, owner, href } }) => (
  <div className={styles.listContent}>
    <div className={styles.description}>{content}</div>
    <div className={styles.extra}>
      <Avatar src={avatar} size="small" />
      <a href={href}>{owner}</a> 发布在 <a href={href}>{href}</a>
    </div>
  </div>
);

export default ArticleListContent;
