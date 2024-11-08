<template>
  <u-navbar leftIcon="" placeholder border bgColor="rgb(239,243,248)">
    <template #left>
      <div class="tetx-36 text-#2F384C">
        设备
      </div>
    </template>
  </u-navbar>

  <div class="main">
    <!-- header -->
    <u-row gutter="18">
      <u-col span="6">
        <div class="box bg-1 relative box-border overflow-hidden p-l-35 p-t-19" @click="scanCode">
          <div class="size-42">
            <img src="/static/images/qrcode-icon.png" alt="" style="width: 100%; height: 100%;">
          </div>
          <div class="text-28 text-white">
            扫描二维码识别设备
          </div>
          <div class="rectangle absolute -bottom-10 -right-5" />
          <div class="rectangle absolute right-27 -bottom-10" />
          <div class="rectangle absolute right-59 -bottom-10" />
        </div>
      </u-col>
      <u-col span="6">
        <div class="box bg-2 relative box-border overflow-hidden p-l-35 p-t-19" @click="goSarch">
          <div class="size-42">
            <img src="/static/images/search-icon.png" alt="" style="width: 100%; height: 100%;">
          </div>
          <div class="text-28 text-white">
            搜索附近的心电设备
          </div>
          <div class="circle absolute -right-100 -top-100" />
        </div>
      </u-col>
    </u-row>
    <up-swipe-action v-if="deviceList.length > 0">
      <up-swipe-action-item
        v-for="(v) in deviceList" :key="v.deviceId" :options="options"
        @click="deviceItemClick($event, v)"
      >
        <div class="device-item-wrap">
          <div class="w-full flex items-center justify-between">
            <div class="flex items-center">
              <img v-if="v.type === '302'" src="/static/home/302.jpg" alt="" class="m-l-14 m-r-18 h-120 w-90">
              <img v-else src="/static/home/icon-301b.png" alt="" class="m-l-14 m-r-18 h-120 w-90">
              <div class="flex flex-col gap-5">
                <div>
                  <span class="text-32 text-#999999">型号: </span><span class="text-32 text-#2F384C">{{ v.type }}</span>
                </div>
                <div>
                  <span class="text-24 text-#999999">S/N码: </span><span class="text-24 text-#2F384C">{{ v.name }}</span>
                </div>
                <div v-if="v.user" class="text-elli w-400">
                  <span class="text-24 text-#999999">备注: </span><span class="text-24 text-#2F384C">{{ v.user }}</span>
                </div>
              </div>
            </div>
            <div
              v-if="!isConnect || v.deviceId !== deviceId" class="content-btn flex-center"
              @click="connectBluetooth(v)"
            >
              连接
            </div>
            <div
              v-if="v.deviceId === deviceId && isConnect" class="content-btn active flex-center"
              @click="disconnect(v.deviceId)"
            >
              断开
            </div>
          </div>
        </div>
      </up-swipe-action-item>
    </up-swipe-action>
    <div v-else>
      <div class="w-full flex-center">
        <img src="/static/images/empty.png" alt="" class="size-480">
      </div>
      <div class="text-center text-39 text-#999999">
        暂无设备
      </div>
    </div>
    <z-model
      :show="confirmBreakConnectModel" confirmText="确定断开" cancelText="取消" title="提示"
      @close="() => { confirmBreakConnectModel = false }" @confirm="breakConnect"
      @cancel="() => { confirmBreakConnectModel = false }"
    >
      <template #default>
        <div class="m-b-40 m-t-24 text-center text-28 text-#666666">
          您正在连接其他设备, 请先断开~
        </div>
      </template>
    </z-model>
  </div>

  <z-popup
    :show="showRenamePopup" title="设置备注" :disabled="checkRename" @close="handlePopupClose"
    @confirm="confirmRename" @cancel="handlePopupClose"
  >
    <div class="h-300 w-full">
      <div class="m-t-20 box-border h-70 w-full border-rd-10 bg-[#f0f3f8] p-10">
        <input v-model="rename" :maxlength="16" class="wh-full" type="text" placeholder="请输入备注">
      </div>
    </div>
  </z-popup>

  <!-- <z-model :title="scaninValidQRCodeTitle" :show="showZModel" @close="handleZModelClose" @confirm="handleZModelConfirm" /> -->
  <z-model
    :show="showZModel" cancelText="取消" confirmText="登记" @close="handleZModelClose"
    @confirm="handleZModelConfirm"
  >
    <div class="w-full">
      <z-input v-model:value="scanUserName" title="姓名" />
      <z-input v-model:value="scanUserGender" title="性别" />
      <z-input v-model:value="scanUserAge" title="年龄" />
    </div>
  </z-model>

  <!-- scanDeviceQrCodeModel -->
  <z-model
    :show="scanDeviceQrCodeModel" confirmText="连接" cancelText="取消" title="设备信息"
    @close="() => { scanDeviceQrCodeModel = false }" @confirm="connectDeviceOfScan" @cancel="() => { scanDeviceQrCodeModel = false }"
  >
    <template #default>
      <div class="m-b-64 m-t-24 flex gap-24 border-rd-16 bg-[#F2F5F9] px-24 py-48">
        <div class="flex-center">
          <img v-if="scanDeviceInfo?.type === '302'" src="/static/home/302.jpg" alt="" class="h-100 w-80">
          <img v-else src="/static/home/icon-301b.png" alt="" class="h-100 w-80">
        </div>
        <div class="w-full flex-col flex-1 justify-center gap-24 text-26">
          <div class="flex items-center">
            <div class="w-70px text-[#999999]">
              设备类型:
            </div>
            <div class="text-[#333333]">
              {{ scanDeviceInfo?.type }}
            </div>
          </div>
          <div class="flex items-center">
            <div class="w-70px text-[#999999]">
              设备S/N:
            </div>
            <div class="text-[#333333]">
              {{ scanDeviceInfo?.name }}
            </div>
          </div>
          <div class="flex items-center">
            <div class="w-70px text-[#999999]">
              固件版本:
            </div>
            <div class="text-[#333333]">
              1.0
            </div>
          </div>
        </div>
      </div>
    </template>
  </z-model>

  <up-tabbar activeColor="#4F95FF" :value="1" :fixed="true" :placeholder="true" :safe-area-inset-bottom="true">
    <up-tabbar-item
      v-for="(item, index) in TabbarConfig" :key="index" :text="item.text"
      @click="clickTabbar(item.path)"
    >
      <template #active-icon>
        <image :src="item.activeIcon" alt="" class="h-48 w-48" />
      </template>
      <template #inactive-icon>
        <image :src="item.icon" alt="" class="h-48 w-48" />
      </template>
    </up-tabbar-item>
  </up-tabbar>
