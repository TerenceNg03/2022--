import { Badge, Descriptions,Input } from 'antd';
import { useRequest } from 'umi';
import { queryFakeList } from '../../service';
import AvatarList from '../AvatarList';
import styles from './index.less';
import moment from 'moment';
import { useEffect } from 'react';

const Projects = (props) => {

  const { data } = props;
  
  return <div>{data.map((item) => {
    return <Descriptions title="账单" bordered key={item.key}>
    <Descriptions.Item label="姓名">{item.name}</Descriptions.Item>
    <Descriptions.Item label="是否参保">{item.canbao}</Descriptions.Item>
    <Descriptions.Item label="支付方式">{item.zhifufangshi}</Descriptions.Item>
    <Descriptions.Item label="支付时间">{item.ordertime}</Descriptions.Item>
    <Descriptions.Item label="就诊时间" span={2}>
      {item.jiuzhentime}
    </Descriptions.Item>
    <Descriptions.Item label="状态" span={3}>
      <Badge status={item.state} text={item.text} />
    </Descriptions.Item>
    <Descriptions.Item label="共计支付">{item.gongjizhifu}</Descriptions.Item>
    <Descriptions.Item label="医保代付">{item.yibaodaifu}</Descriptions.Item>
    <Descriptions.Item label="自费支付">{item.zifeizhifu}</Descriptions.Item>
    <Descriptions.Item label="账单详情">
      {item.xiangqing}
    </Descriptions.Item>
    </Descriptions>
  })}</div>;

  };

export default Projects;
