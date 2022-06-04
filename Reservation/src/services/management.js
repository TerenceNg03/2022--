import { request } from 'umi';

export async function queryPatientInfo(params) {
  return request(`/api/management/get_detail`, {
    method: 'GET',
    params: params,
  });
}

export async function queryHospitalList() {
  return request('/api/management/hospital', {
    method: 'GET',
  });
}

export async function queryDepartmentList() {
  return request('/api/management/dept', {
    method: 'GET',
  });
}

export async function queryDoctorList(params) {
  const { hospital, department, ...rest } = params;

  if(!hospital && !department) {
    return request('/api/management/doctor/all', {
      method: 'GET',
    });
  }

  if(hospital && !department) {
    return request(`/api/management/doctor/hospital/${hospital}`, {
      method: 'GET',
    });
  }

  if(!hospital && department) {
    return request(`/api/management/doctor/dept/${department}`, {
      method: 'GET',
    });
  }

  if(hospital && department) {
    return request('/api/management/doctor/', {
      method: 'GET',
      params: {
        hospital,
        department,
      },
    });
  }
}

export async function querySchedule(params) {
  const { doctor_id, ...rest } = params

  return request(`/api/management/arrange/${doctor_id}`, {
    method: 'GET',
  });
}