</template>

<script setup lang='ts'>
import useDeviceStore from '@/store';
import { TabbarConfig } from '@/config/tabbar.config';
import { ConnectBluetooth, SearchBluetooth } from '@/utils';
import { type BluetoothDeviceInfo, setLocalDeviceList } from '@/utils/helper';
import { getDeviceList, removeDevice, updateDevice } from '@/api/common';
import { wxLogin } from '@/utils/user';
import { getUserInfoByUnionId, loginByCode, uploadUser } from '@/api/user';

const deviceStore = useDeviceStore();

let ConnectBluetoothIns: any = null;
const SearchBluetoothIns: any = new SearchBluetooth();

const options = reactive([
  {
    text: '删除',
    style: {
      backgroundColor: '#FF4500',
    },
  },
  {
    text: '备注',
    style: {
      backgroundColor: '#3A86FF',
    },
  },
]);

const rename = ref<string>('');
const showZModel = ref<boolean>(false); // 提示信息的模态框
const checkRename = ref<boolean>(true);
const showRenamePopup = ref<boolean>(false); // 重命名的模态框
const scanDeviceQrCodeModel = ref<boolean>(false); // 扫描设备二维码的模态框
const confirmBreakConnectModel = ref<boolean>(false); // 重命名的模态框

const scanUserAge = ref<string>('');
const scanUserName = ref<string>('');
const scanUserGender = ref<string>('');
const deviceList = ref<BluetoothDeviceInfo[]>([]);
const scanDeviceInfo = ref<BluetoothDeviceInfo | null>(null);

