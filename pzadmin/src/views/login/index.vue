<template>
  <el-row class="login-container" justify="center" :align="'middle'">
    <el-card style="max-width: 400px">
      <template #header>
        <div class="card-header">
          <img :src="imgUrl" alt="" />
        </div>
      </template>
      <div class="jump-link">
        <el-link type="primary" @click="handleChange">{{
          formType ? "返回登录" : "注册账号"
        }}</el-link>
      </div>
      <el-form
        :model="loginForm"
        class="demo-ruleForm"
        :rules="rules"
        ref="loginFormRef"
      >
        <el-form-item prop="userName">
          <el-input
            v-model="loginForm.userName"
            placeholder="手机号"
            :prefix-icon="UserFilled"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="passWord">
          <el-input
            v-model="loginForm.passWord"
            type="password"
            placeholder="密码"
            :prefix-icon="Lock"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item v-if="formType" prop="validCode">
          <el-input
            v-model="loginForm.validCode"
            placeholder="验证码"
            :prefix-icon="Promotion"
            clearable
          >
            <template #append>
              <span @click="countDownChange">{{ countDown.validText }}</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :style="{ width: '100%' }"
            @click="submitForm(loginFormRef)"
          >
            {{ formType ? "注册" : "登录" }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-row>
</template>
<script setup>
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import {
  getCode,
  userAuthentication,
  login,
  menuPermissions,
} from "../../api/index";
import { ref, reactive, computed, toRaw } from "vue";
const imgUrl = new URL("../../../public/login-head.png", import.meta.url).href;
// 引入组件库
import { UserFilled, Lock, Promotion } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
const router = useRouter();
const store = useStore();
// 获取动态路由,根据用户权限处理导航
const routerList = computed(() => {
  return store.state.menu.routerList;
});
const loginForm = reactive({
  userName: "",
  passWord: "",
  validCode: "",
});

//切换表单 登录0/注册1
const formType = ref(0);
const handleChange = () => {
  formType.value = formType.value ? 0 : 1;
};

//手机号验证
const validateUser = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入手机号"));
  } else {
    const phoneRegx =
      /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
    phoneRegx.test(value) ? callback() : callback(new Error("手机号格式错误"));
  }
};
//密码验证
const validatePass = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    const regx = /^[a-zA-Z0-9_-]{4,16}$/;
    regx.test(value)
      ? callback()
      : callback(new Error("密码格式为4到16位字符，请确认格式"));
  }
};
const rules = reactive({
  userName: [{ validator: validateUser, trigger: "blur" }],
  passWord: [{ validator: validatePass, trigger: "blur" }],
});

//倒计时
const countDown = reactive({
  validText: "获取验证码",
  time: 60,
});
//防止重复点击，创造多个计时器
let flag = false;
const countDownChange = () => {
  if (flag) return;
  // 校验手机号
  const phoneRegx =
    /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;

  if (!loginForm.userName || !phoneRegx.test(loginForm.userName)) {
    return ElMessage({ message: "请检查手机号是否正确", type: "warning" });
  }
  const timer = setInterval(() => {
    if (countDown.time <= 0) {
      flag = false;
      countDown.validText = "重新获取";
      countDown.time = 60;
      clearInterval(timer);
    } else {
      countDown.time--;
      countDown.validText = `重新获取(${countDown.time})`;
    }
  }, 1000);
  flag = true;
  getCode({ tel: loginForm.userName }).then(({ data }) => {
    console.log(data, "data");
    if (data.code === 10000) {
      ElMessage.success("发送成功");
    }
  });
};
const loginFormRef = ref();
const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (formType.value) {
        userAuthentication(loginForm).then(({ data }) => {
          if (data.code === 10000) {
            ElMessage({ message: "注册成功，请登录", type: "success" });
            formType.value = 0;
          }
        });
      } else {
        login(loginForm).then(({ data }) => {
          if (data.code === 10000) {
            ElMessage({ message: "登录成功", type: "success" });
            localStorage.setItem("pz_token", data.data.token);
            localStorage.setItem(
              "pz_userInfo",
              JSON.stringify(data.data.userInfo)
            );
            //根据用户权限的不同，处理导航的动态路由
            menuPermissions().then(({ data }) => {
              store.commit("dynamicMenu", data.data);
              toRaw(routerList.value).forEach((item) => {
                router.addRoute("main", item);
              });
              router.push("/");
            });
          }
        });
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>
<style lang="less" scoped>
:deep(.el-card__header) {
  padding: 0;
}
.login-container {
  height: 100%;
  .card-header {
    background-color: #899fe1;
    img {
      width: 100%;
    }
  }
  .jump-link {
    text-align: right;
    margin-bottom: 10px;
  }
}
</style>
