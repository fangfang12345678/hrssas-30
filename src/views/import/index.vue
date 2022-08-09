<template>
  <!-- 公共导入组件 -->
  <uploadExcel :on-success="success" />
</template>
<script>
// import uploadExcel from "@/views/UploadExcel";
import { importEmployee } from "@/api/employees";
export default {
  methods: {
    async success({ results }) {
      const userRelations = {
        入职日期: "timeOfEntry",
        手机号: "mobile",
        姓名: "username",
        转正日期: "correctionTime",
        工号: "workNumber",
      };
      //处理数据
      const resArr = results.map((item) => {
        const obj = {};
        for (const itemKey in item) {
          if (
            ["timeOfEntry", "correctionTime"].includes(userRelations[itemKey])
          ) {
            userInfo[userRelations[key]] = new Date(
              this.formatDate(item[key], "/")
            );
          } else {
            obj[userRelations[itemKey]] = item[itemKey];
          }
        }
        return obj;
      });
      console.log(resArr);
      await importEmployee(resArr);
      this.$message.success("导入成功");
    },
    // excel中的时间是一个数字，需要调用此方法进行处理 -> 直接复制
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1);
      time.setYear(time.getFullYear() - 70);
      const year = time.getFullYear() + "";
      const month = time.getMonth() + 1 + "";
      const date = time.getDate() - 1 + "";
      if (format && format.length === 1) {
        return year + format + month + format + date;
      }
      return (
        year +
        (month < 10 ? "0" + month : month) +
        (date < 10 ? "0" + date : date)
      );
    },
  },
};
</script>
