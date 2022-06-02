import { Space, Table, Typography, Badge } from 'antd';
import moment from 'moment';
import { changeStatus } from '../../../../detail/service';

const Reservations = (props) => {

  const { data, onCancel } = props;

  const statusInfo = {
    booked: {
      text: '未开始',
      type: 'success',
    },
    started: {
      text: '就诊中',
      type: 'processing',
    },
    done: {
      text: '已结束',
      type: 'default',
    },
    cancelled: {
      text: '已取消',
      type: 'default',
    }
  }

  const columns = [
    {
      title: '预约日期',
      key: 'date',
      render: (_, record) => (
        <span>
          {moment(record.start_time).format('YYYY-MM-DD')}
        </span>
      ),
    },
    {
      title: '预约时间',
      key: 'range',
      render: (_, record) => (
        <span>
          {moment(record.expire_time).format('HH:mm:ss')}~{moment(record.expire_time).format('HH:mm:ss')}
        </span>
      ),
    },
    {
      title: '医院',
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
      title: '状态',
      dataIndex: 'status',
      render: (_, record) => (
        <Badge
          status={statusInfo[record.status].type}
          text={statusInfo[record.status].text}
        />
      ),
    },
    {
      title: '操作',
      key: 'detail',
      render: (_, record) => (
        <Space size={16}>
          <a>详情</a>
          <Typography.Link
            disabled={record.status != 'booked'}
            onClick={(e) => {
              e.preventDefault();
              onCancel(record.app_id);
            }}
          >
            取消预约
          </Typography.Link>
        </Space>
      ),
    },
  ];

  return <Table
    columns={columns}
    dataSource={data}
    rowKey="app_id"
  />;
}

export default Reservations;
