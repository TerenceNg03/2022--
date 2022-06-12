// @ts-ignore
/* eslint-disable */

declare namespace API {
    type CurrentUser = {
        userName?: string;
        role?: string;
    };

    type BackendResult = {
        code: number;
        data: Record<string, any>;
        message: string;
    };

    type PageParams = {
        current?: number;
        pageSize?: number;
    };

    type RuleListItem = {
        key?: number;
        disabled?: boolean;
        href?: string;
        avatar?: string;
        name?: string;
        owner?: string;
        desc?: string;
        callNo?: number;
        status?: number;
        updatedAt?: string;
        createdAt?: string;
        progress?: number;
    };

    type RuleList = {
        data?: RuleListItem[];
        /** 列表的内容总数 */
        total?: number;
        success?: boolean;
    };

    type ArrangeInfoItem = {
        id?:number;
        startTime?:string;
        endTime?:string;
        dayType?:string;
    };

    type DoctorInfoItem = {
        id?: number;
        userName?: string;
        realName?: string;
        password?: string;
        hospital?: string;
        department?: string;
    };

    type DoctorInfoList = {
        data?: DoctorInfoItem[];
        total?: number;
    };

    type FakeCaptcha = {
        code?: number;
        status?: string;
    };

    type LoginParams = {
        userName?: string;
        password?: string;
    };

    type ErrorResponse = {
        /** 业务约定的错误码 */
        errorCode: string;
        /** 业务上的错误信息 */
        errorMessage?: string;
        /** 业务上的请求是否成功 */
        success?: boolean;
    };

    type NoticeIconList = {
        data?: NoticeIconItem[];
        /** 列表的内容总数 */
        total?: number;
        success?: boolean;
    };

    type NoticeIconItemType = 'notification' | 'message' | 'event';

    type NoticeIconItem = {
        id?: string;
        extra?: string;
        key?: string;
        read?: boolean;
        avatar?: string;
        title?: string;
        status?: string;
        datetime?: string;
        description?: string;
        type?: NoticeIconItemType;
    };
}
