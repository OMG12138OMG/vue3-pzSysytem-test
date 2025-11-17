import Layout from '../views/Main.vue'
import Login from '../views/login/index.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const localData = localStorage.getItem('pz_v3pz')

const routes = [
  { 
    path: '/',
    component: Layout,
    name: 'main',
    redirect: to => {
      if(localData){
        const child = JSON.parse(localData).menu.routerList[0].children
        //有子菜单
        if(child) {
          return child[0].meta.path
        }else{
        //没有子菜单
          return JSON.parse(localData).menu.routerList[0].meta.path
        }
      }else{
        return '/'
      }
    },
    children: []
  },
  {
    path: '/login',
    component: Login
  },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})
export default router