<template>
  <el-menu
    :style="{ width: !isCollapse ? '220px' : '64px' }"
    background-color="#545c64"
    class="el-menu-vertical-demo"
    text-color="#fff"
    :collapse="isCollapse"
    default-active="2"
  >
    <p class="logo-lg">{{ !isCollapse ? "DIDI陪诊" : "DIDI" }}</p>
    <TreeMenu :index="1" :menuData="menuData" />
  </el-menu>
</template>
<script setup>
import TreeMenu from "../components/treeMenu.vue";
import { computed } from "vue";
import { useStore } from "vuex";
//store 对象
const store = useStore();
//拿到菜单折叠状态数据
const isCollapse = computed(() => store.state.menu.isCollapse);
// 菜单数据,并传递给TreeMenu
const menuData = computed(() => store.state.menu.routerList);
</script>
<style lang="less" scoped>
.el-menu-vertical-demo {
  height: 100%;
  .logo-lg {
    font-size: 20px;
    text-align: center;
    height: 50px;
    line-height: 50px;
    color: #fff;
  }
}
</style>
