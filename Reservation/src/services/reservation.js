import { request } from 'umi';

export async function queryReservations(params) {
  return request('/api/reservation/query_patient.php', {
    method: 'GET',
    params: params,
  });
}

export async function queryReserveList(params) {
  return request(`/api/reservation/query_doctor.php`, {
    method: 'GET',
    params: params,
  });
}

export async function queryOccupiedRanges(params) {
  return request('/api/reservation/query_within_a_week.php', {
    method: 'GET',
    params: params,
  });
}

export async function reserveDoctor(data) {
  return request('/api/reservation/make_appoint.php', {
    method: 'POST',
    data: data,
  });
}

export async function changeStatus(data) {
  return request('/api/reservation/change_status.php', {
    method: 'POST',
    data: data,
  });
}