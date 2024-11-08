<template>
  <u-navbar title="采集成员登记" autoBack placeholder bg-color="#F2F5F9" />

  <div class="main">
    <div class="box" @click="() => { userPopup = true }">
      <div class="flex items-center justify-center">
        <div style="background-color: rgb(79 149 255 / 10%);" class="size-40 flex-center b-rd-20">
          <up-icon name="account-fill" :size="14" :color="`${'#4F95FF'}`" />
        </div>
        <div class="m-l-8 text-32 text-#2F384C">
          当前成员
        </div>
      </div>
      <div class="flex items-center justify-center gap-8">
        <div class="text-36 text-#4F95FF">
          {{ activeMember!.name || '请选择' }}
        </div>
        <div v-if="activeMember!.name" class="size-32">
          <img v-if="activeMember!.avatarUrl" :src="activeMember!.avatarUrl" alt="" class="wh-full border-rd-[50%]">
          <!-- <img v-else src="/static/home/user-avatar.png" alt="" class="wh-full"> -->
          <up-avatar v-else :size="16" src="" />
        </div>
        <up-icon name="arrow-right" :size="14" />
      </div>
    </div>
    <div class="box" @click="handleAdd">
      <div class="flex items-center justify-center">
        <div style="background-color: rgb(79 149 255 / 10%);" class="size-40 flex-center b-rd-20">
          <up-icon name="man-add-fill" :size="14" :color="`${'#4F95FF'}`" />
        </div>
        <div class="m-l-8 text-32 text-#2F384C">
          快捷添加成员
        </div>
      </div>
      <up-icon name="arrow-right" :size="14" />
    </div>
    <div class="box" @click="scanCode">
      <div class="flex items-center justify-center">
        <div style="background-color: rgb(79 149 255 / 10%);" class="size-40 flex-center b-rd-20">
          <up-icon name="scan" :size="16" :color="`${'#4F95FF'}`" />
        </div>
        <div class="m-l-8 text-32 text-#2F384C">
          扫码登记
        </div>
      </div>
      <up-icon name="arrow-right" :size="14" />
    </div>
  </div>

  <z-popup title="快捷添加成员" :show="addMemberPopup" @close="closeAddMemberPopup" @cancel="closeAddMemberPopup" @confirm="addMemberConfirm">
    <template #default>
      <div class="m-b-322 m-t-48 flex-col gap-24">
        <z-input v-model:value="formData.name" title="姓名" placeholder="请输入..." @input="handleNameChange" />
        <z-input v-model:value="sex" title="性别" placeholder="请选择" icon="arrow-right" disabled @click="handleSexClick" />
        <z-input v-model:value="birthString" title="出生日期" placeholder="请选择" icon="arrow-right" disabled @click="handleDateClick" />
      </div>
    </template>
  </z-popup>

  <up-picker :show="genderPickerShow" :columns="columns" @confirm="genderConfirm" @cancel="genderCancel" />
  <up-datetime-picker
    v-model="curDate"
    :show="birthdayPickerShow"
    mode="date"
    :maxDate="maxDate"
    :minDate="minDate"
    @confirm="birthdayConfirm"
    @cancel="birthdayCancel"
  />
  <z-model
    :show="scanInvalidModel" confirmText="重新扫码" cancelText="取消" title="请扫描成员二维码"
    @close="() => { scanInvalidModel = false }" @confirm="scanCode" @cancel="() => { scanInvalidModel = false }"
  >
    <template #default>
      <div class="m-b-40" />
    </template>
  </z-model>
  <z-model
    :show="inValidUserMemberModel" confirmText="重新扫码" cancelText="取消" title="非您名下成员"
    @close="() => { inValidUserMemberModel = false }" @confirm="scanCode" @cancel="() => { inValidUserMemberModel = false }"
  >
    <template #default>
      <div class="m-b-40" />
    </template>
  </z-model>

  <!-- 扫码登记展示成员信息model -->
  <z-model
    :show="scanValidModel" confirmText="登记" cancelText="取消" title="成员信息"
    @close="() => { scanValidModel = false }" @confirm="registerOfScan" @cancel="() => { scanValidModel = false }"
  >
    <template #default>
      <div class="m-b-64 m-t-24 flex-col gap-24 border-rd-16 bg-[#F2F5F9] p-24">
        <div class="hl-80 w-full flex justify-between">
          <div class="">
            姓名
          </div>
          <div>{{ scanFormData?.name }}</div>
        </div>
        <div class="hl-80 w-full flex justify-between">
          <div class="">
            性别
          </div>
          <div>{{ scanFormData?.gender }}</div>
        </div>
        <div class="hl-80 w-full flex justify-between">
          <div class="">
            年龄
          </div>
          <div>{{ scanFormData?.age }}</div>
        </div>
      </div>
    </template>
  </z-model>

  <!-- 选择成员POP -->
  <z-popup :show="userPopup" :mt="221" title="选择成员" @close="userPopupClose" @confirm="userPopupConfirm" @cancel="userPopupClose">
    <template #default>
      <div class="grid-container m-t-56">
        <div v-for="(item, index) in memberList" :key="item.create_tm" class="grid-item" :class="{ active: index === activeUserIndex }" @click="activeUser(item, index)">
          <div class="flex items-center">
            <div class="m-r-8 size-48">
              <img v-if="item.avatarUrl" :src="item.avatarUrl" alt="" class="wh-full border-rd-[50%]">
              <!-- <img v-else class="wh-full" src="/static/home/user-avatar.png" alt=""> -->
              <up-avatar v-else :size="24" src="" />
            </div>
            <div class="text-elli w-200 text-32 text-#2F384C">
              {{ item.name }}
            </div>
          </div>
          <div class="m-t-16 flex items-center justify-between">
            <div class="text-28 text-#999999">
              年龄
            </div>
            <div class="text-28 text-#2F384C">
              {{ item.age }}
            </div>
          </div>
          <div class="m-b-16 m-t-16 b-b-1 b-b-#DCDCDC b-b-solid" />
          <div class="flex items-center justify-between">
            <div class="text-28 text-#999999">
              性别
            </div>
            <div class="text-28 text-#2F384C">
              {{ item.gender === 1 ? '女' : '男' }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </z-popup>
</template>

<script setup lang='ts'>
import dayjs from 'dayjs';
import { ab2hex } from '@/utils';
import { validForm } from '@/utils/helper';
import useDeviceStore from '@/store/index';
import useMemberStore from '@/store/member';
import { qrcodePrefix } from '@/config/common.config';
import { WriteBleType, writeBLE } from '@/utils/ble';
import type { MemberInfoList } from '@/api/member/type';
import { addMember, getMember, register2Service } from '@/api/member';

const deviceStore = useDeviceStore();
const memberStore = useMemberStore();

interface IFormData {
  [key: string]: string | number | boolean | null;
}

const curDate = dayjs().valueOf();
const maxDate = dayjs().valueOf();
const minDate = dayjs().subtract(100, 'year').month(0).date(1).valueOf();
const formData = ref<IFormData>({
  name: null,
  gender: 2,
  birth: null,
  uuid: null,
});

const columns = ref([
  ['男', '女'],
]);

const birthString = ref<string>('');
const sex = ref<string>('');

const activeUserIndex = ref<number>(0); // 当前选中成员下标
const activeMember = ref<MemberInfoList | null>(null); // 当前选中成员
const scanFormData = ref<any>({}); // 扫码后的数据
const memberList = ref<MemberInfoList[]>([]); // 成员列表

const userPopup = ref<boolean>(false); // 选择成员POP
const addMemberPopup = ref<boolean>(false);
const scanValidModel = ref<boolean>(false); // 扫码后的有效弹窗
const genderPickerShow = ref<boolean>(false);
const scanInvalidModel = ref<boolean>(false); // 扫码后的无效弹窗
const birthdayPickerShow = ref<boolean>(false);
const inValidUserMemberModel = ref<boolean>(false); // 扫码后非您名下成员

// 获取成员
const getMemberList = async () => {
  const res = await getMember({ belongto: uni.getStorageSync('uuid') });
  memberStore.setMemberList(res);
  memberList.value = res;
};

onMounted(async () => {
  await writeBLE(WriteBleType.end, 'end');
  activeMember.value = memberStore.getMemberInfo;
  await getMemberList();
});

onShow(() => {
  memberList.value = memberStore.getMemberList;
  activeMember.value = memberStore.getMemberInfo;
});

// 登记到设备中
const register2Device = async (member: MemberInfoList) => {
  const { uuid } = member;
  if (!uuid)
    return;
  let userId1 = '';
  let userId2 = '';
  let userId3 = '';
  let userId4 = '';
  try {
    uni.showLoading({ title: '登记中', mask: true });
    const str = uuid.replace(/[\->/]|\?\]/g, '');
    userId1 = await writeBLE(WriteBleType.USERID, str.slice(0, 16));
    setTimeout(async () => {
      userId2 = await writeBLE(WriteBleType.USERID2, str.slice(-16));
    }, 100);
    uni.onBLECharacteristicValueChange(({ value }) => {
      const hex = ab2hex(value);
      if (hex?.startsWith('aa05')) {
        userId3 = hex;
      }
      if (hex?.startsWith('aa10')) {
        userId4 = hex;
      }
    });

    setTimeout(async () => {
      if (userId1 === userId3 && userId2 === userId4) {
        // 登记到服务器  这里为什么没有给我返回这个用户的头像 avatarUrl: string
        const res = await register2Service({
          dev_sn: deviceStore.getName,
          pat_id: uuid,
        });
        if (res === '添加成功') {
          uni.showToast({ icon: 'none', title: '登记到设备成功' });
          memberStore.setMemberInfo(member);
          console.log('memberStore.getMemberInfo', memberStore.getMemberInfo);
          activeMember.value = member;
          scanValidModel.value = false;
        }
        else {
          uni.showToast({ icon: 'none', title: '登记到设备失败' });
        }
      }
      else {
        uni.showToast({ icon: 'none', title: '登记到设备失败' });
      }
    }, 300);
  }
  catch (error) {
    uni.showToast({ icon: 'none', title: '登记到设备失败' });
  }
};

