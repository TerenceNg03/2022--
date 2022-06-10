import { request } from 'umi';

export async function queryRecords(params) {
  const { patient_id } = params;
  return request(`/api/record/record/${patient_id}`, {
    method: 'GET',
  });
}

export async function writeDiagnosis(data) {
  return request('/api/record/write', {
    method: 'POST',
    data: data,
  });
}