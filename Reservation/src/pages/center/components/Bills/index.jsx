import { Badge, Descriptions } from 'antd';

const Bills = (props) => {

  const { data } = props;

  if(!data) return false;

  const payStates  = {
    'false' : {
      state: 'processing',
      text: '未支付'
    },
    'true' : {
      state: 'success',
      text: '已支付'
    },
  };


  return <div>
    {
      data.map((bill) => {
        const payState = payStates[bill.QueueID >= 0];
        const price = bill.ItemList.reduce((prev, cur) => {
          return prev + cur.Price * cur.Num;
        }, 0);
        return <Descriptions title={'单号：'+bill.BillID} bordered key='BillID'>
          <Descriptions.Item label="时间">{bill.Date}</Descriptions.Item>
          <Descriptions.Item label="总费用">{price}</Descriptions.Item>
          <Descriptions.Item label="状态" span={3}>
            <Badge status={payState.state} text={payState.text} />
          </Descriptions.Item>
          <Descriptions.Item label="账单详情">
            {
              bill.ItemList.map((medicine) => {
                return <>
                  <span key='ID'>
                    {medicine.Num}{medicine.Unit}{medicine.Name}（{medicine.Brand}，{medicine.Price}元/{medicine.Unit}）
                  </span>
                  <br/>
                </>;
              })
            }
          </Descriptions.Item>
        </Descriptions>
      })
    }
  </div>;

  };

export default Bills;
