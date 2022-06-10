import React, {Component} from 'react'
import {Button, Form, notification, Spin} from 'antd'
import FormBuilder from 'antd-form-builder'
import moment from "moment";
import CheckAST from "./CheckAST.js"
import Suggest from "./Suggest.js"
import {string} from "prop-types";
// import ExportExcel from "./ExportExcel.js";
const FormItem = Form.Item;

let uuid = 0;

const DateView = ({ value }) => value.format('yyyy-MM-DD HH:mm:ss')

const personalInfoSample = {
    id: 1,
    name: '华安',
    gender: '男',
    age: 27,
    department: '发热门诊科',
    userID: 9527,
    doctorID: 2022,
    doctorName: '钮祜禄',
    time: moment('2022-01-01 15:43:56'),
}

let SampleMedicines = [{"id": 123123,"medName": "钝角", "maxval": 5, "unit": "盒/50mg", "Usage": "口服"},
                {"id": 123123,"medName": "您好", "maxval": 5, "unit": "盒/30mg", "Usage": "外用"},
                {"id": 123123,"medName": "阿姆斯特朗", "maxval": 5, "unit": "盒/10mg", "Usage": "在月球上"},
                {"id": 123123,"medName": "Gemini", "maxval": 5, "unit": "盒/10mg", "Usage": "上课"}]
export {SampleMedicines}

// let firstPgMed = []
// export {firstPgMed}

let AllMedInfo = []
export {AllMedInfo}

export default class UpdateRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recordID: 0,
            userID: 13,
            doctorID: 8,
            loading: true,
            commit: true
        }
    }

    formRef = React.createRef();


    componentDidMount() {
        let formData = new FormData();
        formData.append('userID', this.state.userID);
        formData.append('doctorID', this.state.doctorID);
        console.log('send data to record backend[newcase]: ', formData.get('userID')," ", formData.get('doctorID'));
        this.newCase(formData)
        this.setState({loading: false})
    }

    newCase(formData) {
        fetch(`http://124.220.171.17:1376/api/record/newcase`,{
            method:"POST",
            body: formData
        }).then(res=>res.json()).then(data=>{
            console.log('return data from record backend[newcase]: ', data)
            if (data["code"]===200){
                this.setState({recordID: data["data"]["id"]})
                const key = `open${Date.now()}`;
                const btn = (
                    <Button type="primary" size="small" onClick={() => notification.close(key)}>
                        确认
                    </Button>
                );
                notification.open({
                    message: `新建病历成功！`,
                    description:
                        `病历号：${this.state.recordID}`,
                    btn,
                    key,
                });
            }else{
                const key = `open${Date.now()}`;
                const btn = (
                    <Button type="primary" size="small" onClick={() => notification.close(key)}>
                        确认
                    </Button>
                );
                notification.open({
                    message: `新建病历失败！`,
                    description:
                        `核对病人ID和医师ID并请刷新重试`,
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
        for(let i=0; i<x["sps"].length; i++){
            sps.push({"clinicID": personalInfoSample.id,
                "checkname": x["sps"][i]["checkname"],
                "result": x["sps"][i]["result"]})
        }
        let trs = [];

        let newMedBill = {
            "patient_id": this.state.userID.toString(),
            "bill": []
        }

        for(let i=0; i<x["trs"].length; i++){
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
            trs.push({"clinicID": personalInfoSample.id,
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
            this.setState({commit: true})
            // commit to pharmacy backend
            let toPha_code = 0
            console.log(newMedBill)
            fetch(`http://124.220.171.17:6666/doctor_interface/prescmedicine/`,{
                method:"POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newMedBill)
            }).then(res=> {
                toPha_code = res.status
                console.log(res)
                if (toPha_code!==200){
                    throw new Error(`HTTP error ${res.status}`)
                } else {
                    const key = `open${Date.now()}`;
                    const btn = (
                        <Button type="primary" size="small" onClick={() => notification.close(key)}>
                            确认
                        </Button>
                    );
                    notification.open({
                        message: `后台药房账单更新成功！`,
                        description:
                            ``,
                        btn,
                        key,
                    });
                }
                return res.json()
            }).then(data=>{
                // add alert here
                console.log(data)
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
            fetch(`http://124.220.171.17:1376/api/record/commit?id=${this.state.recordID}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newRecordData)
            }).then(res => res.json()).then(data => {
                console.log(data)
                if (data["code"] === 200) {
                    // recordID = data["data"]["id"];
                    const key = `open${Date.now()}`;
                    const btn = (
                        <Button type="primary" size="small" onClick={() => notification.close(key)}>
                            确认
                        </Button>
                    );
                    notification.open({
                        message: data['msg'],
                        description:
                            `病历号：${this.state.recordID}`,
                        btn,
                        key,
                    });
                } else {
                    const key = `open${Date.now()}`;
                    const btn = (
                        <Button type="primary" size="small" onClick={() => notification.close(key)}>
                            确认
                        </Button>
                    );
                    notification.open({
                        message: `修改失败`,
                        description:
                            data['msg'],
                        btn,
                        key,
                    });
                }
            })

        }
    }

    getInfoMeta = () =>{
        return {
            columns: 2,
            fields: [
                {key: 'id', label: '门诊号'},
                {key: 'name', label: '姓名'},
                // { key: 'name.last', label: 'Last Name' },
                {key: 'gender', label: '性别'},
                {key: 'age', label: '年龄'},
                {key: 'department', label: '就诊科室'},
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
            // initialValues: { obj: { input: 5 } },

            fields: [
                {
                    key: 'cc',
                    label: '主诉',
                    labelCol: {style: {width: '15%'}},
                    initialValue: '',
                    // tooltip: 'This is the tooltip.',
                },
                { key: 'hopi', label: '现病史', labelCol: {style: {width: '15%'}}, widget: 'textarea' },
                { key: 'pmh', label: '既往史', labelCol: {style: {width: '15%'}}, widget: 'textarea' },
                { key: 'pe', label: '体格检查', labelCol: {style: {width: '15%'}}, widget: 'textarea' },
                { key: 'sps', label: '辅助检查', labelCol: {style: {width: '15%'}}, widget: CheckAST },
                {
                    key: 'pd', label: '初步诊断', labelCol: {style: {width: '15%'}}, initialValue: '',
                    // tooltip: 'This is the tooltip.',
                },
                { key: 'trs', label: '处理意见', labelCol: {style: {width: '15%'}}, widget: Suggest },
                { key: 'rc', label: '注意事项', labelCol: {style: {width: '15%'}}, widget: 'textarea' },
                { key: 'edu', label: '健康教育', labelCol: {style: {width: '15%'}}, widget: 'textarea' },
            ],
        }

        const form = this.formRef.current

        // Just example of how to dynamicly change fields based on user's input
        if (form && form.getFieldValue('checkbox')) {
            meta.fields.splice(2, 1)
        }
        return meta
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
                    <FormBuilder meta={this.getInfoMeta()} initialValues={personalInfoSample} viewMode/>
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
