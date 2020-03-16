// http.js
import axios from 'axios'
import store from '../store'
const url = 'http://47.108.67.109/'; // 环境配置中的接口地址
const ajax = axios.create({
    baseURL: url, // 请求地址
    timeout: 30000 // 请求超时
})
ajax.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8' // post 的 请求头设置
// 自定义请求
ajax.defaults.adapter = function (config){
    return new Promise((resolve, reject) => {
        // console.log(config)
        // wx小程序 发起请求相应 log 就可以看到熟悉的返回啦
        let header = {};
        if(wx.getStorageSync('token')){
            header = {
                'content-type': 'application/json',// 默认值
                'token': `${ wx.getStorageSync('token') }` 
            }
        } else {
            header = {
                'content-type': 'application/json'// 默认值
            }
        }
        wx.request({
          url:url+config.url,
          method:config.method,
          data:config.data,
          header:header,
          success:(res)=>{ 
              if(res.data.code == -1){
                mpvue.navigateTo({ 
                    url: '../authorize/main'
                })
              }else{
                return resolve(res);
              }
              
          },
          fail:(err)=>{
            return reject(err)
          }
        })
      })
}
// 请求拦截
ajax.interceptors.request.use(config => {
    // 每次请求之前判断vuex中的token是否存在（也可以存在stroge里面）
    // 如果存在，则统一在请求的header中加上token，后台判断是否登录
    // 即使存在token，也有可能过期，所以在响应拦截中也要判断状态
    // const token =  wx.getStorageSync('token');
    // console.log(wx.getStorageSync('token'),'666666')
    // token && (config.headers.Authorization = 'Bearer' + token) // jwt验证
    return config
}, error => {
    return Promise.error(error)
}
)
// 响应拦截
ajax.interceptors.response.use(
    response => {
        return response
    },
    // 状态码提示
    error => {
        return Promise.reject(error);
    }
)

export default ajax