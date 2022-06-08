import { request } from 'umi';

export async function queryBills(params) {
  return request('/api/pharmacy/querycart/', {
    method: 'GET',
    params: {
      UserID: params.patient_id,
    },
  });
}