import { ab2hex } from '../ecg';
import { StoreDataPath } from '@/config/ecg.config';
import useDeviceStore from '@/store';

const deviceStore = useDeviceStore();
/**
 * @description 将字节解析成电压值
 * @author GEO.PAN
 * @param {number} b1 导联1的byte1
 * @param {number} b2 导联1的byte2
 * @param {number} b3 导联2的byte1
 * @param {number} b4 导联2的byte2
 * @return { data1:number; data2:number; data3:number; }
 */
export function byte2data(b1: number, b2: number, b3: number, b4: number): { data1: number; data2: number; data3: number } {
  const data1 = (((b1 & 0x7F) << 8) + (b2 & 0xFF) - 16384) * 1.153945923; // 通过2个字节解析为电压值
  const data2 = (((b3 & 0x7F) << 8) + (b4 & 0xFF) - 16384) * 1.153945923; // 通过2个字节解析为电压值
  const data3 = data2 - data1; // 计算导联2的电压值
  return { data1, data2, data3 };
}

/**
 * 16进制字符串转ArrayBuffer
 */
export function hex2ab(hex: string) {
  return new Uint8Array(hex.match(/[\da-f]{2}/gi)!.map(h => Number.parseInt(h, 16))).buffer;
}

/**
 * @description 三个导联的数据点转换为DAT文件的一个采样点数据写入块
 * @author GEO.PAN
 * @param {number} data1 导联1的数据点(由2个字节组成)
 * @param {number} data2 导联2的数据点(由2个字节组成)
 * @param {number} data3 导联3的数据点(由2个字节组成)
 * @return ArrayBuffer
 */
function data2ab(data1: number, data2: number, data3: number): ArrayBuffer {
  const ab = new ArrayBuffer(6); // 6个字节缓冲
  const dv = new DataView(ab); // 写入数据
  dv.setUint16(0, data1, true); // 写入两个字节
  dv.setUint16(2, data2, true); // 写入两个字节
  dv.setUint16(4, data3, true); // 写入两个字节
  return ab;
}

export function ble2data(data: any[]): ArrayBuffer[] {
  const u8 = new Uint8Array(data);
  const abf: ArrayBuffer[] = [];
  for (let i = 2; i < u8.length - 2; i += 4) {
    const { data1, data2, data3 } = byte2data(u8[i], u8[i + 1], u8[i + 2], u8[i + 3]);
    const segment = data2ab(data1, data2, data3);
    abf.push(segment);
  }
  return abf;
}

const fs = wx.getFileSystemManager();
const fileBasePath = `${wx.env.USER_DATA_PATH}/${StoreDataPath.ECG_DATA_PATH}`;

/**
 * @param fileName 目录路径
 * @returns  Promise
 */
export function checkFileIsExist(fileName: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!fileName) {
      console.log('文件名不能为空');
      resolve(false);
      return;
    }
    fs.access({
      path: `${fileBasePath}/${fileName}.dat`,
      success: () => {
        console.log('文件存在');
        resolve(true);
      },
      fail: () => {
        console.log('文件不存在');
        resolve(false);
      },
    });
  });
}

/**
 * @description 递归创建目录
 */
export function ensureDirectoryExists(): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.access({
      path: fileBasePath,
      success: () => {
        console.log('目录已存在');
        resolve();
      },
      fail: () => {
        fs.mkdir({
          dirPath: `${wx.env.USER_DATA_PATH}/${StoreDataPath.ECG_DATA_PATH}`,
          recursive: true,
          success: () => {
            console.log('目录创建成功');
            resolve();
          },
          fail: () => {
            console.log('目录创建失败');
            reject(new Error('目录创建失败').message);
          },
        });
      },
    });
  });
}

/**
 * @param filePath 文件路径
 * @param data  文件内容
 * @returns  Promise
 */
export async function saveFile(filePath: string, data: string | ArrayBuffer): Promise<string> {
  return new Promise((resolve) => {
    fs.writeFile({
      filePath: `${fileBasePath}/${filePath}.dat`,
      data,
      success: () => {
        console.log('文件写入成功');
        resolve('文件写入成功');
      },
      fail: () => {
        console.log('文件写入失败');
        resolve(new Error('文件写入失败').message);
      },
    });
  });
}

/**
 * @param filePath 文件路径
 * @param data  文件内容
 * @returns  Promise
 */
