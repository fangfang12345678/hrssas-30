import router from "./router";
import store from "./store";
import NProgress from "nprogress"; // 引入一份进度条插件
import "nprogress/nprogress.css"; // 引入进度条样式

const whitelist = ["/login", "/404"];
//前置守卫
router.beforeEach(async (to, from, next) => {
  NProgress.start();
  if (store.getters.token) {
    if (!store.getters.userId) {
      const res = await store.dispatch("user/getUserInfo");
      console.log(res.roles.menus);
      const routers = await store.dispatch(
        "permission/filterRouters",
        res.roles.menus
      );
      router.addRoutes([
        ...routers,
        { path: "*", redirect: "/404", hidden: true },
      ]);
      next(to.path);
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
// 后置首位
router.afterEach(() => {
  NProgress.done();
});
