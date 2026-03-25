import { createStore } from 'vuex'
import menu from './menu'
import createPersistedstate from 'vuex-persistedstate'

export default createStore({
    // 利用vuex-persistedstate插件进行持久化存储
    plugins: [new createPersistedstate({
        // 设置存储的key，存储在本地localStorage中
           key: 'pz_v3pz',
        })
    ],
    modules:{
        menu
    }
})