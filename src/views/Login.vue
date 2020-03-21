<!--
  登录页
-->
<template>
  <div>
    <!-- 登录背景 -->
    <div class="background-wrap">
      <div class="login-background"></div>
    </div>
    <div id="title-box">
      <p class="main-title">党建云</p>
      <p class="sub-title">人员后台系统</p>
    </div>
    <!-- 登录框 -->
    <div class="login-box">
      <div class="box-title">欢迎登录</div>
      <div class="box-form">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="0">
          <el-form-item prop="username">
            <el-input type="text" v-model="ruleForm.username" auto-complete="off" palcehoder="请输入用户名" @change="checked = false">
              <i slot="prefix" class="el-input__icon fa fa-user"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="ruleForm.password" show-password auto-complete="off" palcehoder="请输入密码" @change="checked = false">
              <i slot="prefix" class="el-input__icon fa fa-lock"></i>
            </el-input>
          </el-form-item>
          <el-form-item style="height:20px;">
            <el-checkbox v-model="checked" class="fl" @change="rememberClick" :disabled='ruleForm.username==""||ruleForm.password==""'><span class="text-dark-blue">记住密码</span></el-checkbox>
            <!-- <el-button type="text" class="text-dark-blue fr" @click="">帮助中心</el-button> -->
          </el-form-item>
          <el-form-item>
            <el-button :loading="buttonLoading" @click="submitForm('ruleForm')" class="fill-width" type="danger">
            {{buttonLoading ? '登录中' : '登录'}}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button :disabled="buttonLoading" @click="resetForm('ruleForm')" class="fill-width">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div></div>
    </div>
  </div>
</template>

<script>
  import qs    from "qs"; //需要传表单时, 引用此包
  import { request } from '../plugins/request.js'
  export default {
    data() {
      var validatepass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          callback();
        }
      };
      var validateaccount = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else {
          callback();
        }
      };
      return {
        checked: false,
        buttonLoading: false,
        ruleForm: {
          password: '',
          username: '',
        },
        rules: {
          password: [
            { validator: validatepass, trigger: 'blur' }
          ],
          username: [
            { validator: validateaccount, trigger: 'blur' }
          ],
        },
      };
    },
    created () {
      let self = this
      self._remember();
    },
    mounted () {
      // --------- 键盘时间的监听
      window.addEventListener('keypress', this.pressEnter);  
    },
    methods: {
      pressEnter (event) { 
        if(this.$route.path && this.$route.path == "/login") { //仅在登录页调用此事件
          if(event.key == "Enter") {
            this.submitForm('ruleForm');
          }
        }
      },
      //登录按钮
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.login();
          } else {
            return false;
          }
        });
      },
      //登录
      login: function() {
        var self = this;
        self.buttonLoading = true;
        let config = {
          url: `${this.common.basePath}/login/password`,
          method: "post",
          data: qs.stringify(this.ruleForm)
        }
        this.axios(config).then((r) => {
          self.buttonLoading = false;
          // sessionStorage.setItem('Access-Token',JSON.stringify(r.headers['access-token']));
          // sessionStorage.setItem('Access-Key',JSON.stringify(r.data.data.userId));
          // sessionStorage.setItem('Authority',JSON.stringify(r.data.data.webList));
          //登录成功储存token
          self.axios.defaults.headers.common['Authorization'] = `Bearer ${r.data.data.access_token}`;
          //session中存储用于图片和文件上传
          sessionStorage.setItem('Access-Token',JSON.stringify(r.data.data.access_token));
          //查询当前登录用户信息
          this.axios.get(`${this.common.baseAuthPath}/user/loginUser`,{params:{}}).then((response) => {
            sessionStorage.setItem('userData',JSON.stringify(response.data.data))
          }).catch((error) => {this.$message.error('获取用户信息失败！5秒后...前往重新登录！');setTimeout(()=> {this.$router.push({name: 'Login'});}, 5000)});
          //查询字典
          this.axios.post(`${this.common.baseAuthPath}/dictionary/type`,{}).then((response) => {
            sessionStorage.setItem('dictionary',JSON.stringify(response.data.data))
          }).catch((error) => {this.$message.error('获取字典失败！5秒后...前往重新登录！');setTimeout(()=> {this.$router.push({name: 'Login'});}, 5000)});
          //登录成功，进入首页，创建WS
          this.createUpWS();
          self.$router.push({name: 'Home'});
        }).catch((e) => {
          self.buttonLoading = false;
          self.$message.error(e)
        })
      },
      //登录成功，进入首页，创建WS
      createUpWS(){
        console.log('登陆成功，创建WS');
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
      },
      //重置按钮
      resetForm(formName) {
        this.checked = false;
        this.ruleForm.password = '';
        this.ruleForm.username = '';
        localStorage.setItem("remember",'false');
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        this.$refs[formName].resetFields();
      },
      //记住按钮
      rememberClick() {
        this.checked ? localStorage.setItem("remember",'true') : localStorage.setItem("remember",'false')
        this.checked ? localStorage.setItem("username", this.ruleForm.username) : localStorage.removeItem('username');
        this.checked ? localStorage.setItem("password", this.ruleForm.password) : localStorage.removeItem('password');
      },
      //记住账号密码
      _remember: function() {
        if(JSON.parse(localStorage.getItem("remember"))) { 
          this.checked = true;
          if(localStorage.getItem("username") && localStorage.getItem("password")) {
            this.ruleForm.username = localStorage.getItem("username");
            this.ruleForm.password = localStorage.getItem("password");
          }
        }else{
          this.checked = false;
          localStorage.removeItem('username');
          localStorage.removeItem('password');
        }
      },
    },
  }
