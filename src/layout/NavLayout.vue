<template>
  <div id="wapper">
    <!-- 页面顶部 -->
    <div class="header-wrap">
      <!-- logo与title -->
      <div>
        <img src="../assets/img/logo.jpg" alt="" class="logo-img">
        <h1 class="title-in-header"><span>党建云</span> 人员后台系统</h1>
      </div>
      <!-- 说明书与新建反馈 -->
      <div class="left-button-icon">
        <!-- <i class="el-icon-question instructions" @click="$router.push({name: 'InstructionsPage'})" title="说明书"></i> -->
        &nbsp;&nbsp;&nbsp; 
        <!-- <i class="el-icon-circle-plus add" @click="dialogVisible = true" title="新建反馈"></i> -->
        <!-- <el-button icon="el-icon-chat-square" circle @click="isWSTips()" title="聊天室"></el-button> -->
      </div>
      <div class="center-button-icon" 
        v-loading="chatIconLoading" element-loading-spinner="el-icon-refresh" element-loading-background="transparent" customClass="chatIconLoading" 
        @click="chatIconLoading ? isWSTips():'';">
        <el-badge :is-dot='wsTips'>
          <img 
            src="../assets/img/chat.png" 
            height="30" 
            alt="/#聊天#/" 
            @click="$router.push({name: 'HttpChat'});" 
            :title="common.websock ? '聊天室（已启动）' : '聊天室（未启动）'"
            >
        </el-badge>
      </div>
      <!-- 右侧按钮组 -->
      <div class="right-button-group">
        <el-button class="el-icon-button" circle @click="changeUser()" title="前往登录"><i class="fa fa-sign-in"></i></el-button>
        <el-dropdown class="el-icon-button" @command="onCommand">
          <span class="el-dropdown-link">
            <el-button circle title="用户信息"><i class="fa fa-user-circle"></i></el-button>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item  command="personalInfo">个人资料</el-dropdown-item>
            <el-dropdown-item  command="resetPass">重置密码</el-dropdown-item>
            <el-dropdown-item divided  command="signOutLogin">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button class="el-icon-button" circle @click="restTabs();$router.push({name: 'Home'});" title="返回首页"><i class="fa fa-home"></i></el-button>
        <el-button class="el-icon-button" circle @click="changeMode" title="切换导航"><i class="fa fa-exchange"></i></el-button>
      </div>
    </div>
    <!-- 页面主体（导航条+主页面） -->
    <transition name="el-zoom-in-bottom">
      <el-row v-loading="changeLoading" class="content-wrap-row">
        <!-- 水平方向导航 -->
        <transition name="el-zoom-in-top">
          <el-col v-if="navMode == 'horizontal'" :span="24" class="nav-bar-horizontal nav-bg my-nav">
            <el-menu :default-active="activeNav" class="el-menu-demo" mode="horizontal" menu-trigger='hover' @select="navClicked" :background-color="navbg">
              <el-submenu v-for="(item, index) in routes" :index="item.name" :key="item.name">
                <template slot="title">{{item.navName}}</template>
                <el-menu-item v-for="(itemInner, indexInner) in item.children" :index="itemInner.name" :key="itemInner.name">
                  <i class="margin-10-r nav-icon" :class="itemInner.meta.navIcon"></i>
                  <span slot="title">{{itemInner.navName}}</span>
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </el-col>
        </transition>
        <!-- 竖直方向导航 -->
        <transition name="el-zoom-in-bottom">
          <el-col v-if="navMode == 'vertical'" :span="3" class="nav-bar-vertical nav-bg my-nav">
            <el-menu :default-active="activeNav" class="el-menu-demo" mode="vertical" menu-trigger='click' @select="navClicked" :background-color="navbg">
              <el-submenu v-for="(item, index) in routes" :index="item.name" :key="item.name">
                <template slot="title">{{item.navName}}</template>
                <el-menu-item v-for="(itemInner, indexInner) in item.children" :index="itemInner.name" :key="itemInner.name">
                  <i class="margin-10-r nav-icon" :class="itemInner.meta.navIcon"></i>
                  <span slot="title">{{itemInner.navName}}</span>
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </el-col>
        </transition>
        <!-- 主页面 -->
        <el-col :span="navMode == 'vertical' ? 21 : 24" :class="{'content-vertical': navMode == 'vertical','content-horizontal': navMode == 'horizontal','show-tabs':editableTabs.length!=0,'hidden-tabs':editableTabs.length==0}">
          <div class="content-wrap" ref="contentWrap" :class="{'vertical-box': navMode == 'vertical', 'horizontal-box': navMode == 'horizontal'}" @scroll="scrollEvent">
            <el-tabs class="my-tabs-card" v-if="editableTabs.length!=0" v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" @tab-click="clickTab">
              <el-tab-pane
                v-for="(item, index) in editableTabs"
                :key="item"
                :label="common.showTitle(item).tabName"
                :name="item">
              </el-tab-pane>
            </el-tabs>
            <keep-alive >
              <router-view v-loading="mainLoading" v-if="dataReady&&$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-loading="mainLoading" v-if="dataReady&&!$route.meta.keepAlive"></router-view>
            <!-- <router-view v-loading="mainLoading" v-if="dataReady"></router-view> -->
            <el-backtop target=".content-wrap" :bottom="100" style="border: 1px solid;"></el-backtop>
          </div>
        </el-col>
      </el-row>
    </transition>
    <!-- 新建反馈Dialog -->
    <el-dialog
      title="新建反馈信息"
      :visible.sync="dialogVisible"
      width="750px"
      center>
      <build-feedback :dialogVisible="dialogVisible" @changeDialogVisible="changeDialogVisible"></build-feedback>
    </el-dialog>

    <!-- 个人资料Dialog -->
    <el-dialog
      :visible.sync="personalDialogVisible"
      width="500px"
      :show-close="false"
      center>
      <div slot="title">我的信息</div>
      <div v-if="userData">
        <el-form label-width="80px" class="personalForm">
          <el-avatar v-if="userData.picture" :size="80" :src="userData.picture" fit="cover">
            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
          </el-avatar>
          <div class="mart5">
            <span>{{userData.real_name}}</span>
            <el-divider direction="vertical"></el-divider>
            <span>{{'性别：'+common.conversionDictionary(userData.sex)}}</span>
            <el-divider direction="vertical"></el-divider>
            <span>{{'民族：'+common.conversionDictionary(userData.nation)}}</span>
          </div>
          <el-divider></el-divider>
          <el-form-item label="账号：">{{userData.account}}</el-form-item>
          <el-form-item label="婚姻：">{{common.conversionDictionary(userData.marital_status)}}</el-form-item>
          <el-form-item label="生日：">{{common._convertDate(userData.birthday, 'yyyy/MM/dd hh:mm')}}</el-form-item>
          <el-form-item label="邮箱：">{{userData.email}}</el-form-item>
          <el-form-item label="手机：">{{userData.phone}}</el-form-item>
          <el-form-item label="地址：">{{userData.address}}</el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import qs from "qs";
  import Sortable from "sortablejs";
  import BuildFeedback from '../views/maintenanceSystem/Feedback.vue';  //新建反馈
  export default {
    inject:['reload'],
    data() {
      return {
        userData:sessionStorage.getItem('userData') ? JSON.parse(sessionStorage.getItem('userData')):null,
        dataReady:     false,
        changeLoading:       false,//切换导航
        mainLoading:   false,//主页面
        navbg: '#F0F8FF',//导航的背景色（顶部导航和router导航）
        
        dialogVisible: false,//是否弹出新建反馈信息弹框

        navMode:sessionStorage.getItem('navMode')?sessionStorage.getItem('navMode'):"vertical",//默认vertical
        routes: [],
        activeNav: null,//当前激活的（导航）菜单的index

        editableTabsValue:this.$route.name? this.$route.name:null,//绑定值，选中选项卡的 name，默认第一个选项卡的 name
        editableTabs: sessionStorage.getItem('tabsArr') ? JSON.parse(sessionStorage.getItem('tabsArr')):[],//tabs数组
        wsTips:false,//消息提示
        myInterval:null,
        chatIconLoading:false,//聊天图标

        personalDialogVisible:false,//个人资料弹框
      };
    },
    components: {
      "build-feedback": BuildFeedback
    },
    watch: {
      '$route.meta.keepAlive':{
        handler (newV, oldV) {
          this.$route.meta.keepAlive = newV;
        },
        deep: true,
      },
      "navMode": {
        handler (newV, oldV) {
          // console.log(newV)
        },
        deep: true,
      },
      "$route": {
        handler (to, from) {
          console.log(to)
          //直接输路径进入页面时，top-tabs需特殊处理
          if(this.$route.name==='Home'){//首页top-tabs需清空
            this.editableTabs = [];
            this.activeNav = null;
            sessionStorage.setItem('tabsArr',JSON.stringify(this.editableTabs));
          }else{//非首页且this.editableTabs未有该页面，则需添加
            this.addTab(this.$route.name)
          }
          this.editableTabsValue = to.name;
          this.activeNav = to.name;
          this.mainLoading = true
          this.$nextTick(() => {
            this.mainLoading = false
          })
        },
        deep: true
      },
    },
    computed:{
      computed_userData(){
        return this.userData;
      },
    },
    created () {
      if(!sessionStorage.getItem('Access-Token')) {
        this.$message.error("登录失效, 请重新登录!");
        clearInterval(this.myInterval);
        this.myInterval = null;
        this.closeWS();
        setTimeout(()=> {
          this.$router.push({name: "Login"})
        }, 2000)
      } else {
        this.buildNav();this.dataReady = true;
        this.polling();//轮询
      }
    },
    mounted() {
      //直接输路径进入页面时，top-tabs需特殊处理
      if(this.$route.name==='Home'){//首页top-tabs需清空
        this.editableTabs = [];
        this.activeNav = null;
        sessionStorage.setItem('tabsArr',JSON.stringify(this.editableTabs));
      }else{//非首页且this.editableTabs未有该页面，则需添加
        this.addTab(this.$route.name)
      }
      
      console.log(this.$route.meta.keepAlive);
      console.log(this.$router.options.routes);
      this.isWSTips();//进入该页面的初始化请求，获取新消息提示
      this.editableTabs.length===0? '' : this.dragInit();
    },
    destroyed(){
      clearInterval(this.myInterval);
      this.myInterval = null;
    },
    methods: {
      scrollEvent(event){
        console.log(event)
        console.log(event.srcElement.scrollHeight)
        console.log(event.srcElement.scrollTop)
        console.log(event.srcElement.clientHeight)
        let el = document.getElementsByClassName('my-tabs-card')[0];
        if(event.srcElement.scrollHeight - (event.srcElement.scrollTop + event.srcElement.clientHeight) ==0){
          // el.style.position = '59px';
          // el.style.top = '59px';
        }else{
          // el.style.top = '59px';
        }
      },

      /**
       * 轮询
       * @return {[type]} [description]
       */
      polling() {
        this.myInterval = window.setInterval(() => {
          setTimeout(() => {
            this.isWSTips() //调用接口的方法
          }, 1)
        }, 60000);//每过60s请求一次（轮询做websoket新消息提示）
      },

      /**
       * 是否有消息提示的红点
       * @return {[type]} [description]
       */
      isWSTips(){
        if(this.userData){
          this.axios.get(`${this.common.baseAuthPath_chat}/online_group/menu`,{params:{}}).then((response) => {
            let arr = response.data.data ? response.data.data.rows :[];
            let myarr = [];//有我消息的群组id所组成的数组
            if(arr.length>0){
              for(var i = 0;i<arr.length;i++){
                arr[i].newsMessage&&arr[i].newsMessage.readerList.split(',').indexOf(String(this.userData.id))!=-1 ? myarr.push(arr[i].groupId) : '';
              }
            }
            myarr.length!=0 ? this.wsTips=true : this.wsTips=false;//有我的群组消息，wsTips设为true
            this.chatIconLoading = false;
          }).catch((error) => {
            this.chatIconLoading = true;
            // this.$message.error('获取新消息提示失败！');   
          });
        }
      },

      //关闭websoket(退登、token失效、切换用户(前往登陆))
      closeWS(){
        if(this.common.websock){
          this.common.lockReconnect = true;  
          this.common.websock.close();this.common.websock = null;    //全部关闭
          sessionStorage.removeItem('chatRecord') ;                   //清空暂缓聊天记录
          clearTimeout(this.common.reconnectData);                   //离开清除 timeout
          clearTimeout(this.common.timeoutObj);                      //离开清除 timeout
          clearTimeout(this.common.serverTimeoutObj);                //离开清除 timeout
          // this.$router.back(-1);                                     //离开聊天室
        }else{
          // this.$message('你尚未启动！')
        }   
      },

      /**
       * 拖拽tabs
       * @return {[type]} [description]
       */
      dragInit() {
       // 一定要等页面先加载完后才调用，否则会报错
        this.$nextTick(() => {
          this.initSort()
        })
      },
      initSort() {
        let el = document.querySelectorAll(".my-tabs-card .el-tabs__nav")[0];// 获取拖拽的容器 .my-tabs-card 一定是tabs上的class 如果是其他上的class名称，可能会无法拖拽
        this.sortable = Sortable.create(el, {
          group: "top_tabs",  //命名
          sort: true,  //拖拽排序
          delay: 100, // 拖动的延迟时间
          animation: 300,  // 排序动画的时间，ms

          // ghostClass: "sortable-ghost",  //格式为简单css选择器的字符串，当拖动列表单元时会生成一个副本作为影子单元来模拟被拖动单元排序的情况，此配置项就是来给这个影子单元添加一个class，我们可以通过这种方式来给影子元素进行编辑样式；
          // chosenClass: "sortable-chosen",  // 格式为简单css选择器的字符串，当选中列表单元时会给该单元增加一个class；
          // dragClass: "sortable-drag",  // Class name for the dragging item
          fallbackClass: true,  // 当forceFallback设置为true时，拖放过程中鼠标附着单元的样式

          onEnd: evt => {//列表单元拖放结束后的回调函数
            this.$nextTick(() => {
              // 实现推拽的代码，先在原数组中删除当前推拽的对象，然后在将它添加到对应的位置
              // targetObj当前推拽的对象，evt.oldIndex推拽对象原来的下标，evt.newIndex推拽对象要推拽到的下标
              let targetObj = this.editableTabs.splice(evt.oldIndex, 1)[0]
              this.editableTabs.splice(evt.newIndex, 0, targetObj)
              sessionStorage.setItem('tabsArr',JSON.stringify(this.editableTabs));
            })
          },
        })
      },
      /**
       * 增加选项卡
       * @param {[type]} index      [router的name值]
       */
      addTab(index) {
        this.editableTabs.push(index);
        this.editableTabs = this.unique(this.editableTabs);//数组去重
        this.editableTabsValue = index;//选中的选项卡

        sessionStorage.setItem('tabsArr',JSON.stringify(this.editableTabs));
      },
      /**
       * 数组去重
       * @param  {[type]} arr [需去重的数组]
       * @return {[type]}     [description]
       */
      unique(arr){
        var hash=[];
        for (var i = 0; i < arr.length; i++) {
           if(hash.indexOf(arr[i])==-1){
            hash.push(arr[i]);
           }
        }
        return hash;
      },
      /**
       * 移除选项卡
       * @param  {[type]} targetName [description]
       * @return {[type]}            [description]
       */
      removeTab(targetName) {
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab;
              }
            }
          });
        }

        this.activeNav = activeName;//当前激活的（导航）菜单的index
        this.$router.push({name: activeName})//导航条路由跳转

        this.editableTabsValue = activeName;//选中的选项卡
        this.editableTabs = tabs.filter(tab => tab !== targetName);//点击移除选项卡 this.editableTabs

        sessionStorage.setItem('tabsArr',JSON.stringify(this.editableTabs));
      },
      /**
       * tab 被选中时触发
       * @param  {[type]} tab   [description]
       * @param  {[type]} event [description]
       * @return {[type]}       [description]
       */
      clickTab(tab, event) {
        this.activeNav = tab.name;//当前激活的（导航）菜单的index
        this.$router.push({name: tab.name})//导航条路由跳转
        this.editableTabsValue = tab.name;//选中的选项卡
      },
      /**
       * 根据router构建左侧导航
       * @return {[type]} [description]
       */
      buildNav() { 
        this.$router.options.routes.forEach((item, index) => {
          if(item.meta.showNav&&item.name!='Home') {
            this.routes.push(item)
          }
        })
        this.activeNav = this.$route.name//当前激活的（导航）菜单的index
        this.routes.forEach((item, index) => {
          var target = item.children
          if(target) {
            for(let i = target.length-1; i >= 0; i--) { // 删除不需展示在导航上的二级页面
              if(target[i].meta.hiddenPage) {
                target.splice(i, 1)
              }
            }
          }
        })
      },
      /**
       * 使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转
       */
      navClicked (index, indexArray) {
        this.activeNav = index;//当前激活的（导航）菜单的index
        this.addTab(index);//点击导航条增加一个tab选项卡
        this.$router.push({name: index})//导航条路由跳转
      },
      /**
       * 切换导航
       */
      changeMode () {
        this.changeLoading = true
        if(this.navMode == "horizontal") {
          this.navMode = "vertical"
          this.changeLoading = false
          sessionStorage.setItem("navMode","vertical")
        } else {
          this.navMode = "horizontal"
          this.changeLoading = false
          sessionStorage.setItem("navMode","horizontal")
        }
        setTimeout (() => {
          this.changeLoading = false
        }, 500)
      },

      /**
       * 新建反馈 触发子组件 新建反馈信息弹框消失 的事件
       */
      changeDialogVisible(data){
        this.dialogVisible = data;//改变了父组件的值
      },

      /**
       * 下拉菜单
       * @param  {[type]} val dropdown-item 的指令
       * @return {[type]}     [description]
       */
      onCommand(val){
        if(val === 'personalInfo'){
          !this.userData ? this.userData = JSON.parse(sessionStorage.getItem("userData")) : '';
          this.personalDialogVisible = true;
        }else if(val === 'resetPass'){
          this.$message('暂未实现！')
        }else if(val === 'signOutLogin'){
          this.closeWS();
          sessionStorage.removeItem('tabsArr');
          sessionStorage.removeItem("Access-Token")
          sessionStorage.removeItem("userData");
          sessionStorage.removeItem('dictionary');
          this.$router.push({name: 'Login'});
        }else{}
      },

      /**
       * 返回首页，需清空顶部tabs选项卡以及导航菜单的激活状态
       * @return {[type]} [description]
       */
      restTabs(){
        this.editableTabs = [];
        this.activeNav = null;
        sessionStorage.setItem('tabsArr',JSON.stringify(this.editableTabs));
      },
      /**
       * 前往登陆(切换用户)
       * @return {[type]} [description]
       */
      changeUser(){
        this.closeWS();
        sessionStorage.removeItem('tabsArr');
        sessionStorage.removeItem("Access-Token")
        sessionStorage.removeItem("userData");
        sessionStorage.removeItem('dictionary');
        this.$router.push({name: 'Login'});
      },
    },
  }
