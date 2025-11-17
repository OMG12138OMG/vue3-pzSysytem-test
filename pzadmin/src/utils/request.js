import axios from 'axios'
import { ElMessage } from 'element-plus'

const http = axios.create({
    baseURL:'https:/v3pz.itndedu.com/v3pz',
    timeout: 10000
})

// 添加请求拦截器
http.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('pz_token')
    //接口白名单,即不需要添加token的api
    const whiteUrl = ['/get/code','/user/authentication','/login']
    //判断当前接口是否在白名单内
    if(token && !whiteUrl.includes(config.url)){
        config.headers['x-token'] = token
    }
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
http.interceptors.response.use(function (response) {
    //接口异常处理
    if(response.data.code === -1){
      ElMessage.warning(response.data.message)
    }
    if(response.data.code === -2){
      localStorage.removeItem('pz_token')
      localStorage.removeItem('pz_userInfo')
      localStorage.removeItem("pz_v3pz");
      window.location.href = window.location.origin
    }
    return response;
  }, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  });

export default http