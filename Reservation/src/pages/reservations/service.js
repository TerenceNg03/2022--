// @ts-ignore

/* eslint-disable */
import { request } from 'umi';

export async function queryReserveList(data) {
  return request(`/api/query_doctor.php`, {
    method: 'POST',
    data: data,
  });
}
