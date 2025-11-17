const localData = localStorage.getItem('pz_v3pz')

const state = localData ? localData.menu: {
    isCollapse: false,
    selectMenu:[],
    routerList:[],
}
const mutations = {
    collapseMenu(state){
        state.isCollapse = !state.isCollapse
    },
    addMenu(state,payload){
        //对菜单进行去重
        if(state.selectMenu.findIndex(item=>item.path === payload.path) === -1){
            state.selectMenu.push(payload)
        }
    },
    closeMenu(state,payload){
        //找到点击数据的索引
        const index = state.selectMenu.findIndex(item=>item.path === payload.path)
        //根据索引删除
        state.selectMenu.splice(index,1)
    },
    dynamicMenu(state,payload){
        //通过glob导入文件
        const modules = import.meta.glob('../views/**/**/*.vue')
        function routerSet(router){
            router.forEach(route => {
                //判断是否有子菜单
                if(!route.children){
                    const url = `../views${route.meta.path}/index.vue`
                    //拿到vue组件
                    route.component = modules[url]
                }else{
                    routerSet(route.children)
                }
            });
        }
        routerSet(payload)
        state.routerList = payload
    },
}

export default {
  state,
  mutations
}