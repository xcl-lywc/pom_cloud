import vue from 'vue';
import { MessageBox } from 'element-ui';
import { Notification } from 'element-ui';
import router from '.././router'
import store from '.././store'
import qs from "qs"
const Vue = new vue({router, store}); //注册router, 实例中调用

export default {
  //通用
  basePath:       `${window.location.origin}/api`,
  baseAuthPath:       `${window.location.origin}/api/user`,
  webSocketSever: `${window.location.host}/api/websoket`,
  //聊天
  basePath_chat:       `${window.location.origin}/api`,
  baseAuthPath_chat_push:       `${window.location.origin}/api/push`,//yaohy
  baseAuthPath_chat:       `${window.location.origin}/api/user`,//gh
  httpSocketSever: `${window.location.host}/chat/websocket/web`,
  //文件
  basePath_file:`${window.location.origin}/file`,
  baseAuthPath_file:`${window.location.origin}/file/user`,
  //维护系统
  baseMSPath:     `${window.location.origin}/ms`,
  //流程
  baseProcessPath:     `${window.location.origin}/api/activiti`,

  websock: null, //webSocket对象
  reconnectData:null,
  lockReconnect:false,    //避免重复连接，因为onerror之后会立即触发 onclose
  timeout:10000,          //10s一次心跳检测
  timeoutObj:null,
  serverTimeoutObj:null,
  wsTips:false,//webSocket消息提示

  elementPagination: {     //elementUi中的分页所需数据
    pageSizes: [10, 20, 30],
    pageSizeDefault: 10,   //初始条数
    pageNumDefault:1,      //初始页码
  },
  tableMaxHeight:'800px',

  /**
   * 根据id转化为文本信息（字典）
   * @param  {[type]} id 查询的id，即需转化为文本信息的id
   * @return {[type]}    [description]
   */
  conversionDictionary(id){
    let result = ''
    if(id!=null){
      let dictionary = sessionStorage.getItem('dictionary') ? JSON.parse(sessionStorage.getItem('dictionary')):null;
      let arr = [];//字典的所有id数组
      if(dictionary){//有字典并且成功获取到字典
        if(dictionary.total>0){//字典有数据
          dictionary.rows.forEach( function(item, index) {arr.push(item.id)});//把字典的所有id循环装到数组里面
          if(arr.indexOf(id)===-1){//查询的id不在字典的情况
            return result = '无法匹配';
          }else{//查询的id在字典的情况
            dictionary.rows.forEach( function(item, index) {
              if(item.id===id){return result = item.name;}
            });
          } 
        }else{//字典无数据
          return result = '暂无'
        }
      }else{//没有字典或获取字典失败
        return result = '没有字典或获取字典失败！！'
      }
    }else{
      return result = '未填写'
    }
    return result;
  },

  /*
   * 根据router的name值显示当前页面大标题与小标题
   */
  showTitle(name){
    switch(name){
      case 'OrgList':
        return {mainName: '组织检索',subName:'系统组织列表',tabName: '组织列表'};
        break;
      case 'OrgDetail':
        return {mainName: '组织详情',subName:'OrgDetail',tabName: '组织详情'};
        break;
      case 'PersonSearch':
        return {mainName: '用户搜索',subName:'用户列表',tabName: '人员检索'};
        break;
      case 'BackstagePerson':
        return {mainName: '后台人员',subName:'人员列表',tabName: '后台人员'};
        break;
      case 'BacktageRole':
        return {mainName: '后台权限管理',subName:'角色列表',tabName: '后台角色'};
        break;
      case 'SystemApp':
        return {mainName: '系统应用',subName:'应用列表',tabName: '系统应用'};
        break;
      case 'MyApp':
        return {mainName: '我的应用',subName:'应用列表',tabName: '我的应用'};
        break;
      case 'CreateApp':
        return {mainName: '创建应用',subName:'CreateApp',tabName: '创建应用'};
        break;
      case 'AppDetail':
        return {mainName: '应用详情',subName:'AppDetail',tabName: '应用详情'};
        break;
      case 'ParamSet':
        return {mainName: '系统参数',subName:'参数列表',tabName: '系统参数'};
        break;
      case 'OperationLog':
        return {mainName: '操作日志',subName:'日志列表',tabName: '操作日志'};
        break;
      case 'AbnormalLog':
        return {mainName: '异常日志',subName:'日志列表',tabName: '异常日志'};
        break;
			case 'MenuManage':
			  return {mainName: '菜单管理',subName:'菜单项详情',tabName: '菜单管理'};
			  break;
			case 'ProcessManage':
			  return {mainName: '流程图管理',subName:'流程图展示',tabName: '流程图管理'};
			  break;
			case 'FormManage':
			  return {mainName: '表单管理',subName:'表单管理',tabName: '表单管理'};
			  break;
      case 'FillInForm':
        return {mainName: '填写表单',subName:'填写表单',tabName: '填写表单'};
        break;
      default:
        return {mainName: '',subName:''};
        break;
    };
  },
 
  /**
  * 将时间戳转换为某年某月某日 00：00：00
  * @params {string/number} timeSetback 时间戳
  * @params {string} format 时间格式
  */
  _convertDate(timeSetback, format){
    return timeSetback ? new Date(timeSetback).Format(format) : '暂无';
  },
  
  /**
   * 通用方法用于返回之前浏览的页面, 当path丢失时返回首页
   * @return {[type]} [description]
   */
  backForward () {
    let path = sessionStorage.getItem("historyPath") || "/"
    Vue.$router.push({path: path})
  },
 
  /*
   * 文本验证字符
   * @params {object} rule 文本详细信息
   * @params {string} value 文本的值
   * @params {object} callback 回调函数
   * @params {string} type  文本类型 single为单行(20)，textarea为多行(128)
   */
  wordNumberValid(rule, value, callback, type){  
    if(value){
      if(type == 'single'){
        if(value.length > 20){
          return callback(new Error('最大字数不能超过20个字'));
        }
        return callback();
      }else{
        if(value.length > 128){
          return callback(new Error('最大字数不能超过128个字'));
        }
        return callback();
      } 
    }
    return callback();
  },

  /*
   * 根据附件地址下载附件
   */
  downloadFileByUrl(fileUrl){
    window.open(fileUrl);
  },

  /*
   * blod 下载附件
   */
  _fileBold(response) { 
    let fileName = decodeURI(response.headers['content-disposition'].substring(20, response.headers['content-disposition'].length));
    let url = window.URL.createObjectURL(new Blob([response.data]))
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
  },
  
}

/*
*   格式化日期格式
*/
Date.prototype.Format = function (fmt) {
  var o = {
      "M+": this.getMonth() + 1, //月份 
      "d+": this.getDate(), //日 
      "h+": this.getHours(), //小时 
      "m+": this.getMinutes(), //分 
      "s+": this.getSeconds(), //秒 
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
      "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}