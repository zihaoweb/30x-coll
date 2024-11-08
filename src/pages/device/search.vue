<template>
  <u-navbar title="搜索设备" autoBack placeholder border bgColor="#F2F5F9" />
  <div class="main">
    <div v-if="localDeviceList.length" class="m-b-96">
      <div class="flex text-24 text-#999999">
        <div>已保存设备</div>
      </div>
      <div v-for="(v) in localDeviceList" :key="v.deviceId" class="box">
        <div class="text-32 text-#2F384C lh-48">
          {{ v.name }}
          <div v-if="v.user" class="m-t-8 text-24 text-#4F95FF lh-36">
            {{ v.user }}
          </div>
        </div>
        <div v-if="!v.connect || !isConnect" class="content-btn flex-center" @click="connectBluetooth(v, true)">
          连接
        </div>
        <div v-else class="content-btn active flex-center" @click="disconnect">
          断开
        </div>
      </div>
    </div>
    <div class="m-b-16 flex justify-between text-24 text-#999999">
      <div class="flex items-center text-28 text-#666666">
        {{ isSearch ? '设备搜索中...' : '搜索完成' }}
        <div v-if="isSearch" class="loading m-l-8" />
      </div>
      <div class="text-28 text-#4F95FF" @click="searchBluetooth">
        搜索设备
      </div>
    </div>
    <div v-if="hasDevice">
      <div v-for="(v) in deviceList" :key="v.deviceId" class="box">
        <div class="text-32 text-#2F384C lh-48">
          {{ v.name }}
        </div>
        <div class="content-btn flex-center" @click="connectBluetooth(v)">
          连接
        </div>
      </div>
    </div>
    <div v-else>
      <div class="w-full flex-center">
        <img src="/static/images/empty.png" alt="" class="size-480">
      </div>
      <div class="text-center text-39 text-#999999">
        未搜索到设备~
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import useDeviceStore from '@/store/index';
import type { BluetoothDeviceInfo } from '@/utils/helper';
import { ConnectBluetooth, SearchBluetooth } from '@/utils';

const deviceStore = useDeviceStore();

let ConnectBluetoothIns: any = null;
const SearchBluetoothIns: any = new SearchBluetooth();

const deviceId = ref<string>('');
const isSearch = ref<boolean>(false);
const hasDevice = ref<boolean>(true);
const isConnect = ref<boolean>(false);
const deviceList = ref<BluetoothDeviceInfo[]>([]); // 搜索到的蓝牙设备
const localDeviceList = ref<BluetoothDeviceInfo[]>([]); // 本地蓝牙设备
const tempDevList = ref<BluetoothDeviceInfo[]>([]); // 临时蓝牙设备
const timer = ref<any>(null);

onShow(async () => {
  const choosetype = uni.getStorageSync('choosetype');
  if (!choosetype && deviceStore.getIsCollection) {
    ConnectBluetoothIns = new ConnectBluetooth(deviceStore.getDeviceId, '');
    ConnectBluetoothIns.closeBLEConnection();
    deviceStore.setIsCollection(false);
    localDeviceList.value.forEach(item => item.connect = false);
    console.log('未选择设备类型, 已断开蓝牙连接');
  }
  else {
    uni.removeStorageSync('choosetype');
  }
  isConnect.value = deviceStore.getIsCollection;
  const id = deviceStore.getDeviceId;
  // tempDevList.value = await getDeviceList({ acc_id: uni.getStorageSync('uuid') });
  tempDevList.value = deviceStore.getDeviceList;
  if (tempDevList.value.length) {
    tempDevList.value.forEach((item: any, index: number) => {
      setTimeout(() => {
        if (isConnect.value) {
          item.connect = item.deviceId === id;
        }
        if (item.type) {
          item.name = item.dev_sn;
          item.user = item.dev_alias;
          item.deviceId = item.dev_id;
          localDeviceList.value.push(item);
        }
      }, 1000 * (index + 1));
    });
  }
});

