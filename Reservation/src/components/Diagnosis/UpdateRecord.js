import React, {Component} from 'react'
import {Button, Form, notification, Spin} from 'antd'
import FormBuilder from 'antd-form-builder'
import moment from "moment";
import CheckAST from "./CheckAST.js"
import Suggest from "./Suggest.js"
import {string} from "prop-types";
const FormItem = Form.Item;

const DateView = ({ value }) => value.format('yyyy-MM-DD HH:mm:ss')

let AllMedInfo = [];
export { AllMedInfo };

export default class UpdateRecord extends Component {
    constructor(props) {
        super(props);
        this.patientID = this.props.patientInfo.id;
        this.doctorID = this.props.doctorID;
        this.userInfo = {
            name: this.props.patientInfo.name,
            gender: '男',
            age: 27,
            time: moment(),
        };
        this.afterCommit = this.props.afterCommit;
        this.state = {
            recordID: 0,
            loading: true,
            commit: false,
        };
    }

    formRef = React.createRef();

    componentDidMount() {
        let formData = new FormData();
        formData.append('userID', this.patientID);
        formData.append('doctorID', this.doctorID);
        console.log('send data to record backend[newcase]: ', formData.get('userID')," ", formData.get('doctorID'));
        this.newCase(formData);
        this.setState({loading: false});
    }

    newCase(formData) {
        fetch(`/api/record/record/newcase`,{
            method:"POST",
            body: formData
        }).then(res=>res.json()).then(data=>{
            console.log('return data from record backend[newcase]: ', data)
            if (data["code"]===200){
                this.setState({recordID: data["data"]["id"]})
                // const key = `open${Date.now()}`;
                // const btn = (
                //     <Button type="primary" size="small" onClick={() => notification.close(key)}>
                //         确认
                //     </Button>
                // );
                // notification.open({
                //     message: `新建病历成功！`,
                //     description: `病历号：${this.state.recordID}`,
                //     btn,
                //     key,
                // });
            }else{
                const key = `open${Date.now()}`;
                const btn = (
                    <Button type="primary" size="small" onClick={() => notification.close(key)}>
                        确认
                    </Button>
                );
                notification.open({
                    message: `新建病历失败！`,
                    description: `核对病人ID和医师ID并请刷新重试`,
                    btn,
                    key,
                });
            }
        })
    }

    handleChange = () => {
        this.forceUpdate();
        this.setState({commit: false});
    }

