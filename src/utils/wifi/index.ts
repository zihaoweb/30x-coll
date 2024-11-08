export class GetWiFi {
  initWiFi(GetWiFiNameCallBack: Function) {
    return new Promise(() => {
      uni.startWifi({
        success: () => {
          this.getWfFiInfo(GetWiFiNameCallBack);
        },
        fail(err) {
          console.log('初始化WiFi失败', err);
        },
      });
    });
  }

  getWfFiInfo(cb: Function) {
    return new Promise(() => {
      uni.getConnectedWifi({
        success(res) {
          cb(res);
          console.log(res);
        },
        fail(err) {
          cb(err);
          console.log(err);
        },
        complete: () => {
          uni.stopWifi();
        },
      });
    });
  }
}
