<template>
  <!-- 自定义导航 -->
  <u-navbar leftIcon="" placeholder border bg-color="#F2F5F9">
    <template #left>
      <div class="text-32 text-#2F384C">
        心电图
      </div>
    </template>
  </u-navbar>

  <div class="device mx-24 m-t-24 h-270 flex-center">
    <div class="m-r-16 flex flex-1 justify-end">
      <img v-if="!isCollection" src="/static/images/notdevice.png" alt="" class="h-240 w-180">
      <img v-else-if="isCollection && connectDeviceType.includes('301')" src="/static/home/icon-301b.png" alt="" class="h-240 w-180">
      <img v-else-if="isCollection && connectDeviceType === '302'" src="/static/home/302.jpg" alt="" class="h-240 w-180">
    </div>
    <div class="w-[50%]">
      <div class="flex-col items-start">
        <div class="device-title-name">
          {{ isCollection ? connectDeviceType : '暂无设备连接' }}
        </div>
        <div
          v-if="isCollection"
          :style="{ backgroundColor: 'rgba(255, 63, 63, 0.1)' }"
          class="collect-btn flex-center text-#FF3F3F"
          @click="disconnect"
        >
          断开连接
        </div>
        <div v-else :style="{ backgroundColor: 'rgba(79, 149, 255, 0.1)' }" class="collect-btn flex-center text-#4F95FF" @click="searchBluetooth">
          {{ reconnect ? '重新连接' : '连接设备' }}
        </div>
      </div>
    </div>
  </div>

  <!-- card info -->
  <div class="relative mx-20rpx m-t-24">
    <up-row v-if="connectDeviceType !== '301B'" gutter="10" customStyle="margin-bottom: 10px">
      <up-col span="6" @click="clickUserCard">
        <div id="userinfo" class="container">
          <div class="flex-col">
            <div class="flex-center gap-8 text-32 lh-48" :style="{ color: (registerMember?.name && isCollection) ? '#4F95FF' : '#999999' }">
              <div v-if="notYourMember" class="text-elli max-w-260 text-#4F95FF">
                非你名下成员
              </div>
              <div v-else class="text-elli max-w-260">
                {{ (registerMember?.name && isCollection) ? registerMember?.name : '未登记成员' }}
              </div>
              <div v-if="registerMember?.name && isCollection && !notYourMember" class="flex-center">
                <img v-if="registerMember?.avatarUrl" :src="registerMember?.avatarUrl" alt="" class="h-32 w-32 b-rd-[50%]">
                <up-avatar v-else :size="16" src="" />
              </div>
            </div>
            <div class="m-t-4 text-24 text-#999999 lh-36">
              成员信息
            </div>
          </div>
          <div class="size-72 flex-center border-rd-[50%] bg-#F2F5F9">
            <img src="/static/home/user-icon.png" alt="" class="h-40 w-40">
          </div>
        </div>
      </up-col>
      <up-col span="6" @click="clickWiFiCard">
        <div id="userinfo" class="container">
          <div class="flex-col">
            <div class="flex items-center text-32rpx text-#4F95FF lh-48" :style=" { color: (isConnectedWiFi && WiFiName) ? '#4F95FF' : '#999999' }">
              {{ (isConnectedWiFi && WiFiName) ? WiFiName : '未连接网络' }}
            </div>
            <div class="m-t-4 text-24 text-#999999 lh-36">
              网络信息
            </div>
          </div>
          <div class="size-72 flex-center border-rd-[50%] bg-#F2F5F9">
            <up-icon name="wifi" :size="26" />
          </div>
        </div>
      </up-col>
    </up-row>
    <up-row gutter="10">
      <up-col span="6">
        <div id="userinfo" class="container">
          <div class="flex-col">
            <div class="flex items-center text-32rpx text-#2FC465 lh-48">
              {{ isCollection ? eletText : '--' }}
            </div>
            <div class="m-t-4 text-24 text-#999999 lh-36">
              当前电量
            </div>
          </div>
          <div class="size-72 flex-center border-rd-[50%] bg-#F2F5F9">
            <img src="/static/home/energy-icon.png" alt="" class="h-40 w-40">
          </div>
        </div>
      </up-col>
      <up-col span="6" @click="clickDeviceCard">
        <div id="userinfo" class="container">
          <div class="flex-col">
            <div class="flex items-center text-32rpx text-#4F95FF lh-48">
              {{ connectDeviceType || '--' }}
            </div>
            <div class="m-t-4 text-24 text-#999999 lh-36">
              设备信息
            </div>
          </div>
          <div class="size-72 flex-center border-rd-[50%] bg-#F2F5F9">
            <img src="/static/home/device-icon.png" alt="" class="h-40 w-40">
          </div>
        </div>
      </up-col>
    </up-row>
    <div v-if="notRegisterModel" class="guide absolute h-300 w-500" :style="{ top: guideTop, left: 0 }">
      <div class="m-t-64 text-center text-32 text-#2F384C lh-54">
        {{ notYourMember ? '当前设备登记成员非你名下' : '设备还未登记采集成员' }}
      </div>
      <div class="m-t-16 text-center text-24 text-#999999">
        登记成员明确设备采集数据归属
      </div>
      <div class="m-t-40 box-border flex gap-16 px-40">
        <div class="h-80 w-full flex-center b-1 b-#4F95FF b-rd-16 b-solid text-32 text-#4F95FF" @click="notRegisterConfirm">
          我知道了
        </div>
        <div class="h-80 w-full flex-center b-rd-16 bg-#4F95FF text-32 text-white" @click="clickUserCard">
          去设置
        </div>
      </div>
      <div class="triangle-up" :style="{ top: '-11px', left: '70px' }" />
    </div>

    <div v-if="setWiFiModel" class="guide absolute h-300 w-500" :style="{ top: guideTop, right: 0 }">
      <div class="m-t-64 text-center text-32 text-#2F384C lh-54">
        设备还未录入WiFi信息
      </div>
      <div class="m-t-16 text-center text-24 text-#999999">
        录入WiFi设备采集数据自动上传
      </div>
      <div class="m-t-40 box-border flex gap-16 px-40">
        <div class="h-80 w-full flex-center b-1 b-#4F95FF b-rd-16 b-solid text-32 text-#4F95FF" @click="setWiFiConfirm">
          我知道了
        </div>
        <div class="h-80 w-full flex-center b-rd-16 bg-#4F95FF text-32 text-white" @click="clickSetWifi">
          去设置
        </div>
      </div>
      <div class="triangle-up" :style="{ top: '-11px', right: '70px' }" />
    </div>
  </div>

  <!-- 心电波形图 -->
  <div class="main">
    <div class="flex-center flex-col">
      <div class="relative h-494 w-full">
        <div class="absolute left-0 top-0 wh-full flex justify-between">
          <div class="z-10 m-l-24 m-t-16 text-24">
            实时心电图
          </div>
          <div class="bpm m-t-16">
            <up-icon name="heart-fill" :size="12" :color="`${'#fff'}`" />
            {{ bpm }} bpm
          </div>
        </div>
        <img src="/static/home/ecg-bg-line.png" alt="" class="absolute left-0 top-0 z-1 wh-full">
        <div class="absolute top-60 z-10 h-48 w-32">
          <span class="m-l-24">I</span>
        </div>
        <div class="absolute top-180 z-10 h-48 w-32">
          <span class="m-l-24">II</span>
        </div>
        <div class="absolute top-330 z-10 h-48 w-32">
          <span class="m-l-24">III</span>
        </div>
        <div class="wh-full">
          <canvas id="ecgCanvas" class="wh-full" type="2d" />
        </div>
      </div>
    </div>
  </div>

  <!-- 按钮 -->
  <div class="main b-btn-wrap flex-col">
    <div v-if="showCountDown" :class="{ 'b-btn-wrap-show': showCountDown }" class="b-btn-wrap-countdown m-t-24 flex-col-center">
      <div class="box-border h-72 flex-center gap-18 b-rd-106 bg-#2FC465 px-32 py-12 text-white">
        <div>距离结束还有</div>
        <up-count-down
          ref="countDown" :auto-start="false" :time="millisecond" format="mm:ss" @change="onTimeChange"
          @finish="saveSegment"
        >
          <div>
            <div>
              <text class="text-white">
                <text class="text-white">
                  {{ timeData!.minutes < 10 ? `0${timeData!.minutes}` : timeData!.minutes }} : {{ timeData!.seconds < 10 ? `0${timeData!.seconds}` : timeData!.seconds }}
                </text>
              </text>
            </div>
          </div>
        </up-count-down>
      </div>
      <div class="m-t-8 flex-center text-24 text-#2F384C lh-48">
        {{ chooseShortMember?.name }}正在进行片段保存...
      </div>
    </div>
    <div class="my-24">
      <u-row gutter="10">
        <u-col span="6">
          <div class="fe-btn bg-#FF3F3F1A text-#FF3F3F" @click="openEventRecord($event)">
            事件记录
          </div>
        </u-col>
        <u-col span="6">
          <div v-if="shortCollect" class="fe-btn bg-#4F95FF text-#FFFFFF" @click="saveSegment">
            保存并上传
          </div>
          <div v-else class="fe-btn bg-#4F95FF text-#FFFFFF" @click="validateSaveSegment">
            保存片段
          </div>
        </u-col>
      </u-row>
    </div>
    <div v-if="hasMessage" class="history-wrap" @click="historyRecord">
      <div>{{ recentName }}在{{ dayjs(Number(recentTime)).format('YYYY-MM-DD HH:mm') }}进行了片段保存</div>
      <div class="relative flex items-center gap-21">
        <span>更多记录</span>
        <span v-if="hasUnreadMessage" class="red-dot absolute right-30 top-8" />
        <up-icon name="arrow-right" :size="12" />
      </div>
    </div>
  </div>

  <!-- 事件记录POP  incidentRecord -->
  <z-popup :show="incidentRecord" confirm-text="记录" :mt="80" title="心脏事件记录" @close="recordPopupClose" @confirm="recordPopupConfirm" @cancel="recordPopupClose">
    <template #default>
      <div>
        <div class="m-t-24 text-26 text-#999999 lh-40">
          随时标记不适症状或活动行为，助力医生精准诊断，提升分析准确性。
        </div>
        <div class="my-wrap" @click="checkSN">
          <div class="text-32 text-#2F384C">
            设备码
          </div>
          <div class="flex gap-21 text-32 text-#999999">
            <div :style="{ color: recordSNCode ? '#2F384C' : '#999999' }">
              {{ recordSNCode || '请选择' }}
            </div>
            <up-icon name="arrow-right" :size="12" />
          </div>
        </div>
        <div class="my-wrap m-t-24" @click="chooseUser">
          <div class="text-32 text-#2F384C">
            成员
          </div>
          <div class="flex gap-21 text-32 text-#999999">
            <div :style="{ color: recordUser ? '#2F384C' : '#999999' }">
              {{ recordUser || '请选择' }}
            </div>
            <up-icon name="arrow-right" :size="12" />
          </div>
        </div>
        <div class="my-wrap m-t-24" @click="chooseTime">
          <div class="text-32 text-#2F384C">
            记录时间
          </div>
          <div class="flex gap-21 text-32 text-#999999">
            <div :style="{ color: recordTime ? '#2F384C' : '#999999' }">
              {{ recordTime.slice(0, 5) || '请选择' }}
            </div>
            <up-icon name="arrow-right" :size="12" />
          </div>
        </div>
        <div class="m-b-16 m-t-24 flex items-center justify-between">
          <div class="text-32 text-#2F384C">
            事件记录 <span v-if="voiceList.length">({{ voiceList.length }}/3)</span>
          </div>
          <div class="size-48 flex-center b-rd-[50%] text-32 text-#999999" :style="{ backgroundColor: voiceList.length >= 3 ? 'rgba(79, 149, 255, .3)' : '#4F95FF' }" @click="chooseVoice">
            <img src="/static/home/mic.png" alt="" class="size-32">
          </div>
        </div>
        <!-- voiceList.list -->
        <div v-if="voiceList.length" class="my-wrap relative m-b-24 m-t-24 flex-col gap-14">
          <div v-for="(voiceObj, index) in voiceList" :key="voiceObj.id" class="flex items-center gap-21">
            <div class="text-32 text-#2F384C">
              记录{{ index + 1 }}
            </div>
            <img src="/static/images/voice-icon.png" class="size-36" alt="" @click="playVoice(voiceObj)">
            <img src="/static/images/voice-img.png" alt="" class="h-45 w-348">
            <div class="flex gap-21 text-32 text-#2F384C">
              {{ Math.round(voiceObj.duration / 1000) }}秒
            </div>
            <div class="absolute right-6" @click="deleteVoice(index)">
              <up-icon :size="20" name="close-circle-fill" :color="`${'#FF3F3F'}`" />
            </div>
          </div>
        </div>
        <up-textarea v-model="incidentRecordText" :height="124" placeholder="请描述您当前的不适症状以及活动行为。" />
      </div>
    </template>
  </z-popup>

  <!-- 选择SN码POP -->
  <z-popup :show="SNCodePopup" :mt="336" title="选择设备码" @close="SNCodePopupClose" @confirm="SNCodePopupConfirm" @cancel="SNCodePopupClose">
    <template #default>
      <div>
        <div v-for="(item, index) in deviceList" :key="index" class="my-wrap m-t-24" @click="chooseSNCode(item)">
          <div class="text-32 text-#2F384C">
            {{ item }}
          </div>
          <div>
            <up-icon name="arrow-right" :size="12" />
          </div>
        </div>
      </div>
    </template>
  </z-popup>

  <!-- 短程采集选择成员POP  shortUserPopup -->
  <z-popup
    :show="shortUserPopup"
    :mt="221"
    title="选择成员"
    cancel-text="快捷添加"
    @close="() => { shortUserPopup = false }"
    @confirm="shortUserPopupConfirm"
    @cancel="shortUserPopupClose"
  >
    <template #default>
      <div class="grid-container m-t-56">
        <div v-for="(item, index) in memberList" :key="index" class="grid-item" :class="{ active: index === activeUserIndex }" @click="activeUser(item, index)">
          <div class="flex items-center">
            <div class="m-r-8 size-48">
              <img v-if="item.avatarUrl" class="b-round wh-full" :src="item.avatarUrl" alt="">
              <up-avatar v-else :size="27" src="" />
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

  <!-- 快捷添加成员 -->
  <z-popup title="快捷添加成员" :show="quickAddMember" @close="closeQuickAddMember" @cancel="cancelQuickAddMember" @confirm="confirmQuickAddMember">
    <template #default>
      <div class="m-b-322 m-t-48 flex-col gap-24">
        <z-input v-model:value="quickAddMemberForm.name" title="姓名" placeholder="请输入..." @input="handleNameInput" />
        <z-input v-model:value="sex" title="性别" placeholder="请选择" icon="arrow-right" disabled @click="handleSexClick" />
        <z-input v-model:value="birthString" title="出生日期" placeholder="请选择" icon="arrow-right" disabled @click="handleDateClick" />
      </div>
    </template>
  </z-popup>

  <up-picker :show="genderPickerShow" :columns="columns" @confirm="genderConfirm" @cancel="() => { genderPickerShow = false }" />

  <up-datetime-picker
    v-model="curDate"
    :show="birthdayPickerShow"
    mode="date"
    :maxDate="maxDate"
    :minDate="minDate"
    @confirm="birthdayConfirm"
    @cancel="birthdayCancel"
  />

  <!-- 事件记录选择成员POP userPopup -->
  <z-popup :show="userPopup" :mt="221" title="选择成员" @close="userPopupClose" @confirm="userPopupConfirm" @cancel="userPopupClose">
    <template #default>
      <div class="grid-container m-t-56">
        <div v-for="(item, index) in memberList" :key="item.create_tm" class="grid-item" :class="{ active: index === activeUserIndex }" @click="activeUser(item, index)">
          <div class="flex items-center">
            <div class="m-r-8 size-48">
              <img v-if="item.avatarUrl" class="b-round wh-full" :src="item.avatarUrl" alt="">
              <up-avatar v-else :size="27" src="" />
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

  <!-- 选择时间POP -->
  <up-datetime-picker
    ref="datetimePickerRef"
    v-model="incidentTime"
    :show="timePopup"
    mode="time"
    @cancel="datePickerCancel"
    @confirm="datePickerConfirm"
  />

  <!-- 音频POP voicePopup  -->
  <z-popup :show="voicePopup" :mt="130" title="语音记录" :isShowCancel="false" :isShowConfirm="false" @close="stopRecord">
    <div class="h-200 w-full">
      <div v-if="!isRecordVoice" class="m-t-80 flex-center text-32 text-#2F384C lh-80">
        长按下方按钮开始录音~
      </div>
      <div v-else class="loaders m-t-80 flex-center">
        <div class="loader">
          <div class="line-scale-pulse-out">
            <div v-for="(_, index) in lines" :key="index" class="pulse-line" />
          </div>
        </div>
      </div>
      <div class="relative flex-center">
        <div class="bottom-60 m-t-100 box-border size-120 b-rd-[50%] primary-btn p-20">
          <img src="/static/images/recordv.png" alt="" class="wh-full" @touchstart="startRecord" @touchend="stopRecord">
        </div>
      </div>
    </div>
  </z-popup>

  <!-- 自定义tabbar -->
  <up-tabbar activeColor="#4F95FF" :border="false" :value="0" :fixed="true" :placeholder="true" :safe-area-inset-bottom="true">
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

  <!-- 设置WIFI弹窗 setWiFiPopup (isConnectedWiFi && WiFiName) ? WiFiName : '未连接网络' -->
  <z-popup :show="setWiFiPopup" :mt="330" title="WIFI设置" @close="closeSetWiFiPopup" @confirm="confirmSetWiFi" @cancel="closeSetWiFiPopup">
    <div class="h-300 w-full">
      <div v-if="isConnectedWiFi && WiFiName" class="m-b-6 m-t-14 text-26 text-#999999">
        当前设备登记WI-FI:{{ WiFiName }}
      </div>
      <div class="m-b-16 m-t-24 text-32 text-#2F384C">
        WIFI名称
      </div>
      <div class="m-t-20 box-border h-70 w-full border-rd-10 bg-[#f0f3f8] p-10">
        <input v-model="localWiFiName" class="wh-full" type="text" placeholder="请输入WIFI" placeholder-style="font-size: 32rpx;color:#999999">
      </div>
      <div class="m-b-16 m-t-16 text-32 text-#2F384C">
        密码
      </div>
      <div class="relative m-t-20 box-border h-70 w-full border-rd-10 bg-[#f0f3f8] p-10">
        <input v-if="showPassword" v-model="WiFiPassword" class="h-full w-[70%]" type="password" placeholder="请输入WIFI密码" placeholder-style="font-size: 32rpx; color:#999999">
        <input v-else v-model="WiFiPassword" class="h-full w-[70%]" type="text" placeholder="请输入WIFI密码" placeholder-style="font-size: 32rpx; color:#999999">
        <div class="absolute right-20 top-20" @click="changeShowPassword">
          <up-icon name="eye" :size="16" />
        </div>
      </div>
    </div>
  </z-popup>

  <!-- 设备信息 -->
  <z-popup
    :show="setDevicePopup" :mt="232" title="设备信息" confirm-text="好的" :isShowCancel="false"
    @confirm="() => { setDevicePopup = false }" @close="() => { setDevicePopup = false }"
  >
    <template #default>
      <div class="flex-center">
        <img v-if="connectDeviceType === '302'" src="/static/home/302.jpg" alt="" class="h-240 w-180">
        <img v-else src="/static/home/icon-301b.png" alt="" class="h-240 w-180">
      </div>
      <div>
        <div class="my-wrap">
          <div class="text-32 text-#999999">
            设备型号
          </div>
          <div class="text-32 text-#2F384C">
            {{ connectDeviceType }}
          </div>
        </div>
        <div class="my-wrap m-t-24">
          <div class="text-32 text-#999999">
            设备码
          </div>
          <div class="text-32 text-#2F384C">
            {{ deviceSN }}
          </div>
        </div>
        <div class="my-wrap m-t-24">
          <div class="text-32 text-#999999">
            固件版本
          </div>
          <div class="text-32 text-#2F384C">
            1.0
          </div>
        </div>
        <div class="my-wrap m-t-24" @click="formatMemory">
          <div class="text-32 text-#2F384C">
            格式化内存
          </div>
          <div>
            <up-icon name="arrow-right" :size="12" />
          </div>
        </div>
        <div v-if="connectDeviceType !== DeviceType.DEV_301B" class="my-wrap m-t-24" @click="otherSetting">
          <div class="text-32 text-#2F384C">
            其他设置
          </div>
          <div>
            <up-icon name="arrow-right" :size="12" />
          </div>
        </div>
      </div>
    </template>
  </z-popup>

  <!-- 其他设置  otherSettingPopup -->
  <z-popup
    :show="otherSettingPopup" :mt="232" title="其他设置"
    @cancel="() => { otherSettingPopup = false, setDevicePopup = true }"
    @close="() => { otherSettingPopup = false, setDevicePopup = true }"
    @confirm="handleOtherSetting"
  >
    <template #default>
      <div>
        <div class="my-wrap m-t-64">
          <div class="text-32 text-#999999">
            默认数据自动上传
          </div>
          <div>
            <up-switch v-model="tempAutoUpload" inactiveColor="#DCDCDC" @change="handleAutoUpload" />
          </div>
        </div>
        <div class="my-wrap m-t-24">
          <div class="text-32 text-#999999">
            采集时长
          </div>
          <div class="flex gap-21 text-32 text-#2F384C" @click="handleScreenTime('coll')">
            {{ collTimeText }}
            <up-icon name="arrow-right" :size="12" />
          </div>
        </div>
        <div class="my-wrap m-t-24">
          <div class="text-32 text-#999999">
            屏幕保护时长
          </div>
          <div class="flex gap-21 text-#2F384C" @click="handleScreenTime('screen')">
            {{ screenTimeText }}
            <up-icon name="arrow-right" :size="12" />
          </div>
        </div>
        <div class="my-wrap m-t-64">
          <div class="text-32 text-#2F384C">
            提示音
          </div>
          <div>
            <up-switch v-model="tempSound" inactiveColor="#DCDCDC" @change="handleSound" />
          </div>
        </div>
      </div>
    </template>
  </z-popup>

  <!-- 格式化内存   formatMemoryPopup -->
  <z-popup
    :show="formatMemoryPopup"
    confirm-text="格式化内存"
    :isShowCancel="false"
    :mt="40"
    @confirm="onFormatMemory"
    @close="closeFormatMemory"
  >
    <template #default>
      <div class="format-wrap">
        <span>注意: 格式化内存将会清除设备中所有数据，且必须在设备开机1分钟之内执行此操作</span>
      </div>
    </template>
  </z-popup>

  <z-model :show="saveSegmentModel" title="保存片段" confirm-text="保存" @confirm="saveEcgRecord" @cancel="cancelSaveEcgRecord">
    <template #default>
      <p class="m-t-24 text-26 text-#999999">
        将当前片段保存快速申请报告，适用于想要快速获得心电结果的场景。
      </p>
      <span class="text-26 text-#FF3F3F">保存时长15分钟，保存过程中不要离开小程序。</span>
    </template>
  </z-model>

  <!-- 时长不够提醒 -->
  <z-model :show="notFullTimeModel" title="提示" confirm-text="我知道了" cancel-text="结束采集" @confirm="() => { notFullTimeModel = false }" @cancel="stopCollection">
    <template #default>
      <p class="m-t-14 text-center text-30 text-#666666">
        时长超过10分钟可获取报告
      </p>
      <p class="m-t-14 text-center text-30 text-#666666">
        建议您继续采集
      </p>
    </template>
  </z-model>

  <!-- 断开设备连接提示 -->
  <z-model :show="disconnectModel" title="提示" confirm-text="断开" cancel-text="取消" @confirm="confirmDisconnect" @cancel="() => { disconnectModel = false }">
    <template #default>
      <p class="m-t-14 text-center text-30 text-#666666">
        正在采集,确定要断开连接吗?
      </p>
    </template>
  </z-model>

  <u-popup round="20" :show="goLogin" @close="closeLoginForm">
    <div class="px-24">
      <div class="h-80 w-full flex-center">
        隐私政策提示
      </div>
      <button v-if="aloneChecked" class="w—full m-b-24 m-t-24 h-80 border-rd-40 primary-btn text-white" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
        登录
      </button>
      <button v-else class="w—full m-b-24 m-t-24 h-80 border-rd-40 primary-btn text-white" @click="checkAgree">
        登录
      </button>
      <div class="m-t-24 flex items-center gap10">
        <up-checkbox
          v-model:checked="aloneChecked"
          :custom-style="{ marginBottom: '8px' }"
          name="agree"
          usedAlone
          @change="aloneChecked = !aloneChecked"
        >
          <template #label>
            <div class="text-28 text-#2F384C">
              同意<span class="primary-color" @click="showLaws('privacy')">用户协议</span>与<span class="primary-color" @click="showLaws('terms')">隐私条款</span>
            </div>
          </template>
        </up-checkbox>
      </div>
    </div>
  </u-popup>
