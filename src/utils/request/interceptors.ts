import type {
  HttpRequestConfig,
  HttpResponse,
} from 'uview-plus/libs/luch-request/index';

function requestInterceptors() {
  /**
   * 请求拦截
   * @param {object} http
   */
  uni.$u.http.interceptors.request.use(
    (config: HttpRequestConfig) => config,
    // (
    //   config: any, // 可使用async await 做异步操作
    // ) => Promise.reject(config),
  );
}
function responseInterceptors() {
  /**
   * 响应拦截
   * @param {object} http
   */
  uni.$u.http.interceptors.response.use(
    async (response: HttpResponse) => response.data,
    /* 对响应成功做点什么 可使用async await 做异步操作 */

    // // 配置参数
    // // 自定义参数
    // const custom = config?.custom;

    // 请求成功则返回结果
    // if (data.code === 200 || response.statusCode === 200) {
    //   return data || {};
    // }
    // else {
    //   // 否则返回一个pending中的promise
    //   return new Promise(() => {});
    // }
    // ,
    // (response: HttpError) => {
    //   if (response.statusCode) {
    //     // 请求已发出，但是不在2xx的范围
    //     showMessage(response.statusCode);
    //     return Promise.reject(response.data);
    //   }
    //   showMessage('网络连接异常,请稍后再试!');
    // },
  );
}

export { requestInterceptors, responseInterceptors };