</script>

<style lang="less">
  @navbg: #F0F8FF;
  .my-nav{
    .el-menu{
      border-right:none !important;/*导航菜单的样式修改*/
      .el-submenu__title{
        border-bottom: 0px solid #ddd;
      }
      .el-submenu__title:hover{
        background:#fff !important;
      }
      .el-menu-item:hover{
        background:#fff !important;
      }
      .el-menu-item.is-active{
        background:#fff !important;
      }
    }
  }
  .my-tabs-card{
    .el-tabs__header{
      margin:0 !important;/*选项卡的样式修改*/
      .el-tabs__nav.is-top{
        background: @navbg;
      }
      .el-tabs__item.is-active.is-closable{
        background:#fff;
      }
    }
  }
</style>

<style scoped lang="less">
  @navbg: #F0F8FF;
  #wapper {
    background-color: rgb(255,255,255);
    background-size: 800px;
    background-position: -200px;
    .header-wrap {
      height: 60px;
      border-bottom: 1px solid #dcdcdc;
      box-sizing: border-box;
      background: @navbg;
      &> div {
        display: flex;
        flex-direction: flex-start;
      }
      .logo-img {
        height: 59px;
      }
      .title-in-header {
        margin: 0;
        height: 60px;
        line-height: 60px;
        span{
          font-size:16px;
        }
      }
      .left-button-icon{
        position: absolute;
        top: 10px;
        right: 300px;
        i{
          font-size: 20px;
          cursor:pointer;
        }
        .instructions{
          margin-top:10px;
        }
        .add{
          margin-top:10px;
        }
      }
      .center-button-icon{
        position: absolute;
        top: 15px;
        right: 240px;
        cursor:pointer;
        line-height:30px;
      }
      .right-button-group {
        position: absolute;
        top: 10px;
        right: 10px;
        .el-icon-button {
          margin-left: 5px;
          margin-right: 5px;
        }
      }
    }
    .content-wrap-row{
      .nav-bg{
        background:@navbg;
      }
      .nav-bar-vertical {
        width: 239px!important;
        height: calc(100vh - 60px);
      }
      .nav-bar-horizontal{
        width:100vw;
        height:60px;
      }
      .content-vertical {
        width: calc( 100% - 240px )!important;
        
      }
      .content-horizontal {
        width: calc(100% - 1px)!important;
      }
      .content-wrap {
        width: 100%;
        overflow-y: auto;
        background: #fff;
        border-left:1px solid #e6e6e6;
      }
      .content-wrap.vertical-box {
        height: calc( 100vh - 60px );
        .my-tabs-card{
          display: block;
          position:absolute;
          z-index:99;
          width:100%;
          top: 0px;
          // top: 59px;
          background:#fff !important; 
          .el-tabs__header{
            margin:0 !important;
          }
        }
      }
      .content-wrap.horizontal-box {
        height: calc( 100vh - 120px );
        .my-tabs-card{
          display:none;
        }
      }
    }
  } 
</style>
