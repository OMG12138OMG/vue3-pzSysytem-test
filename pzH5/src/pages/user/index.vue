<template>
  <div class="container">
    <div class="user">
      <van-image :src="userInfo.avatar" height="100" width="100" class="img" />
      <div class="text">{{ userInfo.name }}</div>
    </div>
    <div class="foot">
      <div class="foot1">
        <div class="text1" @click="goOrder">
          <van-image width="20" height="20" src="/images/ic_list_in.png" />
          我的订单
        </div>
        <div class="text2">
          <van-icon name="arrow" />
        </div>
      </div>
      <div class="foot1">
        <div class="text1">
          <van-image width="20" height="20" src="/images/ic_clients.png" />
          服务对象管理
        </div>
        <div class="text2">
          <van-icon name="arrow" />
        </div>
      </div>
      <div class="foot2">
        <div class="text1">
          <van-image width="20" height="20" src="/images/ic_share.png" />
          分享转发
        </div>
        <div class="text2">
          <van-icon name="arrow" />
        </div>
      </div>
    </div>
    <van-button type="danger" class="quit" size="large" @click="show = true">
      退出登录
    </van-button>
    <van-dialog
      title="提示"
      v-model:show="show"
      @cancel="show = false"
      @confirm="logout"
      show-cancel-button
    >
      <div class="quit_text">是否确认退出登录</div>
    </van-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const show = ref(false);
// 退出登录
const logout = () => {
  localStorage.removeItem("h5_userInfo");
  localStorage.removeItem("h5_token");
  router.push("/login");
};
// 用户信息
const userInfo = computed(() => {
  return JSON.parse(localStorage.getItem("h5_userInfo")) || {};
});
// 获取订单列表
const getOrderList = async (state) => {
  const { data } = await proxy.$api.orderList({ state });
  data.data.forEach((item) => {
    // 支付订单计算倒计时
    item.timer = item.order_start_time + 7200000 - Date.now();
  });
  // 订单数据
  order.value = data.data;
};
const goOrder = () => {
  router.push(`/order`);
  setTimeout(() => {
    window.location.reload();
  }, 500);
};
</script>
<style scoped lang="less">
.container {
  background-color: #f0f0f0;
  height: 100vh;
  overflow: hidden;
  .user {
    width: 95%;
    height: 200px;
    background-color: #fff;
    text-align: center;
    border-radius: 10px;
    margin: 10px;
    .img {
      margin-top: 30px;
    }
    .text {
      line-height: 30px;
      font-weight: bold;
    }
  }
  .order {
    width: 90%;
    margin: 10px;
    border-radius: 5px;
    background-color: #fff;
    padding: 10px;
    .top {
      margin: 10px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      .text1 {
        color: #333;
      }
      .text2 {
        color: #999;
      }
      border-bottom: 0.5px solid #f5f5f5;
    }
    .buttom {
      padding: 10px;
      display: flex;
      justify-content: space-around;
      .item {
        font-size: 14px;
        color: #999;
      }
    }
  }
  .foot {
    margin: 0 10px;
    padding: 10px;
    line-height: 50px;
    background-color: #fff;
    .foot1,
    .foot2 {
      display: flex;
      justify-content: space-between;
      color: #555;
    }
    .foot1 {
      border-bottom: 0.5px solid #f5f5f5;
    }
  }
  .quit {
    width: 90%;
    margin: 20px;
  }
  .quit_text {
    margin: 20px 0;
    text-align: center;
  }
}
</style>