</template>

<script setup lang="ts">
import { onReady } from '@dcloudio/uni-app';
import dayjs from 'dayjs';
import {
  WriteBleType,
  appendFile,
  ble2data,
  byte2data,
  checkFileIsExist,
  ensureDirectoryExists,
  hex2ab,
  readFile,
  saveFile,
  writeBLE,
} from '@/utils/ble';
import { DeviceType } from '@/config/common.config';
import { GetWiFi } from '@/utils/wifi';
import { wxLogin } from '@/utils/user';
import { getWifiInfo, setWifiInfo } from '@/api/wifi';
import { addMember, getMember, getRegister2Service } from '@/api/member';
import useDeviceStore from '@/store/index';
import useRecordStore from '@/store/record';
import useMemberStore from '@/store/member';
import { addIncidentList } from '@/api/incident';
import { TabbarConfig } from '@/config/tabbar.config';
import type { MemberInfoList } from '@/api/member/type';
import { validForm } from '@/utils/helper';
import { getUserInfoByUnionId, getUserPhonenumber, loginByCode, signUp, uploadUser } from '@/api/user';
import type { GetIncidentListParams } from '@/api/incident/types';
import type { IAddEcgRecord, IUploadEcgRecord } from '@/api/ecg/types';
import { CollectionStatus } from '@/config/ecg.config';
import { ConnectBluetooth, HeartChart, SearchBluetooth, ab2hex } from '@/utils';
import { addCollectionRecord, updateCollectionRecord, uploadEcgBinaryData, uploadNumberArrayData } from '@/api/ecg';
import type { SignUpParams } from '@/api/user/types';
import useEcgCanvasStore from '@/store/ecg';
import { getDeviceList, getSystemConfig } from '@/api/common';

