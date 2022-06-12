// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import {api} from '@/config';
import {message} from "antd";

const baseUrl = `${api.prefix}`;

/**
 * 添加预约
 * @param body
 * @param options
 */
export async function addArrange(body: {[key: string]:any}, options?:{[key:string]:any }) {
    return request<API.BackendResult>(`${baseUrl}/arrange`, {
        method: 'POST' ,
        params: body ,
        headers: {
            'token': localStorage.getItem('token') || '',
        },
        ...( options || {} ),
    })
}
/**
 * 获取全部排班的数据
 */
export async function getArrangeInfo(options?: { [key: string]: any }) {
    return request<API.BackendResult>(`${baseUrl}/arrange`, {
        method: 'GET' ,
        headers: {
            'token': localStorage.getItem('token') || '',
        },
        ...( options || {} ),
    })
}

/**
 * 获取某个医生的排班数据
 */
export async function getDoctorArrange(id : number, options?:{[key:string]:any}) {
    const res = await request<API.BackendResult>(`${baseUrl}/arrange/${id}`,{
        method: 'GET',
        headers: {
            'token': localStorage.getItem('token') || '',
        },
        ...(options || {}),
    });
    if(res.code < 0){
        message.error(res.message);
        return {
            data: [],
            success: false
        };
    } else {
        return {
            data: res.data.arranges,
            success: true
        };
    }
}


/** 获取当前的用户 GET /api/oauth/verify */
export async function currentUser(
    body?: { [key: string]: any },
    options?: { [key: string]: any }
) {
    return request<API.BackendResult>(`${baseUrl}/oauth/verify`, {
        method: 'GET',
        headers: {
            'token': localStorage.getItem('token') || '',
        },
        ...(options || {}),
    });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function logout(
    options?: { [key: string]: any }
) {
    return request<API.BackendResult>(`${baseUrl}/oauth/logout`, {
        method: 'GET',
        headers: {
            'token': localStorage.getItem('token') || '',
        },
        ...(options || {}),
    });
}

export async function getCaptcha(
    options?: { [key: string]: any }
) {
    return request<API.BackendResult>(`${baseUrl}/oauth/captcha`, {
        method: 'GET',
        headers: {
            'token': localStorage.getItem('token') || '',
        },
        ...(options || {}),
    });
}

/** 登录接口 POST /api/login/account */
export async function login(
    body: { [key: string]: any },
    options?: { [key: string]: any }
) {
    return request<API.BackendResult>(`${baseUrl}/oauth/login`, {
        method: 'POST',
        params: body,
        headers: {
            'token': localStorage.getItem('token') || '',
        },
        ...(options || {}),
    });
}

export async function patientRegister(
    body: { [key: string]: any },
    options?: { [key: string]: any },
) {
    return request<API.BackendResult>(`${baseUrl}/oauth/register`, {
        method: 'POST',
        params: body,
        headers: {
            'token': localStorage.getItem('token') || '',
        },
        ...(options || {}),
    });
}

export async function getNotices(userName: string, options?: { [key: string]: any }) {
    return request<API.BackendResult>(`${baseUrl}/ws/mq/${userName}`, {
        method: 'GET',
        headers: {
            'token': localStorage.getItem('token') || '',
        },
        ...(options || {}),
    });
}

/** 获取规则列表 GET /api/rule */
export async function getDoctors(
    options?: { [key: string]: any },
) {
    const res = await request<API.BackendResult>(`${baseUrl}/doctor/all`, {
        method: 'GET',
        headers: {
            'token': localStorage.getItem('token') || '',
        },
        ...(options || {}),
    });
    if(res.code < 0){
        message.error(res.message);
        return {
            data: [],
            success: false
        };
    } else {
        return {
            data: res.data.doctorInfos,
            success: true
        };
    }
}

export async function getDoctorNumbers(
    options?: { [key: string]: any },
) {
    const res = await request<API.BackendResult>(`${baseUrl}/statistics/doctors`, {
        method: 'GET',
        headers: {
            'token': localStorage.getItem('token') || '',
        },
        ...(options || {}),
    });
    if(res.code < 0){
        message.error(res.message);
        return undefined;
    } else {
        return res.data.number;
    }
}

export async function getPatientNumbers(
    options?: { [key: string]: any },
) {
    const res = await request<API.BackendResult>(`${baseUrl}/statistics/patients`, {
        method: 'GET',
        headers: {
            'token': localStorage.getItem('token') || '',
        },
        ...(options || {}),
    });
    if(res.code < 0){
        message.error(res.message);
        return undefined;
    } else {
        return res.data.number;
    }
}

export async function getAdminNumbers(
    options?: { [key: string]: any },
) {
    const res = await request<API.BackendResult>(`${baseUrl}/statistics/admins`, {
        method: 'GET',
        headers: {
            'token': localStorage.getItem('token') || '',
        },
        ...(options || {}),
    });
    if(res.code < 0){
        message.error(res.message);
        return undefined;
    } else {
        return res.data.number;
    }
}

export async function getUserNumbers(
    options?: { [key: string]: any },
) {
    const res = await request<API.BackendResult>(`${baseUrl}/statistics/users`, {
        method: 'GET',
        headers: {
            'token': localStorage.getItem('token') || '',
        },
        ...(options || {}),
    });
    if(res.code < 0){
        message.error(res.message);
        return undefined;
    } else {
        return res.data.number;
    }
}

export async function getAPINumbers(
    options?: { [key: string]: any },
) {
    const res = await request<API.BackendResult>(`${baseUrl}/statistics/apicounts`, {
        method: 'GET',
        headers: {
            'token': localStorage.getItem('token') || '',
        },
        ...(options || {}),
    });
    if(res.code < 0){
        message.error(res.message);
        return undefined;
    } else {
        return res.data.number;
    }
}

export async function getAPISuccessNumbers(
    options?: { [key: string]: any },
) {
    const res = await request<API.BackendResult>(`${baseUrl}/statistics/apicounts/SUCCESS`, {
        method: 'GET',
        headers: {
            'token': localStorage.getItem('token') || '',
        },
        ...(options || {}),
    });
    if(res.code < 0){
        message.error(res.message);
        return undefined;
    } else {
        return res.data.number;
    }
}

export async function getAPIFailNumbers(
    options?: { [key: string]: any },
) {
    const res = await request<API.BackendResult>(`${baseUrl}/statistics/apicounts/FAILURE`, {
        method: 'GET',
        headers: {
            'token': localStorage.getItem('token') || '',
        },
        ...(options || {}),
    });
    if(res.code < 0){
        message.error(res.message);
        return undefined;
    } else {
        return res.data.number;
    }
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
    return request<API.RuleListItem>('/api/rule', {
        method: 'PUT',
        headers: {
            'token': localStorage.getItem('token') || '',
        },
        ...(options || {}),
    });
}

/** 新建规则 POST /api/rule */
export async function addDoctor(
    body: { [key: string]: any },
    options?: { [key: string]: any }
) {
    return request<API.BackendResult>(`${baseUrl}/doctor`, {
        method: 'POST',
        params: body,
        headers: {
            'token': localStorage.getItem('token') || '',
        },
        ...(options || {}),
    });
}

/** 删除规则 DELETE /api/rule */
export async function deleteDoctor(
    body: { [key: string]: any },
    options?: { [key: string]: any }
) {
    return request<API.BackendResult>(`${baseUrl}/doctor`, {
        method: 'DELETE',
        params: body,
        headers: {
            'token': localStorage.getItem('token') || '',
        },
        ...(options || {}),
    });
}
