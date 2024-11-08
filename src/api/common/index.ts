/**
 * 通用接口
 */
import type { AddDeviceItemParams, SystemConfig } from './types';
import { get, post } from '@/utils/request';

enum URL {
  getDeviceType = '/bu/pat_coll/dev_type/list',
  getDeviceList = '/bu/pat_coll/dev_conn/list',
  addDevice = '/bu/pat_coll/dev_conn/add',
  updateDevice = '/bu/pat_coll/dev_conn/update',
  removeDevice = '/bu/pat_coll/dev_conn/del',
  config = '/bu/pat_coll/configs',
}

export const getDeviceType = () => get<{ type: string }[]>({ url: URL.getDeviceType });

// 获取设备list
export const getDeviceList = (data: { acc_id: string }) => post<any>({ url: URL.getDeviceList, data });
// 添加设备
export const addDevice = (data: AddDeviceItemParams) => post<any>({ url: URL.addDevice, data });

export const updateDevice = (data: Partial<AddDeviceItemParams>) => post<string>({ url: URL.updateDevice, data });

export const removeDevice = (data: { uuid: string }) => post<any>({ url: URL.removeDevice, data });

export const getSystemConfig = () => get<SystemConfig[]>({ url: URL.config });