interface TimeDuration {
  minutes: number;
  seconds: number;
}

interface IFormData {
  [key: string]: string | number | boolean | null;
}

const lines = Array.from({ length: 21 }, () => ({}));

const curDate = dayjs().valueOf();
const maxDate = dayjs().valueOf();
const minDate = dayjs().subtract(100, 'year').month(0).date(1).valueOf();

const ecgCanvasStore = useEcgCanvasStore();
const recordStore = useRecordStore();
const memberStore = useMemberStore();
const deviceStore = useDeviceStore();
const SearchBluetoothIns = new SearchBluetooth();
const columns = ref([
  ['男', '女'],
]);
let ConnectBluetoothIns: any = null;
let innerAudioContext: any = null;
const GetWiFiIns = new GetWiFi();
const bufferSize = 1024 * 12; // 每次分段存储 12KB 数据
const buffer = new Uint8Array(bufferSize);
const dataArray: number[] = [];
const bpm = ref<number>(0);
const offset = ref<number>(0); // 偏移量
const countDown = ref<any>(null);
const startCollectTime = ref<number | null>(null); // 开始采集时间
const maxinterval = ref<number>(uni.getStorageSync('maxinterval') || 15);
const invalidinterval = ref<number>(uni.getStorageSync('invalidinterval') || 10);
const millisecond = ref<number>(900000); // 采集时间(毫秒) 15分钟 900000

const voiceList = ref<any>([]);
const voiceitem = ref<any>({});
const voicePopup = ref<boolean>(false);

const leadCanvas = ref<HeartChart | null>(null);
const count = ref<number>(0);

const dataArrayTimer = ref<any>(null);
const guideTop = ref<string>('');
const timeData = ref<TimeDuration | null>({
  minutes: 15,
  seconds: 0,
});

const screenTimeList = ref(['20秒', '40秒', '60秒']);
const collTimeList = ref(['24小时', '48小时', '72小时']);
const incidentTime = ref<string>('');

const screenTimeIndex = ref<number>(0);
const tempScreenTimeIndex = ref<number>(0);
const collTimeIndex = ref<number>(0);
const tempCollTimeIndex = ref<number>(0);
const screenTimeText = ref<string>('20秒');
const collTimeText = ref<string>('24小时');

const aloneChecked = ref<boolean>(false); // 同意协议
const goLogin = ref<boolean>(false); // 登录pop

const sound = ref<boolean>(false); // 提示音
const tempSound = ref<any>(false); // 临时提示音
const timePopup = ref<boolean>(false); // 选择时间POP
const userPopup = ref<boolean>(false); // 选择成员POP
const reconnect = ref<boolean>(false); // 重连
const autoUpload = ref<boolean>(true); // 自动上传
const tempAutoUpload = ref<boolean>(true); // 临时自动上传
const hasMessage = ref<boolean>(false); // 是否有读消息
const showPassword = ref<boolean>(true); // true : type = password  false : type = text
const SNCodePopup = ref<boolean>(false); // 选择SN码POP
const datetimePickerRef = ref<any>(null); // 选择时间POP
const isCollection = ref<boolean>(false);
const shortCollect = ref<boolean>(false); // 是否保存片段
const setWiFiPopup = ref<boolean>(false);
const setWiFiModel = ref<boolean>(false); // 设置WiFi
const setWiFiTag = ref<boolean>(false); // 设置WiFi
const notYourMember = ref<boolean>(false); // 非你名下成员
const isRecordVoice = ref<boolean>(false); // 是否正在录音
const showCountDown = ref<boolean>(false); // 显示倒计时
const shortUserPopup = ref<boolean>(false); // 选择成员POP
const quickAddMember = ref<boolean>(false); // 快速注册成员POP
const incidentRecord = ref<boolean>(false); // 音频可视化控件
const setDevicePopup = ref<boolean>(false);
const isShortCollect = ref<boolean>(false); // 是否正在短程采集
const isConnectedWiFi = ref<boolean>(false); // 是否已登记WiFi
const hasUnreadMessage = ref<boolean>(false); // 是否有未读消息
const genderPickerShow = ref<boolean>(false); // 选择性别POP
const saveSegmentModel = ref<boolean>(false);
const notFullTimeModel = ref<boolean>(false);
const disconnectModel = ref<boolean>(false); // 断开连接,确认断开
const notRegisterModel = ref<boolean>(false);
const notRegisterTag = ref<boolean>(false);
const formatMemoryPopup = ref<boolean>(false);
const otherSettingPopup = ref<boolean>(false);
const birthdayPickerShow = ref<boolean>(false); // 选择生日POP
const directoryPathIsExist = ref<boolean>(false);