const deviceId = ref<string>('');
const isConnect = ref<boolean>(false);
const renameDevice = ref<BluetoothDeviceInfo | null>(null);
const isConnectDevice = ref<BluetoothDeviceInfo>(); // 正在连接的设备
const goSearchClick = ref<boolean>(false);
const showAgreePrivacy = ref<boolean>(false);

onMounted(async () => {
  wx.getPrivacySetting({
    success: (res: any) => {
      if (res.needAuthorization) {
        showAgreePrivacy.value = true;
      }
    },
  });
  const uuid = uni.getStorageSync('uuid');
  if (!uuid) {
    const { code } = await wxLogin();
    const { unionid, openid } = await loginByCode(code);
    uni.setStorageSync('unionid', unionid);
    uni.setStorageSync('openid', openid);
    try {
      const user = await getUserInfoByUnionId(unionid, '30x');
      if (user.code !== 'NG') {
        if (!user.openid_coll) {
          await uploadUser({
            uuid: user.uuid,
            openid_coll: openid,
          });
        }
        uni.setStorageSync('islogin', true);
        uni.setStorageSync('uuid', user.uuid);
      }
    }
    catch (error) {
      console.log(error);
    }

    const res = await getDeviceList({ acc_id: uni.getStorageSync('uuid') });
    const resList = res.map((item: any) => {
      item.name = item.dev_sn;
      item.user = item.dev_alias;
      item.connect = false;
      item.deviceId = item.dev_id;
      return item;
    });
    deviceList.value = resList;
    const deviceSNList = res.map((item: any) => item.dev_sn);
    uni.setStorageSync('devicelist', deviceSNList);
  }
  else {
    const res = await getDeviceList({ acc_id: uni.getStorageSync('uuid') });
    console.log('getDeviceList', res);
    const resList = res.map((item: any) => {
      item.name = item.dev_sn;
      item.user = item.dev_alias;
      item.connect = false;
      item.deviceId = item.dev_id;
      return item;
    });
    deviceList.value = resList;
  }
});

onShow(async () => {
  wx.setKeepScreenOn({
    keepScreenOn: true,
  });
  // const localDeviceList = deviceStore.getDeviceList;
  const res = await getDeviceList({ acc_id: uni.getStorageSync('uuid') });
  deviceList.value = res.map((item: any) => {
    item.name = item.dev_sn;
    item.user = item.dev_alias;
    item.connect = false;
    item.deviceId = item.dev_id;
    return item;
  });
  deviceStore.setDeviceList(deviceList.value);
  isConnect.value = deviceStore.getIsCollection;
  if (isConnect.value) {
    deviceList.value.forEach((item: BluetoothDeviceInfo) => {
      if (item.deviceId === deviceStore.getDeviceId) {
        item.connect = true;
        deviceId.value = item.deviceId;
        isConnectDevice.value = item;
      }
    });
  }
});

watch(rename, () => {
  checkRename.value = rename.value.trim() === '';
});

