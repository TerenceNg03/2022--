import { Space, Popover, Tag, List, Card, Col, Row, Statistic, Image } from 'antd';

const Bills = (props) => {

  const { data } = props;

  if(!data) return false;

  const payStates  = {
    'false' : {
      color: '#0099FF',
      text: '未支付'
    },
    'true' : {
      color: '#5BD8A6',
      text: '已支付'
    },
  };

  const getDetailText = (bill) => (
    <Card title="账单详情" bordered={false}>
      <div>
        {
          bill.ItemList.map((medicine) => {
            return <>
              <span key={medicine.ID}>
                {medicine.Num}{medicine.Unit}{medicine.Name}（{medicine.Brand}，{medicine.Price}元/{medicine.Unit}）<br/>
              </span>
            </>;
          })
        }
      </div>
    </Card>
  );

  return <Card>
    <List
      itemLayout="vertical"
      dataSource={data}
      renderItem={(bill) => {
        const payState = payStates[bill.QueueID >= 0];
        const price = bill.ItemList.reduce((prev, cur) => {
          return prev + cur.Price * cur.Num;
        }, 0);
        return <List.Item>
          <List.Item.Meta
            title={'单号：'+ bill.BillID}
            description={
                <Tag color={payState.color}>{payState.text}</Tag>
            }
          />

          <Row gutter={20} >
            <Col span={12} style={{ marginRight: 40, overflow: 'hidden' }}>
              <Popover content={getDetailText(bill)} trigger="hover">
                <Card bordered={false} >
                  <Image.PreviewGroup>
                    <Space size={20}>
                      {
                        bill.ItemList.map((medicine) => {
                          return (
                            <Image key={medicine.ID} preview={false} width={60} src={medicine.URL} />
                          );
                        })
                      }
                    </Space>
                  </Image.PreviewGroup>
                </Card>
              </Popover>
            </Col>
            <Col span={4}>
              <Statistic title="总费用 (元)" value={price} precision={2} />
            </Col>
            <Col span={4}>
              <Statistic title="开单时间" value={bill.Date} />
            </Col>
          </Row>
        </List.Item>
      }}
    />
  </Card>

};

export default Bills;
