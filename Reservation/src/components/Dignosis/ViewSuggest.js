import React from 'react';
import 'antd/dist/antd.css';
import '../index.css';
import {Form, Input, Button, Space, List} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import searchSelect from "./searchSelect.js";

const SuggestSample = [
    {first: '克痢痧胶囊', second: '盒/20mg', third: '口服', num: 1},
    {first: '归脾胶囊', second: '盒/1.2g', third: '口服', num: 2},
];

const ViewSuggest = () => {
    return (
        <List
            itemLayout="horizontal"
            dataSource={SuggestSample}
            renderItem={item => (
                <List.Item>
                    <List.Item.Meta
                        title={item.first}
                        description={<span>{'剂量：'} {item.num} {item.second} <br/> {'用法：'} {item.third}</span>}
                    />
                </List.Item>
            )}
        />
    );
};

export default ViewSuggest;