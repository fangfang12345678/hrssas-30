<template>
  <div>
    <el-upload
      list-type="picture-card"
      :before-upload="beforeUpload"
      :on-preview="preview"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :file-list="fileList"
      :limit="1"
      action="#"
      :class="{ complated: iscomplated }"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress
      v-if="showPercent"
      :percentage="percent"
      label-width="200px"
    ></el-progress>
    <el-dialog title="图片" :visible.sync="showDialog">
      <img :src="imgUrl" style="width: 100%" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import COS from "cos-js-sdk-v5";
// 需要实例化
const cos = new COS({
  SecretId: "AKID51jDSTItFMGwNZWFjyyjFWYNyKRJwLVQ",
  SecretKey: "iBPOAi15wYv3wa0B7nEQN5XlkUzFG1Xo",
});
// 实例化的包 已经具有了上传的能力 可以上传到该账号里面的存储桶了
export default {
  data() {
    return {
      showPercent: false,
      percent: 0,
      fileList: [
        {
          url: "https://inews.gtimg.com/newsapp_bt/0/13960022516/641",
        },
      ], // 图片地址设置为数组
      showDialog: false, // 控制显示弹层
      imgUrl: "",
    };
  },
  computed: {
    iscomplated() {
      return this.fileList.length === 1;
    },
  },
  methods: {
    preview(file) {
      // 这里应该弹出一个层 层里是点击的图片地址
      this.imgUrl = file.url;
      this.showDialog = true;
    },
    handleRemove(file, fileList) {
      //this.fileList = this.fileList.filter((item) => item.uid!== file.uid)
      this.fileList = fileList;
    },
    changeFile(file, fileList) {
      this.fileList = fileList;
    },
    beforeUpload(file) {
      // 要开始做文件上传的检查了
      // 文件类型 文件大小
      const types = ["image/jpeg", "image/gif", "image/bmp", "image/png"];
      if (!types.includes(file.type)) {
        this.$message.error("上传图片只能是 JPG、GIF、BMP、PNG 格式!");
        return false;
      }
      //  检查大小
      const maxSize = 5 * 1024 * 1024; // 1M=1024KB 1KB = 1024B
      if (maxSize < file.size) {
        this.$message.error("图片大小最大不能超过5M");
        return false;
      }
      this.showPercent = true;
      return true;
    },
    upload(params) {
      //   console.log(params.file)
      if (params.file) {
        // 执行上传操作
        cos.putObject(
          {
            Bucket: "renzi-123-1313213538", // 存储桶
            Region: "ap-nanjing", // 地域
            Key: params.file.name, // 文件名
            Body: params.file, // 要上传的文件对象
            StorageClass: "STANDARD", // 上传的模式类型 直接默认 标准模式即可
            // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
            onProgress: ({ percent }) => {
              this.percent = percent * 100;
            },
          },
          (err, data) => {
            // data返回数据之后 应该如何处理
            if (err) {
              return this.$message.error(err.message || "上传失败");
            }
            this.fileList.forEach((item) => {
              if (item.uid === params.file.uid) {
                item.url = `http://${data.Location}`;
                item.upload = true;
              }
            });
            // console.log(err || data);
            setTimeout(() => {
              this.showPercent = false; // 隐藏进度条
              this.percent = 0; // 进度归0
            }, 2000);
          }
        );
      }
    },
  },
};
</script>
<style scoped lang="scss">
.complated {
  ::v-deep.el-upload--picture-card {
    display: none;
  }
}
</style>
