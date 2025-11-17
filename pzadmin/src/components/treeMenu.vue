<template>
  <template v-for="(item, index) in props.menuData">
    <el-menu-item
      @click="handleClick(item, `${props.index}-${item.meta.id}}`)"
      v-if="!item.children || item.children.length === 0"
      :index="`${props.index}-${item.meta.id}}`"
      :key="`${props.index}-${item.meta.id}}`"
    >
      <el-icon size="20">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span>{{ item.meta.name }}</span>
    </el-menu-item>
    <el-sub-menu v-else :index="`${props.index}-${item.meta.id}}`">
      <template #title>
        <el-icon size="20">
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.name }}</span>
      </template>
      <TreeMenu
        :index="`${props.index}-${item.meta.id}}`"
        :menuData="item.children"
      />
    </el-sub-menu>
  </template>
</template>
<script setup>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
//store 对象
const store = useStore();
//创建路由实例
const router = useRouter();
//获得父组件传来的数据
const props = defineProps(["menuData", "index"]);
//点击菜单
const handleClick = (item, active) => {
  store.commit("addMenu", item.meta);
  router.push(item.meta.path);
};
</script>
<style lang="less" scoped></style>
