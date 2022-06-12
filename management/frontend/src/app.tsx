import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import {currentUser, getNotices} from './services/ant-design-pro/api';
import { BookOutlined } from '@ant-design/icons';
import defaultSettings from '../config/defaultSettings';
import {createWebSocket} from "@/websocket";
import {notification, message} from "antd";
import {api} from '@/config';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/login';
const webSocketPath = `ws://${api.host}:${api.port}/message`;

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
    loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
    settings?: Partial<LayoutSettings>;
    currentUser?: API.CurrentUser;
    loading?: boolean;
    fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
    const fetchUserInfo = async () => {
        try {
            const msg = await currentUser();
            if(msg.code < 0){
                localStorage.clear();
                if(history.location.pathname !== '/'){
                    history.push(loginPath);
                }
            } else {
                if(msg.data.role !== 'ADMIN' && history.location.pathname !== '/' && history.location.pathname !== '/logout'){
                    message.error('无访问权限');
                    history.push('/');
                }
                return msg.data;
            }
        } catch (error) {
            localStorage.clear();
            history.push(loginPath);
        }
        return undefined;
    };
    // 如果不是登录页面，执行
    if (history.location.pathname !== loginPath) {
        const currentUser = await fetchUserInfo();
        if(history.location.pathname != '/') {
            const offlineNotices = await getNotices(currentUser?.userName);
            if (offlineNotices.code === 0 && offlineNotices.data.mqList.length > 0) {
                for (let i = 0; i < offlineNotices.data.mqList.length; i++) {
                    notification['info']({
                        message: `未读消息: ${offlineNotices.data.mqList[i].title}`,
                        description: offlineNotices.data.mqList[i].content,
                        duration: 0,
                    });
                }
            }
            const ws = createWebSocket(`${webSocketPath}/${currentUser?.userName}`);
            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                notification['info']({
                    message: data.title,
                    description: data.content,
                    duration: 0,
                });
            };
        }
        return {
            fetchUserInfo,
            currentUser,
            settings: defaultSettings,
        };
    }
    return {
        fetchUserInfo,
        settings: defaultSettings,
    };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
    return {
        title: "后台管理系统",
        rightContentRender: () => <RightContent />,
        disableContentMargin: false,
        waterMarkProps: {
            content: initialState?.currentUser?.userName,
        },
        footerRender: () => <Footer />,
        onPageChange: () => {
            const { location } = history;
            if (!initialState?.currentUser && location.pathname !== loginPath && location.pathname !== '/') {
                history.push(loginPath);
            }
        },
        navTheme: "dark",
        menuHeaderRender: undefined,
        // 自定义 403 页面
        // unAccessible: <div>unAccessible</div>,
        // 增加一个 loading 的状态
        childrenRender: (children, _) => {
            if (initialState?.loading) return <PageLoading />;
            return (
                <>
                    {children}
                </>
            );
        },
        ...initialState?.settings,
    };
};
