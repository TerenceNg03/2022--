import React, { Component } from 'react';
import { Form, Button, Rate, Input, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import FormBuilder from 'antd-form-builder';
import moment from 'moment';
import CheckAST from './CheckAST.js';
import Suggest from './Suggest.js';
// import ExportExcel from "./ExportExcel.js";
const FormItem = Form.Item;

let uuid = 0;

const DateView = ({ value }) => value.format('yyyy-MM-DD HH:mm:ss');

const personalInfoSample = {
  id: 2007473,
  name: '赵王',
  gender: '男',
  age: '27',
  department: '发热门诊科',
  time: moment('2022-01-01 15:43:56'),
};

let medicines = [
  { medName: '钝角', maxval: 5, unit: '盒/50mg', Usage: '口服' },
  { medName: '您好', maxval: 5, unit: '盒/30mg', Usage: '外用' },
  { medName: '阿姆斯特朗', maxval: 5, unit: '盒/10mg', Usage: '在月球上' },
  { medName: 'Gemini', maxval: 5, unit: '盒/10mg', Usage: '上课' },
];
export { medicines };

const Basic = () => {
  const formRef = React.createRef();

  const handleFinish = (evt) => {
    console.log('submit: ', formRef.current.getFieldsValue());
    // console.log('submit__: ', props.form.getFieldsValue())
    console.log('submit: ', JSON.stringify(formRef.current.getFieldsValue()));
    const x = formRef.current.getFieldsValue();
    let sps = [];
    for (let i = 0; i < x['sps'].length; i++) {
      sps.push({
        clinic: personalInfoSample.id,
        checkname: x['sps'][i]['checkname'],
        result: x['sps'][i]['result'],
      });
    }
    let trs = [];
    for (let i = 0; i < x['trs'].length; i++) {
      trs.push({
        clinic: personalInfoSample.id,
        medName: x['trs'][i]['medName'],
        val: x['trs'][i]['val'],
        unit: x['trs'][i]['unit'],
        Usage: x['trs'][i]['Usage'],
      });
    }
    const newData = {
      cas: {
        registerID: personalInfoSample.id,
        cc: x['cc'],
        hopi: x['hopi'],
        pmh: x['pmh'],
        pe: x['pe'],
        pd: x['pd'],
        rc: x['rc'],
        edu: x['edu'],
      },
      sps: sps,
      trs: trs,
    };
    console.log('after change: ', JSON.stringify(newData));
    fetch(`/api/commit?id=${personalInfoSample.id}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formRef.current.getFieldsValue()),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
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
        {
          key: 'time',
          label: '就诊时间',
          viewWidget: DateView,
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
          key: 'cc',
          label: '主诉',
          labelCol: { style: { width: '15%' } },
          initialValue: '',
          // tooltip: 'This is the tooltip.',
        },
        {
          key: 'hopi',
          label: '现病史',
          labelCol: { style: { width: '15%' } },
          widget: 'textarea',
        },
        {
          key: 'pmh',
          label: '既往史',
          labelCol: { style: { width: '15%' } },
          widget: 'textarea',
        },
        {
          key: 'pe',
          label: '体格检查',
          labelCol: { style: { width: '15%' } },
          widget: 'textarea',
        },
        {
          key: 'sps',
          label: '辅助检查',
          labelCol: { style: { width: '15%' } },
          widget: CheckAST,
        },
        {
          key: 'pd',
          label: '初步诊断',
          labelCol: { style: { width: '15%' } },
          initialValue: '',
          // tooltip: 'This is the tooltip.',
        },
        {
          key: 'trs',
          label: '处理意见',
          labelCol: { style: { width: '15%' } },
          widget: Suggest,
        },
        {
          key: 'pc',
          label: '注意事项',
          labelCol: { style: { width: '15%' } },
          widget: 'textarea',
        },
        {
          key: 'edu',
          label: '健康教育',
          labelCol: { style: { width: '15%' } },
          widget: 'textarea',
        },
      ],
    };

    const form = formRef.current;

    // Just example of how to dynamicly change fields based on user's input
    if (form && form.getFieldValue('checkbox')) {
      meta.fields.splice(2, 1);
    }
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
      <FormBuilder meta={getFormMeta()} />
      <Form.Item wrapperCol={{ span: 16, offset: 8 }} className="form-footer">
        <Button htmlType="submit" type="primary">
          提交
        </Button>
      </Form.Item>
      <Form.Item wrapperCol={{ span: 16, offset: 8 }} className="form-footer">
        {/*<ExportExcel/>*/}
      </Form.Item>
    </Form>
  );
};

export default Basic;
