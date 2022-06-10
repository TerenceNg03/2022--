import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import { message } from 'antd';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import { PageLoading } from '@ant-design/pro-layout';
import { history, Link } from 'umi';
import { verifyAccount } from '@/services/management'

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/login';

const jumpToLogin = () => {
  const currentUrl = window.location.href;
  const afterProt = currentUrl.indexOf("//") + 2;
  const redir = encodeURIComponent(currentUrl.substring(afterProt));
  window.location.href = `http://124.220.171.17:3000/login?redir=${redir}`;
}

const verifyLogin = () => {
  if(!localStorage.user) jumpToLogin();
}

const fetchUserInfo = async () => {
  verifyLogin();

  const verification = await verifyAccount();

  if(!verification.code) {
    message.success(verification.message);
  } else {
    message.error(verification.message);
    localStorage.removeItem('user');
    jumpToLogin();
  }

  const info = {
    access: verification.data.role,
    name: verification.data.userName,
    id: JSON.parse(localStorage?.user).userId,
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    geographic: {
      province: '浙江省',
      city: '杭州市',
      address: '西湖区工专路 77 号',
    },
  }

  return info;
};

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState() {

  const token = window.location.search.substring(1);

  if(token) {
    const params = decodeURIComponent(token).split('&');
    const user = {};
    params.forEach((param) => {
      const key_value = param.split('=');
      user[key_value[0]] = key_value[1];
      localStorage['user'] = JSON.stringify(user);
    });
  }
  
  const currentUser = await fetchUserInfo();
  return {
    fetchUserInfo,
    currentUser,
    settings: {},
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      verifyLogin();
    },
    links: isDev
      ? [
          <Link to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
          <Link to="/~docs">
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],
    ...initialState?.settings,
  };
};
