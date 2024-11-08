export interface IFormData {
  name: string;
  gender: number;
  birth: string;
  belongto?: string;
  code?: string;
  message?: string;
  avatarUrl?: string;
}

export interface MemberInfoList extends IFormData {
  create_tm: string;
  deleted: string;
  uuid: string;
  age?: number;
  pat_id?: string;
}

export interface IFormData {
  name: string;
  gender: number;
  birth: string;
  mobile?: string;
  relationship?: string;
  auto_aireport: boolean;
  auto_docreport: boolean;
  contact_name?: string;
  contact_mobile?: string;
  contact_rela?: string;
  belongto?: string;
  code?: string;
  message?: string;
  avatarUrl?: string;
  uuid: string;
}

export interface IAddMemberResult {
  uuid: string;
  code: string;
  key: number;
  message: string;
}
