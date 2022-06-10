import { Space, Table, Typography, Badge, Modal } from 'antd';
import { useState } from 'react';
import ViewRecord from '@/components/Diagnosis/ViewRecord';
import moment from 'moment';

const Reservations = (props) => {
  const [visible, setVisible] = useState(false);
  const [recordID, setRecordID] = useState(0);

  const { data, onCancel } = props;

  const handleCancel= () => {
    setVisible(false);
  }

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
          {moment(record.start_time).format('HH:mm:ss')}~{moment(record.expire_time).format('HH:mm:ss')}
        </span>
      ),
    },
    // {
    //   title: '医院',
    //   dataIndex: 'address',
    //   key: 'address',
    // },
    // {
    //   title: '科室',
    //   dataIndex: 'department',
    //   key: 'department',
    // },
    {
      title: '医生',
      dataIndex: 'doctor_name',
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
          <Typography.Link
            onClick={(e) => {
              e.preventDefault();
              setRecordID(record.record_id);
              setVisible(true);
            }}
          >
            详情
          </Typography.Link>
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

  return <>
    <Table
      columns={columns}
      dataSource={data}
      rowKey="app_id"
    />
    <Modal
      title='详情'
      visible={visible}
      footer={null}
      onCancel={handleCancel}
    >
      {
        recordID
        ?
        <ViewRecord recordID={recordID}/>
        :
        '暂无接诊结果'
      }
    </Modal>
  </>;
}

export default Reservations;
