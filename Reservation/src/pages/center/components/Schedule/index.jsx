import { Space, Table, Typography, Badge } from 'antd';
import moment from 'moment';

const weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

const Schedule = (props) => {

  const { data } = props;

  const columns = [
    {
      title: '星期',
      key: 'date',
      render: (_, ranges, index) => (
        <span>
          {weekday[index]}
        </span>
      ),
    },
    {
      title: '排班',
      key: 'ranges',
      render: (_, ranges) => {
        return ranges.map((range, index) => {
          return (<span key={index}>
            {moment(range.start, 'HH:mm:ss').format('HH:mm')}~{moment(range.end, 'HH:mm:ss').format('HH:mm')}<br/>
          </span>);
        });
      },
    },
  ];

  return <Table
    columns={columns}
    dataSource={data}
    rowKey={(_, index) => index}
  />;
}

export default Schedule;
