import React, {Component} from 'react';
import 'antd/dist/antd.css';
import '../index.css';
import { useState } from "react";
import {Form, Input, Button, Space, Select, notification} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { AllMedInfo } from "./UpdateRecord";
const { Option } = Select;

// const medItem = {
//     basic: {name: 'medItem', component: Search}
// }

let timeout;
let currentValue;

const fetch_http = (value, callback) => {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }

    currentValue = value;
    let code = 0
    const fake = () => {
        fetch(`http://124.220.171.17:6666/doctor_interface/querymedicine/?SearchContent=${value}`,{
            method:"GET",
        }).then(res=> {
            code = res.status
            console.log(res)
            if (code!==200){
                throw new Error(`HTTP error ${res.status}`)
            }
            return res.json()
        }).then(data=>{
            console.log('return data from pharmacy backend[getAllMedInfo]: ', data)
            let newOptions = []
            if (code===200){
                for(let i=0; i<data["MediList"].length && i<20; i++) {
                    let item={
                        "id": data["MediList"][i]["ID"],
                        "medName": data["MediList"][i]["Name"],
                        "maxval": data["MediList"][i]["Num"],
                        "unit": data["MediList"][i]["Unit"],
                        "Usage": data["MediList"][i]["Usage"],
                    }
                    newOptions.push(item)
                }
            }
            callback(newOptions)
        }).catch(error => {
            const key = `open${Date.now()}`;
            const btn = (
                <Button type="primary" size="small" onClick={() => notification.close(key)}>
                    确认
                </Button>
            );
            notification.open({
                message: `获取药房数据失败！`,
                description:
                    `请检查网络并刷新重试, ${error}`,
                btn,
                key,
            });
        })
    };

    timeout = setTimeout(fake, 300);
};

const Suggest = () => {
    const [medoption, setMedoption] = useState([])
    const [load, setLoad] = useState(false)

    const getMedOption = (newvalue) => {
        setLoad(true);
        if(newvalue && newvalue.length>=2){
            fetch_http(newvalue, setMedoption)
        } else {
            setMedoption([])
        }
        setLoad(false);
    }

    const handleMedicineChange = (value) => {
        console.log(medoption, value)
        for(let i=0; i<medoption.length; i++){
            if(medoption[i]["id"] === value) {
                console.log(`medName: ${medoption[i]["medName"]}, unit: ${medoption[i]["unit"]}, Usage: ${medoption[i]["Usage"]}`)
                AllMedInfo.push(medoption[i])
                const key = `open${Date.now()}`;
                const btn = (
                    <Button type="primary" size="small" onClick={() => notification.close(key)}>
                        确认
                    </Button>
                );
                notification.open({
                    message: `药品：${medoption[i]["medName"]} 信息完成核对`,
                    description:(
                        <a>
                            {`单位：${medoption[i]["unit"]}`}<br/>
                            {`建议用法：${medoption[i]["Usage"]}`}<br/>
                            {`药品剩余：${medoption[i]["maxval"]}`}
                        </a>
                    ),
                    duration: 10,
                    btn,
                    key,
                });
            }
        }
    };

    return (
        <Form.List name="trs">
            {(fields, {add, remove}) => (
                <a>
                    {fields.map(({key, name, ...restField}) => (
                        <Space key={key} style={{display: 'flex', marginBottom: 0}} align="baseline">
                            <Form.Item
                                {...restField}
                                name={[name,"medName"]}
                                rules={[{ required: true, message: "请输入药品" }]}
                            >
                                <Select
                                    showSearch
                                    // value={value}
                                    allowClear
                                    placeholder="选择药品"
                                    style={{width: 120}}
                                    loading={load}
                                    optionFilterProp="children"
                                    defaultActiveFirstOption={false}
                                    showArrow={false}
                                    filterOption={false}
                                    onSearch={getMedOption}
                                    onChange={handleMedicineChange}
                                >
                                    {medoption.map((d) => <Option key={d["id"]}>{d["medName"]}</Option>)}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                {...restField}
                                name={[name,"val"]}
                                rules={[{ required: true, message: "请输入剂量" },]}
                            >
                                <Input placeholder="剂量" />
                            </Form.Item>
                            <Form.Item
                                {...restField}
                                name={[name,"unit"]}
                                rules={[{ required: true, message: "请输入剂量单位" },]}
                            >
                                <Input placeholder="单位"/>
                            </Form.Item>
                            <Form.Item
                                {...restField}
                                name={[name, "Usage"]}
                                rules={[{ required: true, message: "请输入药品用法" },]}
                            >
                                <Input placeholder="用法"/>

                            </Form.Item>


                            <MinusCircleOutlined onClick={() => remove(name)}/>
                        </Space>
                    ))}
                    <Form.Item>
                        <Button type="dashed" onClick={() => add()} icon={<PlusOutlined/>}>
                            新增药品
                        </Button>
                    </Form.Item>
                </a>
            )}
        </Form.List>
    );
    // }
};

export default Suggest;