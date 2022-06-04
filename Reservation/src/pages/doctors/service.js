import { request } from 'umi';

export async function queryHospitalList() {
  return request('/api/hospital', {
    method: 'GET',
  });
}

export async function queryDepartmentList() {
  return request('/api/dept', {
    method: 'GET',
  });
}

export async function queryDoctorList(params) {
  const { hospital, department, ...rest } = params;

  if(!hospital && !department) {
    return request('/api/doctor/all', {
      method: 'GET',
    });
  }

  if(hospital && !department) {
    return request(`/api/doctor/hospital/${hospital}`, {
      method: 'GET',
    });
  }

  if(!hospital && department) {
    return request(`/api/doctor/dept/${department}`, {
      method: 'GET',
    });
  }

  if(hospital && department) {
    return request('/api/doctor/', {
      method: 'GET',
      params: {
        hospital,
        department,
      },
    });
  }
}

export async function reserveDoctor(data) {
  return request('/api/make_appoint.php', {
    method: 'POST',
    data: data,
  });
}

export async function querySchedule(params) {
  const { doctor_id, ...rest } = params

  return request(`/api/arrange/${doctor_id}`, {
    method: 'GET',
  });
}

export async function queryOccupiedRanges(params) {
  return request('/api/query_within_a_week.php', {
    method: 'GET',
    params: params,
  });
}