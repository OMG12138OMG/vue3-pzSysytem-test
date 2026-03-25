<template>
  <div class="header-container">
    <div class="header-left flex-box">
      <!-- @click="store.commit('collapseMenu')"此时将点击结果上传给store -->
      <el-icon class="icon" size="20" @click="store.commit('collapseMenu')"
        ><Fold
      /></el-icon>
      <ul class="flex-box">
        <li
          v-for="(item, index) in selectMenu"
          :key="item.path"
          :class="{ selected: route.path === item.path }"
          class="tab flex-box"
        >
          <el-icon size="12"><component :is="item.icon"></component></el-icon>
          <router-link class="text flex-box" :to="item.path">
            {{ item.name }}
          </router-link>
          <el-icon class="close" size="12" @click="closeTab(item, index)">
            <Close />
          </el-icon>
        </li>
      </ul>
    </div>
    <div class="header-right">
      <el-dropdown @command="handleClick">
        <div class="el-dropdown-link flex-box">
          <el-avatar :src="userInfo.avatar" />
          <p class="user-name">{{ userInfo.name }}</p>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="cancel">登出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

const userInfo = JSON.parse(localStorage.getItem("pz_userInfo"));

//store 对象
const store = useStore();
//创建路由实例
const route = useRoute();
const router = useRouter();
const selectMenu = computed(() => store.state.menu.selectMenu);
const closeTab = (item, index) => {
  store.commit("closeMenu", item);
  // 删除的非当前页tag,不做任何处理
  if (route.path !== item.path) {
    return;
  }
  // 获取当前菜单
  const selectMenuData = selectMenu.value;
  // 如果删除的事最后一项
  if (index === selectMenuData.length) {
    // 如果tag只有一个元素
    if (!selectMenuData.length) {
      router.push("/");
    } else {
      router.push(selectMenuData[index - 1].path);
    }
  } else {
    //如果删除的事中间位置tag
    router.push(selectMenuData[index].path);
  }
};
const handleClick = (command) => {
  if (command === "cancel") {
    localStorage.removeItem("pz_token");
    localStorage.removeItem("pz_userInfo");
    localStorage.removeItem("pz_v3pz");
    router.push("/login");
  }
};
</script>
<style lang="less" scoped>
.flex-box {
  display: flex;
  align-items: center; /*上下居中*/
}
.header-container {
  display: flex;
  justify-content: space-between; /*两边对齐*/
  align-items: center; /*上下居中*/
  height: 100%;
  background-color: #fff;
  padding-right: 25px;
  .header-left {
    height: 100%;
    .icon {
      width: 45px;
      height: 100%;
    }
    .icon:hover {
      background-color: #f5f5f5;
      cursor: pointer;
    }
    ul {
      height: 100%;
      .tab {
        height: 100%;
        padding: 0 10px;
        .text {
          margin: 0 5px;
        }
        .close {
          visibility: hidden;
        }
        &.selected {
          a {
            color: #409eff;
          }
          i {
            color: #409eff;
          }
          background-color: #f5f5f5;
        }
      }
    }
    .tab:hover {
      background-color: #f5f5f5;
      cursor: pointer;
      .close {
        visibility: inherit;
        color: #000;
      }
    }
  }
  .header-right {
    .user-name {
      margin-left: 10px;
    }
  }
  a {
    height: 100%;
    font-size: 15px;
    color: #333;
  }
}
</style>
