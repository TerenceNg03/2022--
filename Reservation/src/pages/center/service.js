import { request } from 'umi';

export async function queryReservations(params) {
  return request('/api/query_patient.php', {
    method: 'GET',
    params: params,
  });
}

export async function queryRecords(params) {
  return request('/api/get_records', {
    method: 'GET',
    params: params,
  });
}

export async function queryBills(params) {
  return request('/api/get_bills', {
    method: 'GET',
    params: params,
  });
}