const connectBluetooth = async (deviceInfo: BluetoothDeviceInfo) => {
  console.log('connectBluetooth', deviceInfo);
  if (isConnect.value) {
    confirmBreakConnectModel.value = true;
    return;
  }
  // 检测蓝牙权限
  wx.getSetting({
    success: (res) => {
      if (!res.authSetting['scope.bluetooth']) {
        wx.authorize({
          scope: 'scope.bluetooth',
          success() {
            console.log('授权成功');
            uni.showLoading({ title: '正在连接', mask: true });
            deviceId.value = deviceInfo.deviceId;
            SearchBluetoothIns.initBluetooth(() => {}, () => {});
            setTimeout(async () => {
              ConnectBluetoothIns = new ConnectBluetooth(deviceInfo.deviceId, '');
              const connect = await ConnectBluetoothIns.createBLEConnection();
              if (!connect) {
                uni.showToast({ title: '请检查设备是否开启', icon: 'none' });
                return;
              }
              deviceInfo.connect = true;
              deviceStore.setIsCollection(true);
              deviceStore.setName(deviceInfo.name);
              deviceStore.setDeviceId(deviceInfo.deviceId);
              deviceStore.setDeviceType(deviceInfo.type!);
              const res = await ConnectBluetoothIns.getBLEServices();
              if (res) {
                deviceStore.setCharacteristicId(res.characteristicId);
                deviceStore.setServiceId(res.serviceId);
              }

              setTimeout(() => {
                deviceList.value.forEach(item => item.connect = (item.deviceId === deviceInfo.deviceId));
                uni.showToast({ title: '连接成功', icon: 'none' });
                setTimeout(() => {
                  uni.switchTab({
                    url: '/pages/tab/home/index',
                  });
                }, 1000);
              }, 2000);
            }, 1000);
          },
          fail() {
            uni.showToast({ title: '授权失败, 请前往设置打开授权~', icon: 'none' });
            console.log('授权失败');
          },
        });
      }
      else {
        deviceId.value = deviceInfo.deviceId;
        uni.showLoading({ title: '正在连接', mask: true });
        SearchBluetoothIns.initBluetooth(() => {}, () => {});
        setTimeout(async () => {
          ConnectBluetoothIns = new ConnectBluetooth(deviceInfo.deviceId, '');
          const connect = await ConnectBluetoothIns.createBLEConnection();
          if (!connect) {
            uni.showToast({ title: '请检查设备是否开启', icon: 'none' });
            return;
          }
          deviceInfo.connect = true;
          deviceStore.setIsCollection(true);
          deviceStore.setName(deviceInfo.name);
          deviceStore.setDeviceId(deviceInfo.deviceId);
          deviceStore.setDeviceType(deviceInfo.type!);
          const res = await ConnectBluetoothIns.getBLEServices();
          if (res) {
            deviceStore.setCharacteristicId(res.characteristicId);
            deviceStore.setServiceId(res.serviceId);
          }

          setTimeout(() => {
            deviceList.value.forEach(item => item.connect = (item.deviceId === deviceInfo.deviceId));
            uni.showToast({ title: '连接成功', icon: 'none', duration: 1000 });
            setTimeout(() => {
              uni.switchTab({
                url: '/pages/tab/home/index',
              });
            }, 1000);
          }, 2000);
        }, 1000);
      }
    },
  });
};

// 断开连接
const disconnect = (deviceId: string) => {
  deviceStore.setReconnect(true);
  deviceStore.setIsCollection(false);
  confirmBreakConnectModel.value = false;
  uni.showLoading({ title: '正在断开...', mask: true });
  SearchBluetoothIns.initBluetooth(() => {}, () => {});
  setTimeout(() => {
    ConnectBluetoothIns = new ConnectBluetooth(deviceId, '');
    ConnectBluetoothIns.closeBLEConnection(deviceId);
  }, 500);
  setTimeout(() => {
    uni.hideLoading();
    isConnect.value = false;
    deviceList.value.forEach(item => item.connect = false);
    // uni.setStorageSync('devicelist', deviceList.value);
    setTimeout(() => {
      if (goSearchClick.value) {
        goSearchClick.value = false;
        uni.navigateTo({
          url: '/pages/device/search',
        });
      }
    }, 500);
  }, 1000);
};

const breakConnect = () => {
  goSearchClick.value = true;
  disconnect(deviceId.value);
};

