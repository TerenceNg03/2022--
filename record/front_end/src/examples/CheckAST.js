import React from 'react';
import 'antd/dist/antd.css';
import '../index.css';
import { Form, Input, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const CheckAST = () => {
    const onFinish = values => {
        console.log('Received values of form:', values);
    };

    return (
        <Form.List name="sps">
            {(fields, { add, remove }) => (
                <a>
                    {fields.map(({ key, name, ...restField }) => (
                        <Space key={key} style={{ display: 'flex', marginBottom: 0}} align="baseline">
                            <Form.Item
                                {...restField}
                                name={[name, 'checkname']}
                                rules={[{ required: true, message: 'Missing 项目名' }]}
                            >
                                <Input placeholder="项目名" />
                            </Form.Item>
                            <Form.Item
                                {...restField}
                                name={[name, 'result']}
                                rules={[{ required: true, message: 'Missing 检查结果' }]}
                            >
                                <Input placeholder="检查结果" />
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => remove(name)} />
                        </Space>
                    ))}
                    <Form.Item>
                        <Button type="dashed" onClick={() => add()}  icon={<PlusOutlined />}>
                            新增检查
                        </Button>
                    </Form.Item>
                </a>
            )}
        </Form.List>
    );
};

export default CheckAST;