const setWiFiTimer = ref<any>();
const deviceId = ref<string>(''); // 设备id
const deviceSN = ref<string>(''); // 设备序列号
const wifiSName = ref<string>(''); // 写入设备返回的WiFi名称
const eletText = ref<string>('');
const recordUser = ref<string>('');
const recordTime = ref<string>('');
const recentName = ref<string>('');
const recentTime = ref<string>('');
const recordSNCode = ref<string>('');
const collectionId = ref<string>('');
const WiFiName = ref<string>(''); // WiFi名称
const localWiFiName = ref<string>(''); // 本机连接的WiFi名称
const WiFiPassword = ref<string>(''); // WiFi密码
const wifiSPassword = ref<string>(''); // 写入设备返回的WiFi密码
const recordUserUuid = ref<string>('');
const connectDeviceType = ref<string>(''); // 连接设备类型
const incidentRecordText = ref<string>(''); // 事件记录描述

const activeUserIndex = ref<number>(0); // 当前选中成员下标
const memberList = ref<MemberInfoList[]>([]);
const setWiFiStartTime = ref<number | null>(0);
const deviceList = ref<string[]>([]);
const registerMember = ref<MemberInfoList | null>(null); // 获取到的登记到设备中的成员
const quickAddMemberForm = ref<IFormData>({
  name: null,
  gender: 2,
  birth: null,
  uuid: null,
  belongto: null,
});
const sex = ref<string>('');
const birthString = ref<string>('');
const chooseShortMember = ref<MemberInfoList | null>(null); // 选择的短程采集的成员

onReady(async () => {
  const query = uni.createSelectorQuery();
  query.select('#userinfo').boundingClientRect();
  query.exec((res) => {
    guideTop.value = `${res[0].height + 5}px`;
  });
});

watch(isRecordVoice, () => {
  if (isRecordVoice.value) {
    nextTick(() => {
      document.querySelector('.loader')?.classList.add('loaded');
    });
  }
  else {
    nextTick(() => {
      document.querySelector('.loader')?.classList.remove('loaded');
    });
  }
});

const initSystemConfig = async () => {
  const config = await getSystemConfig();
  if (config?.length > 0) {
    uni.setStorageSync('invalidinterval', Number(config[1].value));
    uni.setStorageSync('maxinterval', Number(config[3].value));
    maxinterval.value = Number(config[3].value);
    invalidinterval.value = Number(config[1].value);
    console.log('invalidinterval: ', invalidinterval.value, maxinterval.value);
  }
  else {
    uni.showModal({
      title: '温馨提示',
      content: '网络异常,请刷新重试~',
      success: (res) => {
        if (res.confirm) {
          initSystemConfig();
        }
      },
      fail: () => {
        uni.exitMiniProgram();
      },
    });
  }
};

onMounted(async () => {
  const { code } = await wxLogin();
  if (code === 'NG') {
    return;
  }
  const { unionid, openid } = await loginByCode(code);
  uni.setStorageSync('unionid', unionid);
  uni.setStorageSync('openid', openid);
  try {
    const user = await getUserInfoByUnionId(unionid, '30x');
    if (user.code !== 'NG') {
      await initSystemConfig();
      if (!user.openid_coll) {
        await uploadUser({
          uuid: user.uuid,
          openid_coll: openid,
        });
      }
      uni.setStorageSync('uuid', user.uuid);
      uni.setStorageSync('islogin', true);
      await recordStore.init();
      await getMemberList();
      getRecord();
      const res = await getDeviceList({ acc_id: uni.getStorageSync('uuid') });
      if (res.code !== 'NG') {
        deviceList.value = res.map((item: any) => item.dev_sn);
        uni.setStorageSync('devicelist', deviceList.value);
      }
    }
    else {
      // goLogin.value = true;

    }
    if (!isCollection.value) {
      await check();
    }
    // deviceList.value = deviceStore.getDeviceList;
  }
  catch (error) {
    console.log(error);
  }
  const query = uni.createSelectorQuery();
  query
    .select('#ecgCanvas')
    .fields({ size: true, node: true }, (res: any) => {
      const canvas = res.node; // 这是微信小程序的 Canvas 对象
      const ctx = canvas.getContext('2d'); // 获取 Canvas 的绘图上下文
      const dpr = wx.getSystemInfoSync().pixelRatio; // 获取设备的像素比
      const width = res.width;
      const height = res.height;
      canvas.width = width * dpr;// 设置 canvas 的宽度和高度
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);// 缩放 canvas 的绘图上下文
      leadCanvas.value = new HeartChart(ctx, width, height);// 确保 leadCanvas 是一个已经定义的响应式变量
    })
    .exec();
  ecgCanvasStore.setCanvasIns(leadCanvas.value);
});

const setWiFiConfirm = () => {
  setWiFiModel.value = false;
  setWiFiTag.value = true;
};

const clickSetWifi = () => {
  setWiFiModel.value = false;
  setWiFiPopup.value = true;
};

const notRegisterConfirm = () => {
  notRegisterTag.value = true;
  notRegisterModel.value = false;
};

// 跳转到登记页面
const clickUserCard = () => {
  if (!isCollection.value) {
    uni.showToast({ icon: 'none', title: '请先连接设备~' });
    return;
  }
  notRegisterModel.value = false;
  uni.navigateTo({
    url: '/pages/register/index',
  });
};

const clickDeviceCard = () => {
  if (!isCollection.value) {
    uni.showToast({ icon: 'none', title: '请先连接设备~' });
    return;
  }
  setDevicePopup.value = true;
};

const activeUser = (item: any, index: number) => {
  activeUserIndex.value = index;
};

const onFormatMemory = async () => {
  await writeBLE(WriteBleType.CLEAR, 'clear');
  setTimeout(async () => {
    await writeBLE(WriteBleType.start, 'start');
  }, 200);
  setTimeout(async () => {
    await writeBLE(WriteBleType.start, 'start');
  }, 300);
  formatMemoryPopup.value = false;
};

const closeFormatMemory = () => {
  setTimeout(async () => {
    await writeBLE(WriteBleType.start, 'start');
  }, 100);
  setTimeout(async () => {
    await writeBLE(WriteBleType.start, 'start');
  }, 200);
  formatMemoryPopup.value = false;
  setDevicePopup.value = true;
};

// 开始录音
const startRecord = () => {
  isRecordVoice.value = true;
  const recorderManager = uni.getRecorderManager();
  recorderManager.start({
    duration: 30000,
  });
  recorderManager.onStop((res) => {
    isRecordVoice.value = false;
    voiceitem.value.duration = res.duration;
    voiceitem.value.path = res.tempFilePath;
    if (voiceList.value.length > 2) {
      voiceList.value.shift();
    }
    voiceList.value.push(voiceitem.value);
    voiceitem.value = {};
    incidentRecord.value = true;
    voicePopup.value = false;
  });
};

// 结束录音
const stopRecord = () => {
  const recorderManager = uni.getRecorderManager();
  recorderManager.stop();
  incidentRecord.value = true;
  voicePopup.value = false;
};

// 上传心电数据数组
const uploadDataArray = async () => {
  const res = await uploadNumberArrayData({ data: dataArray });
  if (res) {
    console.log('心率', res.bgm.toFixed(0));
    bpm.value = res.bgm.toFixed(0);
    dataArray.length = 0;
  }
};

// 收集心电数据 每8秒上传一次
const collectionHeartRateData = () => {
  if (dataArrayTimer.value) {
    clearInterval(dataArrayTimer.value);
  }
  dataArrayTimer.value = setInterval(() => {
    uploadDataArray();
    getBattery();
  }, 8000);
};

// 获取最近一条记录
const getRecord = () => {
  hasMessage.value = recordStore.getHasRecord;
  hasUnreadMessage.value = recordStore.getHasUnreadMessage;
  if (hasMessage.value) {
    const record = recordStore.getRecordList[0];
    const res = JSON.parse(JSON.stringify(record));
    recentName.value = res.pat_name;
    recentTime.value = res.collect_sta_tm;
  }
};

const getWiFiName = async (res: any) => {
  console.log('res-wifi', res);
  localWiFiName.value = res.wifi?.SSID;
  try {
    const ans = await getWifiInfo({ dev_sn: deviceStore.getName, type: 'wifi' });
    console.log('ans-wifi', ans);
    if (ans.length === 0) {
      isConnectedWiFi.value = false;
    }
    else {
      isConnectedWiFi.value = true;
      WiFiName.value = ans[0].wifi_name;
    }
  }
  catch (error) {
    console.log(error);
  }
};

const changeShowPassword = () => {
  showPassword.value = !showPassword.value;
};

const openEventRecord = async (event: any) => {
  if (!uni.getStorageSync('islogin')) {
    goLogin.value = true;
    return;
  }
  if (event.type === 'tap') {
    const res = memberStore.getMemberList;
    if (res.length === 0) {
      memberList.value = await getMember({ belongto: uni.getStorageSync('uuid') });
      console.log('memberList', memberList.value);
    }
    else {
      memberList.value = res;
    }
    incidentRecord.value = true;
    recordTime.value = dayjs().format('HH:mm:ss.SSS');
  }
};

const otherSetting = () => {
  otherSettingPopup.value = true;
  setDevicePopup.value = false;
  const deviceStr = recordSNCode.value.slice(0, 4) + recordSNCode.value.slice(-6);
  screenTimeIndex.value = uni.getStorageSync(`${deviceStr}screenTime`) || 0;
  collTimeIndex.value = uni.getStorageSync(`${deviceStr}collTime`) || 0;
  autoUpload.value = uni.getStorageSync(`${deviceStr}autoUpload`) || false;
  sound.value = uni.getStorageSync(`${deviceStr}sound`) || false;
  tempAutoUpload.value = autoUpload.value;
  tempScreenTimeIndex.value = screenTimeIndex.value;
  tempCollTimeIndex.value = collTimeIndex.value;
  tempSound.value = sound.value;
  screenTimeText.value = screenTimeList.value[screenTimeIndex.value];
  collTimeText.value = collTimeList.value[collTimeIndex.value];
};

// 设置提示音
const handleSound = async (value: boolean) => {
  tempSound.value = value;
};

