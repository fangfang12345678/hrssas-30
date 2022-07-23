import router from "./router";
import store from "./store";
import NProgress from "nprogress"; // 引入一份进度条插件
import "nprogress/nprogress.css"; // 引入进度条样式

const whitelist = ["/login", "/404"];
router.beforeEach(async (to, from, next) => {
  NProgress.start();
  if (store.getters.token) {
    if (!store.getters.userId) {
      await store.dispatch("user/getUserInfo");
    }
    if (to.path === "/login") {
      next("/");
    } else {
      next();
    }
  } else {
    if (whitelist.includes(to.path)) {
      next();
    } else {
      next("/login");
    }
  }
  NProgress.done();
});
router.afterEach(() => {
  NProgress.done();
});
