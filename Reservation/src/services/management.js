import { request } from 'umi';

export async function verifyAccount() {
  const token = localStorage.user ? JSON.parse(localStorage.user).token : '';
  return request(`/api/management/oauth/verify`, {
    method: 'GET',
    params: { token },
    headers: {
      token,
    },
  });
}

export async function queryPatientInfo(params) {
  return request(`/api/management/get_detail`, {
    method: 'GET',
    params: params,
    headers: {
      token: localStorage.user ? JSON.parse(localStorage.user).token : ''
    },
  });
}

export async function queryHospitalList() {
  return request('/api/management/hospital', {
    method: 'GET',
    headers: {
      token: localStorage.user ? JSON.parse(localStorage.user).token : ''
    },
  });
}

export async function queryDepartmentList() {
  return request('/api/management/dept', {
    method: 'GET',
    headers: {
      token: localStorage.user ? JSON.parse(localStorage.user).token : ''
    },
  });
}

export async function queryDoctorList(params) {
  const { hospital, department, ...rest } = params;

  if(!hospital && !department) {
    return request('/api/management/doctor/all', {
      method: 'GET',
      headers: {
        token: localStorage.user ? JSON.parse(localStorage.user).token : ''
      },
    });
  }

  if(hospital && !department) {
    return request(`/api/management/doctor/hospital/${hospital}`, {
      method: 'GET',
      headers: {
        token: localStorage.user ? JSON.parse(localStorage.user).token : ''
      },
    });
  }

  if(!hospital && department) {
    return request(`/api/management/doctor/dept/${department}`, {
      method: 'GET',
      headers: {
        token: localStorage.user ? JSON.parse(localStorage.user).token : ''
      },
    });
  }

  if(hospital && department) {
    return request('/api/management/doctor/', {
      method: 'GET',
      params: {
        hospital,
        department,
      },
      headers: {
        token: localStorage.user ? JSON.parse(localStorage.user).token : ''
      },
    });
  }
}

export async function querySchedule(params) {
  const { doctor_id, ...rest } = params

  return request(`/api/management/arrange/${doctor_id}`, {
    method: 'GET',
    headers: {
      token: localStorage.user ? JSON.parse(localStorage.user).token : ''
    },
  });
}