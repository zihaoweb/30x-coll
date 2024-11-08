<script setup lang="ts">
import { mpUpdate } from '@/utils/index';

onLaunch((params: any) => {
  console.log('App Launch');
  mpUpdate();
  if (uni.getStorageSync('from') === 'user') {
    uni.removeStorageSync('from');
    return;
  }
  params.from && uni.setStorageSync('from', params.from);
  console.log('params', params);
});
onShow(() => {
  console.log('App Show');
});
onHide(() => {
  console.log('App Hide');
});
</script>

<style lang="scss">
/* 每个页面公共css */
@import 'uview-plus/index.scss';
@import '@/static/styles/common.scss';
</style>
