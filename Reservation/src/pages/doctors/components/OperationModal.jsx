import { ModalForm, ProForm, ProFormTimePicker, ProFormDatePicker, ProFormTextArea } from '@ant-design/pro-form';
import { Result, Button, Select } from 'antd';
import { useState, useRef } from 'react';
import { useRequest } from 'umi';
import moment from 'moment';
import styles from '../style.less';
import { querySchedule, queryOccupiedRanges } from '../service';

const { Option } = Select;

const timeRangeToString = range => `${moment(range.start, 'HH:mm:ss').format("HH:mm")}~${moment(range.end, 'HH:mm:ss').format("HH:mm")}`;

const OperationModal = (props) => {
  const [timeVisible, setTimeVisible] = useState(false);
  const [choosenDate, setChoosenDate] = useState('');
  const [daySchedule, setDaySchedule] = useState([]);
  const [occupiedRanges, setOccupiedRanges] = useState({});
  const formRef = useRef(null);

  const { done, visible, current, onReturn, onSubmit} = props;

  const handleReturn = () => {
    setTimeVisible(false);
    onReturn();
  }

  const { data: occupations, loading: loadingOccupations, run: getOccupations } = useRequest(() => {
    return queryOccupiedRanges({
      doctor_id: current.id,
    });
  }, { refreshDeps: [current.id] });

  const { data: schedule, loading: loadingSchedule, run: getSchedule } = useRequest(() => {
    return querySchedule({
      doctor_id: current.id,
    });
  }, { refreshDeps: [current.id] });

  const disabledDate = (current) => {
    if(!current) return false;

    const diff = current.diff(moment(), 'days');
    return diff >= 6 || diff < 0;
  };

  return (
    <ModalForm
      visible={visible}
      title={'预约'}
      formRef={formRef}
      className={styles.standardListForm}
      width={640}
      onFinish={async (values) => {
        const { 0: start_time, 1: expire_time } = values.range.split('~');
        onSubmit({
          doctor_id: current.id,
          description: values.description || "" ,
          start_time: moment(values.date + ' ' + start_time).format('YYYY-MM-DD HH:mm:ss'),
          expire_time: moment(values.date + ' ' + expire_time).format('YYYY-MM-DD HH:mm:ss'),
        });
        getOccupations();
      }}
      //initialValues={current}
      submitter={{
        render: (props, dom) => (done ? false : dom),
      }}
      modalProps={{
        onCancel: handleReturn,
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
              const weekday = (date.weekday() + 1) % 7;
              setTimeVisible(true);
              setChoosenDate(dateString);
              setDaySchedule(schedule[weekday]);
              setOccupiedRanges(new Set(occupations[weekday]?.map(item => timeRangeToString(item))));
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
                  daySchedule.map((range, index) => {
                    const rangeString = timeRangeToString(range);
                    const occupied = occupiedRanges.has(rangeString);
                    const past = moment(choosenDate + ' ' + range.start).isBefore(moment());
                    return <Option
                      value={rangeString}
                      key={index}
                      disabled={occupied || past}
                    >
                      {timeRangeToString(range) + (past ? '（时间已过）' : occupied ? '（预约已满）' : '')}
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
            <Button type="primary" onClick={handleReturn}>
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
