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

export async function querySchedule(data) {
  return request('/api/arrange', {
    method: 'GET',
    data: data,
  });
}

export async function queryOccupiedRanges(data) {
  return request('/api/query_picked_time', {
    method: 'GET',
    data: data,
  });
}