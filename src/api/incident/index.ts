import type { GetIncidentListParams, IncidentDetail } from './types';
import { post } from '@/utils';

enum URL {
  addIcidentList = '/bu/pat_coll/event/add',
  getIncidentList = '/bu/pat_coll/event/list',
  removeAllInvalid = '/bu/pat_coll/clear_invalid_collect',
  uploadVoice = '/bu/pat_coll/event/upload',
}

export const addIncidentList = (data: GetIncidentListParams) => post<IncidentDetail>({ url: URL.addIcidentList, data });
export const removeAllInvalidList = (data: { accid: string }) => post<any>({ url: URL.removeAllInvalid, data });
export const uploadVoice = (data: any) => post<any>({ url: URL.uploadVoice, data });