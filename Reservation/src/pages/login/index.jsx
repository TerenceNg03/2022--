import { login } from '@/services/ant-design-pro/api';
import { LoginForm, ProFormRadio } from '@ant-design/pro-form';
import { Alert, message } from 'antd';
import { history, useIntl, useModel } from 'umi';
import styles from './index.less';

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();

    if (userInfo) {
      await setInitialState((s) => ({ ...s, currentUser: userInfo }));
    }
  };

  const handleSubmit = async (values) => {
    const loginInfo = await login(values);

    const defaultLoginSuccessMessage = intl.formatMessage({
      id: 'pages.login.success',
      defaultMessage: '登录成功！',
    });
    message.success(defaultLoginSuccessMessage);
    await fetchUserInfo();
    /** 此方法会跳转到 redirect 参数所在的位置 */

    if (!history) return;
    const { query } = history.location;
    const { redirect } = query;
    const direct = loginInfo.currentAuthority === 'doctor' ? '/reservations' : '/center';
    history.push(/*redirect || */direct);
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
