import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import api from './api'


const app=createApp(App)
// 在实例上绑定属性
app.config.globalProperties.$api=api

router.beforeEach((to,from)=>{
    const token = localStorage.getItem("h5_token");
    if (!token && to.path !== "/login") {
        // 避免重复跳登录页（比如从登录页刷新时）
        if (from.path !== '/login') {
            return '/login'
        }
    } 
    // 情况2：已登录且访问登录页 → 跳首页
    else if (token && to.path === '/login') {
        // 避免重复跳首页（比如从首页跳登录页时）
        if (from.path !== '/') {
            return '/'
        }
    }
})

app.use(router)
app.mount('#app')
