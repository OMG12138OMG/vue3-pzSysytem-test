<template>
  <el-table :data="tableData.list" style="width: 100%">
    <el-table-column prop="id" label="id" />
    <el-table-column prop="name" label="昵称" />
    <el-table-column prop="permissions_id" label="所属组别">
      <template #default="scope">
        {{ permissionName(scope.row.permissions_id) }}
      </template>
    </el-table-column>
    <el-table-column prop="mobile" label="手机号" />
    <el-table-column prop="active" label="状态">
      <template #default="scope">
        <el-tag :type="scope.row.active ? 'success' : 'danger'">
          {{ scope.row.active ? "正常" : "禁用" }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="创建时间" width="210">
      <template #default="scope">
        <div class="flex-box">
          <el-icon><Clock /></el-icon>
          <span style="margin-left: 8px"> {{ scope.row.create_time }}</span>
        </div>
      </template>
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
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" disabled />
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model="form.name" placeholder="请输入用户昵称"></el-input>
      </el-form-item>
      <el-form-item label="菜单权限" prop="permissions_id">
        <el-select
          v-model="form.permissions_id"
          placeholder="请选择菜单权限"
          style="width: 240px"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
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
import { authAdmin, menuSelectList, updateUser } from "../../../api";
import { ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";

//表单
//弹窗显示与隐藏
const dialogFormVisible = ref(false);

//关闭弹窗回调
const beforeClose = () => {
  dialogFormVisible.value = false;
  //重置表单
  formRef.value.resetFields();
};

//表单验证
const rules = reactive({
  name: [{ required: true, message: "请输入用户昵称", trigger: "blur" }],
  permissions_id: [
    { required: true, message: "请选择菜单权限", trigger: "change" },
  ],
});
const formRef = ref();
//form数据
const form = reactive({
  name: "",
  permissions_id: "",
});
const confirm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      updateUser({
        name: form.name,
        permissions_id: form.permissions_id,
      }).then(({ data }) => {
        console.log(data);
        if (data.code === 10000) {
          beforeClose();
          getauthAdminListData();
        }
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};

//列表数据
const tableData = reactive({
  list: [],
  total: 0,
});

onMounted(() => {
  getauthAdminListData();
  menuSelectList().then(({ data }) => {
    options.value = data.data;
    console.log(options.value);
  });
});

//请求列表数据，多次复用
const getauthAdminListData = () => {
  authAdmin(paginationData).then(({ data }) => {
    const { list, total } = data.data;
    list.forEach((el) => {
      el.create_time = dayjs(el.create_time).format("YYYY-MM-DD HH:mm:ss");
    });
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
  getauthAdminListData();
};
const handleCurrentChange = (val) => {
  paginationData.pageNum = val;
  getauthAdminListData();
};

const options = ref([]);
//根据权限id：permissions_id获取权限名称
const permissionName = (id) => {
  const data = options.value.find((el) => el.id === id);
  return data ? data.name : "超级管理员";
};

const open = (row) => {
  dialogFormVisible.value = true;
  Object.assign(form, {
    name: row.name,
    permissions_id: permissionName(row.permissions_id),
    mobile: row.mobile,
  });
};
</script>
<style lang="less" scoped>
.flex-box {
  display: flex;
  align-items: center;
}
</style>