const genderConfirm = ({ value }: { value: string[] }) => {
  console.log('点击了性别', value[0]);
  sex.value = value[0];
  genderPickerShow.value = false;
  addMemberPopup.value = true;
};
const userPopupClose = () => {
  userPopup.value = false;
};
const userPopupConfirm = async () => {
  userPopup.value = false;
  const member = memberList.value[activeUserIndex.value];
  console.log('点击了成员', member);

  await register2Device(member);
};
const activeUser = (item: any, index: number) => {
  // console.log('activeUser', item, index);
  activeUserIndex.value = index;
};
const genderCancel = () => {
  genderPickerShow.value = false;
  addMemberPopup.value = true;
};
const handleSexClick = () => {
  genderPickerShow.value = true;
  addMemberPopup.value = false;
};
const handleDateClick = () => {
  birthdayPickerShow.value = true;
  addMemberPopup.value = false;
};
const birthdayConfirm = ({ value }: { value: string }) => {
  console.log('点击了日期', value);
  formData.value.birth = `${value}`;
  const formattedValue = dayjs(value).format('YYYY-MM-DD');
  birthString.value = formattedValue;
  birthdayPickerShow.value = false;
  addMemberPopup.value = true;
};
const birthdayCancel = () => {
  birthdayPickerShow.value = false;
  addMemberPopup.value = true;
};
const closeAddMemberPopup = () => {
  addMemberPopup.value = false;
  formData.value.name = '';
  sex.value = '';
  birthString.value = '';
};

