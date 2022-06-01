import React, {Component, Fragment, useState} from 'react';
// import 'antd/dist/antd.css';
// import './index.css';
import {Form, Input, Space, Select, Row, Col} from 'antd';
// import jsonp from 'fetch-jsonp';
// import qs from 'qs';
import { medicines } from "./Basic";
const { Option } = Select;
// let timeout;
// let currentValue;

const SearchInput = () => {
// class SearchInput extends Component {
    // const [medicine, setMedicine] = useState("");
    // const [unit, setUnit] = useState("");
    // const [Usage, setUsage] = useState("");
    const formRef = React.createRef()
    const handleMedicineChange = (value) => {
        for(let i=0; i<medicines.length; i++){
            if(medicines[i]["medName"] === value) {
                console.log(`medName: ${value}, unit: ${medicines[i]["unit"]}, Usage: ${medicines[i]["Usage"]}`)
                // console.log(`name: ${name}`);
                // setMedicine(value);
                // setUnit(medicines[i]["unit"]);
                // setUsage(medicines[i]["Usage"]);
                // console.log(`medName: ${value}, unit: ${unit}, Usage: ${Usage}`)
                console.log(formRef.current.getFieldsValue());
                // console.log(this.props)
                // this.formRef.current.setFieldsValue({
                //     medName: medicines[i]["medName"],
                //     val: '',
                //     unit: medicines[i]["unit"],
                //     Usage: medicines[i]["Usage"]
                // })
                //
                // document.getElementById("unit").innerText = medicines[i]["unit"];
            }
        }
    };

    const handleFinish = () => {
        console.log("from search: ", this.formRef.current.getFieldsValue())
    }

    return (
            <Form
                name="medItem"
                ref={formRef}
                // onFinish={this.handleFinish}
            >
                <Space style={{display: 'flex', marginBottom: 0}} align="baseline">

                    <Form.Item
                        name={"medName"}
                        rules={[{required: true, message: "请输入药品"}]}
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
                            onChange={handleMedicineChange}
                            // onChange={this.handleMedicineChange}
                        >
                            {medicines.map((d) => <Option key={d["medName"]}>{d["medName"]}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name={"val"}
                        rules={[{required: true, message: "请输入剂量"}]}
                    >
                        <Input placeholder="剂量"/>
                    </Form.Item>
                    <Form.Item
                        name={"unit"}
                        rules={[{required: true, message: "请输入单位"},]}
                    >
                        <Input placeholder="单位"/>
                    </Form.Item>
                    <Form.Item
                        name={"Usage"}
                        rules={[{required: true, message: "请输入用法"}]}
                    >
                        <Input placeholder="用法"/>
                    </Form.Item>

                 </Space>
            </Form>
            // <Fragment>
            //     <Row gutter={8}>
            //         <Col span={5}>
            //             <Input defaultValue="0571" />
            //         </Col>
            //         <Col span={8}>
            //             <Input defaultValue="26888888" />
            //         </Col>
            //     </Row>
            // // </Fragment>
    );
};

export default SearchInput;