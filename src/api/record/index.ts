import type { GetRecordListResult } from './types';
import { get, post } from '@/utils';

enum URL {
  deleteRecord = '/bu/pat_coll/collection/del',
  getRecordList = '/bu/pat_coll/collection/find',
  setRecordRead = '/bu/pat_coll/collection/',
}

export const deleteRecord = (data: { collectid: string }) => post<any>({ url: URL.deleteRecord, data });
export const getRecordList = (data: { accid: string }) => post<GetRecordListResult[]>({ url: URL.getRecordList, data });
export const setRecordRead = (data: { accid: string }) => get<any>({ url: URL.setRecordRead + data.accid });
