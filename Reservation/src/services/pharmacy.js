import { request } from 'umi';

export async function queryBills(params) {
  return request('/api/pharmacy/get_bills', {
    method: 'GET',
    params: params,
  });
}