import axios from "axios";
import { Message } from "element-ui";
import store from "@/store";
import { getTimeStamp, setTimeStamp } from "@/utils/auth";
import router from "@/router";
//创建axios实例
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000,
});
//请求拦截器
const timeOut = 6000000;
function IsCheckTimeOut() {
  return Date.now() - getTimeStamp() < timeOut;
}

request.interceptors.request.use(
  (config) => {
    // console.log(config);
    if (store.getters.token) {
      if (IsCheckTimeOut()) {
        config.headers.Authorization = `Bearer ${store.getters.token}`;
      } else {
        // token没用了 因为超时了
        store.dispatch("user/logout"); // 登出操作
        // 跳转到登录页
        router.push("/login");
        return Promise.reject(new Error("token超时了"));
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // axios默认加了一层data
    const { success, message, data } = response.data;
    const res = response.data;
    //   要根据success的成功与否决定下面的操作
    if (success) {
      return data;
    } else {
      // 业务已经错误了 还能进then ? 不能 ！ 应该进catch
      Message.error(message); // 提示错误消息
      return Promise.reject(new Error(message));
    }

  },
  (error) => {
    if (error.response.status === 401) {
      store.dispatch("user/logout");
      router.push("/login");
    }
    Message.error(error.message || "系统错误"); // 提示错误信息
    return Promise.reject(error); // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
  }
);

//默认导出request请求
export default request;
