import { request } from 'umi';

export async function queryReservations(data) {
  console.log(data);
  return request('/api/query_patient.php', {
    method: 'POST',
    data: data,
  });
}

export async function queryRecords(data) {
  return request('/api/get_records', {
    method: 'GET',
    data: data,
  });
}

export async function queryBills(data) {
  return request('/api/get_bills', {
    method: 'GET',
    data: data,
  });
}
