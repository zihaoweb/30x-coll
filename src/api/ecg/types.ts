export interface IAddEcgRecord {
  /**
   * 开始采集时间
   */
  collect_sta_tm: string;
  /**
   * 使用者UUID
   */
  pat_id: string;
  /**
   * 状态，00(待上传：已开始采集数据，暂未停止采集)、01(上传成功)、02(上传失败)、03(蓝牙中断)、04(无效数据:
   * 例如采集时长不超过10分钟)、05(异常中断：采集数据过程中离开了此页面)
   */
  status: string;
}

export interface IAddEcgRecordResult {
  /**
   * OK和NG的其中一个
   */
  code: string;
  /**
   * 采集记录UUID
   */
  collectid: string;
}

export interface IUploadEcgRecord extends IAddEcgRecord {
  /**
   * 采集数据的总时长
   */
  duration: number;

  /**
   * 采集数据的UUID
   */
  collectid: string;
}

export interface IUploadEcgRecordResult {
  /**
   * OK和NG的其中一个
   */
  code: string;
}

export interface IEcgBinary {
  buffer: ArrayBuffer;
  patid: string;
  starttime: string;
  duration: number | string;
}
