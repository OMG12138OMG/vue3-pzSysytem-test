<template>
  <div class="btns">
    <el-button :icon="Plus" type="primary" @click="open(null)" size="small">
      新增
    </el-button>
  </div>
  <el-table :data="tableData.list" style="width: 100%">
    <el-table-column prop="id" label="id"> </el-table-column>
    <el-table-column prop="name" label="昵称"> </el-table-column>
    <el-table-column prop="permissionName" label="菜单权限" width="500">
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="primary" @click="open(scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="pagination-info">
    <el-pagination
      v-model:current-page="paginationData.pageNum"
      :page-size="paginationData.pageSize"
      :background="false"
      size="small"
      layout="total, prev, pager, next"
      :total="tableData.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
  <el-dialog
    v-model="dialogFormVisible"
    :before-close="beforeClose"
    title="添加权限"
    width="500px"
  >
    <el-form
      ref="formRef"
      :model="form"
      label-width="100px"
      label-position="left"
      :rules="rules"
    >
      <el-form-item v-show="false" prop="id">
        <el-input v-model="form.id"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入权限名称"></el-input>
      </el-form-item>
      <el-form-item label="权限" prop="permissions">
        <el-tree
          ref="treeRef"
          style="max-width: 600px"
          :data="permissionData"
          node-key="id"
          show-checkbox
          :default-checked-keys="defaultKeys"
          :default-expanded-keys="[2]"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm(formRef)">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import { userGetMenu, userSetMenu, menuList } from "../../../api";
import { Plus } from "@element-plus/icons-vue";

//树形结构菜单权限数据
const permissionData = ref([]);

onMounted(() => {
  userGetMenu().then(({ data }) => {
    permissionData.value = data.data;
  });
  getListData();
});

//列表数据
const tableData = reactive({
  list: [],
  total: 0,
});
const open = (rowData = {}) => {
  dialogFormVisible.value = true;
  //弹窗打开form是异步操作
  nextTick(() => {
    if (rowData) {
      Object.assign(form, { id: rowData.id, name: rowData.name });
      treeRef.value.setCheckedKeys(rowData.permission);
    }
  });
};
//请求列表数据，多次复用
const getListData = () => {
  menuList(paginationData).then(({ data }) => {
    const { list, total } = data.data;
    tableData.list = list;
    tableData.total = total;
  });
};
const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
});
const handleSizeChange = (val) => {
  paginationData.pageSize = val;
  getListData();
};
const handleCurrentChange = (val) => {
  paginationData.pageNum = val;
  getListData();
};

//tree实例
const treeRef = ref();

//表单验证
const rules = reactive({
  name: [{ required: true, message: "请输入权限名称", trigger: "blur" }],
});
const formRef = ref();
const confirm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      const permissions = JSON.stringify(treeRef.value.getCheckedKeys()); //获取选中的权限
      userSetMenu({
        name: form.name,
        permissions: permissions,
        id: form.id,
      }).then(({ data }) => {
        beforeClose();
        getListData();
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};

//form数据
const form = reactive({
  id: "",
  name: "",
  permissions: "",
});
//弹窗显示与隐藏
const dialogFormVisible = ref(false);

//关闭弹窗回调
const beforeClose = () => {
  dialogFormVisible.value = false;
  //重置表单
  formRef.value.resetFields();
  //重置权限
  treeRef.value.setCheckedKeys([]);
};

//选中权限
const defaultKeys = [4, 5];
</script>
<style lang="less" scoped>
.btns {
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
</style>
