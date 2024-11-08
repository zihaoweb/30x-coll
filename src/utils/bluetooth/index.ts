const deviceNameRegExp = /^H[a-zA-Z0-9]+$/i; // 设备名称正则

export class ConnectBluetooth {
  deviceId: string;
  serviceId: string;
  writeCharacteristicId: string;
  notifyCharacteristicId: string;
  connectionTimeout: number;
  constructor(deviceId: string, serviceId: string) {
    this.deviceId = deviceId; // 设备id
    this.serviceId = serviceId; // 主服务 uuid
    this.writeCharacteristicId = ''; // write 特征值uuid
    this.notifyCharacteristicId = ''; // notify  特征值uuid
    this.connectionTimeout = 10000; // 连接BLE timeout 时长
  }

  /**
   * 连接BLE
   */
  createBLEConnection() {
    return new Promise((resolve) => {
      uni.createBLEConnection({
        deviceId: this.deviceId,
        timeout: this.connectionTimeout,
        success: () => {
          resolve(true);
        },
        fail: (err) => {
          console.log('createBLEConnection', err);
          resolve(false);
        },
      });
    });
  }

  /**
   * 获取某个型号BLE设备服务表
   * 这里获取到的是一个列表,具体选取哪个serviceId 需要拿到每个serviceId后,
   * 去获取蓝牙设备对应服务中所有特征值(characteristic), 获取到的特征值能成功写入(write)和订阅(notify)
   * 消息, 就用这个serviceId, 此时serviceId 就可以写死到项目中***(只针对同型号的蓝牙).***
   */
  getBLEServices(): Promise<{ deviceId: string; serviceId: string; characteristicId: string; notifyCharacteristicId: string }> {
    return new Promise((resolve, reject) => {
      // 连接成功之后需要延时，继续操作才不会出问题
      setTimeout(() => {
        uni.getBLEDeviceServices({
          deviceId: this.deviceId,
          success: async (res) => {
            let _servicecId = '';
            console.log('res', res);
            const services = res.services;
            const len = services.length;
            let flag = false;
            for (let i = 0; i < len; i++) {
              if (services[i]?.uuid.startsWith('0000FFF0')) {
                _servicecId = services[i]?.uuid;
                flag = true;
                break;
              }
            }
            if (!flag) {
              for (let i = 0; i < len; i++) {
                if (services[i].isPrimary) {
                  _servicecId = services[i].uuid;
                  break;
                }
              }
            }
            const { writeCharacteristicId, notifyCharacteristicId } = await this.getBLEDeviceCharacteristics(
              this.deviceId,
              _servicecId,
            );
            resolve({
              deviceId: this.deviceId,
              serviceId: _servicecId,
              characteristicId: writeCharacteristicId,
              notifyCharacteristicId,
            });
          },
          fail: (err) => {
            console.log(err);
            reject(err);
          },
        });
      }, 600);
    });
  }

  /**
   * 主动断开蓝牙设备的连接
   * @returns {Promise} 返回一个Promise，当连接断开成功时resolve
   */
  closeBLEConnection(): Promise<any> {
    return new Promise(() => {
      uni.closeBLEConnection({
        deviceId: this.deviceId,
        success() {
          console.log('主动断开连接1');
        },
      });
    });
  }

  /**
   * 获取蓝牙设备的所有特征值
   * @param {string} deviceId 蓝牙设备的ID
   * @param {string} serviceId 蓝牙设备服务的ID
   * @returns {Promise} 返回一个Promise，resolve时携带包含写特征值和通知特征值的对象
   */
  getBLEDeviceCharacteristics(deviceId: string, serviceId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      uni.getBLEDeviceCharacteristics({
        deviceId,
        serviceId,
        success: async (res) => {
          const { characteristics } = res;
          console.log('characteristics', characteristics);
          let notifyStatus = false;
          let writeCharacteristicId: string = '';
          let notifyCharacteristicId: string = '';
          for (let i = 0; i < characteristics.length; i++) {
            const characteristic = characteristics[i];
            if (characteristic.properties.write) {
              writeCharacteristicId = characteristic.uuid;
            }
            if (characteristic.properties.notify) {
              notifyCharacteristicId = characteristic.uuid;
              notifyStatus = await this.notifyBLECharacteristicValueChange(deviceId, serviceId, notifyCharacteristicId);
            }
          }
          if (writeCharacteristicId && notifyStatus) {
            resolve({ writeCharacteristicId, notifyCharacteristicId });
          }
          else {
            if (!notifyStatus) {
              reject(new Error('启用低功耗蓝牙设备特征值变化时的notify功能失败'));
            }
            else {
              reject(new Error('当前设备不可写数据'));
            }
          }
        },
        fail(err) {
          reject(err);
        },
      });
    });
  }

  /**
   * 启用蓝牙设备特征值的通知功能
   * @param {string} deviceId 蓝牙设备的ID
   * @param {string} serviceId 蓝牙设备服务的ID
   * @param {string} characteristicId 蓝牙设备特征值的ID
   */
  notifyBLECharacteristicValueChange(deviceId: string, serviceId: string, characteristicId: string) {
    return new Promise<boolean>((resolve, reject) => {
      uni.notifyBLECharacteristicValueChange({
        deviceId,
        serviceId,
        characteristicId,
        state: true, // 是否启用 notify
        success: () => {
          resolve(true);
        },
        fail() {
          reject(new Error('启用低功耗蓝牙设备特征值变化时的notify功能失败'));
        },
      });
    });
  }
}

