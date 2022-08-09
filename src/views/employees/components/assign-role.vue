<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="close">
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">{{
        item.name
      }}</el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="12">
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from "@/api/setting";
import { getUserDetailById } from "@/api/user";
import { assignRoles } from "@/api/employees";
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false,
    },
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null,
    },
    currentId: {
      type: String,
    },
  },
  data() {
    return {
      roleList: [],
      roleIds: [],
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async btnOk() {
      await assignRoles({ id: this.currentId, roleIds: this.roleIds });
      this.$message.success("修改角色成功");
      this.close();
    },

    close() {
      this.$emit("update:showRoleDialog", false);
    },
    async getRoleList() {
      const { rows } = await getRoleList();
      this.roleList = rows;
      // console.log(this.roleList);
    },
    async getUserDetailById(id) {
      const { roleIds = [] } = await getUserDetailById(id);
      this.roleIds = roleIds;
    },
  },
};
</script>
