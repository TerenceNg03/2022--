import React from 'react';
import 'antd/dist/antd.css';
import '../index.css';
import { List, Typography, Divider } from 'antd';

const CheckSample = [
    {
        checkName: '粪便隐血试验',
        result: '阴性',
    },
    {
        checkName: '新冠抗体检测',
        result: '阴性',
    },
];

const ViewCheckAST = (props) => {
    let CheckData = props.value;

    // fetch(`http://0.0.0.0:8080/api/view/${this.state.recordID}`,{
    //     method:"GET"
    // }).then(res=>res.json()).then(data=>{
    //    CheckData = data["data"]["sps"];
    // });
    // CheckSample[0]["checkName"] = "abc";

    return (
        <List
            itemLayout="horizontal"
            dataSource={CheckData}
            renderItem={item => (
                <List.Item>
                    <List.Item.Meta
                        title={item["checkName"]}
                        description={item["result"]}
                    />
                </List.Item>
            )}
        />
    );
};

export default ViewCheckAST;