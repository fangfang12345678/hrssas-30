// import PageTools fron '@/components/PageTools',
// export default {
//   install(Vue) {
//     Vue.component(PageTools,PageTools)
//   }
// }
// 该文件负责所有的公共的组件的全局注册   Vue.use
import PageTools from "./PageTools";
import UploadExcel from "./UploadExcel";
import ImageUpload from "./ImageUpload";
export default {
  install(Vue) {
    //  注册全局的通用栏组件对象
    Vue.component("PageTools", PageTools);
    Vue.component("UploadExcel", UploadExcel);
    Vue.component("ImageUpload", ImageUpload); // 注册导入上传组件
  },
};
