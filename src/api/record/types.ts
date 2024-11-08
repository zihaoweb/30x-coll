export interface GetRecordListResult {
  /**
   * 用户id
   */
  accid: string;
  /**
   * 开始采集时间
   */
  collect_sta_tm: string;
  /**
   * 编号
   */
  collectid: string;
  /**
   * 创建时间
   */
  create_tm: string;
  /**
   * 记录是否已删除
   */
  deleted: string;
  /**
   * 采集时长
   */
  duration: number;
  /**
   * 使用者是否已删除
   */
  pat_deleted: string;
  /**
   * 使用者UUID
   */
  pat_id: string;
  /**
   * 使用者名称
   */
  pat_name: string;
  /**
   * 是否已读
   */
  readed: string;
  /**
   * 状态，00(待上传：已开始采集数据，暂未停止采集)、01(上传成功)、02(上传失败)、03(蓝牙中断)、04(无效数据:
   * 例如采集时长不超过10分钟)、05(异常中断：采集数据过程中离开了此页面)
   */
  status: string;
  /**
   * 更新时间
   */
  update_tm: string;
  [property: string]: any;
}
