import React, {Component} from 'react';
import 'antd/dist/antd.css';
import '../index.css';
import useHash from '../useHash'
import { useState } from "react";
import {Form, Input, Button, Space, Select, notification} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { medicines } from "./Basic";
// import SearchInput from "./Search";
const { Option } = Select;

// const medItem = {
//     basic: {name: 'medItem', component: Search}
// }

const Suggest = () => {

    const handleMedicineChange = (value) => {
        for(let i=0; i<medicines.length; i++){
            if(medicines[i]["medName"] === value) {
                console.log(`medName: ${value}, unit: ${medicines[i]["unit"]}, Usage: ${medicines[i]["Usage"]}`)
                const key = `open${Date.now()}`;
                const btn = (
                    <Button type="primary" size="small" onClick={() => notification.close(key)}>
                        确认
                    </Button>
                );
                notification.open({
                    message: `药品：${value} 信息完成核对`,
                    description:
                        `单位：${medicines[i]["unit"]}\n建议用法：${medicines[i]["Usage"]}\n药品剩余：${medicines[i]["maxval"]}`,
                    btn,
                    key,
                });
            }
        }
    };

    const onFinish = values => {
        console.log('Received values of form:', values);
    };

    // const current = useHash() || 'basic'
    //
    // const renderExample = () => {
    //     const item = medItem[current]
    //     if (!item || !item.component) {
    //         return <span style={{ color: 'red' }}>Error: example "{current}" not found.</span>
    //     }
    //     const Comp = item.component
    //     return (
    //         <Comp/>
    //     )
    // }

    // render() {
        // const {getFieldDecorator} = this.props.form;
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
                                    placeholder="选择药品"
                                    style={{width: 120}}
                                    optionFilterProp="children"
                                    defaultActiveFirstOption={false}
                                    showArrow={false}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    // onChange={handleMedicineChange}
                                    onChange={handleMedicineChange}
                                >
                                    {medicines.map((d) => <Option key={d["medName"]}>{d["medName"]}</Option>)}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                {...restField}
                                name={[name,"val"]}
                                rules={[{ required: true, message: "请输入剂量" }]}
                            >
                                <Input placeholder="剂量" />
                            </Form.Item>
                            <Form.Item
                                {...restField}
                                name={[name,"unit"]}
                                rules={[{ required: true, message: "请输入单位" },]}
                            >
                                <Input placeholder="单位"/>
                            </Form.Item>
                            <Form.Item
                                {...restField}
                                name={[name, "Usage"]}
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