/**
 * 用户信息相关接口
 */
import type { AccountInfo, SignUpParams, UserId, UserPhoneNumber } from './types';
import { get, post } from '@/utils/request';

enum URL {
  signUp = '/bu/pat_app/accounts/signup',
  loginByCode = '/wx/wx/coll/session/', // 登录
  getUserInfoByUnionId = '/bu/pat_app/account-unionid/', // 根据unionid获取用户信息
  phonenumber = '/wx/wx/coll/phone/', // 获取手机号
  getLaws = '/bu/doc_web/fetch-laws',
  uploadUser = '/bu/pat_app/accounts/update',
}

export const signUp = (data: SignUpParams) => post<any>({ url: URL.signUp, data });
export const loginByCode = (code: string) => get<UserId>({ url: URL.loginByCode + code });
export const getUserInfoByUnionId = (unionid: string, app: string) => get({ url: `${URL.getUserInfoByUnionId + unionid}/${app}` });
export const getUserPhonenumber = (code: any) => get<UserPhoneNumber>({ url: URL.phonenumber + code });
export const getLaws = (fileName: string) => get<string>({ url: `${URL.getLaws}/${fileName}` });
export const uploadUser = (data: Partial<AccountInfo>) => post<AccountInfo>({ url: URL.uploadUser, data });
