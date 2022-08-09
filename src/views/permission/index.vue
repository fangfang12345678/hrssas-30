<template>
  <div class="app-container">
    <!-- 靠右的按钮 -->
    <page-tools>
      <template v-slot:after>
        <el-button type="primary" size="small" @click="addPermission('0', 1)"
          >添加权限</el-button
        >
      </template>
    </page-tools>
    <!-- 表格 -->
    <el-table border :data="list" row-key="id">
      <el-table-column align="center" label="名称" prop="name" />
      <el-table-column align="center" label="标识" prop="code" />
      <el-table-column align="center" label="描述" prop="description" />
      <el-table-column align="center" label="操作">
        <template v-slot="{ row }">
          <el-button type="text" @click="addPermission(row.id, 2)"
            >添加</el-button
          >
          <el-button type="text" @click="editPermission(row.id)"
            >编辑</el-button
          >
          <el-button type="text" @click="delPermission(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 放置一个弹层 用来编辑新增节点 -->
    <el-dialog :title="`${title}权限点`" :visible="showDialog" @close="close">
      <!-- 表单 -->
      <el-form
        label-width="120px"
        :model="formData"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item label="权限名称" prop="name">
          <el-input style="width: 90%" v-model="formData.name" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input style="width: 90%" v-model="formData.code" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input style="width: 90%" v-model="formData.description" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch active-value="1" inactive-value="0" v-model="value" />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOk">确定</el-button>
          <el-button size="small">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPermissionList,
  addPermission,
  delPermission,
  getPermissionDetail,
  updatePermission,
} from "@/api/permisson";
import { transTree } from "@/utils/index";
export default {
  data() {
    return {
      value: false,
      showDialog: false,
      list: [],
      formData: {
        name: "", // 名称
        code: "", // 标识
        description: "", // 描述
        type: "", // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: "", // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: "0", // 开启},
      },
      rules: {
        name: [{ required: true, message: "请填写名称", trigger: "blur" }],
        code: [{ required: true, message: "权限标识", trigger: "blur" }],
      },
    };
  },
  computed: {
    title() {
      return this.formData.id ? "编辑" : "增加";
    },
  },
  created() {
    this.getPermissionList();
  },
  methods: {
    async editPermission(id) {
      this.formData = await getPermissionDetail(id);
      this.showDialog = true;
    },
    async delPermission(id) {
      this.$confirm("确定删除吗？");
      await delPermission(id);
      //重新拉取数据
      await this.getPermissionList();
    },
    async btnOk() {
      await this.$refs.formRef.validate();
      if (this.formData.id) {
        //编辑
        updatePermission(this.formData);
      } else {
        await addPermission(this.formData);
        console.log(this.formData);
      }
      this.$message.success(`${this.title}权限点成功`);
      await this.getPermissionList();
      this.close();
    },
    close() {
      this.$refs.formRef.resetFields();
      this.formData = {
        name: "", // 名称
        code: "", // 标识
        description: "", // 描述
        type: "", // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: "", // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: "0", // 开启},}
      };
      this.showDialog = false;
    },
    addPermission(pid, type) {
      this.formData.pid = pid;
      this.formData.type = type;
      this.showDialog = true;
    },

    async getPermissionList() {
      this.list = await getPermissionList();
      this.list = transTree(this.list, "0");
    },
  },
};
</script>

<style></style>