// 连接蓝牙设备
const connectBluetooth = async (deviceInfo: BluetoothDeviceInfo, isLocal: boolean = false) => {
  uni.showLoading({ title: '正在连接', mask: true });
  deviceId.value = deviceInfo.deviceId;
  ConnectBluetoothIns = new ConnectBluetooth(deviceInfo.deviceId, '');
  const connect = await ConnectBluetoothIns.createBLEConnection();
  if (!connect) {
    uni.showToast({ title: '请检查设备是否开启', icon: 'none' });
    return;
  }
  deviceInfo.connect = true;
  deviceStore.setIsCollection(true);
  if (!isLocal) {
    deviceStore.setDeviceList([deviceInfo]);
  }
  deviceStore.setName(deviceInfo.name);
  deviceStore.setDeviceId(deviceInfo.deviceId);
  deviceStore.setDeviceType(deviceInfo.type!);
  const res = await ConnectBluetoothIns.getBLEServices();
  if (res) {
    deviceStore.setCharacteristicId(res.characteristicId);
    deviceStore.setServiceId(res.serviceId);
    uni.hideLoading();
    setTimeout(() => {
      if (deviceInfo.type) {
        uni.switchTab({
          url: '/pages/tab/home/index',
        });
      }
      else {
        uni.navigateTo({
          url: '/pages/device/type',
        });
      }
    }, 300);
  }
};

// 搜索到蓝牙设备之后的callback
const getServiceList = (service: BluetoothDeviceInfo[]) => {
  const { deviceId, name } = service[0];
  if (tempDevList.value.some(item => item.deviceId === deviceId))
    return;
  if (deviceList.value.some(item => item.name === name))
    return;
  service[0].connect = false;
  deviceList.value.push(...service);
  deviceStore.setDeviceList([...deviceList.value]);
};

const disconnect = () => {
  uni.showLoading({ title: '正在断开...', mask: true });
  ConnectBluetoothIns = new ConnectBluetooth(deviceStore.getDeviceId, '');
  ConnectBluetoothIns.closeBLEConnection();
  deviceStore.setIsCollection(false);
  localDeviceList.value.forEach(item => item.connect = false);
  setTimeout(() => {
    uni.showToast({ title: '已断开', icon: 'none' });
  }, 1000);
};

// 搜索蓝牙设备
const searchBluetooth = () => {
  deviceList.value = [];
  hasDevice.value = true;
  isSearch.value = true;
  SearchBluetoothIns.initBluetooth(getServiceList, () => {});
  timer.value = setTimeout(() => {
    if (timer.value)
      clearTimeout(timer.value);
    if (!isSearch.value)
      return;
    isSearch.value = false;
    if (deviceList.value.length === 0) {
      hasDevice.value = false;
    }
  }, 10000);
};

onMounted(() => {
  // 搜索蓝牙设备
  searchBluetooth();
  isSearch.value = true;
  setTimeout(() => {
    isSearch.value = false;
    if (deviceList.value.length === 0) {
      hasDevice.value = false;
      wx.getSetting({
        success: (res) => {
          if (!res.authSetting['scope.userLocation']) {
            uni.showToast({ title: '请前往设置打开位置授权~', icon: 'none' });
          }
        },
      });
    }
  }, 10000);
});
</script>

<style scoped lang='scss'>
.box{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 26rpx 24rpx;
  margin-top: 16rpx;
  width: 100%;
  background-color: red;
  background-color: #FFF;
  border-radius: 16rpx;
  box-sizing: border-box;

  .content-btn{
    width: 112rpx;
    height: 68rpx;
    font-size: 24rpx;
    color: #4F95FF;
    background: rgb(79 149 255 / 10%);
    border-radius: 8rpx;
    font-weight: 400;
    line-height: 36rpx;
  }

  .active{
    color: #FF3F3F;
    background-color: rgb(255 63 63 / 10%);
  }
}

.loading {
  position: relative;
  width: 32rpx;
  height: 32rpx;
  border: 2rpx solid rgb(79 149 255 / 100%);
  border-top-color: rgb(79 149 255 / 20%);
  border-right-color: rgb(79 149 255 / 20%);
  border-bottom-color: rgb(79 149 255 / 20%);
  border-radius: 100%;
  animation: circle infinite 0.75s linear;
}

@keyframes circle {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
