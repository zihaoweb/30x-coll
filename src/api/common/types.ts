export interface UploadImageResult {
  file: string;
  url: string;
}

export interface SendCodeParams {
  phone: number;
  code: number;
}

export interface SendCodeResult {
  code: number;
}

export interface GetDeviceListResult {
  /**
   * 账户id
   */
  acc_id: string;
  /**
   * 首次连接时间
   */
  create_tm: string;
  /**
   * 设备别名
   */
  dev_alias?: string;
  /**
   * 设备id
   */
  dev_id: string;
  /**
   * 设备SN码
   */
  dev_sn: string;
  /**
   * 类型，301、301WiFi版、302的其中一个
   */
  type: string;
  /**
   * 记录唯一标识
   */
  uuid: string;
  [property: string]: any;
}

export interface AddDeviceItemParams {
  /**
   * 账户id
   */
  acc_id: string;
  /**
   * 设备别名
   */
  dev_alias?: string;
  /**
   * 设备id
   */
  dev_id: string;
  /**
   * 设备SN码
   */
  dev_sn: string;
  /**
   * 类型，301、301WiFi版、302的其中一个
   */
  type?: string;
  uuid?: string;
}

export interface SystemConfig {
  name: string;
  value: string;
}
