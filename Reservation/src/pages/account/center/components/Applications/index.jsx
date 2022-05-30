
import { Avatar, List, } from 'antd';
import { useRequest } from 'umi';
import { queryFakeList } from '../../service';
import stylesApplications from './index.less';
import numeral from 'numeral';


const Applications = (props) => {

  const { data } = props;
  return <List
    itemLayout="horizontal"
    rowKey="key"
    dataSource={data}
    renderItem={(item) => (
      <List.Item>
        <List.Item.Meta
          avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
          title={<a href="https://ant.design">{item.title}</a>}
          description="这是药的具体信息"
        />
      </List.Item>
    )}
  />
};

export default Applications;
