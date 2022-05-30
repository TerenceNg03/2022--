import { request } from 'umi';

export async function queryDoctorList(data) {
  return request('/api/get_doctors', {
    method: 'GET',
    data: data,
  });
}

export async function reserveDoctor(data) {
  return request('/api/make_appoint.php', {
    method: 'POST',
    data: data,
  });
}