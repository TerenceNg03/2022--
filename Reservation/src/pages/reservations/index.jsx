import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Link, useRequest } from 'umi';
import { useRef } from 'react';
import { queryReserveList } from './service';
import { currentUser as queryCurrentUser } from '@/services/ant-design-pro/api';

export const TableList = () => {
  const actionRef = useRef();

  const { data: currentUser, loading } = useRequest(() => {
    return queryCurrentUser();
  });

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 60,
    },
    {
      title: '患者名字',
      dataIndex: 'patient_id',
    },
    {
      title: '患者描述',
      dataIndex: 'description',
      valueType: 'textarea',
      width: 500,
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
          text: '已失效',
          status: 'Default',
        },
      },
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
      { !loading && currentUser && (
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
            const nameFilter = item => data.patient_id ? `${item.patient_id}`.includes(`${data.patient_id}`) : true;
            return Promise.resolve({
              data: res.data.filter(nameFilter),
              success: res.success,
            });
          }}
        />
      )}
    </PageContainer>
  );
};

export default TableList;