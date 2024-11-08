import type { GetWifiParams, SetWifiParams } from './type';
import { post } from '@/utils/request';

enum URL {
  getWifiInfo = '/bu/pat_app/dev/get',
  setWifiInfo = '/bu/pat_app/dev/set',
}

export const getWifiInfo = (data: GetWifiParams) => post<any>({ url: URL.getWifiInfo, data });
export const setWifiInfo = (data: SetWifiParams) => post<any>({ url: URL.setWifiInfo, data });
