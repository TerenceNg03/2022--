import { PlusOutlined } from '@ant-design/icons';
import ProDescriptions from '@ant-design/pro-descriptions';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { useRequest } from 'ahooks';
import { Button, Drawer, Input, message } from 'antd';
import { Link } from 'umi';
import { useRef, useState } from 'react';
import UpdateForm from './components/UpdateForm';
import { queryReserveList } from './service';
import { currentUser as queryCurrentUser } from '@/services/ant-design-pro/api';

const TableList = () => {
  const actionRef = useRef();
  const [currentRow, setCurrentRow] = useState();

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
          status: 'Default',
        },
        'started': {
          text: '就诊中',
          status: 'Processing',
        },
        'done': {
          text: '已结束',
          status: 'Success',
        },
        'cancelled': {
          text: '已取消',
          status: 'Error',
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
        <Link to={
          {
            pathname: "/detail",
            state:
            {
              record: record,
            }
          }
          // onClick={() => {
          //   // setCurrentRow(record);
          // }}
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
          rowKey="key"
          search={{
            labelWidth: 80,
          }}
          request={ async (params, sorter, filter) => {
            const data = { doctor_id : currentUser.data.id, ...params };
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
// 医生列表
// api / dector / queryDector   param: { hospital, department } res: { DectorId, 已被预约人数，接受预约人数 }
// api / doctor / chooseDector   param: { DectorId,patienceId,name,reserveTime.desc } res: { success: }

// 个人页面
//  药方、账单 放着
// 个人信息
// api/user/queryUserInfo   param: { userId } res: { userId, name, telephone}\
// api/user/queryReserveList   param: { userId } res: { data:预约的{name, desc, status},sucdess: }
