import { LoginForm, ProFormRadio } from '@ant-design/pro-form';
import { message } from 'antd';
import { history, useModel } from 'umi';
import styles from './index.less';

const Login = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const handleSubmit = async (values) => {
    message.success('登录成功！');

    /** 此方法会跳转到 redirect 参数所在的位置 */
    if (!history) return;
    const { query } = history.location;
    const { redirect } = query;
    history.push('/center');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          onFinish={async (values) => {
            await handleSubmit(values);
          }}
          initialValues={{
            role: 'patient',
          }}
        >
          <ProFormRadio.Group
            name="role"
            label="登入角色"
            value='patient'
            options={[
              {
                label: '患者',
                value: 'patient',
              },
              {
                label: '医生',
                value: 'doctor',
              },
              {
                label: '管理员',
                value: 'admin',
              },
            ]}
          />
        </LoginForm>
      </div>
    </div>
  );
};

export default Login;