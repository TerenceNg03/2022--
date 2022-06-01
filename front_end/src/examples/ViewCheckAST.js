import React from 'react';
import 'antd/dist/antd.css';
import '../index.css';
import { List, Typography, Divider } from 'antd';

const CheckSample = [
    {
        first: '粪便隐血试验',
        second: '阴性',
    },
    {
        first: '新冠抗体检测',
        second: '阴性',
    },
];

const ViewCheckAST = () => {
    return (
        <List
            itemLayout="horizontal"
            dataSource={CheckSample}
            renderItem={item => (
                <List.Item>
                    <List.Item.Meta
                        title={item.first}
                        description={item.second}
                    />
                </List.Item>
            )}
        />
    );
};

export default ViewCheckAST;