export class SearchBluetooth {
  available: boolean;
  discovering: boolean;
  isDiscovery: boolean;
  discoveringTimer: any;
  discoveringInterval: number;
  deviceCount: number;
  constructor() {
    this.available = false; // 蓝牙是否可用/开启
    this.discovering = false; // 是否正在搜索设备
    this.discoveringTimer = null; // 搜索无设备提示延时器
    this.isDiscovery = false; // 是否搜索到设备
    this.discoveringInterval = 10000; // 搜索时长10s
    this.deviceCount = 0; // 搜索到的设备数量
  }

  /**
   * 初始化蓝牙模块
   * @param {Function} discoveryCallback 搜索到设备后的回调
   * @param {Function} stateChangeCallback 状态变化的回调
   */
  initBluetooth(discoveryCallback: Function, stateChangeCallback: Function) {
    return new Promise<void>((resolve, reject) => {
      uni.openBluetoothAdapter({
        success: () => {
          console.log('初始化蓝牙模块成功！');
          // 监听蓝牙适配器状态变化事件
          this.onBluetoothStateChange(stateChangeCallback);
          // 开始搜寻附近的蓝牙外围设备
          this.discoverBluetooth(discoveryCallback);
          resolve();
        },
        fail: (err) => {
          console.log('初始化蓝牙模块失败');
          if (err.errCode === 10001) {
            uni.showToast({
              icon: 'none',
              title: '请打开手机蓝牙~',
              duration: 3000,
            });
          }
          // 监听蓝牙适配器状态变化事件
          this.onBluetoothStateChange(stateChangeCallback);
          reject(err);
        },
      });
    });
  }

  /**
   * 搜寻蓝牙设备
   * @param {Function} cb 搜索到设备后的回调
   */
  discoverBluetooth(cb: Function) {
    if (!cb || typeof cb !== 'function')
      return;

    uni.startBluetoothDevicesDiscovery({
      success: () => {
        this.discoveringTimer = setTimeout(() => {
          // 超过指定时间还没搜到设备的处理
          if (this.deviceCount === 0) {
            this.unloadBluetooth();
          }
        }, this.discoveringInterval);
      },
      fail: () => {
        console.error('启动蓝牙设备发现失败');
      },
    });

    this.onBluetoothDeviceFound(cb);
  }

  /**
   * 监听蓝牙适配器状态变化事件
   * @param {Function} cb 处理状态变化的函数
   */
  onBluetoothStateChange(cb: Function) {
    uni.onBluetoothAdapterStateChange((res) => {
      const { available, discovering } = res;
      this.updateBluetoothState(res); // 更新蓝牙适配器状态
      if (!available && !discovering) {
        // 蓝牙断开
        this.unloadBluetooth();
      }
      cb && cb(res);
    });
  }

  /**
   * 更新蓝牙适配器状态
   */
  updateBluetoothState(state: UniApp.OnBluetoothAdapterStateChangeResult) {
    const { available, discovering } = state;
    this.available = available;
    this.discovering = discovering;
  }

  /**
   * 监听搜索蓝牙设备事件
   */
  onBluetoothDeviceFound(cb: Function) {
    uni.onBluetoothDeviceFound(({ devices }) => {
      if ((devices[0].name.startsWith('H01') || devices[0].name.startsWith('H02')) && deviceNameRegExp.test(devices[0].name)) {
        this.deviceCount = devices.length;
        cb(devices);
      }
    });
  }

  /**
   * 停止搜寻蓝牙设备
   */
  stopDiscovery() {
    uni.stopBluetoothDevicesDiscovery();
    clearTimeout(this.discoveringTimer);
  }

  /**
   * 关闭本机蓝牙适配器
   */
  closeBluetooth() {
    uni.closeBluetoothAdapter();
    clearTimeout(this.discoveringTimer);
  }

  /**
   * 卸载本机蓝牙的事件
   */
  unloadBluetooth() {
    this.closeBluetooth();
    this.discovering && this.stopDiscovery();
  }
}
