<template>
  <u-navbar title="记录" placeholder autoBack border bgColor="rgb(239,243,248)" />
  <div class="tabs-wrap">
    <up-tabs
      :lineHeight="2" :activeStyle="{ color: '#4F95FF', fontSize: '28rpx' }" :lineWidth="58"
      :inactiveStyle="{ color: '#999999', fontSize: '28rpx' }"
      :lineColor="`${'#4F95FF'}`" :current="currentIndex" :list="tablist" :scrollable="false" @click="handleClickTabs"
    />
  </div>
  <div v-if="currentIndex === 1 && waitUploadList.length > 0" class="px-20">
    <div v-if="isClickManage" class="my-20 flex justify-between">
      <div class="text-28 text-#2F384C" @click="selectAll">
        {{ isSelectAll ? '取消全选' : '全选' }}
      </div>
      <div class="text-28 text-#2F384C" @click="cancelManage">
        取消
      </div>
    </div>
    <div v-if="!isClickManage" class="my-24 flex justify-between">
      <div class="text-28 text-#999999">
        共计{{ waitUploadList.length }}条数据
      </div>
      <div class="flex items-center gap-8" @click="manageRecord">
        <img src="/static/images/manager-icon.png" alt="" class="size-20">
        <div class="text-28rpx text-#4F95FF">
          多选
        </div>
      </div>
    </div>
    <div v-for="v in waitUploadList" :key="v.id" class="record-item relative m-b-24 ml-auto" :style="{ width: `${tempWidth}px` }">
      <div class="choose-wrap" :class="{ 'choose-active': v.isSelect }" @click="chooseRecord(v)" />
      <div class="m-b-24 border-rd-20 bg-white p-20">
        <div class="my-10 flex justify-between">
          <div class="flex items-center justify-between gap-8">
            <img v-if="v.avatarUrl" :src="v.avatarUrl" class="h-48 w-48" alt="">
            <up-avatar v-else src="" :size="27" />
            <div>{{ v.pat_name }}</div>
          </div>
          <div class="flex gap-14">
            <div v-if="!v.exit" class="lost flex-center">
              数据丢失
            </div>
            <div :class="{ break: v.status === '03', fail: v.status === '02', error: v.status === '05', disconnected: v.status === '06' }" class="flex-center">
              {{ v.status === '02' ? '上传失败' : v.status === '03' ? '蓝牙中断' : v.status === '05' ? '异常断开' : '手动断开' }}
            </div>
          </div>
        </div>
        <div class="my-24">
          <up-line color="#DCDCDC" />
        </div>
        <div class="my-20 flex justify-between">
          <div class="flex items-center gap-8">
            <img src="/static/images/timer-icon.png" class="size-32" alt="">
            <div class="text-28 text-#999999">
              时长
            </div>
          </div>
          <div class="text-28 text-#2F384C">
            {{ Math.floor(v.duration / 60) }}分钟
          </div>
        </div>
        <div class="my-20 flex justify-between">
          <div class="flex items-center gap-8">
            <img src="/static/images/timer-icon.png" class="size-32" alt="">
            <div class="text-28 text-#999999">
              开始时间
            </div>
          </div>
          <div class="text-28 text-#2F384C">
            {{ dayjs(Number(v.collect_sta_tm)).format('YYYY-MM-DD HH:mm:ss') }}
          </div>
        </div>
        <div class="my-24">
          <up-line color="#DCDCDC" />
        </div>
        <div class="flex justify-end gap-20">
          <div class="del-btn flex-center" @click="removeRecordItem(v)">
            删除记录
          </div>
          <div v-if="v.exit" class="success-btn flex-center" @click="uploadRecordItem(v)">
            继续上传
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectItems.length > 0" class="btn-wrap">
      <div class="b-btn1 flex-center" @click="removeAll">
        全部删除
      </div>
      <div class="b-btn2 flex-center" @click="uploadAll">
        全部上传
      </div>
    </div>
    <div class="empty" />
  </div>
  <div v-if="currentIndex === 1 && waitUploadList.length === 0" class="px-20">
    <div class="w-full flex-center">
      <img src="/static/images/empty.png" alt="" class="size-480">
    </div>
    <div class="text-center text-39 text-#999999">
      暂无记录
    </div>
  </div>
  <div v-if="currentIndex === 2 && invalidList.length > 0" class="px-20">
    <div class="my-20 flex justify-between">
      <div>共 {{ invalidList.length }} 条</div>
      <div class="flex items-center gap-8">
        <img src="/static/images/delete-icon.png" class="size-20" alt="">
        <div class="text-28 text-#FF3F3F" @click="removeAllInvalid">
          清空
        </div>
      </div>
    </div>
    <div v-for="v in invalidList" :key="v.id" class="m-b-24 border-rd-20rpx bg-white p-20">
      <div class="flex items-center justify-between gap-8">
        <img src="/static/home/user-avatar.png" class="h-48 w-48" alt="">
        <div>{{ v.pat_name }}</div>
      </div>
      <div class="my-24">
        <up-line color="#DCDCDC" />
      </div>
      <div class="my-20 flex justify-between">
        <div class="flex items-center gap-8">
          <img src="/static/images/timer-icon.png" class="size-32" alt="">
          <div class="text-28 text-#999999">
            时长
          </div>
        </div>
        <div class="text-28 text-#2F384C">
          {{ Math.floor(v.duration / 60) }}分钟
        </div>
      </div>
      <div class="my-20 flex justify-between">
        <div class="flex items-center gap-8">
          <img src="/static/images/timer-icon.png" class="size-32" alt="">
          <div class="text-28 text-#999999">
            开始时间
          </div>
        </div>
        <div class="text-28 text-#2F384C">
          {{ dayjs(Number(v.collect_sta_tm)).format('YYYY-MM-DD HH:mm:ss') }}
        </div>
      </div>
      <div class="my-24">
        <up-line color="#DCDCDC" />
      </div>
      <div class="flex justify-end">
        <div class="del-btn flex-center" @click="removeRecordItem(v)">
          删除记录
        </div>
      </div>
    </div>
  </div>
  <div v-if="currentIndex === 2 && invalidList.length === 0" class="px-20">
    <div class="w-full flex-center">
      <img src="/static/images/empty.png" alt="" class="size-480">
    </div>
    <div class="text-center text-39 text-#999999">
      暂无记录
    </div>
  </div>