// 设置采集时间 屏幕保护时间
const handleScreenTime = (type: string) => {
  otherSettingPopup.value = false;
  if (type === 'coll') {
    uni.showActionSheet({
      itemList: collTimeList.value,
      success(res) {
        tempCollTimeIndex.value = res.tapIndex;
        collTimeText.value = collTimeList.value[res.tapIndex];
        otherSettingPopup.value = true;
      },
      fail(res) {
        console.log(res.errMsg);
      },
    });
  }
  else {
    uni.showActionSheet({
      itemList: screenTimeList.value,
      success(res) {
        tempScreenTimeIndex.value = res.tapIndex;
        screenTimeText.value = screenTimeList.value[res.tapIndex];
        otherSettingPopup.value = true;
      },
      fail(res) {
        console.log(res.errMsg);
      },
    });
  }
};

// 设置自动上传
const handleAutoUpload = (value: boolean) => {
  tempAutoUpload.value = value;
};

const formatMemory = async () => {
  if (!isCollection.value) {
    uni.showToast({ icon: 'none', title: '请先连接设备~' });
    return;
  }
  // 格式化内存的时候要endEcg信号,并且在设备开机1分钟内有效,如果这时正在短程采集,是end还是不允许点击
  if (isShortCollect.value) {
    uni.showToast({ icon: 'none', title: '请先结束当前采集~' });
    return;
  }
  await writeBLE(WriteBleType.end, 'end');
  setDevicePopup.value = false;
  formatMemoryPopup.value = true;
};

const handleOtherSetting = async () => {
  if (!isCollection.value) {
    uni.showToast({ icon: 'none', title: '请先连接设备~' });
    return;
  }
  const deviceStr = recordSNCode.value.slice(0, 4) + recordSNCode.value.slice(-6);
  console.log(autoUpload.value, tempAutoUpload.value);
  if (autoUpload.value !== tempAutoUpload.value) {
    autoUpload.value = tempAutoUpload.value;
    uni.setStorageSync(`${deviceStr}autoUpload`, autoUpload.value);
    if (autoUpload.value) {
      await writeBLE(WriteBleType.UPLOAD, '0x01');
    }
    else {
      await writeBLE(WriteBleType.UPLOAD, '0x00');
    }
  }
  if (collTimeIndex.value !== tempCollTimeIndex.value) {
    collTimeIndex.value = tempCollTimeIndex.value;
    uni.setStorageSync(`${deviceStr}collTime`, collTimeIndex.value);
    if (collTimeIndex.value === 0) {
      await writeBLE(WriteBleType.COLLECTTIME, '0x01');
    }
    else if (collTimeIndex.value === 1) {
      await writeBLE(WriteBleType.COLLECTTIME, '0x02');
    }
    else if (collTimeIndex.value === 2) {
      await writeBLE(WriteBleType.COLLECTTIME, '0x03');
    }
  }
  if (screenTimeIndex.value !== tempScreenTimeIndex.value) {
    screenTimeIndex.value = tempScreenTimeIndex.value;
    uni.setStorageSync(`${deviceStr}screenTime`, screenTimeIndex.value);
    if (screenTimeIndex.value === 0) {
      await writeBLE(WriteBleType.SCREENTIME, '0x01');
    }
    else if (screenTimeIndex.value === 1) {
      await writeBLE(WriteBleType.SCREENTIME, '0x02');
    }
    else if (screenTimeIndex.value === 2) {
      await writeBLE(WriteBleType.SCREENTIME, '0x03');
    }
  }
  if (sound.value !== tempSound.value) {
    sound.value = tempSound.value;
    uni.setStorageSync(`${deviceStr}sound`, sound.value);
    if (sound.value) {
      await writeBLE(WriteBleType.DING, '0x01');
    }
    else {
      await writeBLE(WriteBleType.DING, '0x00');
    }
  }
  otherSettingPopup.value = false;
};

// 清除定时器
const clearTimer = () => {
  dataArrayTimer.value && clearInterval(dataArrayTimer.value);
};

// 保存数据到本地文件
const saveData2File = async () => {
  !directoryPathIsExist.value && (directoryPathIsExist.value = await checkFileIsExist(collectionId.value));
  const dataToSave = buffer.slice(0, offset.value);
  directoryPathIsExist.value ? await appendFile(collectionId.value, dataToSave.buffer) : await saveFile(collectionId.value, dataToSave.buffer);
};

// 收集数据
const storeData = async (data: any[]) => {
  if (isShortCollect.value) {
    const segments = ble2data(data);
    for (const segment of segments) {
      const u8 = new Uint8Array(segment);
      if (offset.value + u8.length > bufferSize) {
        await saveData2File();
        offset.value = 0; // 重置偏移量
        buffer.set(u8, 0);
        offset.value = u8.length;
      }
      else {
        buffer.set(u8, offset.value);
        offset.value += u8.length;
      }
    }
  }
};

const chooseVoice = () => {
  if (voiceList.value.length >= 3) {
    uni.showToast({ icon: 'none', title: '最多上传3条语音记录~' });
    return;
  }
  wx.getSetting({
    success: (res) => {
      if (!res.authSetting['scope.record']) {
        wx.authorize({
          scope: 'scope.record',
          success() {
            console.log('授权成功');
            incidentRecord.value = false;
            voicePopup.value = true;
          },
          fail() {
            uni.showToast({ title: '授权失败, 请前往设置打开授权~', icon: 'none' });
            console.log('授权失败');
          },
        });
      }
      else {
        incidentRecord.value = false;
        voicePopup.value = true;
      }
    },
  });
};

// 播放语音
const playVoice = (voiceObj: any) => {
  innerAudioContext = uni.createInnerAudioContext();
  // innerAudioContext.autoplay = true;
  innerAudioContext.volume = 1;
  innerAudioContext.play();
  innerAudioContext.src = voiceObj.path;
  innerAudioContext.onPlay(() => {
    console.log('开始播放');
  });
  innerAudioContext.onError((res: any) => {
    console.log(res.errMsg);
    console.log(res.errCode);
  });
};

const deleteVoice = (index: number) => {
  voiceList.value.splice(index, 1);
};

// 上传心电数据
const uploadEcgBinary = async () => {
  const buffer = await readFile(collectionId.value);
  const header = {
    patid: chooseShortMember.value!.uuid,
    starttime: startCollectTime.value!.toString(),
    duration: `${count.value}`,
  };
  const res = await uploadEcgBinaryData({ buffer, ...header });
  console.log('uploadEcgBinaryData', res);
  if (res) {
    setTimeout(() => {
      uni.showToast({ title: '上传成功', icon: 'none' });
    }, 1000);
  }
  else {
    const data: IUploadEcgRecord = {
      collect_sta_tm: startCollectTime.value!.toString(),
      pat_id: chooseShortMember.value!.uuid,
      status: CollectionStatus.FAIL,
      duration: count.value,
      collectid: collectionId.value,
    };
    await updateCollectionRecord(data);
    uni.showToast({ title: '上传失败', icon: 'none' });
    await recordStore.init();
    setTimeout(async () => {
      getRecord();
    }, 1000);
  }
  collectionId.value = '';
  directoryPathIsExist.value = false;
};

// 获取采集的id
const getCollectionId = async () => {
  startCollectTime.value = new Date().getTime();
  const data: IAddEcgRecord = {
    collect_sta_tm: startCollectTime.value!.toString(),
    pat_id: chooseShortMember.value!.uuid,
    status: CollectionStatus.PENDING,
  };
  const { collectid, code } = await addCollectionRecord(data);
  if (code === 'NG') {
    uni.showToast({ icon: 'none', title: '服务器开小差了,请稍后再试~' });
    throw new Error('获取采集id失败');
  }
  collectionId.value = collectid;
  console.log('collectionId', collectionId.value);
};

// 更新采集状态
const updateCollectionStatus = async (type: string = CollectionStatus.SUCCESS, options: any = {}) => {
  if (!startCollectTime.value) {
    return;
  }
  const data: IUploadEcgRecord = {
    collect_sta_tm: startCollectTime.value!.toString(),
    pat_id: chooseShortMember.value!.uuid,
    status: type,
    duration: count.value,
    collectid: collectionId.value,
    ...options,
  };
  const { code } = await updateCollectionRecord(data);
  console.log('updateCollectionStatus', code);
  if (code === 'OK') {
    uni.setStorageSync('shortTag', false);
    if (type === CollectionStatus.SUCCESS) {
      await uploadEcgBinary();
    }
  }
  else {
    data.status = CollectionStatus.FAIL;
    console.log('updateCollectionStatus', data);
    await updateCollectionRecord(data);
    uni.showToast({ icon: 'none', title: '上传失败' });
    await recordStore.init();
    setTimeout(async () => {
      getRecord();
    }, 1000);
  }
};

// 初始化定时器
const initCollectionTimer = async () => {
  try {
    isShortCollect.value = true;
    await getCollectionId();
    await ensureDirectoryExists();
    if (countDown.value) {
      countDown.value.start();
    }
    uni.setStorageSync('shortTag', true);
    uni.setStorageSync('collectid', collectionId.value);
    uni.setStorageSync('pat_id', chooseShortMember.value!.uuid);
    uni.setStorageSync('collect_sta_tm', startCollectTime.value);
  }
  catch (error: any) {
    throw new Error('initCollectionTimer', error);
  }
};

/**
 * @param isUpload 是否上传数据
 * @param bluetoothBreak 是否蓝牙断开
 * @param disconnect 是否用户主动断开
 * @description 停止采集
 */
const stopCollection = async (isUpload: boolean = false, bluetoothBreak: boolean = false, disconnect: boolean = false) => {
  directoryPathIsExist.value = false;
  if (!isUpload) {
    notYourMember.value = false;
    isConnectedWiFi.value = false;
  }
  if (!isShortCollect.value) {
    return;
  }
  appendFile(collectionId.value, buffer.slice(0, offset.value).buffer);

  let status;
  if (bluetoothBreak) {
    status = count.value > invalidinterval.value
      ? CollectionStatus.INTERRUPT
      : CollectionStatus.INVALID_DATA;
  }
  else if (isUpload) {
    status = count.value > invalidinterval.value
      ? CollectionStatus.SUCCESS
      : CollectionStatus.INVALID_DATA;
  }
  else if (disconnect) {
    status = count.value > invalidinterval.value
      ? CollectionStatus.DISCONNECT
      : CollectionStatus.INVALID_DATA;
  }
  else {
    status = count.value > invalidinterval.value
      ? CollectionStatus.EXCEPTION
      : CollectionStatus.INVALID_DATA;
  }
  console.log('status', status);

  try {
    await updateCollectionStatus(status);
  }
  catch (error) {
    console.log(error);
  }

  clearTimer();
  countDown.value.reset();
  !isUpload && (notYourMember.value = false);
  count.value = 0;
  chooseShortMember.value = null;
  shortCollect.value = false;
  showCountDown.value = false;
  isShortCollect.value = false;
  notFullTimeModel.value = false;
  await recordStore.init();
  setTimeout(async () => {
    getRecord();
  }, 1000);
};

