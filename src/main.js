import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import 'customform/src/components/index.js'
import 'customform/lib/customform.common.js'

// import 'custom-bpmn-activiti/lib/custom-bpmn-activiti.css'

//引入font-awesome
import './assets/style/common.less'
import 'font-awesome/css/font-awesome.css'

//阻止启动生产消息
Vue.config.productionTip = false

//引用公用js
import commonJS from "./plugins/common.js"
Vue.prototype.common = commonJS;

//引用emotion.js
import emotionJS from "./plugins/emotion.js"
Vue.prototype.emotion = emotionJS;

// 全局引入axios 并配置
import axios from 'axios'
import qs from 'qs'

//引入js-md5
import md5 from 'js-md5';
window.md5Js = md5
Vue.prototype.md5 = md5;

// 引入echarts
import echarts from 'echarts' 
Vue.prototype.echarts = echarts 

//引入markdown编辑器
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
Vue.use(mavonEditor)

axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';
Vue.prototype.axios = axios;

/******************axios拦截器****************/
if(sessionStorage.getItem("Access-Token")) {
  Vue.prototype.axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(sessionStorage.getItem("Access-Token"))}`;
}
//request 拦截 在非登录或文章相关接口调用时 获取session中的认证数据
// Vue.prototype.axios.interceptors.request.use(
//   (config, Vue) => {
//     try {
//       if(sessionStorage.getItem("Access-Token")) {
//         config.headers.common['Access-Token'] = JSON.parse(sessionStorage.getItem("Access-Token") || null);
//       }
//       if(sessionStorage.getItem("Access-Key")) {
//         config.headers.common['Access-Key'] = JSON.parse(sessionStorage.getItem("Access-Key") || null);
//       }
//     } catch(e) {
//       console.log("获取Access-Token 或 Access-Key 有误!")
//     }
//     config.headers.common['nonce']      = Math.floor(Math.random()*10000000000000000) // 随机数0-10000000000000000
//     config.headers.common['Time-Stamp'] = (new Date()).valueOf() // 当前时间戳
//     config.headers.common['secret']     = "labmiss" // 口令
//     config.headers.common['type']       = "PC"      // 口令 

//     let object = {
//       'nonce':      config.headers.common.nonce,
//       'Time-Stamp': config.headers.common['Time-Stamp'],
//       'secret':     config.headers.common.secret,
//       'Access-Key': config.headers.common['Access-Key'],
//     }
//     let ObjectCombine = object; //组合完成的数组

//     // -------- get请求 --------- //
//     if(config.method == 'get') { 
//       ObjectCombine = Object.assign(object, config.params) //合并原有的四个header参数 & get请求附带的参数
//     }

//     let array = []
//     for ( let k in ObjectCombine ) {
//       array.push(k)
//     }
//     array.sort()
//     let FinalArray = [] //组合完成并排序后的数组
//     array.forEach( (item, index) => {
//       FinalArray.push(ObjectCombine[item])
//     })
//     config.headers.common['sign'] = window.md5Js(FinalArray.join(""))// 写入sign

//     return config
//   }, 
//   error => {
//     return Promise.reject(error)
//   }
// )

//response 拦截
Vue.prototype.axios.interceptors.response.use(
  response => {
    //请求成功的拦截
    /*if (response.config.responseType != "blob") {  //非文件类型不进行处理
      if (response.data.meta.code == "401") {
        // 抛出未登录异常, 并定时跳转至登录页
        setTimeout(() => {
          window.location.href = window.location.origin + "/web/login"
        }, 1500)
        return Promise.reject("未登陆或登陆信息失效!")
      } else if (response.data.meta.code != 0) {
        // 抛出请求失的异常
        return Promise.reject(response.data.meta.message)
      } else {
        // 无异常直接返回
        return response
      }
    } else { //文件类型直接返回
      return response
    }*/
    // 当meta信息为空时，表示后台回传的文件流
    if(!response.data.meta) return response;

    if (response.data.meta.code != 0) { 

      if(response.data.meta.code == 401 || response.data.meta.code == 405) {
        setTimeout(() => {
          window.location.href = window.location.origin + "/web/login"
        }, 1500)
        return Promise.reject("登录验证失效, 请重新登录");
      } else if (response.data.meta.code == 403) {
        setTimeout(() => {
          window.location.href = window.location.origin + "/web/login"
        }, 2000)
        return Promise.reject("您的权限已被修改, 请重新登录");
      } else {
        return Promise.reject(response.data.meta.message)
      }
    } else {
      return response
    }
  }, 
  error => {
    console.log(error.response)
    if(error.response.data.meta){
      return Promise.reject(error.response.data.meta.message);
    }else{
      return Promise.reject(error.response.statusText||error.response.data||error.response.data.error||error.response.data.message);
    }
  }
);

new Vue({
  router,
  store,
  render: function (createElement) {
    let routeMeta = this.$route.meta
    let props = {}
    // 控制是否显示 带导航的布局 || 空白布局
    if (routeMeta && routeMeta.showNav) {
      props.layout = 'nav-layout'
    } else {
      props.layout = 'blank-layout'
    }
    return createElement(App, {props})
  },
  created(){
    //当在任一路由页面被刷新时,即是根组件app被重新创建,此时可以进行webSocket重连  
    //从session中获取用户信息,是登录状态则可以进行webSocket重连
    if(sessionStorage.getItem('Access-Token')) {
      if(this.common.lockReconnect){//这里很关键，因为连接失败之后之后会相继触发 连接关闭，不然会连接上两个 WebSocket
        return
      }
      this.common.lockReconnect = true;
      this.common.reconnectData && clearTimeout(this.common.reconnectData);
      this.common.reconnectData = setTimeout(()=>{
        console.log('刷新页面，重建WS');
        if(typeof(WebSocket) === "undefined"){
          this.$message.error('您的浏览器不支持聊天，请升级浏览器或更换浏览器！');
        }else{
          //你的websockt url
          let wsuri = '';
          window.location.protocol === 'http:' ? 
          wsuri = `ws://${this.common.httpSocketSever}/${JSON.parse(sessionStorage.getItem('Access-Token'))}`:
          wsuri = `wss://${this.common.httpSocketSever}/${JSON.parse(sessionStorage.getItem('Access-Token'))}`;
          //创建websoket
          if('WebSocket' in window){
            this.common.websock = new WebSocket(wsuri);
          }else if('MozWebSocket' in window){
            this.common.websock = new MozWebSocket(wsuri);
          }else{
            this.common.websock = new SockJS(wsuri);
          }
        }
        this.common.lockReconnect = false;
      },0)
    } else {}
  },
}).$mount('#app')
