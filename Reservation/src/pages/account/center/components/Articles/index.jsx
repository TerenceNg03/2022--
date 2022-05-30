import { LikeOutlined, MessageFilled, StarTwoTone } from '@ant-design/icons';
import { Space, Table, Tag } from 'antd';
import { useRequest } from 'umi';
import { queryFakeList } from '../../service';
import ArticleListContent from '../ArticleListContent';
import styles from './index.less';
const columns = [
  {
    title: '时间',
    dataIndex: 'start_time',
    key: 'time',
  },
  {
    title: '就诊医院',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '科室',
    dataIndex: 'department',
    key: 'department',
  },
  {
    title: '医生',
    dataIndex: 'doctor_id',
    key: 'doctor',
  },
  {
    title: '详情',
    key: 'detail',
    render: (_, record) => (
      <Space size="middle">
        <a>详情</a>
      </Space>
    ),
  },
];

const Articles = (props) => {

  const { data } = props;

  return <Table columns={columns} dataSource={data} />;
}

export default Articles;