// 去搜索页
const goSarch = () => {
  if (isConnect.value) {
    confirmBreakConnectModel.value = true;
    return;
  }
  if (uni.getStorageSync('uuid')) {
    uni.navigateTo({
      url: '/pages/device/search',
    });
  }
  else {
    uni.showLoading({ title: '正在跳转...', mask: true });
    setTimeout(() => {
      uni.hideLoading();
      uni.navigateTo({
        url: '/pages/device/search',
      });
    }, 500);
  }
};

const deviceItemClick = async (e: any, device: BluetoothDeviceInfo) => {
  console.log('deviceItemClick', e, device);
  if (e.index === 0) {
    if (isConnect.value && isConnectDevice.value?.name === device.name) {
      uni.showToast({ icon: 'none', title: '请先断开设备' });
      return;
    }
    const res = await removeDevice({ uuid: device.uuid });
    if (res.code !== 'NG') {
      uni.setStorageSync('devicelist', deviceList.value);
      deviceList.value.splice(deviceList.value.findIndex((item: BluetoothDeviceInfo) => item.deviceId === device.deviceId), 1);
    }
    else {
      uni.showToast({ icon: 'none', title: '删除失败, 服务器开小差了~' });
    }
  }
  else {
    showRenamePopup.value = true;
    renameDevice.value = device;
  }
};

const confirmRename = async () => {
  if (rename.value.trim() === '') {
    uni.showToast({ icon: 'none', title: '请输入备注' });
    return;
  }
  let uuid = ''; // 这条记录的uuid
  renameDevice.value!.user = rename.value;
  deviceList.value.forEach((item) => {
    if (item.deviceId === renameDevice.value!.deviceId) {
      uuid = item.uuid;
      item.user = rename.value;
    }
  });
  await updateDevice({
    dev_alias: rename.value,
    uuid,
  });
  rename.value = '';
  showRenamePopup.value = false;
};

const handlePopupClose = () => {
  rename.value = '';
  showRenamePopup.value = false;
};

const handleZModelClose = () => {
  showZModel.value = false;
};

const handleZModelConfirm = () => {
  showZModel.value = false;
};

// 扫码连接设备
const connectDeviceOfScan = () => {
  scanDeviceQrCodeModel.value = false;
  uni.showLoading({ title: '正在连接', mask: true });
  const getServiceList = async (service: BluetoothDeviceInfo[]) => {
    console.log('service', service);
    const { name, deviceId, RSSI, connectable } = service[0];
    if (name === scanDeviceInfo.value!.name) {
      ConnectBluetoothIns = new ConnectBluetooth(deviceId, '');
      const connect = await ConnectBluetoothIns.createBLEConnection();
      if (!connect) {
        uni.showToast({ title: '请确认设备在您身边并已开启~', icon: 'none' });
      }
      else {
        scanDeviceInfo.value!.connect = true;
        scanDeviceInfo.value!.deviceId = deviceId;
        scanDeviceInfo.value!.RSSI = RSSI;
        scanDeviceInfo.value!.connectable = connectable;
        deviceStore.setIsCollection(true);
        deviceStore.setName(scanDeviceInfo.value!.name);
        deviceStore.setDeviceId(scanDeviceInfo.value!.deviceId);
        deviceStore.setDeviceType(scanDeviceInfo.value!.type!);
        setLocalDeviceList(scanDeviceInfo.value!);
        const res = await ConnectBluetoothIns.getBLEServices();
        if (res) {
          deviceStore.setCharacteristicId(res.characteristicId);
          deviceStore.setServiceId(res.serviceId);
        }
        setTimeout(() => {
          deviceList.value.forEach(item => item.connect = (item.deviceId === scanDeviceInfo.value!.deviceId));
          uni.showToast({ title: '连接成功', icon: 'none' });
          setTimeout(() => {
            uni.switchTab({
              url: '/pages/tab/home/index',
            });
          }, 1000);
        }, 2000);
      }
    }
  };
  SearchBluetoothIns.initBluetooth(getServiceList, () => {});
  console.log('scanDeviceInfo', scanDeviceInfo.value);
};