const handleNameChange = (value: any) => {
  formData.value.name = value.detail.value;
};

// 扫码快捷添加成员
const scanCode = () => {
  uni.scanCode({
    onlyFromCamera: false,
    success: async (res) => {
      const arr = res.result.split('?');
      console.log(memberList.value, arr[1]);
      const hasSave = memberList.value.findIndex(item => item.uuid === arr[1]);
      if (hasSave === -1) {
        // 扫码后非您名下成员
        inValidUserMemberModel.value = true;
        return;
      }
      if (arr[0] !== qrcodePrefix) {
        inValidUserMemberModel.value = true;
        return;
      }
      const member = memberList.value[hasSave];
      console.log(member);
      scanFormData.value.age = member.age!;
      scanFormData.value.name = member.name;
      scanFormData.value.gender = member.gender === 0 ? '男' : '女';
      scanFormData.value.uuid = member.uuid;
      activeMember.value = member;
      memberStore.setMemberInfo(member);
      scanValidModel.value = true;
    },
  });
};

const addMemberConfirm = async () => {
  for (const item of memberList.value) {
    if (item.name === formData.value.name) {
      uni.showToast({ title: '该成员已存在', icon: 'none', duration: 2000 });
      return;
    }
  }
  uni.showLoading({ title: '保存中', mask: true });
  console.log('点击了保存', sex.value.length);
  if (!sex.value.length) {
    uni.showToast({ icon: 'none', title: '请选择性别' });
    return;
  }
  formData.value.gender = sex.value === '男' ? 0 : 1;
  console.log('点击了保存', formData.value);
  if (!validForm(formData.value))
    return;
  formData.value.belongto = uni.getStorageSync('uuid');
  const ans = await addMember(formData.value);
  console.log('保存结果', ans);
  uni.hideLoading();
  if (ans.code === 'NG') {
    uni.showToast({ title: ans.message, icon: 'none' });
  }
  else {
    uni.showToast({ title: '保存成功', icon: 'none' });
  }
  addMemberPopup.value = false;
  await getMemberList();
};

const registerOfScan = () => {
  scanValidModel.value = false;
  register2Device(scanFormData.value);
};
const handleAdd = () => {
  if (memberList.value && memberList.value.length >= 5) {
    uni.showToast({ title: '当前家庭成员数量已达到5人上限', icon: 'none', duration: 3000 });
    return;
  }
  console.log('点击了添加成员');
  addMemberPopup.value = true;
};
</script>

<style scoped lang='scss'>
.grid-container{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18rpx;

  .grid-item{
    padding: 24rpx;
    width: 100%;
    background: #F2F5F9;
    border: 2rpx solid #DCDCDC;
    border-radius: 8rpx;
    box-shadow: 0rpx 8rpx 16rpx 0rpx rgb(79 149 255 / 20%);
    box-sizing: border-box;
  }

  .active {
    background: #FFF;
    border: 2rpx solid #4F95FF;
  }
}

.box{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 24rpx;
  margin-bottom:24rpx;
  width: 100%;
  height: 80rpx;
  background: #FFF;
  border-radius: 16rpx;
  box-sizing: border-box;
}
</style>
