import { GithubOutlined, BookOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';
import React from "react";

const Footer: React.FC = () => {
    const defaultMessage = '软件工程小组， 保留所有权利。 图片来源：浙江大学医学院附属第二医院。';

    const currentYear = new Date().getFullYear();

    return (
        <DefaultFooter
            copyright={`${currentYear} ${defaultMessage}`}
            links={[
                {
                    key: 'github',
                    title: (
                        <span>
                            <GithubOutlined /> 代码仓库
                        </span>
                    ),
                    href: 'https://github.com/pan2013e/se-management',
                    blankTarget: true,
                },
                {
                    key: 'docs',
                    title: (
                        <span>
                            <BookOutlined /> 在线文档
                        </span>
                    ),
                    href: 'https://zjuse-2022.github.io/docs/',
                    blankTarget: true,
                }
            ]}
        />
    );
};

export default Footer;