export function appendFile(filePath: string, data: string | ArrayBuffer): Promise<boolean> {
  return new Promise((resolve, reject) => {
    fs.appendFile({
      filePath: `${fileBasePath}/${filePath}.dat`,
      data,
      success: () => {
        // console.log('追加成功');
        resolve(true);
      },
      fail: (err) => {
        // console.log('追加失败', err);
        // uni.showToast({ icon: 'none', title: '保存数据失败~' });
        uni.hideLoading();
        reject(err);
      },
    });
  });
}

/**
 * @param filePath 文件路径
 */
export function removeFile(filePath: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    fs.unlink({
      filePath: `${fileBasePath}/${filePath}.dat`,
      success: () => {
        console.log('删除成功');
        resolve(true);
      },
      fail: (err) => {
        console.log('删除失败', err);
        reject(err);
      },
    });
  });
}

/**
 *  读取文件
 */
export function readFile(filePath: string): Promise<any> {
  return new Promise((resolve) => {
    fs.readFile({
      filePath: `${fileBasePath}/${filePath}.dat`,
      success: (res: any) => {
        resolve(res.data as ArrayBuffer);
      },
      fail: () => {
        // uni.showToast({ icon: 'none', title: '读取文件失败~' });
        resolve(false);
        console.log('read fail');
      },
    });
  });
};

export enum WriteBleType {
  USERID = 'userid',
  USERID2 = 'userid2',
  WIFINAME = 'wifi-name',
  WIFIPASS = 'wifi-pass',
  CLEAR = 'clear',
  TIME = 'time', // 设备信息设置
  TIME2 = 'time2', // 获取时间，时间信息：6byte，年月日时分秒各1字节
  UPLOAD = 'upload', // 是否自动上传
  DING = 'ding', // // 设备信息设置
  COLLECTTIME = 'collect-time', // 记录时长（小时）
  SCREENTIME = 'screen-time', // 屏幕保护时间（秒）
  ELEC = 'elec', // 设备信息获取 电池电量：1byte，取值范围：0%-100%
  SN = 'sn',
  FIRMWAREVERSION = 'firmware-version',
  data = 'data', // 波形数据 设备->手机， 数据点1共4byte， I+II导数据， 数据点2共4byte， I+II导数据， 数据点3共4byte， I+II导数据， 数据点4共4byte， I+II导数据
  start = 'start', // 启动心电蓝牙数据
  end = 'end', // 结束心电蓝牙数据
}

export interface Device {
  connected?: boolean; // 监听得到的设备连接状态
  name?: string; // 设备名称
  deviceId?: string; // 设备uuid
  serviceId?: string; // 设备的服务uuid(获取的index:0的serviceId): 6e400001-b5a3-f393-e0a9-e50e24dcca9e
  writeCharacteristicId?: string; // 设备的特征值uuid(获取的可写charactisticId)
  notifyCharacteristicId?: string; // 设备的特征值uuid(获取的通知charactisticId)
  version?: string; // 暂时没有用
}

/**
 * 写数据
 */