</template>

<script setup lang='ts'>
import dayjs from 'dayjs';
import useRecordStore from '@/store/record';
import { updateCollectionRecord, uploadEcgBinaryData } from '@/api/ecg';
import { checkFileIsExist, readFile, removeFile } from '@/utils/ble';
import { removeAllInvalidList } from '@/api/incident';
import type { GetRecordListResult } from '@/api/record/types';
import { deleteRecord, getRecordList, setRecordRead } from '@/api/record';
import type { IUploadEcgRecord } from '@/api/ecg/types';
import { CollectionStatus } from '@/config/ecg.config';

const recordStore = useRecordStore();

const tablist = ref([
  { name: '', disabled: true },
  { name: '待上传' },
  { name: '无效数据' },
  { name: '', disabled: true },
]);

const currentIndex = ref<number>(1);

const isSelectAll = ref<boolean>(false); // 是否全选
const isClickManage = ref<boolean>(false);

const tempWidth = ref<number | null>(null);
const initializeWidth = ref<number | null>(null);
const waitUploadList = ref<GetRecordListResult[]>([]); // 待上传
const invalidList = ref<GetRecordListResult[]>([]); // 无效数据
const selectItems = ref<string[]>([]);

const initPageData = async () => {
  waitUploadList.value = [];
  invalidList.value = [];
  const data = await getRecordList({ accid: uni.getStorageSync('uuid') });
  for (const v of data) {
    v.isSelect = false;
    const exit = await checkFileIsExist(v.collectid);
    if (exit) {
      v.exit = true;
    }
    else {
      v.exit = false;
    }
    if (v.status === '02' || v.status === '03' || v.status === '05' || v.status === '06') {
      waitUploadList.value.push(v);
    }
    else if (v.status === '04') {
      invalidList.value.push(v);
    }
  }
};

onShow(async () => {
  recordStore.setUnreadMessage(false);
  console.log('recordStore.getHasUnreadMessage', recordStore.getHasUnreadMessage);
  await setRecordRead({ accid: uni.getStorageSync('uuid') });
  // 不延迟拿不到DOM
  setTimeout(() => {
    const query = uni.createSelectorQuery();
    query.select('.record-item').boundingClientRect();
    query.exec((res) => {
      initializeWidth.value = res[0].width;
      tempWidth.value = initializeWidth.value;
    });
  }, 400);

  await initPageData();
});

const removeAll = () => {
  if (selectItems.value.length === 0) {
    uni.showToast({ title: '请选择要删除的数据', icon: 'none' });
  }
  else {
    uni.showModal({
      title: '提示',
      content: '确定要删除选中的数据吗？',
      success: async (res) => {
        if (res.confirm) {
          const PendingUploadList: any = [];
          // selectItems.value.forEach((v) => {
          //   console.log(v);
          //   PendingUploadList.push(deleteRecord({ collectid: v }));
          // });
          // Promise.all(PendingUploadList)
          //   .then(() => {
          //     initPageData();
          //     isClickManage.value = false;
          //     selectItems.value.length = 0;
          //     uni.showToast({
          //       title: '删除成功',
          //     });
          //   })
          //   .catch(() => {
          //     uni.showToast({
          //       icon: 'none',
          //       title: '服务器异常',
          //     });
          //   });
          for (const v of selectItems.value) {
            console.log(v);
            PendingUploadList.push(deleteRecord({ collectid: v }));
          }
          try {
            await Promise.all(PendingUploadList);
            await initPageData();
            isClickManage.value = false;
            selectItems.value.length = 0;
            uni.showToast({
              title: '删除成功',
            });
          }
          catch (error) {
            uni.showToast({
              icon: 'none',
              title: '服务器异常',
            });
          }
        }
        else if (res.cancel) {
          console.log('用户点击取消');
        }
      },
    });
  }
};

