<template>
  <div id="addEmployee">
    <el-dialog title="新增员工" :visible="showDialog" @close="close">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="姓名" prop="username">
          <el-input
            v-model="formData.username"
            style="width: 50%"
            placeholder="请输入姓名"
          />
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input
            v-model="formData.mobile"
            style="width: 50%"
            placeholder="请输入手机号"
          />
        </el-form-item>
        <el-form-item label="入职时间" prop="timeOfEntry">
          <el-date-picker
            v-model="formData.timeOfEntry"
            style="width: 50%"
            placeholder="请选择日期"
          />
        </el-form-item>
        <el-form-item label="聘用形式" prop="formOfEmployment">
          <el-select
            v-model="formData.formOfEmployment"
            style="width: 50%"
            placeholder="请选择"
          >
            <el-option
              v-for="item in selectOption"
              :key="item.id"
              :label="item.value"
              :value="item.id"
          /></el-select>
        </el-form-item>
        <el-form-item label="工号" prop="workNumber">
          <el-input
            v-model="formData.workNumber"
            style="width: 50%"
            placeholder="请输入工号"
          />
        </el-form-item>
        <el-form-item label="部门" prop="departmentName">
          <el-cascader
            v-model="formData.departmentName"
            style="width: 50%"
            :options="treeData"
            :props="{
              checkStrictly: true,
              label: 'name',
              value: 'name',
              emitPath: false,
            }"
            clearable
            placeholder="请选择部门数据"
            @focus="getDepartments"
          />
        </el-form-item>
        <el-form-item label="转正时间" prop="correctionTime">
          <el-date-picker
            v-model="formData.correctionTime"
            style="width: 50%"
            placeholder="请选择日期"
          />
        </el-form-item>
      </el-form>
      <!-- footer插槽 -->
      <template v-slot:footer>
        <el-row type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small">取消</el-button>
            <el-button type="primary" size="small" @click="btnOk"
              >确定</el-button
            >
          </el-col>
        </el-row>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { addEmployee } from "@/api/employees";
import { getDepartments } from "@/api/departments";
import { transTree } from "@/utils";
import EmployeeEnum from "@/api/constant/employees";
export default {
  name: "addEmployee",
  props: { showDialog: { type: Boolean } },
  data() {
    return {
      selectOption: EmployeeEnum.hireType,
      treeData: [], // 定义数组接收树形数据
      formData: {
        username: "", // 用户姓名
        mobile: "", // 手机号
        formOfEmployment: "", // 聘用形式
        workNumber: "", // 工号
        departmentName: "", // 部门名称
        timeOfEntry: "", // 入职时间
        correctionTime: "", // 转正时间
      },
      rules: {
        username: [
          { required: true, message: "用户姓名不能为空", trigger: "blur" },
          {
            min: 1,
            max: 4,
            message: "用户姓名为1-4位",
          },
        ],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
        formOfEmployment: [
          { required: true, message: "聘用形式不能为空", trigger: "blur" },
        ],
        workNumber: [
          { required: true, message: "工号不能为空", trigger: "blur" },
        ],
        departmentName: [
          { required: true, message: "部门不能为空", trigger: "change" },
        ],
        timeOfEntry: [{ required: true, message: "入职时间", trigger: "blur" }],
      },
    };
  },
  methods: {
    close() {
      this.$emit("update:showDialog", false);
      //重置表单
      this.$refs.formRef.resetFields();
      //重置数据
      this.formData = {
        username: "", // 用户姓名
        mobile: "", // 手机号
        formOfEmployment: "", // 聘用形式
        workNumber: "", // 工号
        departmentName: "", // 部门名称
        timeOfEntry: "", // 入职时间
        correctionTime: "", // 转正时间
      };
    },
    async getDepartments() {
      const { depts } = await getDepartments();
      // console.log(depts);
      this.treeData = transTree(depts, "");
      // console.log(this.treeData);
    },
    async btnOk() {
      try {
        await this.$refs.formRef.validate();
        await addEmployee(this.formData);
        this.$message.success("新增成功");
        this.close();
        console.log(this.formData);

        await this.$parent.getEmployeeList();
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style></style>
