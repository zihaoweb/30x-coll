<template>
  <div class="z-input w-full flex items-center" :style="{ height: `${props.height}rpx` }">
    <div class="h-full w-150 flex items-center p-l-20" :style="{ color: props.titleColor }" @click="handleClick">
      {{ props.title }}
    </div>
    <div class="h-full flex flex-1 gap-10">
      <input :value="value" class="z-input h-full flex-1" :placeholder="props.placeholder" :disabled="props.disabled" :maxlength="props.maxlength" @click="emit('click')" @input="emit('input', $event)">
      <u-icon :name="props.icon" />
    </div>
  </div>
</template>

<script setup lang='ts'>
interface IProps {
  title?: string;
  titleColor?: string;
  placeholder?: string;
  icon?: string;
  height?: number;
  disabled?: boolean;
  maxlength?: number;
}

const props = withDefaults(defineProps<IProps>(), {
  title: '',
  titleColor: '',
  placeholder: '',
  icon: '',
  height: 80,
  disabled: false,
  maxlength: 300,
});

const emit = defineEmits(['click', 'choose', 'input']);

const handleClick = (e: any) => {
  emit('choose', e);
};

const value = defineModel('value');
</script>

<style>
.z-input {
  border-bottom: 1px solid #e5e5e5;
  text-align: right;
}
</style>