export function writeBLE(type: string, value: string): Promise<string> {
  if (!value)
    return Promise.reject('未指定写入数据');

  let mode = 0x00;
  if (type === WriteBleType.USERID)
    mode = 0x05;
  else if (type === WriteBleType.USERID2)
    mode = 0x10;
  else if (type === WriteBleType.WIFINAME)
    mode = 0x06;
  else if (type === WriteBleType.WIFIPASS)
    mode = 0x07;
  else if (type === WriteBleType.CLEAR)
    mode = 0x0e;
  else if (type === WriteBleType.TIME)
    mode = 0x02;
  else if (type === WriteBleType.TIME2)
    mode = 0x13;
  else if (type === WriteBleType.UPLOAD)
    mode = 0x18;
  else if (type === WriteBleType.DING)
    mode = 0x02;
  else if (type === WriteBleType.COLLECTTIME)
    mode = 0x19;
  else if (type === WriteBleType.SCREENTIME)
    mode = 0x1a;
  else if (type === WriteBleType.ELEC)
    mode = 0x03;
  else if (type === WriteBleType.SN)
    mode = 0x14;
  else if (type === WriteBleType.FIRMWAREVERSION)
    mode = 0x15;
  else if (type === WriteBleType.data)
    mode = 0x01;
  else if (type === WriteBleType.start)
    mode = 0x08;
  else if (type === WriteBleType.end)
    mode = 0x09;
  else return Promise.reject('无效的指令');
  console.log('mode', mode);
  if (type === WriteBleType.CLEAR || type === WriteBleType.data || type === WriteBleType.start || type === WriteBleType.end) {
    // 帧头+ 帧类别+数据长度+名字字节长度+帧尾
    const bytes = new ArrayBuffer(20);
    const dataview = new DataView(bytes);
    dataview.setUint8(0, 0xaa);
    dataview.setUint8(1, mode);
    for (let i = 0; i < 17; i++) {
      // TODO: 根据最大长度限制进行末尾补0
      dataview.setUint8(i + 2, 0x00);
    }
    dataview.setUint8(19, 0xcc);

    // 蓝牙下发指令
    return write(bytes);
  }
  else if (type === WriteBleType.TIME) {
    const dev: Device = uni.getStorageSync('oldDevice');
    const ding = `${dev.name}DING`;
    const dingData = uni.getStorageSync(ding);

    const upload = `${dev.name}UPLOAD`;
    const uploadData = uni.getStorageSync(upload);

    const date = new Date();
    const year = date.getFullYear() - 1970;
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    console.log('date', year, month, day, hour, minute, second, dingData, uploadData);

    const bytes = new ArrayBuffer(20);
    const dataview = new DataView(bytes);
    dataview.setUint8(0, 0xaa);
    dataview.setUint8(1, mode);
    dataview.setUint8(2, year);
    dataview.setUint8(3, month);
    dataview.setUint8(4, day);
    dataview.setUint8(5, hour);
    dataview.setUint8(6, minute);
    dataview.setUint8(7, second);
    dataview.setUint8(8, 0x00);
    dataview.setUint8(9, 0x00);
    dataview.setUint8(10, 0x00);
    dataview.setUint8(11, 0x00);
    dataview.setUint8(12, 0x00);

    if (dingData.length > 0) {
      if (dingData === '0x00') {
        dataview.setUint8(13, 0x00);
      }
      else {
        dataview.setUint8(13, 0x01);
      }
    }
    else {
      dataview.setUint8(13, 0x01);
    }
    if (uploadData.length > 0) {
      if (uploadData === '0x00') {
        dataview.setUint8(14, 0x00);
      }
      else {
        dataview.setUint8(14, 0x01);
      }
    }
    else {
      dataview.setUint8(14, 0x01);
    }

    dataview.setUint8(15, 0x00);
    dataview.setUint8(16, 0x00);
    dataview.setUint8(17, 0x00);
    dataview.setUint8(18, 0x00);
    dataview.setUint8(19, 0xcc);
    // 蓝牙下发指令
    return write(bytes);
  }
  else if (type === WriteBleType.TIME2) {
    const date = new Date();
    const year = date.getFullYear() - 1970;
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    console.log('date', year, month, day, hour, minute, second);

    const bytes = new ArrayBuffer(20);
    const dataview = new DataView(bytes);
    dataview.setUint8(0, 0xaa);
    dataview.setUint8(1, mode);
    dataview.setUint8(2, year);
    dataview.setUint8(3, month);
    dataview.setUint8(4, day);
    dataview.setUint8(5, hour);
    dataview.setUint8(6, minute);
    dataview.setUint8(7, second);
    dataview.setUint8(19, 0xcc);
    // 蓝牙下发指令
    return write(bytes);
  }
  else if (type === WriteBleType.UPLOAD) {
    const bytes = new ArrayBuffer(20);
    const dataview = new DataView(bytes);
    dataview.setUint8(0, 0xaa);
    dataview.setUint8(1, mode);
    dataview.setUint8(2, 1);
    if (value === '0x00') {
      dataview.setUint8(3, 0x00);
    }
    else {
      dataview.setUint8(3, 0x01);
    }
    dataview.setUint8(19, 0xcc);
    // 蓝牙下发指令
    return write(bytes);
  }
  else if (type === WriteBleType.COLLECTTIME) {
    const bytes = new ArrayBuffer(20);
    const dataview = new DataView(bytes);
    dataview.setUint8(0, 0xaa);
    dataview.setUint8(1, mode);
    dataview.setUint8(2, 1);
    if (value === '0x02') {
      dataview.setUint8(3, 0x02);
    }
    else if (value === '0x03') {
      dataview.setUint8(3, 0x03);
    }
    else {
      dataview.setUint8(3, 0x01);
    }
    dataview.setUint8(19, 0xcc);
    // 蓝牙下发指令
    return write(bytes);
  }
  else if (type === WriteBleType.SCREENTIME) {
    const bytes = new ArrayBuffer(20);
    const dataview = new DataView(bytes);
    dataview.setUint8(0, 0xaa);
    dataview.setUint8(1, mode);
    dataview.setUint8(2, 1);
    if (value === '0x02') {
      dataview.setUint8(3, 0x02);
    }
    else if (value === '0x03') {
      dataview.setUint8(3, 0x03);
    }
    else {
      dataview.setUint8(3, 0x01);
    }
    dataview.setUint8(19, 0xcc);
    // 蓝牙下发指令
    return write(bytes);
  }
  else if (type === WriteBleType.DING) {
    const date = new Date();
    const year = date.getFullYear() - 1970;
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    console.log('date', year, month, day, hour, minute, second);

    const bytes = new ArrayBuffer(20);
    const dataview = new DataView(bytes);
    dataview.setUint8(0, 0xaa);
    dataview.setUint8(1, mode);
    dataview.setUint8(2, year);
    dataview.setUint8(3, month);
    dataview.setUint8(4, day);
    dataview.setUint8(5, hour);
    dataview.setUint8(6, minute);
    dataview.setUint8(7, second);
    dataview.setUint8(8, 0x00);
    dataview.setUint8(9, 0x00);
    dataview.setUint8(10, 0x00);
    dataview.setUint8(11, 0x00);
    dataview.setUint8(12, 0x00);
    if (value === '0x00') {
      dataview.setUint8(13, 0x00);
    }
    else {
      dataview.setUint8(13, 0x01);
    }
    dataview.setUint8(14, 0x00);
    dataview.setUint8(15, 0x00);
    dataview.setUint8(16, 0x00);
    dataview.setUint8(17, 0x00);
    dataview.setUint8(18, 0x00);
    dataview.setUint8(19, 0xcc);
    // 蓝牙下发指令
    return write(bytes);
  }
  else if (type === WriteBleType.ELEC) {
    const bytes = new ArrayBuffer(20);
    const dataview = new DataView(bytes);
    dataview.setUint8(0, 0xaa);
    dataview.setUint8(1, mode);
    dataview.setUint8(19, 0xcc);
    // 蓝牙下发指令
    return write(bytes);
  }
  else if (type === WriteBleType.SN) {
    const bytes = new ArrayBuffer(20);
    const dataview = new DataView(bytes);
    dataview.setUint8(0, 0xaa);
    dataview.setUint8(1, mode);
    dataview.setUint8(19, 0xcc);
    // 蓝牙下发指令
    return write(bytes);
  }
  else if (type === WriteBleType.FIRMWAREVERSION) {
    const bytes = new ArrayBuffer(20);
    const dataview = new DataView(bytes);
    dataview.setUint8(0, 0xaa);
    dataview.setUint8(1, mode);
    dataview.setUint8(19, 0xcc);
    // 蓝牙下发指令
    return write(bytes);
  }
  else {
    // 帧头+ 帧类别+数据长度+名字字节长度+帧尾
    const bytes = new ArrayBuffer(20);
    const dataview = new DataView(bytes);
    dataview.setUint8(0, 0xaa);
    dataview.setUint8(1, mode);
    dataview.setUint8(2, value.length);
    for (let i = 0; i < 16; i++) {
      dataview.setUint8(i + 3, value.charCodeAt(i) ?? 0x00);
    }
    dataview.setUint8(19, 0xcc);

    // 蓝牙下发指令
    console.log('dataview', dataview);
    return write(bytes);
  }
}

function write(data: any): Promise<string> {
  return new Promise((resolve, reject) => {
    // console.log('数据的16进制(HEX)', ab2hex(data));
    uni.writeBLECharacteristicValue({
      deviceId: deviceStore.getDeviceId,
      serviceId: deviceStore.getServiceId,
      characteristicId: deviceStore.getCharacteristicId,
      value: data,
      success: () => {
        // console.log('发送数据成功', res);
        resolve(ab2hex(data));
      },
      fail: (err) => {
        console.error('发送数据失败', err);
        reject(err);
      },
    });
  });
}