// 保存采集 并 上传
const saveSegment = async () => {
  if (count.value > invalidinterval.value) {
    uni.showLoading({ title: '保存中', mask: true });
    await stopCollection(true);
  }
  else {
    notFullTimeModel.value = true;
  }
};

// click save segment
const validateSaveSegment = async () => {
  if (!isCollection.value) {
    uni.showToast({ title: '请连接设备', icon: 'none' });
    return;
  }
  if (connectDeviceType.value !== '301B') {
    if (!registerMember.value?.pat_id && !notRegisterTag.value) {
      notRegisterModel.value = true;
      return;
    }
    if (!isConnectedWiFi.value && !setWiFiTag.value) {
      setWiFiModel.value = true;
      return;
    }
  }
  if (!chooseShortMember.value?.uuid) {
    saveSegmentModel.value = true;
  }
};

const saveEcgRecord = () => {
  saveSegmentModel.value = false;
  shortUserPopup.value = true;
};

const cancelSaveEcgRecord = () => {
  shortCollect.value = false;
  saveSegmentModel.value = false;
  chooseShortMember.value = null;
};

// 倒计时
const onTimeChange = (countdownProps: TimeDuration) => {
  count.value = maxinterval.value - countdownProps.minutes * 60 - countdownProps.seconds;
  timeData.value = countdownProps;
  uni.setStorageSync('duration', count.value);
};

const analyseByte = (byte: any) => {
  const byteArray = new Uint8Array(byte);
  const IData: number[] = Array.from({ length: 4 });
  const IIData: number[] = Array.from({ length: 4 });
  const IIIData: number[] = Array.from({ length: 4 });
  for (let i = 0; i < 4; i++) {
    const baseIndex = i * 4;
    const { data1, data2, data3 } = byte2data(byteArray[baseIndex + 2], byteArray[baseIndex + 3], byteArray[baseIndex + 4], byteArray[baseIndex + 5]);
    IData[i] = data1;
    IIData[i] = data2;
    IIIData[i] = data3;
  }
  // 保存心点数组数据 现在只传一个导联, 后面再拓展
  dataArray.push(...IData);
  leadCanvas.value?.update(IData, IIData, IIIData);
  if (!leadCanvas.value) {
    const query = uni.createSelectorQuery();
    query
      .select('#ecgCanvas')
      .fields({ size: true, node: true }, (res: any) => {
        const canvas = res.node; // 这是微信小程序的 Canvas 对象
        const ctx = canvas.getContext('2d'); // 获取 Canvas 的绘图上下文
        const dpr = wx.getSystemInfoSync().pixelRatio; // 获取设备的像素比
        const width = res.width;
        const height = res.height;
        canvas.width = width * dpr;// 设置 canvas 的宽度和高度
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);// 缩放 canvas 的绘图上下文
        leadCanvas.value = new HeartChart(ctx, width, height);// 确保 leadCanvas 是一个已经定义的响应式变量
      })
      .exec();
    ecgCanvasStore.setCanvasIns(leadCanvas.value);
  }
};

const disconnectBluetooth = async (tag: boolean = true) => {
  uni.showLoading({ title: '正在断开...', mask: true });
  if (tag) {
    await stopCollection(false, false, true);
  }

  SearchBluetoothIns.initBluetooth(() => {}, () => {});
  setTimeout(() => {
    connectDeviceType.value = '';
    ConnectBluetoothIns = new ConnectBluetooth(deviceId.value, '');
    ConnectBluetoothIns.closeBLEConnection(deviceId.value);
    deviceStore.setReconnect(true);
    deviceStore.setIsCollection(false);
    reconnect.value = true;
    isCollection.value = false;
    notYourMember.value = false;
    isConnectedWiFi.value = false;
    uni.hideLoading();
  }, 2000);
};

const confirmDisconnect = () => {
  disconnectBluetooth();
  disconnectModel.value = false;
  setTimeout(async () => {
    await recordStore.init();
    getRecord();
  }, 3000);
};

// 用户手动断开
const disconnect = async () => {
  if (shortCollect.value) {
    disconnectModel.value = true;
    return;
  }
  disconnectBluetooth(false);
};

// 搜索蓝牙设备
const searchBluetooth = () => {
  console.log(uni.getStorageSync('islogin'));
  if (!uni.getStorageSync('islogin')) {
    goLogin.value = true;
    return;
  }
  if (reconnect.value) {
    uni.showLoading({ title: '正在连接', mask: true });
    deviceId.value = deviceStore.getDeviceId;
    SearchBluetoothIns.initBluetooth(() => {}, () => {});
    setTimeout(async () => {
      ConnectBluetoothIns = new ConnectBluetooth(deviceId.value, '');
      const connect = await ConnectBluetoothIns.createBLEConnection();
      if (!connect) {
        uni.showToast({ title: '请检查设备是否开启', icon: 'none' });
        return;
      }
      const res = await ConnectBluetoothIns.getBLEServices();
      if (res) {
        deviceStore.setCharacteristicId(res.characteristicId);
        deviceStore.setServiceId(res.serviceId);
      }
      isCollection.value = true;
      getMemberInfo();
      isConnectedWiFi.value = true;
      deviceStore.setIsCollection(true);
      collectionHeartRateData();
      uni.showToast({ title: '连接成功', icon: 'none' });
    }, 1000);
    return;
  }
  uni.switchTab({ url: '/pages/tab/list/index' });
};

// 重新打开小程序的时候检查是否有短程采集,是否是异常断开或者蓝牙中断的情况
const check = async () => {
  if (uni.getStorageSync('shortTag')) {
    const collectid = uni.getStorageSync('collectid');
    const collect_sta_tm = uni.getStorageSync('collect_sta_tm');
    const pat_id = uni.getStorageSync('pat_id');
    const duration = uni.getStorageSync('duration');
    if (duration > invalidinterval.value) {
      const data: IUploadEcgRecord = {
        collect_sta_tm,
        pat_id,
        status: CollectionStatus.EXCEPTION, // 异常中断
        duration,
        collectid,
      };
      const { code } = await updateCollectionRecord(data);
      if (code === 'OK') {
        console.log('上次采集异常断开, 本次打开重新上传记录成功, 异常中断');
      }
    }
    else {
      const data: Omit<IUploadEcgRecord, 'status'> = {
        collect_sta_tm,
        pat_id,
        duration,
        collectid,
      };
      await updateCollectionStatus(CollectionStatus.INVALID_DATA, data);
    }
  }
};

// 查看是否登记用户是自己名下的
const getMemberInfo = async () => {
  try {
    const data = await getRegister2Service({
      acc_id: uni.getStorageSync('uuid'),
      dev_sn: deviceStore.getName,
      type: 'pat',
    });
    console.log('getMemberInfo', data);
    if (data?.length > 0) {
      if (data[0].owner === 'N') {
        notYourMember.value = true;
      }
      else if (data[0].owner === 'Y') {
        notYourMember.value = false;
        registerMember.value = data[0];
        memberStore.setMemberInfo(data[0]);
      }
    }
    else {
      notYourMember.value = false;
    }
  }
  catch (e) {
    console.log(e);
  }
};

