export enum BleConfig {
  /**
   * ecg page 背景大网格数量
   */
  BIG_GRID_NUM = 8,
  /**
   * ecg page 背景一个大网格中小网格的数量
   */
  SMALL_GRID_NUM = 5,
}

export enum EcgCanvasOptions {
  /**
   * 心电图波形线条点颜色
   */
  ECG_LINE_COLOR = '#02CD88',
  /**
   * 心电图波形线条宽度
   */
  ECG_LINE_WIDTH = 1,
}

export enum StoreDataPath {
  /**
   * 心电数据存储路径
   */
  ECG_DATA_PATH = 'ecg/data',
}

export enum CollectionTimeInterval {
  /**
   * 无效采集时间(单位:秒) 10min
   */
  INVALID_INTERVAL = 10,
  /**
   * 最大采集时间(单位:秒) 15min
   */
  MAX_INTERVAL = 900,
}

export enum CollectionStatus {
  /**
   * 采集中
   */
  PENDING = '00',

  /**
   * 上传成功
   */
  SUCCESS = '01',

  /**
   * 上传失败
   */
  FAIL = '02',

  /**
   * 蓝牙中断
   */
  INTERRUPT = '03',

  /**
   * 无效数据
   */
  INVALID_DATA = '04',

  /**
   * 异常中断
   */
  EXCEPTION = '05',
  /**
   * 手动断开
   */
  DISCONNECT = '06',
}
