import Vue from "vue";
import print from "vue-print-nb";
import "normalize.css/normalize.css"; // A modern alternative to CSS resets
import * as filters from "@/filters"; // 引入工具类

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/en"; // lang i18n

import "@/styles/index.scss"; // global css

import App from "./App";
import store from "./store";
import router from "./router";

import "@/icons"; // icon
import "@/permission"; // permission control
import * as directives from "@/directives";
Vue.use(print);
for (const key in directives) {
  Vue.directive(key, directives[key]);
}
//Vue.use可以传入对象和函数。传入对象，提供install方法，自动调用对象的install方法，然后把Vue传入。函数的话是直接调用函数，然后把Vue传入。
import Component from "@/components";
Vue.use(Component); // 注册自己的插件
// 注册全局的过滤器
Object.keys(filters).forEach((key) => {
  // 注册过滤器
  Vue.filter(key, filters[key]);
});

// set ElementUI lang to EN
Vue.use(ElementUI, { locale });
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});
