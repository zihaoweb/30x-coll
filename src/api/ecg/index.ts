import type { IAddEcgRecord, IAddEcgRecordResult, IEcgBinary, IUploadEcgRecord, IUploadEcgRecordResult } from './types';
import { post } from '@/utils/request';

enum URL {
  addCollectRecord = `/bu/pat_coll/collection/add`,
  updateCollectRecord = '/bu/pat_coll/collection/update',
  uploadEcgBinaryData = '/bu/pat_coll/upload-short-dat',
  uploadDataArray = '/bu/pat_coll/heartrate',
  registerToService = '/bu/pat_app/dev/set',
}

export const addCollectionRecord = (data: IAddEcgRecord) => post<IAddEcgRecordResult>({ url: URL.addCollectRecord, data });
export const updateCollectionRecord = (data: IUploadEcgRecord) => post<IUploadEcgRecordResult>({ url: URL.updateCollectRecord, data });
export const uploadEcgBinaryData = (data: IEcgBinary) => post<IUploadEcgRecordResult>({ url: URL.uploadEcgBinaryData, data: data.buffer, header: { 'Content-Type': 'application/octet-stream', 'patid': data.patid, 'starttime': data.starttime, 'duration': data.duration } });
export const uploadNumberArrayData = (data: any) => post<any>({ url: URL.uploadDataArray, data });
export const registerToService = (data: { dev_sn: string;pat_id: string }) => post<string>({ url: URL.registerToService, data });
