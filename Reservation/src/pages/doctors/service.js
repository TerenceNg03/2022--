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
      data: {
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

export async function querySchedule(data) {
  return request('/api/arrange', {
    method: 'GET',
    data: data,
  });
}

export async function queryOccupiedRanges(data) {
  return request('/api/occupation', {
    method: 'GET',
    data: data,
  });
}