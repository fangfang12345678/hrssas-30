import { constantRoutes, asyncRoutes } from "@/router/index";
const state = {
  routers: constantRoutes,
};
const mutations = {
  setRouters(state, newRouter) {
    state.routers = [...state.routers, ...newRouter];
  },
};
const actions = {
  filterRouters(context, menus) {
    const resRouters = asyncRoutes.filter((item) => menus.includes(item.name));
    context.commit("setRouters", resRouters);
    return resRouters;
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
