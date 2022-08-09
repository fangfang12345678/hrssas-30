<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="`${showTitle}部门`" :visible="isAhowDep" @close="close">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form label-width="120px" :model="formData" :rules="rules" ref="form">
      <el-form-item label="部门名称" prop="name">
        <el-input
          style="width: 80%"
          placeholder="1-50个字符"
          v-model="formData.name"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          style="width: 80%"
          placeholder="1-50个字符"
          v-model="formData.code"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          @focus="chooseEmp"
          style="width: 80%"
          placeholder="请选择"
          v-model="formData.manager"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :value="item.username"
          >
          </el-option
        ></el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
          v-model="formData.introduce"
        />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="submit">确定</el-button>
        <el-button size="small" @click="close">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getEmployeeSimple } from "@/api/employees";
import {
  getDepartments,
  addDepartments,
  getDepartDetail,
  updateDepartments,
} from "@/api/departments";
export default {
  props: {
    currentNode: { type: Object, default: () => ({}) },
    isAhowDep: {
      type: Boolean,
      default: false,
    },
  },
  value: {
    type: Boolean,
  },
  data() {
    // 现在定义一个函数 这个函数的目的是 去找 同级部门下 是否有重复的部门名称
    const checkName = async (rules, value) => {
      // 1、 接口获取所有的部门
      const { depts } = await getDepartments();
      // console.log(depts);
      let currentNodeChilren = null;
      if (this.formData.id) {
        currentNodeChilren = depts.filter((item) => {
          return (
            item.pid === this.currentNode.pid && item.id !== this.currentNode.id
          );
        });
      } else {
        // 2、找到当前点击的部门的所有子部门
        currentNodeChilren = depts.filter(
          (item) => item.pid === this.currentNode.id
        );
      }

      // 3、判断当前部门的所有子部门名称是否包含用户输入的部门名称
      const isRepeat = currentNodeChilren.some((item) => item.name === value);
      // 4、如果包含说明名称重复
      if (isRepeat) {
        return Promise.reject(new Error("部门名称重复"));
      }
      // --> 核心逻辑：用户输入的部门名称跟当前点击的部门的所有的子部门的名称不能重复
    };
    const checkCode = async (rules, value) => {
      // 1、 接口获取所有的部门
      const { depts } = await getDepartments();
      let isRepeat = null;
      if (this.formData.id) {
        isRepeat = depts.some(
          (item) => item.code === value && item.id !== this.currentNode.id
        );
      } else {
        //  2、直接判断当前用户添写的code是否包含在已存在的数据里面
        isRepeat = depts.some((item) => item.code === value);
      }

      if (isRepeat) {
        return Promise.reject("部门code重复");
      }
      // --> 核心逻辑：用户输入的部门code跟任何部门的code都不能重复
    };
    return {
      options: [],
      // 定义表单数据
      formData: {
        name: "", // 部门名称
        code: "", // 部门编码
        manager: "", // 部门管理者
        introduce: "", // 部门介绍
      },
      // 定义校验规则
      rules: {
        name: [
          {
            required: true,
            message: "部门名称不能为空",
            trigger: "blur",
          },

          { validator: checkName, trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门名称要求1-50个字符",
            trigger: "blur",
          },
        ],
        code: [
          { required: true, message: "部门编码不能为空", trigger: "blur" },
          { validator: checkCode, trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门编码要求1-50个字符",
            trigger: "blur",
          },
        ],
        manager: [
          { required: true, message: "部门负责人不能为空", trigger: "blur" },
        ],
        introduce: [
          { required: true, message: "部门介绍不能为空", trigger: "blur" },
          {
            trigger: "blur",
            min: 1,
            max: 300,
            message: "部门介绍要求1-50个字符",
          },
        ],
      },
    };
  },
  computed: {
    showTitle() {
      return this.formData.id ? "编辑" : "新增";
    },
  },
  methods: {
    async chooseEmp() {
      this.options = await getEmployeeSimple();
      // console.log(this.options);
    },
    async getDepartDetailById(id) {
      this.formData = await getDepartDetail(id);
    },
    async submit() {
      await this.$refs.form.validate();
      if (this.formData.id) {
        await updateDepartments(this.formData);
      } else {
        await addDepartments({
          ...this.formData,
          pid: this.currentNode.id,
        });
      }

      this.$message.success(`${this.showTitle}成功`);
      //关闭弹层
      //重置表单
      this.close();
    },
    close() {
      this.$refs.form.resetFields();
      this.formData = {
        name: "", // 部门名称
        code: "", // 部门编码
        manager: "", // 部门管理者
        introduce: "", // 部门介绍
      };
      this.$emit("update:isAhowDep", false);
    },
  },
};
</script>

<style></style>
