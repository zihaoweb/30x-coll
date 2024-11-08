export interface GetIncidentListParams {
  /**
   * 账户id
   */
  acc_id: string;
  /**
   * 设备id
   */
  device_id: string;
  /**
   * 事件发生时间
   */
  event_sta_tm: string;
  /**
   * 成员id
   */
  pat_id: string;
  /**
   * 事件描述
   */
  remark: string;
}

export interface IncidentDetail {
  /**
   * OK和NG的其中一个
   */
  code: string;
  /**
   * 事件记录id
   */
  event_id: string;
}
