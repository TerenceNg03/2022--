import { request } from 'umi';

export async function queryPatientInfo(data) {
  return request(`/api/get_detail`, {
    method: 'GET',
    data: data,
  });
}

export async function changeStatus(data) {
  return request('/api/change_status.php', {
    method: 'POST',
    data: data,
  });
}

export async function writeDiagnosis(params) {
  return request('/api/write', {
    method: 'GET',
    params: params,
  });
}