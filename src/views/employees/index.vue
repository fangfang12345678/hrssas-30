<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools>
        <template #before>
          <span>共5条记录</span>
        </template>
        <template #after>
          <el-button size="small" type="warning" @click="$router.push('import')"
            >导入</el-button
          >
          <el-button size="small" type="danger" @click="exportToExcel"
            >导出</el-button
          >
          <el-button size="small" type="primary" @click="showDialog = true"
            >新增员工</el-button
          >
        </template>
      </PageTools>
      <el-table :data="list" border style="width: 100%">
        <el-table-column label="序号" sortable="" type="index" />
        <el-table-column label="姓名" sortable="" prop="username" />
        <el-table-column label="工号" sortable="" prop="workNumber" />
        <el-table-column label="头像">
          <template v-slot="{ row }">
            <el-avatar
              @click.native="showQrCode(row.staffPhoto)"
              :src="row.staffPhoto"
              style="width: 80px; height: 80px"
            ></el-avatar>
          </template>
        </el-table-column>

        <el-table-column
          :formatter="formatEmployment"
          label="聘用形式"
          sortable=""
          prop="formOfEmployment"
        />
        <el-table-column label="部门" sortable="" prop="departmentName" />
        <!-- <el-table-column label="入职时间" sortable="" prop="timeOfEntry" /> -->
        <el-table-column label="入职时间" sortable="" align="center">
          <!-- 作用域插槽 -->
          <template slot-scope="{ row }">{{
            row.timeOfEntry | formatDate
          }}</template>
        </el-table-column>
        <el-table-column label="账户状态" sortable="" prop="enableState" />
        <el-table-column label="操作" sortable="" fixed="right" width="280">
          <template v-slot="{ row }">
            <el-button
              type="text"
              size="small"
              @click="$router.push(`employees/detail/${row.id}`)"
              >查看</el-button
            >
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small" @click="editRole(row.id)"
              >角色</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="del(row.id)"
              :disabled="!checkPermission('del')"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination
          layout="prev, pager, next"
          :page-size="page.size"
          :current-page="page.page"
          :total="total"
          @current-change="changePage"
        />
      </el-row>
    </div>
    <addEmployee :show-dialog.sync="showDialog"></addEmployee>
    <el-dialog
      title="二维码"
      :visible.sync="showCodeDialog"
      @opened="showQrCode"
      @close="imgUrl = ''"
    >
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <assignRole
      :currentId="currentId"
      :showRoleDialog.sync="showRoleDialog"
      ref="role"
    ></assignRole>
  </div>
</template>

<script>
import QrCode from "qrcode";
import assignRole from "./components/assign-role.vue";
// import PageTools from "@/components/PageTools";
import addEmployee from "@/views/employees/components/add-employee";
import EmployeeEnum from "@/api/constant/employees";
import { getEmployeeList, delEmployee } from "@/api/employees";
import { mixins } from "@/mixin/checkPermission";
export default {
  // components: { PageTools },
  components: { addEmployee, assignRole },
  mixins: [mixins],
  data() {
    return {
      currentId: "",
      showDialog: false,
      showCodeDialog: false,
      showRoleDialog: false,
      page: {
        page: 1,
        size: 10,
      },
      total: 0,
      list: [],
    };
  },
  created() {
    this.getEmployeeList();
  },
  methods: {
    async editRole(id) {
      this.currentId = id;
      await this.$refs.role.getUserDetailById(id);
      this.showRoleDialog = true;
    },
    showQrCode(url) {
      this.showCodeDialog = true;
      this.$nextTick(() => {
        QrCode.toCanvas(this.$refs.myCanvas, url); // 将地址转化成二维码
      });
    },
    async exportToExcel() {
      const { export_json_to_excel } = await import(
        /*webpackChunkName:Export2Excel*/ "@/utils/Export2Excel"
      );

      const { rows } = await getEmployeeList({ page: 1, size: this.total });
      const resData = this.formatterData(rows, headers);
      export_json_to_excel({
        header: Object.key(headers), //表头 必填
        data: resData,
        // 具体数据 必填
        filename: "excel-list", //非必填
        autoWidth: true, //非必填
        bookType: "xlsx", //非必填
      });
    },
    formatterData(rows, headers) {
      return rows.map((item) => {
        return Object.key(headers).map((key) => {
          // 需要判断 字段
          if (
            headers[key] === "timeOfEntry" ||
            headers[key] === "correctionTime"
          ) {
            // 格式化日期
            return formatDate(item[headers[key]]);
          } else if (headers[key] === "formOfEmployment") {
            const obj = EmployeeEnum.hireType.find(
              (obj) => obj.id === item[headers[key]]
            );
            return obj ? obj.value : "未知";
          }
          return item[headers[key]];
          // return item[headers[key]];
        });
      });
    },
    async getEmployeeList() {
      const { rows, total } = await getEmployeeList(this.page);
      this.list = rows;
      this.total = total;
      // console.log(rows);
    },
    changePage(newPage) {
      // console.log(newPage);
      this.page.page = newPage;
      this.getEmployeeList();
      // console.log(this.page);
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      // 要去找 1所对应的值
      const obj = EmployeeEnum.hireType.find((item) => item.id === cellValue);
      return obj ? obj.value : "未知";
    },
    async del(id) {
      try {
        // console.log(id);
        await this.$confirm("是否删除？");
        await delEmployee(id);
        this.$message.success("删除成功");
        await this.getEmployeeList();
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style></style>
