import { Select } from 'antd';
import React, { Component }  from 'react';
import { Form } from 'antd';
const { Option } = Select;

const searchSelect = () => {
    return (
        <Select
            showSearch
            // style={{width: 200}}
            placeholder="选择药品"
            optionFilterProp="children"
            filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
            }
        >
            <Option value="奥美拉唑肠溶胶囊">奥美拉唑肠溶胶囊</Option>
            <Option value="归脾胶囊">归脾胶囊</Option>
            <Option value="左氧氟沙星片">左氧氟沙星片</Option>
            <Option value="克痢痧胶囊">克痢痧胶囊</Option>
        </Select>
    );
};

export default searchSelect;