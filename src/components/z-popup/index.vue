<template>
  <div>
    <up-popup :show="props.show" :round="10" mode="bottom">
      <div class="p-30">
        <div class="header flex items-center justify-between">
          <span class="text-32 text-#2F384C">{{ props.title }}</span>
          <div v-if="showCloseBtn" class="size-80 flex-center" @click="close">
            <up-icon name="close" />
          </div>
        </div>
        <slot />
        <div class="flex gap-16" :style="{ marginTop: `${props.mt}rpx` }">
          <div
            v-if="props.isShowCancel" class="cancel-btn flex-center text-#4F95FF"
            :style="{ color: props.cancelBtnColor, borderColor: props.cancelBtnColor }" @click="handleCancel"
          >
            {{ props.cancelText }}
          </div>
          <div v-if="props.isShowConfirm" class="confirm-btn flex-center text-white" @click="handleConfirm">
            {{ props.confirmText }}
          </div>
        </div>
      </div>
    </up-popup>
  </div>
</template>

<script setup lang='ts'>
interface IProps {
  title?: string;
  show?: boolean;
  cancel?: () => void;
  confirm?: () => void;
  close?: () => void;
  round?: number;
  mode?: string;
  cancelText?: string;
  confirmText?: string;
  isShowCancel?: boolean;
  cancelBtnColor?: string;
  mt?: number;
  showCloseBtn?: boolean;
  isShowConfirm?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  title: '',
  show: false,
  cancel: () => {},
  confirm: () => {},
  close: () => {},
  round: 0,
  mode: 'bottom',
  cancelText: '取消',
  confirmText: '确定',
  isShowCancel: true,
  isShowConfirm: true,
  cancelBtnColor: '#4F95FF',
  mt: 0,
  showCloseBtn: true,
});

const emit = defineEmits(['cancel', 'confirm', 'close']);

const handleCancel = () => {
  emit('cancel');
};

const handleConfirm = () => {
  emit('confirm', true);
};

const close = () => {
  emit('close');
};
</script>

<style scoped lang='scss'>
.cancel-btn{
  height: 80rpx;
  border: 2rpx solid #4F95FF;
  border-radius: 16rpx;
  flex:1;
}

.confirm-btn{
  height: 80rpx;
  background: #4F95FF;
  border-radius: 16rpx;
  flex: 1;
}
</style>
