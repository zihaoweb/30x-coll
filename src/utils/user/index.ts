export function wxLogin(): Promise<UniApp.LoginRes> {
  return new Promise((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: async (result: UniApp.LoginRes) => {
        uni.getUserInfo({
          provider: 'weixin',
          success: (infoRes) => {
            const { nickName, avatarUrl } = infoRes.userInfo;
            uni.setStorageSync('nickname', nickName);
            uni.setStorageSync('avatarurl', avatarUrl);
          },
        });
        if (result.code) {
          resolve(result);
        }
        else {
          reject(new Error('Login failed, no code returned'));
        }
      },
      fail: (err: any) => {
        console.error(`login error: ${err}`);
        reject({ code: 'NG' }); // 确保在失败的情况下也处理 promise
      },
    });
  });
}

export function getUserInfo(): Promise<UniApp.GetUserInfoRes> {
  return new Promise((resolve, reject) => {
    uni.getUserInfo({
      provider: 'weixin',
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        console.error(`getUserInfo error: ${err}`);
        reject(err);
      },
    });
  });
}
