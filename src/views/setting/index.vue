<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="角色管理" name="first">
            <el-button
              icon="el-icon-plus"
              type="primary"
              @click="showDialog = true"
              >新增角色</el-button
            >
            <el-table :data="tableData" style="width: 100%">
              <el-table-column type="index" label="序号" width="180">
              </el-table-column>
              <el-table-column prop="name" label="角色名称" width="180">
              </el-table-column>
              <el-table-column prop="description" label="描述">
              </el-table-column>
              <el-table-column>
                <template v-slot="{ row }">
                  <el-button
                    size="small"
                    type="success"
                    @click="assignPerm(row.id)"
                    >分配权限</el-button
                  >
                  <el-button type="primary" size="small" @click="edit(row.id)"
                    >编辑</el-button
                  >
                  <el-button type="danger" size="small" @click="del(row.id)"
                    >删除</el-button
                  >
                </template></el-table-column
              >
            </el-table>
            <!-- 分页组件 -->
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height: 60px"
            >
              <!-- 分页组件 -->
              <el-pagination
                layout="prev,pager,next"
                :current-page="page.page"
                :page-size="page.pagesize"
                :total="total"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="公司设置" name="second">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false" />
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="公司名称">
                <el-input
                  disabled
                  style="width: 400px"
                  v-model="formData.name"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  disabled
                  style="width: 400px"
                  v-model="formData.companyAddress"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  disabled
                  style="width: 400px"
                  v-model="formData.mailbox"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width: 400px"
                  v-model="formData.remarks"
                />
              </el-form-item> </el-form
          ></el-tab-pane>
        </el-tabs>
      </el-card>
      <el-dialog title="编辑弹层" :visible="showDialog" @close="btnCancel">
        <el-form
          ref="form"
          :model="roleForm"
          :rules="rules"
          label-width="120px"
        >
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleForm.name" />
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="roleForm.description" />
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="btnCancel">取消</el-button>
            <el-button size="small" type="primary" @click="btnOK"
              >确定</el-button
            >
          </el-col>
        </el-row>
      </el-dialog>
      <el-dialog title="分配权限" :visible="showPermDialog" @close="closePes">
        <!-- 权限是一颗树 -->
        <!-- 将数据绑定到组件上 -->
        <!-- check-strictly 如果为true 那表示父子勾选时  不互相关联 如果为false就互相关联 -->
        <!-- id作为唯一标识 -->
        <el-tree
          ref="tree"
          node-key="id"
          :data="permissionList"
          :props="defaultProps"
          :show-checkbox="true"
          :check-strictly="true"
          :default-expand-all="true"
          :default-checked-keys="roleList"
        />
        <!-- 确定 取消 -->
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button type="primary" size="small" @click="btnOkPms"
              >确定</el-button
            >
            <el-button size="small">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  updateRole,
  addRole,
  getRoleList,
  getCompanyInfo,
  deleteRole,
  getRoleDetail,
} from "@/api/setting";
import { getPermissionList, assignPerm } from "@/api/permisson";
import { transTree } from "@/utils/index";
export default {
  data() {
    return {
      currentId: "",
      defaultProps: {
        label: "name",
      },
      roleList: [],
      permissionList: [],
      showPermDialog: false,
      showDialog: false,
      roleForm: {
        name: "",
        description: "",
      },
      rules: {
        name: [{ required: true, message: "name是必填项", trigger: "blur" }],
      },
      formData: {},
      total: 0,
      page: { pagesize: 2, page: 1 },
      activeName: "second",
      tableData: [],
    };
  },
  created() {
    this.getRoleList();
    this.getCompanyInfo();
  },
  methods: {
    async btnOkPms() {
      // console.log(this.$refs.tree.getCheckedKeys());
      await assignPerm({
        id: this.currentId,
        permIds: this.$refs.tree.getCheckedKeys(),
      });
      this.$message.success("给角色分配权限成功");
      this.closePes();
    },
    closePes() {
      this.showPermDialog = false;
      this.roleList = [];
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    async assignPerm(id) {
      this.currentId = id;
      const res = await getPermissionList(id);
      this.permissionList = transTree(res, "0");
      // console.log(this.permissionList);
      const current = await getRoleDetail(id);
      this.roleList = current.permIds;
      this.showPermDialog = true;
    },
    async getRoleList() {
      const res = await getRoleList(this.page);
      this.tableData = res.rows;

      // console.log(res);
      this.total = res.total;
    },
    changePage(newPage) {
      // newPage是当前点击的页码
      this.page.page = newPage; // 将当前页码赋值给当前的最新页码
      this.getRoleList();
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.$store.getters.companyId);
    },
    async del(id) {
      await this.$confirm("确定删除吗？");
      await deleteRole(id);
      let length = this.tableData.length;
      if (length === 1 && this.page.page > 1) {
        this.page.page--;
      }
      this.$message.success("删除成功");
      this.getCompanyInfo();
    },
    async edit(id) {
      console.log(id);
      this.showDialog = true;
      this.roleForm = await getRoleDetail(id);
      // console.log(this.roleForm);
    },
    btnCancel() {
      this.showDialog = false;
      this.$refs.form.resetFields();
      this.roleForm = { name: "", description: "" };
    },

    async btnOK() {
      await this.$refs.form.validate();
      if (this.roleForm.id) {
        // console.log(this.roleForm);
        await updateRole(this.roleForm);
        // console.log(this.roleForm);
      }
      await addRole(this.roleForm);
      console.log(this.roleForm);
      // 重新拉取数据
      this.getRoleList();
      this.$message.success("新增角色成功");
      this.btnCancel();
    },
  },
};
</script>

<style></style>
