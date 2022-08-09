import { getToken, setToken, removeToken } from "@/utils/auth";
import { login } from "@/api/user";
import { getUserInfo, getUserDetailById } from "@/api/user";
import { setTimeStamp } from "@/utils/auth";
import { resetRouter } from "@/router/index";
// 状态
const state = {
  token: getToken(),
  userInfo: {},
};
// 修改状态
const mutations = {
  // 设置token
  setToken(state, token) {
    state.token = token; // 设置token  只是修改state的数据  123 =》 1234
    // vuex变化 => 缓存数据
    setToken(token); // vuex和 缓存数据的同步
  },
  // 删除缓存
  removeToken(state) {
    state.token = null; // 删除vuex的token
    removeToken(); // 先清除 vuex  再清除缓存 vuex和 缓存数据的同步
  },
  removeUserInfo(state) {
    state.userInfo = {};
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo;
  },
};

// 执行异步
const actions = {
  async login(context, data) {
    setTimeStamp();
    // console.log(context);
    const res = await login(data);
    // console.log(res);
    context.commit("setToken", res);
  },
  // 获取用户资料action
  async getUserInfo(context) {
    const result = await getUserInfo(); // 获取返回值
    const baseInfo = await getUserDetailById(result.userId);
    const baseResult = { ...result, ...baseInfo };
    context.commit("setUserInfo", baseResult); // 将整个的个人信息设置到用户的vuex数据中
    return baseResult; // 这里为什么要返回 为后面埋下伏笔
  },
  // 登出的action
  logout(context) {
    // 删除token
    context.commit("removeToken"); // 不仅仅删除了vuex中的 还删除了缓存中的
    // 删除用户资料
    context.commit("removeUserInfo"); // 删除用户信息
    // 重置路由
    resetRouter();
    // 还有一步  vuex中的数据是不是还在
    // 要清空permission模块下的state数据
    // vuex中 user子模块  permission子模块
    // 子模块调用子模块的action  默认情况下 子模块的context是子模块的
    // 父模块 调用 子模块的action
    context.commit("permission/setRouters", [], { root: true });
    // 子模块调用子模块的action 可以 将 commit的第三个参数 设置成  { root: true } 就表示当前的context不是子模块了 而是父模块
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
