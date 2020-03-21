<template>
  <div id="chat-house" v-loading="chatLoading">
    <div id="chat-top">
      <span class="title">聊天室</span>
    </div>
    <div id='chat-box'>
      <div class="box-left-area fl">
          <div class="personal-info">
            <div class="brief-info">
              <el-avatar icon="el-icon-user-solid" class="head-image fl"></el-avatar>
              <span class="nick-name fl mart10 marl10">昵称：休息休息吧</span>
            </div>
            <div class="else-info">
              <p> 群主 2011/04/21</p>
              <p>四川成都市武侯区
                <i class="el-icon-circle-plus marl10 cursor-pointer" @click="getUserList();dialogFormVisible = true;$refs['plusform']?$refs['plusform'].resetFields():'';">添加群组</i>
              </p>
            </div>
          </div>
          <div class="current-group">
            当前群组：{{current_group_name}}
          </div>
          <ul class="online-list">
            <li class="list-header">
              <el-badge :value="onlineChat.size">当前在线人数</el-badge>
            </li>
            <div class="padt15"></div>
            <li 
              class="list-item" 
              v-for="(item,index) in onlineChat.users" 
              :key="index" 
              @click="current_chat_type = 2;chat.chatType = 3;
              my_member_id === item.member_id ? current_member_name = item.name+'（我）' : current_member_name = item.name;
              current_member_id = item.member_id;
              remove_arr_member(item.member_id)">
              <el-avatar icon="el-icon-user-solid" class="head-image fl" size="small"></el-avatar>
              <span class="nick-name fl mart5 marl10 font-blue-color" :class="{'cursor-pointer':my_member_id != item.member_id}">{{item.name}}</span>
              <span class="nick-name fl mart5 marl10 font-blue-color">{{my_member_id === item.member_id ? '（我）':''}}</span>
              <i class="el-icon-phone-outline fr mart5 marr10" :class="{'font-red-color':tipsArr_member.indexOf(item.member_id)!=-1}"></i>
            </li>
          </ul>
      </div>
      <div class="box-main-area fl">
          <div class="main-top">
            <span class="ellipsis w200">{{current_member_name ? current_member_name :current_group_name}}</span>
          </div>
          <div class="main-mid" ref="main-mid" id="main-mid">
            <div class="history">
              <el-link type="info">历史记录</el-link>
            </div>
            <!-- 群聊 -->
            <div v-if="current_chat_type === 1" v-for="(item,index) in chatArr_branch(current_group_id)" :key="index">
              <div v-if="item.whoType=='they'||item.whoType=='we'" :class="{'mid-list':true,'left':item.whoType === 'they','right':item.whoType === 'we'}">
                <div class="chat-info">
                  <el-avatar icon="el-icon-user-solid" :class="{'info-avatar':true,'fl':item.whoType === 'they','fr':item.whoType === 'we','marl10':item.whoType === 'we'}"></el-avatar>
                  <span :class="{'info-date':true,'fl':item.whoType === 'they','fr':item.whoType === 'we','mart10':true,'marl10':item.whoType === 'they','text-bold':true}">{{item.sendUser}}</span>
                  <span :class="{'info-date':true,'fl':item.whoType === 'they','fr':item.whoType === 'we','mart10':true,'marl10':item.whoType === 'they','marr10':true}">{{item.sendTime}}</span>
                </div>
                <div :class="{'chat-content':true,'fl':item.whoType === 'they','fr':item.whoType === 'we','marl40':item.whoType === 'they','marr40':item.whoType === 'we'}">{{item.message}}</div>
              </div>
              <!-- <div v-if="item.whoType==='welcome'" class="welcome">
                {{item.loginWelcome}}
              </div> -->
            </div>
            <!-- 私聊 -->
            <div v-if="current_chat_type === 2"  v-for="(item,index) in chatArr_branch(current_member_id)" :key="index">
              <div v-if="item.whoType=='they'||item.whoType=='we'" :class="{'mid-list':true,'left':item.whoType === 'they','right':item.whoType === 'we'}">
                <div class="chat-info">
                  <el-avatar icon="el-icon-user-solid" :class="{'info-avatar':true,'fl':item.whoType === 'they','fr':item.whoType === 'we','marl10':item.whoType === 'we'}"></el-avatar>
                  <span :class="{'info-date':true,'fl':item.whoType === 'they','fr':item.whoType === 'we','mart10':true,'marl10':item.whoType === 'they','text-bold':true}">{{item.sendUser}}</span>
                  <span :class="{'info-date':true,'fl':item.whoType === 'they','fr':item.whoType === 'we','mart10':true,'marl10':item.whoType === 'they','marr10':true}">{{item.sendTime}}</span>
                </div>
                <div :class="{'chat-content':true,'fl':item.whoType === 'they','fr':item.whoType === 'we','marl40':item.whoType === 'they','marr40':item.whoType === 'we'}">{{item.message}}</div>
              </div>
              <!-- <div v-if="item.whoType==='welcome'" class="welcome">
                {{item.loginWelcome}}
              </div> -->
            </div>
          </div>
          <div class="main-bottom">
            <div class="bottom-btn">
              <div class="btn-left fl">
                <el-dropdown @command="chat.messageType=1;chat.value = $event;" trigger="click" placement="top">
                  <span class="el-dropdown-link">
                    <el-button type="" icon="el-icon-chat-dot-round" circle size="mini" class="marl10" title="常用语"></el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item  command="你好！">你好！</el-dropdown-item>
                    <el-dropdown-item  command="有什么需要帮助的吗？">有什么需要帮助的吗？</el-dropdown-item>
                    <el-dropdown-item  command="抱歉！">抱歉！</el-dropdown-item>
                    <el-dropdown-item  command="再见！">再见！</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-popover
                  placement="top"
                  title="添加表情"
                  width="500"
                  trigger="click">
                    <div id="emotion-app">
                      <p class="show-emotion-area"><span>{{ emotion }} </span><img :src="emotion_icon" alt="#"></p>
                      <sina-emotion 
                        :source="emotionArr"
                        @changeEmotion="emotion=arguments[0].phrase;emotion_icon=arguments[0].icon;
                        chat.value='[{emotion_name:'+emotion+',emotion_icon:'+emotion_icon+'}]'">    
                      </sina-emotion>
                    </div>
                  <div class="look" title="表情" slot="reference" @click="chat.messageType=1"><img src="../assets/img/look.jpg" height="14" width="14" alt="#"></div>
                </el-popover>
                <el-button type="" icon="el-icon-upload" circle size="mini" class="marl10" title="上传文件、图片" @click='chat.messageType=3'></el-button>
                <el-button type="" icon="el-icon-delete" circle size="mini" class="marl10" title="清空内容" @click="chat.value = null"></el-button>
              </div>
              <div class="btn-right fl">
                <el-button type="" @click="$router.back(-1);" size="mini"> 返 回 </el-button>
                <el-button type="danger" @click="websocketdestroyed();" size="mini"> 断 开 </el-button>
                <el-button type="primary" @click="sendMessage('click')" size="mini" class="marl10"> 发 送 </el-button>
              </div>
            </div>
            <div class="bottom-content">
              <el-form :model="chat" ref="chat" label-width="0">
                <el-form-item
                  prop="value"
                  :rules="[{ required: true, message: '请输入内容', trigger: 'blur' },
                  { min: 1, max: 1000, message: '长度在 1 到 100 个字符', trigger: 'blur' },]">
                  <!-- @keyup.enter.prevent.native="sendMessage('enter')" @keyup.ctrl.enter.native="sendMessage('ctrl_enter')" -->
                  <el-input type="textarea" v-model="chat.value" rows="5" placeholder="请输入内容" @input="chat.messageType = 1"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
      </div>
      <div class="box-right-area fl">
          <div class="group-title">群组列表</div>
          <ul class="group-list">
            <li 
              class="list-item" 
              v-for="item in my_group"
              @click="
                my_member_id = item.member_id;
                my_default_group != item.group_id+'_'+item.member_id ? initWebSocket('change') : '';
                my_default_group = item.group_id+'_'+item.member_id;
                activeWS=item.group_id;
                current_chat_type = 1;chat.chatType = 1;
                current_group_id = item.group_id;
                current_member_id = null;
                current_group_name = item.group_name;
                current_member_name = null;
                remove_arr_group(item.group_id)">
              <i class="el-icon-caret-right marr10" v-if="activeWS === item.group_id"></i>
              <i class="marr24" v-else></i>
              <i class="el-icon-house marr10" :class="{'cursor-pointer':my_default_group != item.group_id+'_'+item.member_id}"></i>
              <span :class="{'cursor-pointer':my_default_group != item.group_id+'_'+item.member_id,'font-blue-color':true}">{{item.group_name}}</span>
              <i class="el-icon-phone-outline fr marr10" :class="{'font-red-color':tipsArr_group.indexOf(item.group_id)!=-1}"></i>
            </li>
          </ul>
      </div>
    </div>
    <!-- 添加群组 -->
    <el-dialog 
      title="添加群组" 
      :visible.sync="dialogFormVisible" 
      width='750px'>
      <el-form 
        :model="plusform" 
        ref="plusform"
        :label-width="formLabelWidth"
        v-loading="dialogLoading">
        <el-form-item 
          label="群组名称" 
          prop="chat_name" 
          :rules="[{ required: true, message: '自定义群组名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },]">
          <el-input v-model="plusform.chat_name" class="w300" placeholder="自定义群组名称"></el-input>
        </el-form-item>
        <el-form-item 
          label="组织名称" 
          prop="org_id"
          :rules="[{ required: true, message: '请选择组织', trigger: 'change' }]">
          <el-select class="w300" v-loading="selectLoading" v-model="plusform.org_id" placeholder="请选择组织" @change="" value-key='name' clearable filterable @clear="plusform.org_id = null" @focus="orgObj.total==0 ? getSelectOrgList() : '' ">
            <el-option v-for="item in orgObj.rows" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item 
          label="群组成员" 
          prop="members" 
          :rules="[{ type: 'array', required: true, message: '请至少选择一个群组成员', trigger: 'change' }]">
          <el-checkbox-group v-model="plusform.members" @change="" class="w300">
            <el-checkbox v-for="item in userObj.rows" :label="item.id" :key="item.id">{{item.real_name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
    
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button @click="$refs['plusform'].resetFields();">重 置</el-button>
        <el-button type="primary" @click="submitPlusForm('plusform')">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import SinaEmotion from './SinaEmotion.vue';//新浪表情
  export default {
    data() {
      return {
        my_group:[],//我的群组列表
        my_default_group:null,//我的soket群组(初始化默认第一个群租)
        current_group_name:null,//当前群组名称
        current_member_name:null,//当前私聊人员名称
        current_chat_type:1,//当前聊天类型，1表示群聊；2表示私聊
        current_group_id:null,//当前群组id
        current_member_id:null,//当前私聊人员id
        my_member_id:null,//我的member_id
        chatLoading:false,
        chat:{
          value:null,//普通消息体、普通消息内容(包括小表情)
          chatType:1,//(消息类别) 0公告消息 1普通消息 2查询在线人数情况 3私聊消息
          messageType:1,//(消息类型) 1普通消息 2小表情 3文件地址
          file_id:null,//文件
        },
        websock:null,
        outTips:false,//消息提示
        activeWS:null,//被激活的群组或私聊人员
        reconnectData:null,
        lockReconnect:false,    //避免重复连接，因为onerror之后会立即触发 onclose
        timeout:10000,          //10s一次心跳检测
        timeoutObj:null,
        serverTimeoutObj:null,
        chatArr:[],//记录聊天信息
        tipsArr_member:[],//消息提示数组（私聊）
        tipsArr_group:[],//消息提示数组（群聊）
        onlineChat:{size:0,users:[]},//当前在线人数
        emotionArr: this.emotion.emotionArr ? this.emotion.emotionArr : [],
        emotion: '[表情]',
        emotion_icon:'',

        dialogFormVisible:false,//添加群组弹框
        dialogLoading:false,
        selectLoading:false,
        formLabelWidth: '100px',
        plusform: {
          chat_name: null,
          org_id:null,
          members:[],
        },
        orgObj:{total:0,rows:[]},
        userObj:{total:0,rows:[]},

      };
    },
    components: {
      "sina-emotion":SinaEmotion
    },
    watch: {
      'tipsArr_member':{
        handler (newV, oldV) {
          this.tipsArr_member = newV;
        },
        deep: true
      },
      'tipsArr_group':{
        handler (newV, oldV) {
          this.tipsArr_group = newV;
        },
        deep: true
      },
      'websock':{
        handler (newV, oldV) {
          this.websock = newV;
        },
        deep: true
      },
      'my_default_group':{
        handler (newV, oldV) {
          this.my_default_group = newV;
        },
        deep: true
      },
    },
    computed:{
      chatArr_branch(){//计算我与当前群组或私聊人员应该显示的聊天内容
        return function(id){
          let arr = this.chatArr;
          let newArr = [];
          arr.forEach( (item) => {
            if(this.current_chat_type === 1){
              item.group_id === this.current_group_id ? newArr.push(item) : '';
            }else if(this.current_chat_type === 2){
              item.member_id === this.current_member_id ? newArr.push(item) : '';
            }
          }) 
          return newArr;
        }
      },
      remove_arr_member(){//计算移除已看消息的member_id 出tipsArr_member
        return function(id){
          let arr = this.tipsArr_member;
          let newArr = [];
          for(var i= 0;i<arr.length;i++){
            arr[i] === id ? '' : newArr.push(arr[i])
          }
          this.tipsArr_member = newArr;
          return newArr;
        }
      },
      remove_arr_group(){//计算移除已看消息的group_id 出tipsArr_group
        return function(id){
          let arr = this.tipsArr_group;
          let newArr = [];
          for(var i= 0;i<arr.length;i++){
            arr[i] === id ? '' : newArr.push(arr[i])
          }
          this.tipsArr_group = newArr;
          return newArr;
        }
      },
      computed_group(){//计算群组名称
        return function(id){
          let arr = this.my_group;
          let newVal = id;
          for(var i= 0;i<arr.length;i++){
            arr[i].group_id === id ? newVal = arr[i].group_name : '';
          }
          return newVal;
        }
      },
    },
    created () {

    },
    mounted() {
      this.queryMyChatGroup(false)
    },
    methods: {

      /**
       * 查询登录人员的拥有的群组
       * @return {[type]} [description]
       */
      queryMyChatGroup(init){
        this.chatLoading = true;
        this.axios.get(`${this.common.baseAuthPath}/chat/userGroups`,{params:{}}).then((response) => {
          this.chatLoading = false;
          let arr = response.data.data  ? response.data.data :[];
          this.my_group = arr;//我的群组列表
          if(init===false){
            arr.length>0 ? this.my_default_group = arr[0].group_id+'_'+arr[0].member_id : this.my_default_group = null;//我的soket群组(初始化默认第一个群租)
            arr.length>0 ? this.current_group_name = arr[0].group_name:'';//当前群组名称
            arr.length>0 ? this.current_member_name = null:'';//当前私聊人员名称
            arr.length>0 ? this.activeWS=arr[0].group_id : '';//被激活的群组
            arr.length>0 ? this.current_chat_type = 1:'';//当前聊天类型，1表示群聊；2表示私聊
            arr.length>0 ? this.current_group_id = arr[0].group_id:'';//当前群组id
            arr.length>0 ? this.current_member_id = arr[0].member_id:'';//当前私聊人员id
            arr.length>0 ? this.my_member_id = arr[0].member_id:'';//我的member_id
            this.initWebSocket('init');
          }
          
        }).catch((error) => {
          this.chatLoading = false;
          this.$message.error(error);  
        });
      },
      /**
       * 初始化weosocket
       * @param  {[type]} my_default_group 我的默认群组
       * @param  {[type]} type type为init时，初始化；type为change时，切换；
       * @return {[type]}                  [description]
       */
      initWebSocket(type){
        if(this.my_default_group){
          this.startUpWS(type);
        }else{
          this.$message.error('您暂无群组 或者 您未能获取到你的群组，5秒后返回首页！');
          setTimeout(()=> {
            this.$router.push({name: 'Home'});
          }, 5000);
        }
      },
      //启动WS
      startUpWS(type){
        if(typeof(WebSocket) === "undefined"){
          this.$message.error('您的浏览器不支持聊天，5秒后返回首页！');
          setTimeout(()=> {
            this.$router.push({name: 'Home'});
          }, 5000);
        }else{

          //启动提示
          // if(type === 'init'){
          //   this.$message('启动中...请稍等!');
          // }else if(type === 'change'){
          //   this.$message('切换中...请稍等!');
          // }

          //你的websockt url
          let wsuri = '';
          window.location.protocol === 'http:' ? 
          wsuri = `ws://${this.common.webSocketSever}?access_token=Bearer ${JSON.parse(sessionStorage.getItem('Access-Token'))}`:
          wsuri = `wss://${this.common.webSocketSever}?access_token=Bearer ${JSON.parse(sessionStorage.getItem('Access-Token'))}`;

          //创建websoket
          if('WebSocket' in window){
            this.websock = new WebSocket(wsuri);
          }else if('MozWebSocket' in window){
            this.websock = new MozWebSocket(wsuri);
          }else{
            this.websock = new SockJS(wsuri);
          }

          //链接websoket
          this.websock.onopen = this.websocketonopen(type); //连接成功,发送数据      
          this.websock.onmessage = this.websocketonmessage;  //广播成功,数据接收   
          this.websock.onerror = this.websocketonerror;  //连接断开、失败      
          this.websock.onclose = this.websocketclose; //各种问题导致连接关闭
          
        }
      },

      //连接成功,发送数据
      websocketonopen(type){
        // this.heatBeat();
        if(type === 'init'){
          this.$message({type: 'success',message: '您已成功启动！'});
        }else if(type === 'change'){
          this.$message({type: 'success',message: '您已成功切换至（'+this.computed_group(Number(this.my_default_group.split('_')[0]))+'）！'});
        }
      },
      //心跳检测+消息发送
      heatBeat_sendMessage(){
        this.timeoutObj && clearTimeout(this.timeoutObj);
        this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
        this.timeoutObj = setTimeout(()=>{
            this.sendMessage();
            this.serverTimeoutObj = setTimeout(()=> {
              this.websock.close(); this.websock = null;      //如果  5秒之后我们没有收到 后台返回的心跳检测数据 断开socket，断开后会启动重连机制
            }, 5000);
        }, this.timeout)
      },
      //消息发送
      sendMessage(e){
        // console.log(e)
        // e === 'ctrl_enter' ? this.chat.value += '/n' : '';
        // console.log(this.chat.value)
        this.$refs['chat'].validate((valid) => {
          if (valid) {
            // this.websock.readyState
            // 0        CONNECTING        连接尚未建立
            // 1        OPEN              WebSocket的链接已经建立
            // 2        CLOSING           连接正在关闭
            // 3        CLOSED            连接已经关闭或不可用
            if(this.websock.readyState === 1){
              /**
               * jsStr:
               * 消息类别：chatType  0公告消息 1普通消息 2查询在线人数情况 3私聊消息
               * 消息类型：messageType 1普通消息 2小表情 3文件地址
               * 消息体： message
               * 文件ID: file_id
               * 私聊人员: member_id
               */

              let temporary_actions = {"chatType":this.chat.chatType,"messageType":this.chat.messageType,"message":this.chat.value,'file_id':this.chat.file_id,'member_id':this.current_member_id,whoType:'we',sendUser:'我',sendTime:this.common._convertDate((new Date()).getTime(),'hh:mm:ss'),group_id:this.current_group_id};

              let actions = {"chatType":this.chat.chatType,"messageType":this.chat.messageType,"message":this.chat.value,'file_id':this.chat.file_id,'member_id':this.current_member_id,'group_id':this.current_group_id}; 

              this.chatArr.push(temporary_actions);//暂缓聊天记录
              this.websock.send(JSON.stringify(actions));//根据后台要求发送数据
              console.log(JSON.stringify(actions))
              this.chat.value = null;//发送成功后，清空消息
              // 滚动(聊天框默认滚动到底部)
              this.$nextTick(() => {
                let msgBox = document.getElementById('main-mid') // 获取对象
                msgBox.scrollTop = msgBox.scrollHeight // 滚动高度
              })
            }else{
              if(this.websock.readyState === 3){
                this.$message.error('聊天室已经关闭或不可用,无法发送信息！');
              }else if(this.websock.readyState === 2){
                this.$message.error('聊天室正在关闭,无法发送信息！');
              }else if(this.websock.readyState === 0){
                this.$message.error('聊天室尚未建立,无法发送信息！');
              }else{
                this.$message.error('聊天室无法发送信息！');
              }
            }
          } else {
            return false;
          }
        }); 
      },
      //广播成功,数据接收   
      websocketonmessage(e){ 
        // this.heatBeat();      //收到消息会刷新心跳检测，如果一直收到消息，就推迟心跳发送
        const redata = JSON.parse(e.data);
        console.log(redata)
        const temporary_redata = JSON.parse(e.data);

        if('loginWelcome' in temporary_redata){
          temporary_redata['whoType'] = 'welcome'
          this.$message({type: 'success',message: temporary_redata.loginWelcome});
        }else if('sendUser' in temporary_redata){
          if('member_id' in temporary_redata){
            this.outTips=true;
            let arr = [];
            this.current_member_id === temporary_redata.member_id ? [] : arr.push(temporary_redata.member_id)
            this.tipsArr_member = this.unique(arr);
          }else if('group_id' in temporary_redata){
            this.outTips=true;
            let arr = [];
            this.current_group_id === temporary_redata.group_id ? [] : arr.push(temporary_redata.group_id)
            this.tipsArr_group = this.unique(arr);
          }
          temporary_redata['whoType'] = 'they'
          temporary_redata['sendTime'] = this.common._convertDate((new Date()).getTime(),'hh:mm:ss');
          this.chatArr.push(temporary_redata);
        }else if('users' in temporary_redata){
          temporary_redata['whoType'] = 'online';
          let online = [];
          if(temporary_redata.users.length>0){
            temporary_redata.users.forEach( (item) => {
              this.current_group_id === item.group_id ? online.push(item) : '';
            })
          }
          console.log(online)
          this.onlineChat.users = online;
          this.onlineChat.size = online.length;
        }else{
          temporary_redata['whoType'] = 'else'
        }
        // 滚动(聊天框默认滚动到底部)
        this.$nextTick(() => {
          let msgBox = document.getElementById('main-mid') // 获取对象
          msgBox ? msgBox.scrollTop = msgBox.scrollHeight :'';// 滚动高度
        })
      },
      //连接失败,执行重连
      websocketonerror(e){
        this.$message.error('连接失败！正在尝试重连...');
        this.websock = null;
        this.reconnect('init');
      },
      //各种问题导致连接关闭
      websocketclose(e){  
        console.log('各种问题导致关闭',e);
        if(e.code!=1000){
          this.websock = null;
          this.$message.error('启动失败！！！');
        }else{
          this.$message({type: '',message: '已正常关闭聊天室！'});
        }
        // e.code
        // 1000  正常关闭              正常关闭; 连接成功完成了创建它的任何目的。
        // 1001  离开                  由于服务器故障或浏览器正在远离打开连接的页面导航，端点将消失。
        // 1002  协议错误              由于协议错误，端点正在终止连接。
        // 1003  不支持的数据          连接正在终止，因为端点接收到它无法接受的类型的数据（例如，纯文本端点接收到二进制数据）。
        // 1005  没有收到状态          保留。  表示即使预期有一个状态代码也没有提供。
        // 1006  异常关闭              保留。用于指示在期望状态代码时连接异常关闭（即，没有发送关闭帧）。
        // 1007  帧有效负载数据无效     端点正在终止连接，因为收到的消息包含不一致的数据（例如，文本消息中的非UTF-8数据）。
        // 1008  政策违规              端点正在终止连接，因为它收到违反其策略的消息。这是一个通用状态代码，在代码1003和1009不适用时使用。
        // 1009  消息太大了            端点正在终止连接，因为收到的数据帧太大。
        // 1010  缺少扩展              客户端正在终止连接，因为它希望服务器协商一个或多个扩展，但服务器没有。
        // 1011  内部错误              服务器正在终止连接，因为它遇到意外情况，导致无法完成请求。
        // 1012  服务重启              服务器正在重新启动连接，因为它正在重新启动。[ 参考 ]
        // 1013  稍后再试              由于临时条件，服务器正在终止连接，例如它过载并且正在抛弃其某些客户端。[ 参考 ]
        // 1014  错误的网关            服务器充当网关或代理，并从上游服务器收到无效响应。这类似于502 HTTP状态代码。/
        // 1015  TLS握手              保留。表示由于未能执行TLS握手而导致连接已关闭（例如，无法验证服务器证书）。
      },
      //心跳检测
      heatBeat(){
        console.log('心跳检测中...')
        this.timeoutObj && clearTimeout(this.timeoutObj);
        this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
        this.timeoutObj = setTimeout(()=>{
            console.log("欢迎加入聊天室！")
            this.serverTimeoutObj = setTimeout(()=> {
                this.websock.close(); this.websock = null;      //如果  5秒之后我们没有收到 后台返回的心跳检测数据 断开socket，断开后会启动重连机制
            }, 5000);
        }, this.timeout)
      }, 
      //执行重连
      reconnect(type){
        console.log('正在重连...');
        if(this.lockReconnect){//这里很关键，因为连接失败之后之后会相继触发 连接关闭，不然会连接上两个 WebSocket
          return
        }
        this.lockReconnect = true;
        this.reconnectData && clearTimeout(this.reconnectData);
        this.reconnectData = setTimeout(()=>{
          this.initWebSocket(type);
          this.lockReconnect = false;
        },5000)
      },
      //关闭websoket
      websocketdestroyed(){
        if(this.websock){
          this.lockReconnect = true;  
          this.websock.close();this.websock = null;                  //全部关闭
          this.chatArr=[];                                           //清空暂缓聊天记录
          clearTimeout(this.reconnectData);                          //离开清除 timeout
          clearTimeout(this.timeoutObj);                             //离开清除 timeout
          clearTimeout(this.serverTimeoutObj);                       //离开清除 timeout
          this.$router.back(-1);                            //离开聊天室
        }else{
          this.$message('你尚未启动！')
        }   
      },

      /**
       * 组织list查询 POST
       * @return {[type]} [description]
       */
      getSelectOrgList(){  
        this.selectLoading = true;
        this.axios.post(`${this.common.baseAuthPath}/orgs/list`,this._listParams()).then((response) => {
          this.selectLoading = false;
          this.orgObj = response.data.data;
        }).catch((error) => {
          this.selectLoading = false;
          this.$message.error(error);  
        });
      },
      _listParams(){
        return{
          // pageNum:1,
          // pageSize:10,  
        }
      },
      /**
       * 用户列表list查询 POST
       * @param  {[type]} id 组织id
       * @return {[type]}    [description]
       */
      getUserList(){  
        this.dialogLoading = true;
        this.axios.post(`${this.common.baseAuthPath}/user/list`,this._listParams()).then((response) => {
          this.dialogLoading = false;
          this.userObj = response.data.data;
        }).catch((error) => {
          this.dialogLoading = false;
          this.$message.error(error);  
        });
      },
      /**
       * 提交添加群组的表单
       * @param  {[type]} formName       [表单]
       * @return {[type]}                [description]
       */
      submitPlusForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addGroup();
          } else {
            return false;
          }
        });
      },
      /**
       * 群组form添加 POST
       * @return {[type]} [description]
       */
      addGroup(){
        this.dialogLoading = false;
        let plusform = {
          chat_name:this.plusform.chat_name,
          org_id:this.plusform.org_id,
          members:this.plusform.members,
        }
        this.axios.post(`${this.common.basePath}/clientSocket/addGroup`,plusform).then((response) => {
          this.dialogLoading = false;
          this.dialogFormVisible = false;
          this.queryMyChatGroup(true);//刷新
          this.$message({type: 'success',message: '添加群组成功!'});
        }).catch((error) => {
          this.dialogLoading = false;
          this.$message.error(error);  
        });
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
      
    },
  }
</script>

<style scoped lang="less">
  .chat-house{

  }
</style>
