export const NameRule = /^[\u4E00-\u9FA5a-z0-9.\s]{1,16}$/i;

export interface BluetoothDeviceInfo extends UniApp.BluetoothDeviceInfo {
  connect: boolean;
  user?: string;
  type?: string;
  connectable?: boolean;
  uuid: string;
  dev_sn?: string;
}

export const validForm = (form: any) => {
  console.log(form);
  if (!form.name) {
    uni.showToast({ title: '姓名不能为空', icon: 'none' });
    return false;
  }
  if (form.gender === 2) {
    uni.showToast({ title: '性别不能为空', icon: 'none' });
    return false;
  }
  if (!form.birth) {
    uni.showToast({ title: '出生日期不能为空', icon: 'none' });
    return false;
  }
  if (form.name && !NameRule.test(form.name)) {
    uni.showToast({ title: '姓名格式为1-16个字符', icon: 'none' });
    return false;
  }
  return true;
};

export const setLocalDeviceList = (device: BluetoothDeviceInfo) => {
  if (!device.type) {
    return;
  }
  const deviceList = uni.getStorageSync('devicelist') || [] as BluetoothDeviceInfo[];
  const deviceIndex = deviceList.findIndex((item: BluetoothDeviceInfo) => item.name === device.name);
  if (deviceIndex !== -1) {
    deviceList.splice(deviceIndex, 1); // 删除旧的设备信息
  }
  deviceList.unshift(device);
  uni.setStorage({
    key: 'devicelist',
    data: deviceList,
    success: () => {
      console.log('设备列表存储成功');
    },
    fail: (err) => {
      console.error('设备列表存储失败:', err);
    },
  });
};
