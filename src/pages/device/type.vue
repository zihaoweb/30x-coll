<template>
  <u-navbar title="设备类型" autoBack placeholder border bgColor="#F2F5F9" />
  <div class="main">
    <div v-for="(v) in deviceTypeList" :key="v.type">
      <div class="wrap" @click="connect(v.type)">
        <div class="wrap-left">
          <img v-if="v.type === '302'" src="/static/home/302.jpg" class="mx-16 h-120 w-90" alt="">
          <img v-else src="/static/home/icon-301b.png" class="mx-16 h-120 w-90" alt="">
          <div class="m-l-10">
            {{ v.type }}
          </div>
        </div>
        <div class="wrap-right">
          <img src="/static/images/device-type.png" class="h-43 w-43" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { addDevice, getDeviceType } from '@/api/common';
import useDeviceStore from '@/store';

interface DeviceType {
  type: string;
}

const deviceStore = useDeviceStore();
const connectName = deviceStore.getName;
const deviceList = deviceStore.getDeviceList;
const deviceTypeList = ref<DeviceType[]>([]);

wx.enableAlertBeforeUnload({
  message: '您还没有选择设备类型,确定要退出么?',
  success: () => {
    console.log('success');
  },
  fail: () => {
    console.log('fail');
  },
});

onMounted(async () => {
  deviceTypeList.value = await getDeviceType();
});

const connect = async (type: string) => {
  let dev_id = '';
  let dev_sn = '';
  wx.disableAlertBeforeUnload();
  deviceList.forEach((item: any) => {
    if (item.name === connectName) {
      item.type = type;
      deviceStore.setDeviceType(type);
      deviceStore.setIsCollection(true);
      deviceStore.setDeviceId(item.deviceId);
      deviceStore.setName(item.name);
      deviceStore.setReconnect(true);
      deviceStore.setConnectBluetoothIns(null);
      uni.setStorageSync('choosetype', true); // 选择过设备类型
      dev_id = item.deviceId;
      dev_sn = item.name;
    }
  });
  const res = await addDevice({
    acc_id: uni.getStorageSync('uuid'),
    dev_id,
    dev_sn,
    type,
  });
  if (res.code !== 'OK') {
    uni.showToast({
      title: '网络异常, 请重试',
      icon: 'none',
    });
    return;
  }
  uni.getStorage({
    key: 'devicelist',
    success: (res) => {
      if (!res.data.includes(dev_sn)) {
        uni.setStorageSync('devicelist', [dev_sn, ...res.data]);
      }
    },
    fail: () => {
      uni.setStorageSync('devicelist', [dev_sn]);
    },
    complete: () => {
      uni.switchTab({
        url: '/pages/tab/home/index',
      });
    },
  });
};
</script>

<style scoped lang='scss'>
.wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx 24rpx;
  margin-top: 24rpx;
  width: 100%;
  height: 184rpx;
  background: #FFF;
  border-radius: 16rpx;
  box-sizing: border-box;

  &-left {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
