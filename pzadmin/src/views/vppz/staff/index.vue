<template>
  <div class="btns">
    <el-button :icon="Plus" type="primary" @click="open(null)" size="small">
      新增
    </el-button>
    <el-popconfirm
      confirm-button-text="是"
      cancel-button-text="否"
      :icon="InfoFilled"
      icon-color="#626AEF"
      title="你确定要删除?"
      @confirm="confirmEvent"
    >
      <template #reference>
        <el-button :icon="Delete" type="danger" @click="" size="small">
          删除
        </el-button>
      </template>
    </el-popconfirm>
  </div>
  <el-table
    :data="tableData.list"
    style="width: 100%"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column prop="id" label="id" />
    <el-table-column prop="name" label="昵称" />
    <el-table-column prop="avatar" label="头像">
      <template #default="scope">
        <el-image
          style="width: 50px; height: 50px"
          :src="scope.row.avatar"
        ></el-image>
      </template>
    </el-table-column>
    <el-table-column prop="sex" label="性别">
      <template #default="scope">
        {{ scope.row.sex == 1 ? "女" : "男" }}
      </template>
    </el-table-column>
    <el-table-column prop="mobile" label="手机号" width="180" />
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
  <!-- 新增弹窗 -->
  <el-dialog
    v-model="dialogFormVisible"
    :before-close="beforeClose"
    title="陪护师添加"
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
      <el-form-item label="昵称" prop="name">
        <el-input v-model="form.name" placeholder="请输入用户昵称"></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-button
          v-if="!form.avatar"
          type="primary"
          @click="dialogImgVisible = true"
          >点击上传</el-button
        >
        <el-image v-else :src="form.avatar" style="width: 100px; height: 100px">
        </el-image>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="form.sex" style="width: 240px">
          <el-option label="女" value="1" />
          <el-option label="男" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input-number v-model="form.age" :min="18" :max="50" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input
          v-model="form.mobile"
          placeholder="请输入用户手机号"
        ></el-input>
      </el-form-item>
      <el-form-item label="是否生效" prop="active">
        <el-radio-group v-model="form.active">
          <el-radio :value="0">失效</el-radio>
          <el-radio :value="1">生效</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm(formRef)">确认</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 图片弹窗 -->
  <el-dialog v-model="dialogImgVisible" title="图片选择" width="680px">
    <div class="image-list">
      <div
        v-for="(item, index) in fileList"
        :key="item.name"
        class="img-box"
        @click="selectIndex = index"
      >
        <div v-if="selectIndex == index" class="select">
          <el-icon color="#fff">
            <Check />
          </el-icon>
        </div>
        <el-image
          style="width: 148px; height: 148px"
          :src="item.url"
        ></el-image>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogImgVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmImage">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { ElMessage } from "element-plus";
import {
  photoList,
  companion,
  companionList,
  deleteCompanion,
} from "../../../api";
import { ref, reactive, onMounted } from "vue";
import { Plus, Delete, InfoFilled } from "@element-plus/icons-vue";
import dayjs from "dayjs";
const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
});
const handleSizeChange = (val) => {
  paginationData.pageSize = val;
  getList();
};
const handleCurrentChange = (val) => {
  paginationData.pageNum = val;
  getList();
};
// 获得陪护师列表
const tableData = reactive({
  list: [],
  total: 0,
});
const getList = () => {
  companionList(paginationData).then(({ data }) => {
    const { list, total } = data.data;
    list.forEach((el) => {
      el.create_time = dayjs(el.create_time).format("YYYY-MM-DD HH:mm:ss");
    });
    tableData.list = list;
    tableData.total = total;
  });
};
onMounted(() => {
  // 获取图片列表
  photoList().then(({ data }) => {
    fileList.value = data.data;
  });
  getList();
});
const dialogFormVisible = ref(false);
const beforeClose = () => {
  dialogFormVisible.value = false;
  //重置表单
  formRef.value.resetFields();
};
const formRef = ref();
const form = reactive({
  id: "",
  name: "",
  avatar: "",
  sex: "",
  age: 28,
  mobile: "",
  active: 1,
});
//手机号验证
const validateMobile = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入手机号"));
  } else {
    const phoneRegx =
      /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
    phoneRegx.test(value) ? callback() : callback(new Error("手机号格式错误"));
  }
};
const rules = reactive({
  name: [{ required: true, message: "请输入用户昵称", trigger: "blur" }],
  avatar: [{ required: true, message: "请上传用户头像" }],
  sex: [{ required: true, message: "请选择性别", trigger: "change" }],
  mobile: [{ required: true, validator: validateMobile, trigger: "blur" }],
});

// 提交表单
const confirm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      companion(form).then(({ data }) => {
        if (data.code === 10000) {
          ElMessage.success("成功");
          beforeClose();
          getList();
        } else {
          ElMessage.error(data.message);
        }
      });
      console.log(form);
    } else {
      console.log("error submit!", fields);
    }
  });
};

// 打开表单
const open = (rowData = {}) => {
  dialogFormVisible.value = true;
  if (rowData) {
    Object.assign(form, rowData);
  }
};

// 图片弹窗
const dialogImgVisible = ref(false);
const fileList = ref([]);
// 图片选择
const selectIndex = ref(0);
const confirmImage = () => {
  form.avatar = fileList.value[selectIndex.value].url;
  dialogImgVisible.value = false;
};

// 删除
const selectTableData = ref([]);
const handleSelectionChange = (data) => {
  selectTableData.value = data;
};

const confirmEvent = () => {
  if (!selectTableData.value.length) {
    return ElMessage.error("请选择要删除的项");
  }
  deleteCompanion({ id: selectTableData.value }).then(({ data }) => {
    if (data.code === 10000) {
      ElMessage.success("成功");
      getList();
    } else {
      ElMessage.error(data.message);
    }
  });
};
</script>
<style lang="less" scoped>
.flex-box {
  display: flex;
  align-items: center;
}
.btns {
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
.image-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .img-box {
    position: relative;
    .select {
      position: absolute;
      left: 0;
      top: 0;
      width: 24px;
      height: 24px;
      background-color: #67c23a;
      z-index: 999;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .el-image {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>
