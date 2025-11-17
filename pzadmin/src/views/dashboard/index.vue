<template>
  <el-row class="home" :gutter="20">
    <el-col :span="24" style="margin-top: 20px">
      <el-card shadow="hover" class="user-table">
        <div class="user">
          <img :src="userInfo.user_img" class="user" />
          <div class="user-info">
            <p class="user-info-admin">{{ userInfo.user_name }}</p>
            <p class="user-info-p">{{ userInfo.ip }}</p>
            <p class="user-info-p">{{ userInfo.permission }}</p>
          </div>
          <div class="num">
            <el-card
              :body-style="{ display: 'flex', padding: 0 }"
              v-for="item in countData"
              :key="item.state"
            >
              <div class="detail">
                <p class="num">{{ item.num }}</p>
                <p class="txt">{{ item.state }}</p>
              </div>
            </el-card>
          </div>
        </div>
      </el-card>
      <el-card>
        <div ref="echart" style="height: 220px"></div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { computed, reactive, ref, onMounted, getCurrentInstance } from "vue";
import { report } from "../../api";
const { proxy } = getCurrentInstance();
import * as echarts from "echarts";
// 用户信息
const userInfo = ref([]);
// 数据
const countData = ref([]);
//每一条数据
const chartData = reactive([]);
//格式化图表数据
const chartDatas = computed(() => {
  // 确保 chartData 是数组再执行 map（避免初始为空时报错）
  if (!Array.isArray(chartData)) return [];
  return chartData.map((item) => ({
    ...item,
    order_money: Number(item.order_money), // 转为数字
  }));
});
// 图表配置
const xOptions = reactive({
  // 全局文本样式
  textStyle: { color: "#333" },
  // 图表上方/右侧的系列名称标识
  legend: {},
  // 图表内容区域与容器的边距
  grid: { left: "5%", top: "5%" },
  // 鼠标悬停时显示的数据详情
  tooltip: { trigger: "axis" },
  // X轴
  xAxis: {
    type: "category",
    data: [],
    // 轴线样式
    axisLine: { lineStyle: { color: "#17b3a3" } },
    // 轴标签样式
    axisLabel: { interval: 0, color: "#333" },
  },
  // Y轴
  yAxis: [
    {
      type: "value",
      // 轴线样式
      axisLine: { lineStyle: { color: "#17b3a3" } },
    },
  ],
  // 折线/数据点的颜色）
  color: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3"],
  series: [],
});
const observe = ref(null);
// 渲染图表函数
const renderCharts = () => {
  // 折线图
  // 横坐标设置
  xOptions.xAxis.data = chartDatas.value.map((item) => item.date);
  // 纵坐标设置
  xOptions.series = [
    {
      name: "销量",
      data: chartDatas.value.map((item) => item.order_sum),
      type: "line",
    },
    {
      name: "销售额",
      data: chartDatas.value.map((item) => item.order_sum * item.order_money),
      type: "line",
    },
  ];
  const Echart = echarts.init(proxy.$refs["echart"]);
  Echart.setOption(xOptions);

  // 响应式调整
  observe.value = new ResizeObserver(() => {
    Echart.resize();
  });

  if (proxy.$refs["echart"]) {
    observe.value.observe(proxy.$refs["echart"]);
  }
};

onMounted(() => {
  report().then(({ data }) => {
    userInfo.value = data.data.user;
    countData.value = data.data.types;
    chartData.splice(0, chartData.length, ...data.data.typeList);
    renderCharts();
  });
});
</script>

<style scoped lang="less">
.home {
  height: 100%;
  .user {
    display: flex;
    height: 150px;
    align-items: center;
    margin-bottom: 10px;
    img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin-right: 40px;
    }
    .user-info {
      p {
        line-height: 24px;
      }
      .user-info-p {
        color: #999;
      }
      .user-info-admin {
        margin-bottom: 15px;
        font-size: 30px;
      }
    }
    .num {
      display: flex;
      /* 当容器内的子元素总宽度超过容器宽度时，使用该属性值可让子元素换行显示，以适应容器空间。 */
      flex-wrap: wrap;
      width: 80%;
      padding-left: 20px;
      padding-right: 20px;
      justify-content: space-between;
      .el-card {
        width: 18%;
        margin-left: 40px;
        margin-bottom: 20px;
      }
      .detail {
        margin: 5px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-left: 20px;
        .num {
          font-size: 24px;
        }
        .txt {
          font-size: 16px;
          color: #999;
        }
      }
    }
  }
}
</style>
