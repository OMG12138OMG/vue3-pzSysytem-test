import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import store from './store'

//刷新后动态路由添加
//首先因为动态路由是保存在内存中的，刷新后vue router实例重建，动态路由会丢失，所以需要重新添加
//在应用初始化时恢复路由
const localData = localStorage.getItem('pz_v3pz')
if(localData){
  //将动态路由再次添加到store的state.menu.routerList中
  store.commit('dynamicMenu',JSON.parse(localData).menu.routerList)
  store.state.menu.routerList.forEach((item) => {
    router.addRoute('main',item)
  })
}


//路由守卫，每次跳转之前执行
router.beforeEach((to, from) => {
  const token = localStorage.getItem('pz_token')
  // 情况1：未登录且访问的不是登录页，则跳登录页
  if (!token && to.path !== '/login') {
    // 避免重复跳登录页
    if (from.path !== '/login') {
      return '/login'
    }
  } 
  // 情况2：已登录且访问登录页，则跳首页
  else if (token && to.path === '/login') {
    // 避免重复跳首页
    if (from.path !== '/') {
      return '/'
    }
  }
})

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// 挂载路由
app.use(router)
// 挂载状态管理
app.use(store)
app.mount('#app')
