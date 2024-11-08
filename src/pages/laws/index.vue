<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
  <u-navbar :title="title" autoBack placeholder bg-color="#F2F5F9" />
  <view class="home">
    <view class="box">
      <view class="content" v-html="html" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app';

import { ref } from 'vue';
import { getLaws } from '@/api/user';

const title = ref('');
const html = ref('');

onLoad(async (option: any) => {
  title.value = option?.type === 'privacy' ? '用户协议' : '隐私政策';
  const filename = option?.type === 'privacy' ? 'coll-privacy-user-app' : 'coll-terms-user-app';
  const content = await getLaws(filename);
  html.value = content;
});
</script>

<style lang="scss" scoped>
.home{
  position: fixed;
  width: 100%;
  height: 100%;

  .box{
    overflow: auto;
    width: 100%;
    height: 90%;

    .content{
      padding: 15px;
      font-size: 14px;
      color: #333;
    }
  }
}
</style>
