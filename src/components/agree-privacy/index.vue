<template>
  <u-popup :show="modelValue" round="20" @close="closeAgreePrivacy">
    <div class="p-30">
      <div class="text-black font-bold">
        <span>{{ initTitle }}</span>
      </div>

      <div class="flex flex-col">
        <span class="pt-30 text-black font-bold">{{ initSubTitle }}</span>
        <span class="pt-30 text-black">1.为向您提供基本的服务，我们会遵循正当、合法、必要的原则收集和使用必要的信息。</span>
        <span class="pt-30 text-black">2.基于您的授权我们可能会收集和使用您的相关信息，您有权拒绝或取消授权。</span>
        <span class="pt-30 text-black">3.未经您的授权同意，我们不会将您的信息共享给第三方或用于您未授权的其他用途。</span>
        <span class="pt-30 text-black">4.详细信息请您完整阅读<text class="text-decoration" @click="openPrivacyContract">{{
          initPrivacyContractName
        }}</text></span>
      </div>

      <div class="mt-30 flex items-center justify-around pt-10">
        <div style="min-width: 100px">
          <button class="button button-default" @click="disagree">
            拒绝
          </button>
        </div>
        <div style="min-width: 100px">
          <button
            :id="agreePrivacyId"
            class="button button-primary"
            open-type="agreePrivacyAuthorization"
            @agreeprivacyauthorization="agree"
          >
            同意
          </button>
        </div>
      </div>
    </div>
  </u-popup>
</template>

<script setup lang="ts">
interface AgreePrivacyProps {
  modelValue: boolean;
  // 标题
  title: string;
  // 副标题
  subTitle: string;
  // 禁止自动检测隐私
  disableCheckPrivacy: boolean;
  // 按钮id 必填项不填写时授权按钮id必须为agree-btn
  agreePrivacyId: string;
}

const props = withDefaults(defineProps<AgreePrivacyProps>(), {
  modelValue: false,
  title: '',
  subTitle: '',
  disableCheckPrivacy: true,
  agreePrivacyId: 'agree-btn',
});

const emit = defineEmits(['update:modelValue', 'needPrivacyAuthorization', 'agree', 'disagree']);
const initTitle = ref<string>('隐私政策概要');
const initSubTitle = ref<string>('');
const initPrivacyContractName = ref<string>('隐私政策');

function openAgreePrivacy() {
  emit('update:modelValue', true);
}

function closeAgreePrivacy() {
  emit('update:modelValue', false);
}

function initData() {
  initTitle.value = props.title || initTitle.value;
  initSubTitle.value
    = props.subTitle
    || `亲爱的用户，感谢您一直以来的支持!为了更好地保护您的权益，同时遵守相关监管要求，请认真阅读${initPrivacyContractName.value}，特向您说明如下:`;
}

function checkPrivacySetting() {
  wx.getPrivacySetting({
    success: (res: any) => {
      // 未授权弹框
      if (res.needAuthorization) {
        initPrivacyContractName.value = res.privacyContractName;
        initData();
        // 是否禁用 自动检测隐私并弹框
        if (!props.disableCheckPrivacy) {
          // 需要弹出隐私协议
          openAgreePrivacy();
        }
      }
      else {
        // 用户已经同意过隐私协议，所以不需要再弹出隐私协议，也能调用已声明过的隐私接口
        // wx.getUserProfile()
      }
    },
    fail: (e: any) => {
      console.log(e);
    },
  });
}
// 打开隐私政策
function openPrivacyContract() {
  wx.openPrivacyContract({
    success: () => {}, // 打开成功
    fail: (e: any) => {
      uni.$u.toast(`打开失败:${e}`);
    }, // 打开失败
  });
}

// 同意
function agree(e: any) {
  const buttonId = e.target.id || 'agree-btn';
  emit('agree', buttonId);
  emit('update:modelValue', false);
}

// 拒绝
function disagree() {
  emit('disagree');
  closeAgreePrivacy();
}

onMounted(() => {
  // 检测是否授权
  checkPrivacySetting();

  // // 监听授权
  // wx.onNeedPrivacyAuthorization((resolve, eventInfo) => {
  //   emit('update:modelValue', true);
  //   // 回调
  //   emit('needPrivacyAuthorization', resolve, eventInfo);
  // });
});
</script>

<style scoped lang="scss">
.button {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  //height: 80;
  padding: 10px 20px;
  font-size: 14px;
  text-align: center;
  text-decoration: none;
  color: #fff;
  border-radius: 18rpx;
  box-sizing: border-box;
  flex-direction: row;
  font-weight: 500;
  line-height: 1.5;
  //border-width: 1px;
  //border-style: solid;
}

.button-lg {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  //height: 80rpx;
  padding: 12px 22px;
  font-size: 14px;
  text-align: center;
  text-decoration: none;
  color: #fff;
  border-radius: 20rpx;
  box-sizing: border-box;
  flex-direction: row;
  font-weight: 700;
  line-height: 1.5;
  //border-width: 1px;
  //border-style: solid;
}

.button-default {
  color: #07c160;
  background-color: rgb(0 0 0 / 5%);
}

.button-primary {
  color: #fff;
  background-color: #07c160;
}

button {
  padding: 0;
  margin: 0;
  background-color: transparent;
  border-radius: 0;
  outline: none;
  line-height: inherit;
}

button::after {
  border: none;
}

.text-decoration {
  text-decoration: underline;
  color: #07c160;
}
</style>
