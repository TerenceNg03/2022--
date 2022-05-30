import {
  ModalForm,
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import styles from '../style.less';
import { Result, Button } from 'antd';

const OperationModal = (props) => {
  const { done, visible, current, onReturn, onSubmit} = props;

  return (
    <ModalForm
      visible={visible}
      title={'预约'}
      className={styles.standardListForm}
      width={640}
      onFinish={async (values) => {
        onSubmit({ "doctor_id": current.id, "description":"" , ...values});
      }}
      //initialValues={current}
      submitter={{
        render: (props, dom) => (done ? false : dom),
      }}
      modalProps={{
        onCancel: () => onReturn(),
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
          <ProFormDateTimePicker
            name="time"
            label="预约时间"
            rules={[
              {
                required: true,
                message: '请选择预约时间',
              },
            ]}
            fieldProps={{
              style: {
                width: '100%',
              },
            }}
            placeholder="请选择预约时间"
          />
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