const helperScanCode = (params: any) => {
  try {
    const deviceInfo = JSON.parse(params.result) as BluetoothDeviceInfo;
    if (deviceInfo.name && deviceInfo.name.startsWith('H')) {
      scanDeviceInfo.value = deviceInfo;
      scanDeviceQrCodeModel.value = true;
    }
    else {
      uni.showToast({ title: '无效二维码', icon: 'none' });
    }
  }
  catch (error) {
    uni.showToast({ title: '无效二维码', icon: 'none' });
  }
};

// 扫码
const scanCode = () => {
  wx.getSetting({
    success: (res) => {
      if (!res.authSetting['scope.bluetooth']) {
        wx.authorize({
          scope: 'scope.bluetooth',
          success() {
            console.log('success');
            uni.scanCode({
              onlyFromCamera: false, // 设置false,可以从相册中选择,也可以相机扫描
              scanType: ['qrCode'], // 类型扫描二维码
              success: (ans) => {
                helperScanCode(ans);
              },
            });
          },
          fail() {
            uni.showToast({ title: '授权失败', icon: 'none' });
            console.log('fail');
          },
        });
      }
      else {
        uni.scanCode({
          onlyFromCamera: false, // 设置false,可以从相册中选择,也可以相机扫描
          scanType: ['qrCode'], // 类型扫描二维码
          success: (ans) => {
            helperScanCode(ans);
          },
        });
      }
    },
  });
};

// 点击tabbar切换
const clickTabbar = (path: string) => {
  if (path === '/pages/tab/user/index') {
    if (uni.getStorageSync('from') === 'user') {
      uni.removeStorageSync('from');
      uni.navigateBackMiniProgram({
        success() {
          console.log('跳转成功');
        },
        fail(err) {
          console.log('跳转失败', err);
        },
      });
    }
    else {
      uni.navigateToMiniProgram({
        appId: 'wxd3c75fd54416963d',
        path: '/pages/user/index',
        envVersion: import.meta.env.VITE_APP_ENV === 'development' ? 'trial' : 'release',
        extraData: {
          navigateToMiniProgram: true,
        },
        success() {
          console.log('跳转成功');
        },
        fail(err) {
          console.log('跳转失败', err);
        },
      });
    }
  }
  else {
    uni.switchTab({ url: path });
  }
};
</script>

<style lang="scss">
.content-btn {
  width: 112rpx;
  height: 68rpx;
  font-size: 24rpx;
  color: #4F95FF;
  background: rgb(79 149 255 / 10%);
  border-radius: 8rpx;
  font-weight: 400;
  line-height: 36rpx;
}

.active {
  color: #FF3F3F;
  background-color: rgb(255 63 63 / 10%);
}

.u-swipe-action {
  margin-top: 24rpx;
}

.u-swipe-action-item {
  margin-bottom: 20rpx;
  border-radius: 20rpx;
}

.box {
  width: 100%;
  height: 124rpx;
  border-radius: 16rpx;
}

.bg-1 {
  background: linear-gradient(135deg, #4F95FF 0%, #78AEFF 100%);
}

.bg-2 {
  background: linear-gradient(135deg, #2FC465 0%, #4FD981 100%);
}

.rectangle {
  width: 32rpx;
  height: 78rpx;
  background: linear-gradient(180deg, #FFF 0%, rgb(255 255 255 / 0%) 100%);
  border-radius: 0rpx;
  opacity: 0.1;
  transform: rotate(30deg);
}

.circle {
  width: 156rpx;
  height: 156rpx;
  border: 16rpx solid;
  border-radius: 156rpx;
  opacity: 0.4;
  border-image: linear-gradient(145deg, rgb(255 255 255 / 100%), rgb(255 255 255 / 0%)) 16 16;
}

.device-item-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx 24rpx;
  width: 100%;
  height: 200rpx;
  background: #FFF;
  border-radius: 16rpx;
  box-sizing: border-box;
}
</style>
