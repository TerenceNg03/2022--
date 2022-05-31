import { Space, Table } from 'antd';

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

const Reservations = (props) => {

  const { data } = props;

  return <Table
    columns={columns}
    dataSource={data}
    rowKey="app_id"
  />;
}

export default Reservations;
