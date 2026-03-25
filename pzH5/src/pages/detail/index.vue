<template>
  <div class="container">
    <div class="header">
      <van-icon
        name="arrow-left"
        @click="goBack"
        class="header-left"
        size="20"
      />
      订单详情
    </div>
    <status-bar :item="stateMap[detailData.trade_state]" />
    <div class="tips">
      <div class="dzf" v-if="detailData.trade_state === '待支付'">
        <div class="text1">订单待支付</div>
        <div class="text2">
          请在
          <counter :second="second" />
          内完成支付，超时订单自动取消
        </div>
        <div class="text3">
          <van-button @click="showCode = true" type="success">
            立即支付
          </van-button>
        </div>
      </div>
      <div class="dzf" v-if="detailData.trade_state === '待服务'">
        <div class="text1">正在为您安排服务专员……</div>
        <div class="text2">感谢您的使用，稍后将有服务专员跟您联系</div>
      </div>
      <div class="dzf" v-if="detailData.trade_state === '已安装'">
        <div class="text1">服务已完成……</div>
        <div class="text2">感谢您的使用，如有售后问题请联系客服</div>
      </div>
      <div class="dzf" v-if="detailData.trade_state === '已取消'">
        <div class="text1">订单已取消</div>
        <div class="text2">期待下次为您服务，如需帮助可咨询客服</div>
      </div>
    </div>

    <van-cell-group class="card">
      <div class="header-text">预约信息</div>
      <van-cell
        v-for="(item, key) in makeInfo"
        :key="key"
        :title="item"
        :value="formatData(key)"
      />
    </van-cell-group>

    <van-cell-group class="card">
      <div class="header-text">订单信息</div>
      <van-cell
        v-for="(item, key) in orderInfo"
        :key="key"
        :title="item"
        :value="formatData(key)"
      />
    </van-cell-group>

    <!-- 支付二维码弹窗 -->
    <van-dialog
      :show-confirm-button="false"
      v-model:show="showCode"
      title="微信支付"
    >
      <van-icon name="cross" class="close" @click="closeCode" />
      <van-image width="150" height="150" :src="codeImg" />
      <div>请使用本人微信扫描二维码</div>
    </van-dialog>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import StatusBar from "../../components/statusBar.vue";
// 引入转换二维码插件
import Qrcode from "qrcode";
import counter from "../../components/counter.vue";
import { onMounted, getCurrentInstance, reactive, ref, computed } from "vue";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const showCode = ref(false);
const codeImg = ref("");

// 预约信息详情
const makeInfo = {
  service_name: "预约服务",
  hospital_name: "就诊医院",
  starttime: "期望就诊时间",
  "client.name": "就诊人",
  "client.mobile": "就诊人电话",
  receiveAddress: "接送地址",
  demand: "其他需求",
};
// 订单信息详情
const orderInfo = {
  tel: "就诊人电话",
  order_start_time: "下单时间",
  price: "应付金额",
  put_trade_no: "订单时间",
};

// 预约信息数据格式化
const formatData = (key) => {
  // key.indexOf(".")判断是否是预约信息还是订单信息
  if (key.indexOf(".") === -1) {
    if (key === "order_start_time") {
      return formatTimestamp(detailData[key]);
    }
    return detailData[key];
  }
  // key.split(".")将字符串分割成数组
  // reduce()方法将数组中的元素，缩减为单个返回值。
  // o: 当前元素
  // p：当前元素的属性名
  let arr = key.split(".").reduce((o, p) => {
    return (o || {})[p];
  }, detailData);
  return arr;
};
// 时间格式化
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  // 月份是从0开始的，所以需要+1
  //.padStart(2, "0")用于填充0
  //在字符串的开头（左侧）填充指定字符，直到字符串达到指定的长度。
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
const closeCode = () => {
  showCode.value = false;
  router.push("/order");
};
// 详情页数据
const detailData = reactive({});
//根据订单状态获取倒计时时间
const second = computed(() => {
  return detailData.order_start_time
    ? detailData.order_start_time + 7200000 - Date.now()
    : 0;
});
onMounted(async () => {
  const { data } = await proxy.$api.orderDetail({ oid: route.query.oid });
  //   console.log(data);
  Object.assign(detailData, data.data);
  // 生成二维码
  Qrcode.toDataURL(data.data.code_url).then((url) => {
    codeImg.value = url;
  });
});
const stateMap = {
  待支付: 10,
  待服务: 20,
  已完成: 30,
  已取消: 40,
};
// 点击返回
const goBack = () => {
  router.go(-1);
};
</script>
<style scoped lang="less">
.container {
  background-color: #f0f0f0;
  height: 100vh;
}
.header {
  background-color: #fff;
  line-height: 40px;
  text-align: center;
  .header-left {
    float: left;
  }
}
.card {
  margin: 15px 0;
  padding: 10px;
  .header-text {
    padding-left: 5px;
    line-height: 30px;
    font-size: 16px;
    font-weight: bold;
    border-left: 4px solid red;
  }
}
.dzf {
  padding: 20px;
  .text1 {
    font-size: 20px;
    font-weight: bold;
    line-height: 30px;
    color: #666;
  }
  .text2 {
    font-size: 14px;
    color: #666;
  }
  .text3 {
    text-align: center;
    .van-button {
      margin-top: 10px;
      margin-left: 10px;
      width: 80%;
      font-weight: bold;
    }
  }
}
::v-deep(.van-dialog__content) {
  text-align: center;
  padding: 20px;
  .close {
    position: absolute;
    left: 20px;
  }
}
</style>
