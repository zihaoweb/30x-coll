interface PhoneInfo {
  countryCode: string;
  phoneNumber: string;
  purePhoneNumber: string;
}

export interface AccountInfo {
  /**
   * 来自哪个小程序，301 || 302
   */
  app: string;
  /**
   * 微信头像
   */
  avatarUrl: string;
  /**
   * 创建时间
   */
  create_tm: string;
  /**
   * 电话
   */
  mobile: string;
  /**
   * 微信昵称
   */
  nickname: string;
  /**
   * 微信OpenId
   */
  openid: string;
  /**
   * 微信Unionid
   */
  unionid: string;
  /**
   * 账号UUID
   */
  uuid: string;
  openid_coll?: string;
}

export interface UserPhoneNumber {
  phone_info: PhoneInfo;
  [property: string]: any;
}

export interface UserId {
  openid: string;
  unionid: string;
}

export interface SignUpParams {
  openid_coll: string;
  unionid: string;
  nickname: string;
  avatarUrl: string;
  mobile: string;
  app: string; // 'coll'
}