</script>

<style scoped lang="less">
  @darkBlue: #114275;
  @deepRed: #920404;
  @keyframes scaleBackground {
    0% {transform:scale(1, 1);background-image: url("../assets/img/01.jpg");}
    50% {transform:scale(1.04, 1.02);background-image: url("../assets/img/01.jpg");}
    100% {transform:scale(1, 1);background-image: url("../assets/img/01.jpg");}
  }
  .background-wrap {
    overflow: hidden;
    .login-background {
      width: 100vw;
      height: 100vh;
      background-position: center;
      background-size:cover;
      animation: scaleBackground 15s infinite;
      transition-timing-function: ease-in-out;
    }
  }
  #title-img {
    position: absolute;
    width: 28vw;
    left: 10vw;
    top: 50%;
    margin-top: -158px;
  }
  #title-box {
    position: absolute;
    width: 28vw;
    left: calc(10vw + 0px);
    top: calc(50% + 0px);
    margin-top: -158px;
    color:#fff;
    .main-title{
      font-weight:900;
      font-size:36px;
      float:left;
    }
    .sub-title{
      margin-top:6px;
      margin-left:5px;
      float:left;
      width:320px;
      font-size:30px;
      font-weight:900;
    }
  }
  .text-dark-blue {
    color: @darkBlue;
  }
  .login-box {
    position: absolute;
    top: 50%;
    right: 15vw;
    width: 500px;
    overflow: hidden;
    margin: -243px auto 0 auto;
    padding: 41px 62px;
    box-sizing: border-box;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0 0 10px #ebeef5;
    color: #333;
    opacity: 0.9;
    -webkit-box-sizing: border-box;
    background-color: #d4d4d496;
    border-radius: 10px;
    box-shadow: 5px 5px 10px #171717b8;
    .box-title{
      color: @deepRed;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      padding-bottom: 20px;
      margin-bottom: 20px;
      border-bottom: 1px solid @darkBlue;
    }
    .box-form{
      padding: 0 15px;
      .head-img{
        margin-left: 35%;
        border-radius: 50%;
        width: 80px;
      }
    }
    .box-footer{
      cursor: pointer;
      color: royalblue;
      text-align: center;
      font-size: 14px;
    }
  }
</style>
<style lang="less">
  #particles-js{
    width: 100vw;
    height: 99.5vh;
    position: absolute;
    top: 0;
  }
  #canvas {
    position: absolute;
    width: 100vw;
    height: 100vh;
  }
  .login-box {
    .el-form-item__content {
      padding-left: 0;
    }
  }
</style>