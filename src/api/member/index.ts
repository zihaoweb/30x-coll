import type { IAddMemberResult, MemberInfoList } from './type';
import { post } from '@/utils';

enum URL {
  addMember = '/bu/pat_app/patients/add2',
  getMember = '/bu/pat_app/patients/find',
  getOneMemer = '/bu/pat_coll/patients2/find',
  register2Service = '/bu/pat_app/dev/set',
  getRegister2Service = '/bu/pat_app/dev/get',
}

export const addMember = (data: any) => post<IAddMemberResult>({ url: URL.addMember, data });
export const getMember = (data: { belongto?: string; uuid?: string }) => post<MemberInfoList[]>({ url: URL.getMember, data });
export const getOneMember = (data: { uuid?: string }) => post<MemberInfoList>({ url: URL.getOneMemer, data });
export const register2Service = (data: { dev_sn?: string; pat_id?: string }) => post<any>({ url: URL.register2Service, data });
export const getRegister2Service = (data: { type: string; dev_sn?: string; acc_id?: string }) => post<any[]>({ url: URL.getRegister2Service, data });