    handleFinish = evt => {
        console.log('submit: ', this.formRef.current.getFieldsValue())
        const x = this.formRef.current.getFieldsValue()
        let sps = [];
        for(let i=0; i<x["sps"]?.length; i++){
            sps.push({"clinicID": this.state.recordID,
                "checkname": x["sps"][i]["checkname"],
                "result": x["sps"][i]["result"]})
        }
        let trs = [];

        let newMedBill = {
            "patient_id": this.patientID.toString(),
            "bill": []
        }

        for(let i=0; i<x["trs"]?.length; i++){
            let err_flag = false;
            let medName = "";
            for(let j=0; j<AllMedInfo.length; j++){
                if(AllMedInfo[j]["id"] === x["trs"][i]["medName"]) {
                    let err_str = "";
                    if ( parseInt(x["trs"][i]["val"])>AllMedInfo[j]["maxval"] ) {
                        err_str = `使用的药品：${AllMedInfo[j]["medName"]} 使用量${parseInt(x["trs"][i]["val"])} 大于库存${AllMedInfo[j]["maxval"]}！`;
                    }
                    else if ( x["trs"][i]["unit"]!==AllMedInfo[j]["unit"] ) {
                        err_str = `药品：${AllMedInfo[j]["medName"]} 剂量单位填写错误(前后请勿输入空格),正确单位：${AllMedInfo[j]["unit"]}！`;
                    }
                    if(err_str!=="") {
                        const key = `open${Date.now()}`;
                        const btn = (
                            <Button type="primary" size="small" onClick={() => notification.close(key)}>
                                确认
                            </Button>
                        );
                        notification.open({
                            message: "药品信息填写错误",
                            description:
                                err_str,
                            btn,
                            key,
                        });
                        err_flag = true;
                        break;
                    }
                    else{
                        medName = AllMedInfo[j]["medName"];
                    }
                }
            }
            if(err_flag){
                // freeze the button
                this.setState({commit: true});
                break;
            }
            trs.push({"clinicID": this.state.recordID,
                "medName": medName,
                "val": parseInt(x["trs"][i]["val"]),
                "unit": x["trs"][i]["unit"],
                "Usage": x["trs"][i]["Usage"],})
            newMedBill["bill"].push({
                "medName": x["trs"][i]["medName"],
                "val": parseInt(x["trs"][i]["val"]),
            })
        }
        let newRecordData={
            "cas": {
                "registerID" : this.state.recordID,
                "cc" : x["cc"],
                "hopi" : x["hopi"],
                "pmh" : x["pmh"],
                "pe" : x["pe"],
                "pd" : x["pd"],
                "rc" : x["rc"],
                "edu" : x["edu"]
            },
            "sps" : sps,
            "trs" : trs
        }
        console.log("after change: ", JSON.stringify(newRecordData))
        if(!this.state.commit) { // button not frozen
            this.setState({commit: true});
            // commit to pharmacy backend
            let toPha_code = 0;
            console.log(newMedBill);
            fetch(`/api/pharmacy/prescmedicine/`,{
                method:"POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newMedBill)
            }).then(res=> {
                toPha_code = res.status;
                console.log(res);
                if (toPha_code!==200){
                    throw new Error(`HTTP error ${res.status}`)
                } else {
                    // const key = `open${Date.now()}`;
                    // const btn = (
                    //     <Button type="primary" size="small" onClick={() => notification.close(key)}>
                    //         确认
                    //     </Button>
                    // );
                    // notification.open({
                    //     message: `后台药房账单更新成功！`,
                    //     btn,
                    //     key,
                    // });
                }
                return res.json();
            }).then(data=>{
                // add alert here
                console.log(data);
            }).catch(error => {
                const key = `open${Date.now()}`;
                const btn = (
                    <Button type="primary" size="small" onClick={() => notification.close(key)}>
                        确认
                    </Button>
                );
                notification.open({
                    message: `向药房发送数据失败！`,
                    description:
                        `请检查网络并刷新重试, ${error}`,
                    btn,
                    key,
                });
            })

            // commit to record backend
            fetch(`/api/record/record/commit?id=${this.state.recordID}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newRecordData)
            }).then(res => res.json()).then(data => {
                console.log(data);
                if (data["code"] === 200) {
                    // const key = `open${Date.now()}`;
                    // const btn = (
                    //     <Button type="primary" size="small" onClick={() => notification.close(key)}>
                    //         确认
                    //     </Button>
                    // );
                    // notification.open({
                    //     message: data['msg'],
                    //     description: `病历号：${this.state.recordID}`,
                    //     btn,
                    //     key,
                    // });
                } else {
                    const key = `open${Date.now()}`;
                    const btn = (
                        <Button type="primary" size="small" onClick={() => notification.close(key)}>
                            确认
                        </Button>
                    );
                    notification.open({
                        message: `修改失败`,
                        description: data['msg'],
                        btn,
                        key,
                    });
                }
            })
            this.afterCommit(this.state.recordID);
        }
    }

    getInfoMeta = () =>{
        return {
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
                {
                    key: 'time',
                    label: '就诊时间',
                    viewWidget: DateView,
                },
            ],
        }
    }

    getFormMeta = () => {
        const meta = {
            columns: 1,
            fields: [
                {
                    key: 'cc',
                    label: '主诉',
                    required: true,
                    message: '必填',
                    labelCol: {style: {width: '15%'}},
                },
                {
                    key: 'hopi',
                    label: '现病史',
                    required: true,
                    message: '必填',
                    labelCol: {style: {width: '15%'}},
                    widget: 'textarea',
                },
                { 
                    key: 'pmh',
                    label: '既往史',
                    required: true,
                    message: '必填',
                    labelCol: {style: {width: '15%'}},
                    widget: 'textarea',
                },
                { 
                    key: 'pe',
                    label: '体格检查',
                    required: true,
                    message: '必填',
                    labelCol: {style: {width: '15%'}},
                    widget: 'textarea',
                },
                { 
                    key: 'sps',
                    label: '辅助检查',
                    labelCol: {style: {width: '15%'}},
                    widget: CheckAST,
                },
                { 
                    key: 'pd',
                    label: '初步诊断',
                    required: true,
                    message: '必填',
                    labelCol: {style: {width: '15%'}},
                    initialValue: '',
                },
                { 
                    key: 'trs',
                    label: '处理意见',
                    labelCol: {style: {width: '15%'}},
                    widget: Suggest,
                },
                { 
                    key: 'rc',
                    label: '注意事项',
                    required: true,
                    message: '必填',
                    labelCol: {style: {width: '15%'}},
                    widget: 'textarea',
                },
                { 
                    key: 'edu',
                    label: '健康教育',
                    required: true,
                    message: '必填',
                    labelCol: {style: {width: '15%'}},
                    widget: 'textarea',
                },
            ],
        }

        const form = this.formRef.current;

        // Just example of how to dynamicly change fields based on user's input
        if (form && form.getFieldValue('checkbox')) {
            meta.fields.splice(2, 1);
        }
        return meta;
    }

    render() {
        return (
            <Form
                ref={this.formRef}
                layout="horizontal"
                onFinish={this.handleFinish}
                onValuesChange={this.handleChange}
            >
                <Spin size="large" spinning={this.state.loading}>
                    <FormBuilder meta={this.getInfoMeta()} initialValues={{id: this.state.recordID, ...this.userInfo}} viewMode/>
                    <hr/>
                    <FormBuilder meta={this.getFormMeta()} />
                    <Form.Item wrapperCol={{ span: 16, offset: 8 }} className="form-footer">
                        <Button htmlType="submit" type="primary" disabled={this.state.commit}>
                            提交
                        </Button>
                    </Form.Item>
                </Spin>
            </Form>

        )
    }
}
