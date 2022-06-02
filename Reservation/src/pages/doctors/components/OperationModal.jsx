import { ModalForm, ProForm, ProFormTimePicker, ProFormDatePicker, ProFormTextArea } from '@ant-design/pro-form';
import { Result, Button, Select } from 'antd';
import { useState, useRef } from 'react';
import { useRequest } from 'umi';
import moment from 'moment';
import styles from '../style.less';
import { querySchedule, queryOccupiedRanges } from '../service';

const { Option } = Select;

const timeRangeToString = range => `${range.start}~${range.end}`;

const OperationModal = (props) => {
  const [timeVisible, setTimeVisible] = useState(false);
  const [daySchedule, setDaySchedule] = useState([]);
  const [occupiedRanges, setOccupiedRanges] = useState({});
  const formRef = useRef(null);

  const { done, visible, current, onReturn, onSubmit} = props;

  const { data: weekTimepicked } = useRequest(() => {
    return queryOccupiedRanges({
      id: current.id,
      date: moment().format("YYYY-MM-DD"),
    });
  }, { refreshDeps: [current.id] });

  const { data: schedule } = useRequest(async () => {
    return querySchedule({
      id: current.id,
    });
  }, { refreshDeps: [current.id] });

  const disabledDate = (current) => {
    let diff = current.diff(moment(), 'days');
    return current && (diff >= 6 || diff < 0);
  };

  return (
    <ModalForm
      visible={visible}
      title={'预约'}
      formRef={formRef}
      className={styles.standardListForm}
      width={640}
      onFinish={async (values) => {
        const { 0: start_time, 1: end_time } = values.range.split('~');
        onSubmit({
          doctor_id: current.id,
          description: values.description || "" ,
          time: moment(values.date + ' ' + start_time).format('YYYY-MM-DD HH:mm:ss'),
        });
      }}
      //initialValues={current}
      submitter={{
        render: (props, dom) => (done ? false : dom),
      }}
      modalProps={{
        onCancel: onReturn,
        destroyOnClose: true,
        bodyStyle: done
          ? {
              padding: '32px 0',
            }
          : {},
      }}
    >
      {!done ? (
        <>
          <ProFormDatePicker
            name="date"
            label="预约时间"
            format="YYYY-MM-DD"
            onChange={(date, dateString) => {
              let weekday = (date.weekday() + 1) % 7;
              setTimeVisible(true);
              setDaySchedule(schedule[weekday]);
              setOccupiedRanges(new Set(weekTimepicked[weekday].map(item => timeRangeToString(item))));
              formRef.current.resetFields(['range']);
            }}
            rules={[
              {
                required: true,
                message: '请选择预约日期',
              },
            ]}
            fieldProps={{
              style: { width: '100%' },
              disabledDate: disabledDate,
            }}
            placeholder="选择预约日期"
          />
          {timeVisible &&
            <ProForm.Item
              name="range"
              rules={[
                {
                  required: true,
                  message: '请选择预约时间段',
                },
              ]}
            >
              <Select
                style={{ width: '100%' }}
                placeholder="选择预约时间段"
              >
                {
                  daySchedule.map((item) => {
                    let occupied = occupiedRanges.has(timeRangeToString(item));
                    return <Option
                      value={timeRangeToString(item)}
                      key={timeRangeToString}
                      disabled={occupied}
                    >
                      {timeRangeToString(item) + (occupied ? '（预约已满）' : '')}
                    </Option>;
                  })
                }
              </Select>
            </ProForm.Item>
          }
          <ProFormTextArea
            name="description"
            label="症状描述"
            rules={[
              {
                message: '症状描述不能多于100字。',
                max: 100,
              },
            ]}
            placeholder="请简要您的描述症状（不多于100字）"
          />
        </>
      ) : (
        <Result
          status="success"
          title="预约成功"
          subTitle={<>您已成功预约{current.name}。</>}
          extra={
            <Button type="primary" onClick={onReturn}>
              关闭
            </Button>
          }
          className={styles.formResult}
        />
      )}
    </ModalForm>
  );
};

export default OperationModal;