const uploadAll = async () => {
  if (selectItems.value.length === 0) {
    uni.showToast({ title: '请选择要上传的数据', icon: 'none' });
  }
  else {
    uni.showLoading({ title: '上传中' });
    const PendingUploadList: any = []; // 上传数据
    const PendingUploadList2: any = []; // 修改状态
    for (const v of selectItems.value) {
      const buffer = await readFile(v);
      if (!buffer) {
        PendingUploadList.push(deleteRecord({ collectid: v }));
      }
      else {
        removeFile(v);
        const item = waitUploadList.value.filter(item => item.collectid === v);
        const header = {
          patid: item[0].pat_id,
          starttime: item[0].collect_sta_tm,
          duration: item[0].duration,
        };
        PendingUploadList.push(uploadEcgBinaryData({ buffer, ...header }));
        PendingUploadList2.push(updateCollectionRecord({
          collect_sta_tm: item[0].collect_sta_tm,
          pat_id: item[0].pat_id,
          status: CollectionStatus.SUCCESS,
          duration: item[0].duration,
          collectid: item[0].collectid,
        }));
      }
    }

    Promise.all(PendingUploadList)
      .then(async () => {
        isClickManage.value = false;
        selectItems.value.length = 0;

        await Promise.all(PendingUploadList2);
        await initPageData();
        uni.showToast({ title: '上传成功', icon: 'none' });
      })
      .catch(() => {
        // uni.hideLoading();
        uni.showToast({ icon: 'none', title: '服务器异常' });
      });
  }
};

const removeRecordItem = (v: GetRecordListResult) => {
  uni.showModal({
    title: '提示',
    content: '确定要删除该数据吗？',
    success: async (res) => {
      if (res.confirm) {
        await deleteRecord({ collectid: v.collectid }).then(async () => {
          await initPageData();
          uni.showToast({ icon: 'none', title: '删除成功' });
        });
        console.log('用户点击确定');
      }
      else if (res.cancel) {
        console.log('用户点击取消');
      }
    },
  });
};

const uploadRecordItem = async (v: GetRecordListResult) => {
  console.log(v.collectid);
  const buffer = await readFile(v.collectid);
  if (!buffer) {
    uni.showToast({ title: '您的数据已丢失~', icon: 'none' });
    // 删除这条记录
    await deleteRecord({ collectid: v.collectid }).then(async () => {
      await initPageData();
    });
    return;
  }
  uni.showLoading({ title: '上传中' });
  const header = {
    patid: v.pat_id,
    starttime: v.collect_sta_tm,
    duration: v.duration,
  };
  const res = await uploadEcgBinaryData({ buffer, ...header });
  if (res.code !== 'NG') {
    const data: IUploadEcgRecord = {
      collect_sta_tm: v.collect_sta_tm,
      pat_id: v.pat_id,
      status: CollectionStatus.SUCCESS,
      duration: v.duration,
      collectid: v.collectid,
    };
    const { code } = await updateCollectionRecord(data);
    if (code === 'OK') {
      setTimeout(async () => {
        uni.showToast({ title: '上传成功', icon: 'none' });
        await initPageData();
      }, 2000);
    }
    else {
      await deleteRecord({ collectid: v.collectid }).then(async () => {
        await initPageData();
      });
      uni.showToast({ icon: 'none', title: '上传失败' });
    }
  }
};

const pushSelectItems = (id: string) => {
  if (selectItems.value.includes(id)) {
    selectItems.value = selectItems.value.filter(v => v !== id);
  }
  else {
    selectItems.value.push(id);
  }
};

const removeAllInvalid = async () => {
  uni.showModal({
    title: '提示',
    content: '确定要删除所有无效数据吗？',
    success: async (res) => {
      if (res.confirm) {
        await removeAllInvalidList({ accid: uni.getStorageSync('uuid') }).then(async () => {
          await initPageData();
          uni.showToast({ icon: 'none', title: '删除成功' });
        });
        console.log('用户点击确定');
      }
      else if (res.cancel) {
        console.log('用户点击取消');
      }
    },
    fail: () => {
      console.log('fail');
    },
  });
};

