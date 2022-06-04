// @ts-ignore

/* eslint-disable */
import { request } from 'umi';

export async function queryReserveList(params) {
  return request(`/api/query_doctor.php`, {
    method: 'GET',
    params: params,
  });
}
