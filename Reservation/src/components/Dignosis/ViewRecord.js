import React, { Component } from 'react'
import { Form } from 'antd'
import FormBuilder from 'antd-form-builder'
import moment from "moment";
import ViewCheckAST from "./ViewCheckAST.js"
import ViewSuggest from "./ViewSuggest";

const TimeView = ({ value }) => value.format('yyyy-MM-DD HH:mm:ss');
const DateView = ({ value }) => value.format('yyyy-MM-DD');

const personalInfoSample = {
    id: '2007473',
    name: '赵王',
    gender: '男',
    age: '27',
    //department: '发热门诊科',
    time: moment('2022-01-01 15:43:56'),
}

const ScriptSample = {
    cc: '腹胀腹泻腹痛伴呕吐1天',
    hopi: '患者今凌晨开始腹部胀气，腹痛阵发,位于脐周，便前出现，便后缓解,腹泻2次。现测体温38°C,无鼻塞流涕，无感冒咳嗽，遂转至发热门诊就诊',
    pmh: '否认新冠流行病学史',
    pe: '一般情况好, 咽充血，双侧扁桃体无肿大。一般可, 腹软,肝脾肋下未及,全腹无压痛及反跳痛。',
    pd: '发热:急性胃肠炎',
    rc: '因发热, 故送至隔离点隔离观察,清淡饮食,不适发热门诊随诊',
    edu: '注意休息, 合理饮食',
    sps: [
        {checkName: "123", result: "321"},
    ],
    trs: [
        {medName: '克痢痧胶囊', unit: '盒/20mg', Usage: '口服', val: 1}
    ]
}

const doctorInfoSample = {
    name: '孙李',
    time: moment('2022-01-01'),
}

export default class ViewRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recordData: {},
        }
    }

    // componentWillMount() {
    //     this.getRecordDetail(this.props.recordID);
    // }

    // componentWillReceiveProps(nextProps) {
    //     if(this.props.recordID != nextProps.recordID) this.getRecordDetail(nextProps.recordID);
    // }

    getRecordDetail(id) {
        fetch(`/api/record/view/${id}`, {
            method: "GET",
        }).then(res => res.json()).then(res=>{
            const data = res.data;
            if(!data) return;

            this.setState({
                recordData: {
                    cc: data.cas.cc,
                    hopi: data.cas.hopi,
                    pmh: data.cas.pmh,
                    pe: data.cas.pe,
                    pd: data.cas.pd,
                    rc: data.cas.rc,
                    edu: data.cas.edu,
                    sps: data.sps,
                    trs: data.trs,
                }
            });

            console.log("from record database[get]: ", this.state.recordData);
            //console.log("sample: ", ScriptSample);
        });
    }

    checkData() {
        console.log("check record[get]: ", this.state.recordData);
    }

    infoMeta = {
        columns: 2,
        fields: [
            {
                key: 'id',
                label: '门诊号',
            },
            {
                key: 'name',
                label: '姓名',
            },
            {
                key: 'gender',
                label: '性别',
            },
            {
                key: 'age',
                label: '年龄',
            },
            // {
            //     key: 'department',
            //     label: '就诊科室',
            // },
            {
                key: 'time',
                label: '就诊时间',
                viewWidget: TimeView,
            },
        ],
    };

    formMeta = {
        columns: 1,
        fields: [
            {
                key: 'cc',
                label: '主诉',
                labelCol: {style: {width: '15%'}},
            },
            {
                key: 'hopi',
                label: '现病史',
                labelCol: {style: {width: '15%'}},
            },
            {
                key: 'pmh',
                label: '既往史',
                labelCol: {style: {width: '15%'}},
            },
            {
                key: 'pe',
                label: '体格检查',
                labelCol: {style: {width: '15%'}},
            },
            {
                key: 'sps',
                label: '辅助检查',
                labelCol: {style: {width: '15%'}},
                viewWidget: ViewCheckAST,
            },
            {
                key: 'pd',
                label: '初步诊断',
                labelCol: {style: {width: '15%'}},
            },
            {
                key: 'trs',
                label: '处理意见',
                labelCol: {style: {width: '15%'}},
                viewWidget: ViewSuggest,
            },
            {
                key: 'rc',
                label: '注意事项',
                labelCol: {style: {width: '15%'}},
            },
            {
                key: 'edu',
                label: '健康教育',
                labelCol: {style: {width: '15%'}},
            },
        ],
    };

    doctorMeta = {
        columns: 1,
        fields: [
            {
                key: 'name',
                label: '医师签名',
                labelCol: {style: {width: '50%'}},
            },
            {
                key: 'time',
                label: '时间',
                labelCol: {style: {width: '50%'}},
                viewWidget: DateView,
            },
        ],
    };

    render() {
        // this.checkData();
        this.getRecordDetail(this.props.recordID);
        return (
            <Form layout="horizontal">
                {<FormBuilder meta={this.infoMeta} initialValues={personalInfoSample} viewMode/>}
                <hr/>
                <FormBuilder meta={this.formMeta} initialValues={this.state.recordData} viewMode/>
                <hr/>
                {<FormBuilder meta={this.doctorMeta} initialValues={doctorInfoSample} viewMode />}
            </Form>
        )
    }
}