const handleClickTabs = ({ index }: { index: number }) => {
  if (index === 1) {
    currentIndex.value = index;

    // 待上传
  }
  else if (index === 2) {
    currentIndex.value = index;

    // 无效数据
  }
};
// 出发宽度变化事件
const manageRecord = () => {
  tempWidth.value = initializeWidth.value! * 0.9;
  isClickManage.value = true;
};
const selectAll = () => {
  if (isSelectAll.value) {
    waitUploadList.value.forEach((v) => {
      v.isSelect = false;
      // pushSelectItems(v.collectid);
    });
    selectItems.value.length = 0;
    isSelectAll.value = false;
  }
  else {
    waitUploadList.value.forEach((v) => {
      if (v.exit) {
        v.isSelect = true;
        pushSelectItems(v.collectid);
      }
    });
    if (selectItems.value.length > 0) {
      isSelectAll.value = true;
    }
    else {
      uni.showToast({ title: '您暂无可上传的数据~', icon: 'none' });
    }
  }
};
const cancelManage = () => {
  waitUploadList.value.forEach((v) => {
    v.isSelect = false;
  });
  selectItems.value.length = 0;
  tempWidth.value = initializeWidth.value;
  isClickManage.value = false;
  isSelectAll.value = false;
};

const chooseRecord = (item: GetRecordListResult) => {
  if (!item.exit) {
    uni.showToast({ title: '该数据已丢失~', icon: 'none' });
    return;
  }
  item.isSelect = !item.isSelect;
  pushSelectItems(item.collectid);
  if (selectItems.value.length === waitUploadList.value.length) {
    isSelectAll.value = true;
  }
  else {
    isSelectAll.value = false;
  }
};
</script>

<style scoped lang='scss'>
.empty{
  width:100%;
  height: 150rpx
  // m-t-80 flex items-center justify-between
}

.btn-wrap{
  position: fixed;
  bottom: 80rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: calc(100vw - 48rpx);

}

.b-btn1{
  width: 342rpx;
  height: 80rpx;
  color: #FF3F3F;
  background: rgb(255 63 63 / 10%);
  border-radius: 16rpx;
}

.b-btn2{
  width: 342rpx;
  height: 80rpx;
  color: #FFF;
  background: #4F95FF;
  border-radius: 16rpx;
}

.del-btn{
  padding: 16rpx 8rpx;
  width: 144rpx;
  height: 58rpx;
  font-size: 28rpx;
  color: white;
  background: #FF3F3F;
  border-radius: 8rpx;
  box-sizing: border-box;
}

.success-btn{
  padding: 16rpx 8rpx;
  width: 144rpx;
  height: 58rpx;
  font-size: 28rpx;
  color: white;
  background: #4F95FF;
  border-radius: 8rpx;
  box-sizing: border-box;
}

.tabs-wrap{
  top: 50%;
  padding: 0 20rpx;
}

.tabs-wrap::after{
  display: block;
  margin-top: -3px;
  width: 100%;
  height: 2px;
  background-color: #ccc;
  content: '';
}

.choose-wrap{
  position: absolute;
  top: 50%;
  left: -7%;
  display: block;
  width: 40rpx;
  height: 40rpx;
  border: 1px solid #6495ED;
  border-radius: 10rpx;
  transform: translate(-50%, -50%);
}

.choose-active::after{
  content: '\2713';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #6495ED;
}

.record-item{
  transition: width 0.5s ease;
}

.fail{
  padding: 8rpx 4rpx;
  width: 112rpx;
  height: 44rpx;
  font-size: 24rpx;
  color: #FF3F3F;
  background: rgb(255 63 63 / 10%);
  border-radius: 8rpx;
  box-sizing: border-box;
  line-height: 36rpx;
}

.break{
  padding: 8rpx 4rpx;
  width: 112rpx;
  height: 44rpx;
  font-size: 24rpx;
  color: #FD7F18;
  background: rgb(253 127 24 / 10%);
  border-radius: 8rpx;
  box-sizing: border-box;
  line-height: 36rpx;
}

.lost{
  padding: 8rpx 4rpx;
  width: 112rpx;
  height: 44rpx;
  font-size: 24rpx;
  color: #999999;
  background: rgba(153,153,153,0.1);
  border-radius: 8rpx;
  box-sizing: border-box;
  line-height: 36rpx;
}

.error{
  padding: 8rpx 4rpx;
  width: 112rpx;
  height: 44rpx;
  font-size: 24rpx;
  color: #FD18CF;
  background: rgb(253 24 207 / 10%);
  border-radius: 8rpx;
  box-sizing: border-box;
  line-height: 36rpx;
}

.disconnected{
  padding: 8rpx 4rpx;
  width: 112rpx;
  height: 44rpx;
  font-size: 24rpx;
  color: #ff2768;
  background: rgba(255, 28, 96, 0.1);
  border-radius: 8rpx;
  box-sizing: border-box;
  line-height: 36rpx;
}
</style>