onShow(async () => {
  wx.setKeepScreenOn({
    keepScreenOn: true,
  });

  setTimeout(() => {
    const ecgCanvas = ecgCanvasStore.getCanvasIns;
    console.log('ecgCanvas', ecgCanvas);
    if (!ecgCanvas) {
      const query = uni.createSelectorQuery();
      query
        .select('#ecgCanvas')
        .fields({ size: true, node: true }, (res: any) => {
          const canvas = res.node; // 这是微信小程序的 Canvas 对象
          const ctx = canvas.getContext('2d'); // 获取 Canvas 的绘图上下文
          const dpr = wx.getSystemInfoSync().pixelRatio; // 获取设备的像素比
          const width = res.width;
          const height = res.height;
          canvas.width = width * dpr;// 设置 canvas 的宽度和高度
          canvas.height = height * dpr;
          ctx.scale(dpr, dpr);// 缩放 canvas 的绘图上下文
          leadCanvas.value = new HeartChart(ctx, width, height);// 确保 leadCanvas 是一个已经定义的响应式变量
        })
        .exec();
      ecgCanvasStore.setCanvasIns(leadCanvas.value);
    }
    else {
      leadCanvas.value = ecgCanvas;
    }
  }, 500);

  // setTimeout(() => {
  //   const query = uni.createSelectorQuery();
  //   query
  //     .select('#ecgCanvas')
  //     .fields({ size: true, node: true }, (res: any) => {
  //       const canvas = res.node; // 这是微信小程序的 Canvas 对象
  //       const ctx = canvas.getContext('2d'); // 获取 Canvas 的绘图上下文
  //       const dpr = wx.getSystemInfoSync().pixelRatio; // 获取设备的像素比
  //       const width = res.width;
  //       const height = res.height;
  //       canvas.width = width * dpr;// 设置 canvas 的宽度和高度
  //       canvas.height = height * dpr;
  //       ctx.scale(dpr, dpr);// 缩放 canvas 的绘图上下文
  //       leadCanvas.value = new HeartChart(ctx, width, height);// 确保 leadCanvas 是一个已经定义的响应式变量
  //     })
  //     .exec();
  //   // ecgCanvasStore.setCanvasIns(leadCanvas.value);
  // }, 500);

  setTimeout(async () => {
    uni.onBLEConnectionStateChange(async (res) => {
      if (!res.connected) {
        await stopCollection(false, true);
        isCollection.value = false;
        deviceStore.setIsCollection(false);
        setTimeout(async () => {
          await recordStore.init();
          getRecord();
        }, 2000);
      }
      return false;
    });

    uni.onBLECharacteristicValueChange(async ({ value }) => {
      const hex = ab2hex(value);
      if (hex?.startsWith('aa06')) {
        if (hex === wifiSName.value) {
          wifiSPassword.value = await writeBLE(WriteBleType.WIFIPASS, WiFiPassword.value);
        }
        else {
          setWiFiTimer.value && clearInterval(setWiFiTimer.value);
          uni.hideLoading();
        }
      }
      else if (hex?.startsWith('aa07')) {
        if (hex === wifiSPassword.value) {
          uni.showToast({ title: 'WiFi保存成功', icon: 'none' });
          setWiFiTimer.value && clearInterval(setWiFiTimer.value);
          await writeBLE(WriteBleType.start, 'start');
          deviceStore.setWifiName(WiFiName.value);
          WiFiPassword.value = '';
          setWiFiPopup.value = false;
          isConnectedWiFi.value = true;
          WiFiName.value = localWiFiName.value;
        }
        else {
          uni.showToast({ icon: 'none', title: `WiFi设置失败` });
          await writeBLE(WriteBleType.start, 'start');
        }
      }
      else if (hex?.startsWith('aa03')) {
        const bytes = new Uint8Array(value);
        if (bytes[2]) {
          eletText.value = `${bytes[2]}%`;
        }
      }
      if (hex?.startsWith('aa01')) {
        if (connectDeviceType.value === '302') {
          const hexs = hex.split('ccaa01');
          // 处理第一个部分
          for (let i = 0; i < hexs.length - 1; i++) {
            if (i === 0) {
              const str = `${hexs[0]}cc`;
              const value: any = hex2ab(str);
              analyseByte(value);
              storeData(value);
            }
            else {
              const str = `aa01${hexs[i]}cc`;
              const value: any = hex2ab(str);
              analyseByte(value);
              storeData(value);
            }
          }
        }
        else {
          analyseByte(value);
          storeData(value);
        }
      }
      else {
        if (connectDeviceType.value === '302') {
          const str = `aa01${hex}`;
          const value: any = hex2ab(str);
          analyseByte(value);
          storeData(value);
        }
      }
      if (hex.startsWith('aa0e')) {
        const bytes = new Uint8Array(value);
        if (bytes[2] === 0) {
          uni.showToast({ icon: 'none', title: '格式化失败,请在开机1分钟内执行此操作' });
        }
        else {
          uni.showToast({ icon: 'none', title: '格式化成功' });
        }
      }
    });
  }, 1000);

  connectDeviceType.value = deviceStore.getDeviceType;
  isCollection.value = deviceStore.getIsCollection;
  deviceSN.value = deviceStore.getName;
  recordSNCode.value = deviceStore.getName;
  deviceId.value = deviceStore.getDeviceId;

  if (isCollection.value) {
    try {
      setTimeout(() => {
        writeBLE(WriteBleType.start, 'start');
      }, 200);
      setTimeout(() => {
        writeBLE(WriteBleType.start, 'start');
      }, 500);
      setTimeout(() => {
        writeBLE(WriteBleType.start, 'start');
      }, 800);
      console.log('onShow start');
    }
    catch (error) {
      console.log(error);
    }
    await getMemberInfo();
    registerMember.value = memberStore.getMemberInfo;
    GetWiFiIns.initWiFi(getWiFiName);
    collectionHeartRateData();
  }

  deviceList.value = uni.getStorageSync('devicelist') || [];

  if (uni.getStorageSync('islogin')) {
    await recordStore.init();
    const res = await getMember({ belongto: uni.getStorageSync('uuid') });
    memberStore.setMemberList(res);
    memberList.value = res;
    getRecord();
  }

  if (isCollection.value && connectDeviceType.value !== '301B') {
    if (!registerMember.value?.pat_id && !notRegisterTag.value) {
      notRegisterModel.value = true;
      return;
    }
    if (!isConnectedWiFi.value && !setWiFiTag.value) {
      setWiFiModel.value = true;
      return;
    }
  }

  sound.value = uni.getStorageSync('sound');
  autoUpload.value = uni.getStorageSync('autoUpload');
});

const closeSetWiFiPopup = () => {
  setWiFiPopup.value = false;
  WiFiPassword.value = '';
  showPassword.value = true;
};

// wifi是否设置成功
const checkSetWiFi = () => {
  setWiFiTimer.value = setInterval(async () => {
    if (setWiFiStartTime.value && new Date().getTime() - setWiFiStartTime.value > 5000) {
      uni.hideLoading();
      await writeBLE(WriteBleType.start, 'start');
      uni.showToast({ icon: 'none', title: 'WiFi设置失败,请稍后重试' });
      clearInterval(setWiFiTimer.value);
      setWiFiTimer.value = null;
      setWiFiStartTime.value = null;
    }
  }, 300);
};

const confirmSetWiFi = async () => {
  if (!isCollection.value) {
    uni.showToast({ icon: 'none', title: '请先连接设备' });
    return;
  }
  if (!localWiFiName.value || !WiFiPassword.value) {
    uni.showToast({ icon: 'none', title: '请输入WiFi名称和密码' });
    return;
  }
  // 校验wifi名称和密码只允许字母、数字、下划线
  if (/[\u4E00-\u9FA5]/.test(localWiFiName.value)) {
    uni.showToast({ icon: 'none', title: 'Wi-Fi名称不能包含中文' });
    return;
  }
  if (localWiFiName.value.length > 16) {
    uni.showToast({ icon: 'none', title: 'Wi-Fi名称不能超过16个字符' });
    return;
  }
  if (WiFiPassword.value.length < 8 || WiFiPassword.value.length > 16) {
    uni.showToast({ icon: 'none', title: 'Wi-Fi密码长度必须为8-16个字符' });
    return;
  }
  uni.showLoading({ title: '设置中', mask: true });
  setWiFiStartTime.value = new Date().getTime();
  await writeBLE(WriteBleType.end, 'end');
  checkSetWiFi();
  setTimeout(async () => {
    wifiSName.value = await writeBLE(WriteBleType.WIFINAME, localWiFiName.value);
  }, 500);
  console.log('localWiFiName.value', localWiFiName.value);
  await setWifiInfo({
    dev_sn: deviceStore.getName,
    wifi_name: localWiFiName.value,
  });
  setWiFiPopup.value = false;
};

