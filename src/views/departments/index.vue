<template>
  <div class="dashboard-container" v-loading="loading">
    <div class="app-container">
      <el-card>
        <treeTools :tree-node="company" @tanceng="tanceng" :is-root="true" />
      </el-card>
      <el-tree
        default-expand-all
        :data="departs"
        :props="defaultProps"
        @node-click="handleNodeClick"
      >
        <template v-slot="{ data }">
          <treeTools
            @editPart="editPart"
            :tree-node="data"
            :isRoot="false"
            @getD="getDepartments"
            @tanceng="tanceng"
          />
        </template>
        <!-- </el-row> -->
      </el-tree>
    </div>
    <addDepartments
      ref="getDeById"
      :isAhowDep.sync="isAhowDep"
      :currentNode="currentNode"
    />
  </div>
</template>

<script>
import addDepartments from "@/views/departments/components/add-dept.vue";
import treeTools from "@/views/departments/components/tree-tools";
import { getDepartments } from "@/api/departments";
import { transTree } from "@/utils/index";
export default {
  components: { treeTools, addDepartments },
  data() {
    return {
      loading: false,
      currentNode: {},
      isAhowDep: false,
      company: {}, // 就是头部的数据结构
      departs: [],
      defaultProps: {
        label: "name", // 表示 从这个属性显示内容
      },
    };
  },
  created() {
    this.getDepartments();
  },

  methods: {
    editPart(node) {
      this.isAhowDep = true;
      this.currentNode = node;
      this.$refs.getDeById.getDepartDetailById(node.id); // 直接调用子组件中的方法 传入一个id
    },
    tanceng(node) {
      // console.log(2345678);
      this.isAhowDep = true;
      this.currentNode = node;
    },
    handleNodeClick(data) {
      // console.log(data);
    },
    async getDepartments() {
      this.loading = true;
      try {
        const result = await getDepartments();
        this.company = { name: result.companyName, manager: "负责人", id: "" };
        // this.departs = transTree(result.depts, ""); // 需要将其转化成树形结构
        this.departs = transTree(result.depts, ""); // 需要将其转化成树形结构

        // console.log(result);
        this.loading = false;
      } catch (e) {
        console.log(e);
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.app-container {
  width: 800px;
  margin: 100px auto;
}
</style>
