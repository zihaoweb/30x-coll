export default class RecorderManagerWrapper {
  private recorderManager: UniApp.RecorderManager;
  private isAuthorized: boolean = false;
  private onFilePathReady: (filePath: string) => void;

  constructor(onFilePathReady: (filePath: string) => void) {
    this.recorderManager = uni.getRecorderManager();
    this.onFilePathReady = onFilePathReady;
    this.initializeRecorderEvents();
  }

  // 初始化录音事件
  private initializeRecorderEvents() {
    this.recorderManager.onStop((res) => {
      console.log('录音已停止', res);
      this.onFilePathReady(res.tempFilePath);
    });
  }

  // 检查授权状态并请求授权
  public async checkAndRequestAuthorization(): Promise<boolean> {
    if (this.isAuthorized) {
      return true;
    }

    return new Promise((resolve) => {
      uni.authorize({
        scope: 'scope.record',
        success: () => {
          this.isAuthorized = true;
          console.log('录音授权成功');
          resolve(true);
        },
        fail: (err) => {
          console.log('录音授权失败', err);
          resolve(false);
        },
      });
    });
  }

  // 开始录音
  public startRecording() {
    if (!this.isAuthorized) {
      console.log('未授权录音，无法开始');
      return;
    }

    console.log('开始录音');
    this.recorderManager.start({
      duration: 120000, // 录音时长，最大120秒
      format: 'acc', // 录音格式
    });
  }

  // 停止录音
  public stopRecording() {
    console.log('停止录音');
    this.recorderManager.stop();
  }
}