// 点击tabbar切换
const clickTabbar = (path: string) => {
  if (!uni.getStorageSync('islogin')) {
    goLogin.value = true;
    return;
  }
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
        path: '/pages/user/index?from=collection',
        envVersion: import.meta.env.VITE_APP_ENV === 'development' ? 'trial' : 'release',
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

const chooseUser = () => {
  userPopup.value = true;
  incidentRecord.value = false;
};

const checkSN = () => {
  SNCodePopup.value = true;
  incidentRecord.value = false;
};

const chooseSNCode = (name: string) => {
  recordSNCode.value = name;
  SNCodePopup.value = false;
  incidentRecord.value = true;
};

const chooseTime = () => {
  incidentTime.value = recordTime.value.slice(0, 5);
  timePopup.value = true;
  incidentRecord.value = false;
};

const recordPopupClose = () => {
  voiceList.value.length = 0;
  recordSNCode.value = '';
  recordUser.value = '';
  // recordTime.value = dayjs().format('HH:mm:ss.SSS');
  incidentRecordText.value = '';
  incidentRecord.value = false;
  SNCodePopup.value = false;
  if (innerAudioContext !== null) {
    innerAudioContext.destroy();
    innerAudioContext.src = '';
  }
};

// 事件记录upload
const recordPopupConfirm = async () => {
  if (innerAudioContext !== null) {
    innerAudioContext?.destroy();
    innerAudioContext || (innerAudioContext.src = '');
  }
  if (!recordSNCode.value) {
    return uni.showToast({
      title: '请选择设备码',
      icon: 'none',
    });
  }
  if (!recordUser.value) {
    return uni.showToast({
      title: '请选择成员',
      icon: 'none',
    });
  }
  if (!recordTime.value) {
    return uni.showToast({
      title: '请选择时间',
      icon: 'none',
    });
  }
  if (voiceList.value.length === 0 && !incidentRecordText.value.trim()) {
    return uni.showToast({
      title: '请填写事件描述或上传事件录音!',
      icon: 'none',
    });
  }

  uni.showLoading({ title: '记录中...', mask: true });
  const [h, m, s] = recordTime.value.split(':');
  const [ss, ms] = s.split('.');
  const unix = dayjs().set('hour', Number(h)).set('minute', Number(m)).set('second', Number(ss)).set('millisecond', Number(ms)).valueOf();
  const params: GetIncidentListParams = {
    acc_id: uni.getStorageSync('uuid'),
    pat_id: recordUserUuid.value,
    device_id: recordSNCode.value,
    event_sta_tm: `${unix}`,
    remark: incidentRecordText.value,
  };
  try {
    const res = await addIncidentList(params);
    if (res.code === 'OK') {
      recordUser.value = '';
      incidentRecordText.value = '';
      incidentRecord.value = false;
      SNCodePopup.value = false;
      if (voiceList.value.length > 0) {
        for (const v of voiceList.value) {
          uni.uploadFile({
            url: `${import.meta.env.VITE_APP_BASE_API}/bu/pat_coll/event/upload`,
            filePath: v.path,
            name: 'file',
            formData: {
              event_id: res.event_id,
            },
            success: (res) => {
              console.log('success', res);
            },
            fail: (err) => {
              console.log('123123', err);
            },
            complete: () => {
              console.log('complete');
              voiceList.value.length = 0;
            },
          });
        }
      }
      uni.showToast({ title: '记录成功', icon: 'none' });
    }
    else {
      uni.showToast({ title: '服务器开小差了~', icon: 'none' });
    }
  }
  catch (error) {
    uni.showToast({ title: '服务器开小差了~', icon: 'none' });
  }
};

const SNCodePopupClose = () => {
  incidentRecord.value = true;
  SNCodePopup.value = false;
};

// closeQuickAddMember 关闭快捷添加
const closeQuickAddMember = () => {
  quickAddMember.value = false;
  quickAddMemberForm.value.name = null;
  sex.value = '';
  birthString.value = '';
};

// cancelQuickAddMember 取消快捷添加
const cancelQuickAddMember = () => {
  quickAddMember.value = false;
  shortUserPopup.value = true;
  quickAddMemberForm.value.name = null;
  sex.value = '';
  birthString.value = '';
};

// confirmQuickAddMember 确认快捷添加
const confirmQuickAddMember = async () => {
  for (const item of memberList.value) {
    if (item.name === quickAddMemberForm.value.name) {
      uni.showToast({ icon: 'none', title: '该成员名称已存在' });
      return;
    }
  }
  uni.showLoading({ title: '保存中', mask: true });
  console.log('点击了保存', sex.value.length);
  if (!sex.value.length) {
    uni.showToast({ icon: 'none', title: '请选择性别' });
    return;
  }
  quickAddMemberForm.value.gender = sex.value === '男' ? 0 : 1;
  console.log('点击了保存', quickAddMemberForm.value);
  if (!validForm(quickAddMemberForm.value))
    return;
  quickAddMemberForm.value.belongto = uni.getStorageSync('uuid');
  const ans = await addMember(quickAddMemberForm.value);
  console.log('保存结果', ans);
  if (ans.code === 'NG') {
    uni.showToast({ title: ans.message, icon: 'none' });
  }
  else {
    uni.showToast({ title: '保存成功', icon: 'none' });
    activeUserIndex.value = 0;
    quickAddMemberForm.value.name = null;
    sex.value = '';
    birthString.value = '';
    const res = await getMember({ belongto: uni.getStorageSync('uuid') });
    memberStore.setMemberList(res);
    memberList.value = res;
    quickAddMember.value = false;
    shortUserPopup.value = true;
  }
};

// handleNameInput
const handleNameInput = (e: any) => {
  quickAddMemberForm.value.name = e.detail.value;
};

// handleSexClick
const handleSexClick = () => {
  quickAddMember.value = false;
  genderPickerShow.value = true;
};

// handleDateClick
const handleDateClick = () => {
  birthdayPickerShow.value = true;
  quickAddMember.value = false;
};

const genderConfirm = ({ value }: { value: string[] }) => {
  console.log('点击了性别', value[0]);
  sex.value = value[0];
  genderPickerShow.value = false;
  quickAddMember.value = true;
};

const birthdayConfirm = ({ value }: { value: string }) => {
  console.log('点击了出生日期', value);
  quickAddMemberForm.value.birth = `${value}`;
  const formattedValue = dayjs(Number(value)).format('YYYY-MM-DD');
  birthString.value = formattedValue;
  birthdayPickerShow.value = false;
  quickAddMember.value = true;
};
const birthdayCancel = () => {
  birthdayPickerShow.value = false;
  quickAddMember.value = true;
};

const SNCodePopupConfirm = () => {
  incidentRecord.value = true;
  SNCodePopup.value = false;
};

const userPopupClose = () => {
  incidentRecord.value = true;
  userPopup.value = false;
};

// 快捷添加成员
const shortUserPopupClose = () => {
  if (memberList.value && memberList.value.length >= 5) {
    uni.showToast({ title: '当前家庭成员数量已达到5人上限', icon: 'none', duration: 3000 });
    return;
  }
  shortUserPopup.value = false;
  quickAddMember.value = true;
};

// shortUserPopupConfirm 确定短程采集成员
const shortUserPopupConfirm = async () => {
  try {
    maxinterval.value = uni.getStorageSync('maxinterval');
    invalidinterval.value = uni.getStorageSync('invalidinterval');
    millisecond.value = maxinterval.value * 1000;
    shortUserPopup.value = false;
    const user = memberList.value[activeUserIndex.value];
    shortCollect.value = true;
    chooseShortMember.value = user;
    showCountDown.value = true;
    await initCollectionTimer();
  }
  catch (error: any) {
    throw new Error('shortUserPopupConfirm', error);
  }
};

// 获取电池电量
const getBattery = async () => {
  try {
    await writeBLE(WriteBleType.ELEC, 'elec');
  }
  catch (error) {
    console.log(error);
  }
};

const userPopupConfirm = () => {
  console.log(memberList.value[activeUserIndex.value]);
  recordUser.value = memberList.value[activeUserIndex.value].name;
  recordUserUuid.value = memberList.value[activeUserIndex.value].uuid;
  incidentRecord.value = true;
  userPopup.value = false;
};

const datePickerCancel = () => {
  incidentRecord.value = true;
  timePopup.value = false;
};

const datePickerConfirm = (date: any) => {
  timePopup.value = false;
  incidentRecord.value = true;
  recordTime.value = `${date.value}:00.000`;
};

// 历史记录页
const historyRecord = () => {
  uni.navigateTo({ url: '/pages/record/index' });
};

const clickWiFiCard = () => {
  if (!isCollection.value) {
    uni.showToast({ icon: 'none', title: '请先连接设备~' });
    return;
  }
  setWiFiPopup.value = true;
};

// 获取成员
const getMemberList = async () => {
  const res = await getMember({ belongto: uni.getStorageSync('uuid') });
  memberStore.setMemberList(res);
  memberList.value = res;
};

const closeLoginForm = () => {
  uni.showToast({ icon: 'none', title: '登录后才可以使用~' });
  goLogin.value = false;
};

const checkAgree = () => {
  if (!aloneChecked.value) {
    uni.showToast({ icon: 'none', title: '请勾选同意协议' });
  }
};

const getPhoneNumber = async (e: any) => {
  if (!uni.getStorageSync('islogin')) {
    const { code } = await wxLogin();
    if (code === 'NG')
      return;
    const { unionid, openid } = await loginByCode(code);
    uni.setStorageSync('unionid', unionid);
    uni.setStorageSync('openid', openid);
    const user = await getUserInfoByUnionId(unionid, '30x');
    if (user.code !== 'NG') {
      if (!user.openid_coll) {
        await uploadUser({
          uuid: user.uuid,
          openid_coll: openid,
        });
      }
      uni.setStorageSync('uuid', user.uuid);
      uni.setStorageSync('islogin', true);
      await recordStore.init();
      await getMemberList();
      getRecord();
      return;
    }
  }
  if (!e.detail.code) {
    uni.showToast({ icon: 'none', title: '登录前请授权获取手机号' });
    return;
  }
  const phoneInfo = await getUserPhonenumber(e.detail.code);
  const sign: SignUpParams = {
    unionid: uni.getStorageSync('unionid'),
    openid_coll: uni.getStorageSync('openid'),
    nickname: uni.getStorageSync('nickname'),
    avatarUrl: uni.getStorageSync('avatarurl'),
    mobile: phoneInfo.phone_info.purePhoneNumber,
    app: '30x',
  };
  const res = await signUp(sign);
  uni.setStorageSync('uuid', res.uuid);
  uni.setStorageSync('user', res);
  uni.setStorageSync('islogin', true);
  await getMemberList();
  goLogin.value = false;
};
// 点击查看法律
const showLaws = (type: string) => {
  uni.navigateTo({ url: `/pages/laws/index?type=${type}` });
};
</script>

<style lang="scss" scoped>
@keyframes line-scale-pulse-out {
  0% {
    transform: scaleY(1);
  }

  50% {
    transform: scaleY(0.4);
  }

  100% {
    transform: scaleY(1);
  }
}

.format-wrap{
  background: rgba(253, 127, 24, 0.1);
  border-radius: 16rpx 16rpx 16rpx 16rpx;
  padding: 24rpx;
  color: rgba(253, 127, 24, 1);
}

.pulse-line {
  display: inline-block;
  margin: 0 4rpx;
  width: 8rpx;
  height: 70rpx;
  background-color: #4F95FF;
  border-radius: 4rpx;
  animation: line-scale-pulse-out 0.9s infinite cubic-bezier(0.85, 0.25, 0.37, 0.85);
  animation-fill-mode: both;
}

.pulse-line:nth-child(odd) {
  animation-delay: -0.4s !important;
}

.pulse-line:nth-child(even) {
  animation-delay: -0.2s !important;
}

.loader.loaded {
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 32rpx;
  padding-left: 32rpx;
  height: 120rpx;
  background: #FFF;
  border-radius: 16rpx;
  box-sizing: border-box;
  // border: 2rpx solid #DCDCDC;
}

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

.my-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 24rpx;
  padding-left:24rpx;
  // m-t-40 box-border flex items-center justify-between b-b-1 b-b-#DCDCDC b-b-solid px-24 lh-80
  margin-top: 40rpx;
  box-sizing: border-box;
  border-bottom: 1rpx solid #DCDCDC;
  line-height: 80rpx;
}

.fe-btn{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80rpx;
  font-size: 32rpx;
  border-radius: 16rpx;
}

.bpm{
  // z-10 m-l-auto m-r-24 m-t-8 h-52rpx w-146rpx flex-center gap-8 border-rd-98 bg-#FF3F3F p-r-30 text-24 text-white
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  // width: 176rpx;
  padding-right: 24rpx;
  padding-left: 24rpx;
  margin-top: 8rpx;
  margin-right: 24rpx;
  margin-left: auto;
  height: 52rpx;
  color: #fff;
  background-color: #FF3F3F;
  border-radius: 98rpx;
  gap: 8rpx;
}

:deep(.u-count-down__text){
  color: #fff;
}

.guide{
  z-index: 100;
  background: linear-gradient( 180deg, #EAF2FF 0%, #FFF 100%);
  border: 1rpx solid #4F95FF;
  border-radius: 16rpx;
}

.triangle-up {
    position: absolute;
    // 三角形
    width: 40rpx;
    height: 40rpx;
    background-color: #EAF2FF;
    border: 1px solid #4F95FF;
    border-width: 1px 0 0 1px;
    transform: rotate(45deg);
}

.device-title-name{
  width: 190rpx;
  text-align: center;
  white-space: nowrap;
  font-size: 40rpx;
  color: #2F384C;
}

.collect-btn{
  overflow: hidden;
  padding: 8rpx 30rpx;
  margin-top: 18rpx;
  width: 190rpx;
  height: 58rpx;
  font-size: 26rpx;
  border-radius: 170rpx;
  box-sizing: border-box;
}

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.5s ease;
}

.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

.fade-slide-leave-active {
  position: absolute;
  width: 100%;
}

.b-btn-wrap{
  overflow: hidden;
  transition: height 0.5s ease;

  &-countdown {
    height: 0;
    opacity: 0;
    transition: height 0.5s ease, opacity 0.5s ease;
  }

  &-show {
    height: auto; /* 设置为自动适应内容高度 */
    opacity: 1;
  }

  .history-wrap{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16rpx 32rpx;
    margin-bottom: 30rpx;
    width: 100%;
    height: 68rpx;
    font-size: 24rpx;
    color: #999;
    background: #FFF;
    border-radius: 16rpx;
    box-sizing: border-box;
  }
}

.red-dot {
  display: inline-block;      /* 使其像一个块元素一样显示 */
  width: 10rpx;               /* 红点的宽度 */
  height: 10rpx;              /* 红点的高度 */
  background-color: #FF3F3F;      /* 红点的背景颜色 */
  border-radius: 50%;         /* 将红点变成圆形 */
}
</style>
