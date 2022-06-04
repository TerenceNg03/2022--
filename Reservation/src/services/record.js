import { request } from 'umi';

export async function queryRecords(params) {
  return request('/api/record/get_records', {
    method: 'GET',
    params: params,
  });
}

export async function writeDiagnosis(data) {
  return request('/api/record/write', {
    method: 'POST',
    data: data,
  });
}