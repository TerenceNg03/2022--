import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Link, useModel } from 'umi';
import { useRef } from 'react';
import { queryReserveList } from '@/services/reservation';

export const TableList = () => {
  const actionRef = useRef();
  const { initialState, setInitialState } = useModel('@@initialState');

  const currentUser = initialState.currentUser;

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 60,
    },
    {
      title: '患者名字',
      dataIndex: 'patient_name',
    },
    {
      title: '患者描述',
      dataIndex: 'description',
      valueType: 'textarea',
      width: 500,
    },
    {
      title: '预约时间',
      dataIndex: 'start_time',
      valueType: 'dateTime',
      hideInSearch: true,
      sorter: (a, b) => {
        const atime = new Date(a.start_time).getTime();
        const btime = new Date(b.start_time).getTime();
        return atime - btime;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        'booked': {
          text: '尚未就诊',
          status: 'Success',
        },
        'started': {
          text: '就诊中',
          status: 'Processing',
        },
        'done': {
          text: '已结束',
          status: 'Default',
        },
        'cancelled': {
          text: '已取消',
          status: 'Default',
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Link key='app_id' to={
          {
            pathname: '/detail',
            state:
            {
              record: record,
            }
          }
        }>
          详情
        </Link>,
      ],
    },
  ];
  return (
    <PageContainer>
        <ProTable
          headerTitle="现有预约"
          columns={columns}
          actionRef={actionRef}
          rowKey="app_id"
          search={{
            labelWidth: 80,
          }}
          request={ async (params, sorter, filter) => {
            const data = { doctor_id : currentUser.id, ...params };
            const res = await queryReserveList(data);
            return Promise.resolve({
              data: res.data,
              success: res.success,
            });
          }}
        />
    </PageContainer>
  );
};

export default TableList;