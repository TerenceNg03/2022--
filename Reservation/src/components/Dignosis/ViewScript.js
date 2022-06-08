import React, { Component } from 'react';
import { Form, Button, Rate, Input, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import FormBuilder from 'antd-form-builder';
import moment from 'moment';
import ViewCheckAST from './ViewCheckAST.js';
import CheckSample from './ViewCheckAST.js';
import ViewSuggest from './ViewSuggest.js';
import SuggestSample from './ViewSuggest.js';

const TimeView = ({ value }) => value.format('yyyy-MM-DD HH:mm:ss');
const DateView = ({ value }) => value.format('yyyy-MM-DD');

const personalInfoSample = {
  id: '2007473',
  name: '赵王',
  gender: '男',
  age: '27',
  department: '发热门诊科',
  time: moment('2022-01-01 15:43:56'),
};

const ScriptSample = {
  main: '腹胀腹泻腹痛伴呕吐1天',
  present:
    '患者今凌晨开始腹部胀气，腹痛阵发,位于脐周，便前出现，便后缓解,腹泻2次。现测体温38°C,无鼻塞流涕，无感冒咳嗽，遂转至发热门诊就诊',
  history: '否认新冠流行病学史',
  bodycheck:
    '一般情况好, 咽充血，双侧扁桃体无肿大。一般可, 腹软,肝脾肋下未及,全腹无压痛及反跳痛。',
  // checkast: {CheckSample},
  diagnosis: '发热:急性胃肠炎',
  // suggest: {SuggestSample},
  caution: '因发热, 故送至隔离点隔离观察,清淡饮食,不适发热门诊随诊',
  appendix: '注意休息, 合理饮食',
};

const doctorInfoSample = {
  name: '孙李',
  time: moment('2022-01-01'),
};

const ViewScript = (props) => {
  const formRef = React.createRef();
  const handleFinish = (evt) => {
    console.log('submit: ', formRef.current.getFieldsValue());
  };

  const getInfoMeta = () => {
    const meta = {
      columns: 2,
      fields: [
        { key: 'id', label: '门诊号' },
        { key: 'name', label: '姓名' },
        // { key: 'name.last', label: 'Last Name' },
        { key: 'gender', label: '性别' },
        { key: 'age', label: '年龄' },
        { key: 'department', label: '就诊科室' },
        // { key: 'address', label: 'Address', colSpan: 2 },
        // { key: 'city', label: 'City' },
        // { key: 'zipCode', label: 'Zip Code' },
        {
          key: 'time',
          label: '就诊时间',
          viewWidget: TimeView,
        },
      ],
    };

    return meta;
  };

  const getFormMeta = () => {
    const meta = {
      columns: 1,
      // initialValues: { obj: { input: 5 } },

      fields: [
        {
          key: 'main',
          label: '主诉',
          labelCol: { style: { width: '15%' } },
        },
        {
          key: 'present',
          label: '现病史',
          labelCol: { style: { width: '15%' } },
        },
        {
          key: 'history',
          label: '既往史',
          labelCol: { style: { width: '15%' } },
        },
        {
          key: 'bodycheck',
          label: '体格检查',
          labelCol: { style: { width: '15%' } },
        },
        {
          key: 'checkast',
          label: '辅助检查',
          labelCol: { style: { width: '15%' } },
          viewWidget: ViewCheckAST,
        },
        {
          key: 'diagnosis',
          label: '初步诊断',
          labelCol: { style: { width: '15%' } },
          // tooltip: 'This is the tooltip.',
        },
        {
          key: 'suggest',
          label: '处理意见',
          labelCol: { style: { width: '15%' } },
          viewWidget: ViewSuggest,
        },
        {
          key: 'caution',
          label: '注意事项',
          labelCol: { style: { width: '15%' } },
        },
        {
          key: 'appendix',
          label: '健康教育',
          labelCol: { style: { width: '15%' } },
        },
      ],
    };

    return meta;
  };

  const getDoctorMeta = () => {
    const meta = {
      columns: 1,
      fields: [
        {
          key: 'name',
          label: '医师签名',
          labelCol: { style: { width: '50%' } },
        },
        {
          key: 'time',
          label: '时间',
          labelCol: { style: { width: '50%' } },
          viewWidget: DateView,
        },
      ],
    };

    return meta;
  };

  return (
    <Form
      ref={formRef}
      layout="horizontal"
      onFinish={handleFinish}
      onValuesChange={() => forceUpdate()}
    >
      <FormBuilder
        meta={getInfoMeta()}
        initialValues={personalInfoSample}
        viewMode
      />
      <hr />
      <FormBuilder
        meta={getFormMeta()}
        initialValues={ScriptSample}
        viewMode
      />
      <hr />
      <FormBuilder
        meta={getDoctorMeta()}
        initialValues={doctorInfoSample}
        viewMode
      />
    </Form>
  );
};

export default ViewScript;