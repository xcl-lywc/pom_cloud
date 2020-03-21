<template>
  <div id="chat-house" v-loading="chatLoading" element-loading-text="加载中" :class="{'bg-aliceblue-color':current_chat_type===1,'bg-linen-color':current_chat_type===2}">
    <div id="chat-top">
      <span class="title"> 聊 天 室 </span>
    </div>
    <div id='chat-box'>
      <div class="box-left-area fl">
          <div class="personal-info" v-if="userData">
            <div class="brief-info">
              <!-- <el-avatar icon="el-icon-user-solid" class="head-image fl"></el-avatar> -->
              <el-avatar :src="userData.picture" fit="cover" class="head-image fl" >
                <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
              </el-avatar>
              <span class="nick-name fl mart10 marl10">昵称：{{userData.real_name ? userData.real_name : '暂无'}}</span>
            </div>
            <div class="else-info">
              <p> 生日：{{userData.birthday ? common._convertDate(userData.birthday,'yyyy年MM月dd日') : '暂无'}}</p>
              <p>地址：{{userData.address ? userData.address : '暂无'}} </p>
              <p>
                <i class="el-icon-circle-plus cursor-pointer font-blue-color" @click="dialogType = 1;getUserList();dialogFormVisible = true;$refs['plusform']?$refs['plusform'].resetFields():'';">添加群组</i>
              </p>
            </div>
          </div>
          <div class="current-group">
            {{current_group_name ? '当前群组：'+current_group_name : ''}}
          </div>
          <ul class="online-list" v-if="current_group_name">
            <li class="list-header">
              <el-badge :value="current_group_members.total+' 人'" type="primary">{{current_group_name+' 所有成员'}}</el-badge>
            </li>
            <div class="padt15"></div>
            <div v-loading="chatLLoading" element-loading-text="加载中..." element-loading-background="transparent">
              <li 
                class="list-item" 
                v-for="(item,index) in current_group_members.rows" 
                :key="index" 
                @click="
                  elementPageData.pageNum_p_s = 1;current_chat_type = 2;
                  activeUser=item.user_id;scrollToBottom();
                  elementPageData.pageNum_p_=1;unreadNews(true,item.user_id,current_chat_type);
                  userData.id === item.user_id ? current_member_name = item.name+'（我）' : current_member_name = item.name;
                  current_member_id = item.user_id;">
                <i class="el-icon-caret-right marr10 fl mart8" v-if="activeUser === item.user_id"></i>
                <el-popover
                  v-loading="chatLInfoLoading" 
                  placement="top-start"
                  :title="userData.id === item.user_id ? '我的信息' : '成员信息'"
                  width="200"
                  @show='queryMemberInfo(current_group_id,item.id)'

                  trigger="hover">
                  <div v-if="group_member_info">
                    <p>您的昵称：{{group_member_info.name}}</p>
                    <p>群组名称：{{group_member_info.group_name}}</p>
                  </div>
                  <el-avatar icon="el-icon-user-solid cursor-pointer" class="head-image fl" size="small" slot="reference"></el-avatar>
                </el-popover>
                <span class="nick-name fl mart5 marl10 font-blue-color" :class="{'cursor-pointer':userData.id != item.user_id}">{{item.name}}</span>
                <span class="nick-name fl mart5 marl10 font-blue-color">{{userData.id === item.user_id ? '（我）':''}}</span>
              </li>
            </div>
            <div class="pagination">
              <el-pagination
                background
                layout="prev, next"
                small
                :pager-count="5"
                hide-on-single-page
                @current-change="handleCurrentChange($event,'member',current_group_id)"
                :current-page="elementPageData.pageNum__"
                :page-size="elementPageData.pageSize__"
                :total="current_group_members.total">
              </el-pagination>
            </div>
          </ul>
      </div>
      <div class="box-main-area fl">
          <div class="main-top">
            <span class="ellipsis w200" v-if="current_group_name||current_member_name">{{current_member_name ? current_member_name :'[ '+current_group_name+' ]'}}</span>
          </div>
          <div class="main-mid" ref="main-mid" id="main-mid"
            @scroll="current_chat_type===1?scrollLoadMoreUnRead($event,current_group_id,current_chat_type):scrollLoadMoreUnRead($event,current_member_id,current_chat_type)">
            <!-- 群聊 -->
            <div v-if="current_chat_type === 1" v-for="(item,index) in chatArr_branch(current_group_id)" :key="index">
              <div v-if="item.whoType=='they'||item.whoType=='we'" :class="{'mid-list':true,'left':item.whoType === 'they','right':item.whoType === 'we'}">
                <div class="chat-info">
                  <el-avatar icon="el-icon-user-solid" :class="{'info-avatar':true,'fl':item.whoType === 'they','fr':item.whoType === 'we','marl10':item.whoType === 'we'}"></el-avatar>
                  <span :class="{'info-date':true,'fl':item.whoType === 'they','fr':item.whoType === 'we','mart10':true,'marl10':item.whoType === 'they','text-bold':true}">{{JSON.parse(item.m).creater === '我' ? JSON.parse(item.m).creater : computed_creater(JSON.parse(item.m).creater)}}</span>
                  <span :class="{'info-date':true,'fl':item.whoType === 'they','fr':item.whoType === 'we','mart10':true,'marl10':item.whoType === 'they','marr10':true}">{{ common._convertDate(JSON.parse(item.m).createDate,'MM/dd hh:mm:ss')}}</span>
                </div>
                <div :class="{'chat-content':true,'fl':item.whoType === 'they','fr':item.whoType === 'we','marl40':item.whoType === 'they','marr40':item.whoType === 'we'}" v-html="JSON.parse(item.m).info ? JSON.parse(item.m).info.replace(/\r/g,'<br/>').replace(/\n/g,'<br/>') : JSON.parse(item.m).info"></div>
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
                  <span :class="{'info-date':true,'fl':item.whoType === 'they','fr':item.whoType === 'we','mart10':true,'marl10':item.whoType === 'they','text-bold':true}">{{JSON.parse(item.m).creater === '我' ? JSON.parse(item.m).creater : computed_creater(JSON.parse(item.m).creater)}}</span>
                  <span :class="{'info-date':true,'fl':item.whoType === 'they','fr':item.whoType === 'we','mart10':true,'marl10':item.whoType === 'they','marr10':true}">{{common._convertDate(JSON.parse(item.m).createDate,'MM/dd hh:mm:ss')}}</span>
                </div>
                <div :class="{'chat-content':true,'bg-teal-color':true,'fl':item.whoType === 'they','fr':item.whoType === 'we','marl40':item.whoType === 'they','marr40':item.whoType === 'we'}" v-html="JSON.parse(item.m).info ? JSON.parse(item.m).info.replace(/\r/g,'<br/>').replace(/\n/g,'<br/>') : JSON.parse(item.m).info"></div>
              </div>
              <!-- <div v-if="item.whoType==='welcome'" class="welcome">
                {{item.loginWelcome}}
              </div> -->
            </div>
            <!-- <div class="history">
              <el-link type="info" @click="historyDialogVisible=true;queryChatRecord(true,current_group_id,current_chat_type);">查看历史记录</el-link>
            </div> -->
            <!-- <div class="more" @click="unreadNews(true,current_group_id,1);" v-if="unReadNews.total>elementPageData.pageSize_"><el-link type="info">更多未读消息
            </el-link></div> -->
          </div>
          <div class="main-mid_mask" v-if="isShowChatMLoading" v-loading="chatMLoading" element-loading-text="加载中..." element-loading-background="transparent"></div>
          <div class="main-bottom">
            <div class="bottom-btn">
              <div class="btn-left fl">
                <!-- 常用语 -->
                <el-dropdown @command="chat.messageType=2;chat.value = $event;" trigger="click" placement="top">
                  <span class="el-dropdown-link">
                    <el-button type="" icon="el-icon-chat-dot-round" circle size="mini" class="marl10" title="常用语"></el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item  command="你好！">你好！</el-dropdown-item>
                    <el-dropdown-item  command="OK！">OK！</el-dropdown-item>
                    <el-dropdown-item  command="抱歉！">抱歉！</el-dropdown-item>
                    <el-dropdown-item  command="再见！">再见！</el-dropdown-item>
                    <el-dropdown-item  command="有什么需要帮助的吗？">有什么问题的吗？</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <!-- 添加表情 -->
                <el-popover
                  placement="top"
                  title="添加表情"
                  width="500"
                  trigger="click">
                    <div id="emotion-app">
                      <div class="show-emotion-area" v-if="selectionEmotionArr.length>0">
                        <div class="emotion customEditor">
                          <img v-for="(item,index) in selectionEmotionArr" :key="index" :src="item.emotion_icon" :alt="'['+item.emotion+']'">
                        </div>
                        <div class="btn">
                          <el-button type="primary" :disabled="isBtn" class="fr marl10" @click="chat.messageType=3;emotionHtmlStr(selectionEmotionArr)" size="mini">发 送</el-button>
                          <el-button type="" @click="selectionEmotionArr = [];" size="mini" class="fr">清 空</el-button>
                          <el-button type="" @click="selectionEmotionArr.pop();" size="mini" class="fr">回 退</el-button>
                        </div>
                      </div>
                      <sina-emotion 
                        :source="emotionArr"
                        @changeEmotion="emotion=arguments[0].phrase;emotion_icon=arguments[0].icon;emotionJsonFun(emotion,emotion_icon);">    
                      </sina-emotion>
                    </div>
                  <div class="look" title="表情" slot="reference" @click="chat.messageType=3"><img src="../assets/img/look.jpg" height="14" width="14" alt="#"></div>
                </el-popover>
                <!-- 上传文件、图片 -->
                <el-dropdown @command="chat.messageType=4;" trigger="click" placement="top">
                  <span class="el-dropdown-link">
                    <el-button type="" icon="el-icon-upload" circle size="mini" class="marl10" title="上传文件、图片" @click='chat.messageType=4;'></el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item  command="image">
                      <el-upload
                        class="uploadimage"
                        :action="`${common.baseAuthPath}/file/upload`"
                        :headers="myHeaders"
                        :show-file-list="false"
                        name="file"
                        :data="myImageData"
                        :on-success="handleSuccessSingleImage"
                        :on-error="handleErrorSingleImage"
                        :before-upload="beforeUploadSingleImage">
                        <el-button type="primary" size="mini" @click='chat.messageType=4;'>上传图片<i class="el-icon-picture-outline el-icon--right"></i></el-button>
                      </el-upload>
                    </el-dropdown-item>
                    <el-dropdown-item  command="file">
                      <el-upload
                        class="uploadfile"
                        :action="`${common.baseAuthPath}/file/upload`"
                        :headers="myHeaders"
                        :show-file-list="false"
                        name="file"
                        :data="myFileData"
                        :on-success="handleSuccessSingleFile"
                        :on-error="handleErrorSingleFile"
                        :before-upload="beforeUploadSingleFile">
                        <el-button type="success" size="mini" @click='chat.messageType=4;'>上传文件<i class="el-icon-folder-opened el-icon--right"></i></el-button>
                      </el-upload>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <!-- 清空聊天记录 -->
                <el-button type="" icon="el-icon-delete" circle size="mini" class="marl10" title="清空聊天记录" @click="chat.value = null;clearChatRecord();"></el-button>
                <!-- 编写文档（wangeitor） -->
                <el-popover
                  placement="top"
                  title="wangeditor编辑器"
                  width="600"
                  trigger="click">
                    <wang-editor
                      v-model="weditor.info"
                      ref="initWangEditor"
                      :isClear="weditor.isClear">    
                    </wang-editor>
                  <el-button type="" icon="el-icon-document" circle size="mini" class="marl10" title="wangeditor编辑器" @click="" slot="reference" @click='chat.messageType=2;'></el-button>
                  <el-button type="primary" @click="chat.messageType=2;sendWEMessage()" size="mini" class="mart10 marl10 fr" :disabled="isBtn"> 发 送 </el-button>
                  <el-button type="" @click="$refs.initWangEditor.clearContent();" size="mini" class="mart10 fr"> 清 空 </el-button>
                </el-popover>
                <!-- 自定义的编辑容器 -->
                <!-- <el-popover
                  placement="top"
                  title="自定义编辑器"
                  width="600"
                  trigger="click">
                    <custom-editor
                      ref="initCustomEditor">    
                    </custom-editor>
                  <el-button type="" icon="el-icon-edit" circle size="mini" class="marl10" title="自定义编辑器" @click="" slot="reference" @click='chat.messageType=2;'></el-button>
                </el-popover> -->
              </div>
              <div class="btn-right fl">
                <el-button type="text" @click="current_chat_type===1?elementPageData.pageNum_s = 1:elementPageData.pageNum_p_s = 1;historyDialogVisible=true;current_chat_type===1?queryChatRecord(true,current_group_id,current_chat_type):queryChatRecord(true,current_member_id,current_chat_type);" size="mini" class="marl10 font-green-color" :disabled="isBtn" :title="current_chat_type===1?computed_group(current_group_id)+'的聊天记录':('我与'+current_member_name+'的聊天记录')"> 查看历史记录 </el-button>
                <el-button type="" @click=" $router.back(-1);" size="mini"> 返 回 </el-button>
                <el-button type="danger" @click="websocketdestroyed();" size="mini"> 断 开 </el-button>
                <el-button type="primary" @click="chat.messageType=2;heatBeat_sendMessage(chat.value,'textarea')" size="mini" class="marl10" :disabled="isBtn"> 发 送 </el-button>
              </div>
            </div>
            <div class="bottom-content">
              <el-form :model="chat" ref="chat" label-width="0">
                <el-form-item
                  prop="value"
                  :rules="[{ required: true, message: '请输入内容', trigger: 'blur' },
                  { min: 1, max: 1000, message: '长度在 1 到 100 个字符', trigger: 'blur' },]">
                  <el-input 
                    type="textarea" 
                    v-model="chat.value"
                    rows="5" placeholder="请输入内容" 
                    @input="chat.messageType = 2" 
                    @keypress.enter.native="press_enter($event)"
                    @keydown.ctrl.enter.native="down_ctrlEnter()"></el-input>
                </el-form-item>
              </el-form>
              <i class="tips">Enter 发送，Ctrl+Enter 换行</i>
            </div>
          </div>
      </div>
      <div class="box-right-area fl">
          <div class="group-title">
            <el-badge :value='my_group_total+" 个"' type="primary">群组列表</el-badge>
          </div>
          <ul class="group-list" v-loading="chatRGroupLoading" element-loading-text="加载中..." element-loading-background="transparent">
            <li 
              class="list-item" 
              v-for="item in my_group"
              @mouseover=" tempAtId = item.groupId " @mouseout="tempAtId = null"
              @click="
                elementPageData.pageNum_s = 1;current_chat_type = 1;
                current_member_name = null;current_member_id = null;
                item.newsMessage&&item.newsMessage.readerList.split(',').indexOf(String(userData.id))!=-1 ? elementPageData.pageNum_=1 : '';
                item.newsMessage&&item.newsMessage.readerList.split(',').indexOf(String(userData.id))!=-1 ? unreadNews(true,item.groupId,current_chat_type) : '';
                my_default_group != item.groupId ? initWebSocket('change',item.groupId) : '';
                my_default_group != item.groupId ? queryGroupMember(item.groupId) : '';
                my_default_group = item.groupId;
                activeUser=null;
                activeWS=item.groupId;
                current_group_id = item.groupId;
                current_group_name = item.groupName;">
              <i class="el-icon-caret-right marr10" v-if="activeWS === item.groupId"></i>
              <!-- <i class="marr24" v-else></i> -->
              <i class="el-icon-house marr10" :class="{'cursor-pointer':my_default_group != item.groupId}"></i>
              <span :class="{'cursor-pointer':my_default_group != item.groupId,'font-blue-color':true}">{{item.groupName}}</span>
              <i class="el-icon-phone-outline fr marr10 mart5" :class="{'font-red-color':item.newsMessage&&item.newsMessage.readerList.split(',').indexOf(String(userData.id))!=-1}"></i>
              <i class="el-icon-delete fr marr10 cursor-pointer font-red-color mart5" v-show="tempAtId === item.groupId" @click.stop='dismissGroup(item.groupId)' title="解散群组"></i>
              <i class="el-icon-circle-plus-outline fr marr10 cursor-pointer font-blue-color mart5" v-show="tempAtId === item.groupId" @click.stop="dialogType = 2;plusform.group_id = item.groupId;screenUnAddMembers(item.groupId);$refs['plusform']?$refs['plusform'].resetFields():'';" title="添加成员"></i>
              
            </li>
            <div class="pagination">
              <el-pagination
                background
                layout="prev, next"
                small
                :pager-count="5"
                hide-on-single-page
                @current-change="handleCurrentChange($event,'group',null)"
                :current-page="elementPageData.pageNum"
                :page-size="elementPageData.pageSize"
                :total="my_group_total">
              </el-pagination>
            </div>
          </ul> 
          <div class="group-title">
            <el-badge :is-dot='unReadPrivateNews.total>0'>@我的消息</el-badge>
          </div>
          <div class="private_chat-box" @scroll="scrollLoadMoreUser($event)" v-loading="chatRNewsLoading" element-loading-text="加载中..." element-loading-background="transparent">
            <ul class="list-ul">
              <li class="list-li"
                v-for="(item,index) in unReadPrivateNews.rows" 
                :key="index"
                @click="
                  elementPageData.pageNum_p_s = 1;current_chat_type = 2;
                  activeUser=item.creater;scrollToBottom();
                  elementPageData.pageNum_p_=1;unreadNews(true,item.creater,current_chat_type);
                  userData.id === item.creater ? current_member_name = item.createrName+'（我）' : current_member_name = item.createrName;
                  current_member_id = item.creater;">
                <i class="el-icon-caret-right marr10" v-if="activeUser === item.creater"></i>
                <!-- <i class="marr24" v-else></i> -->
                <i class="el-icon-user marr10" :class="{'cursor-pointer':true}"></i>
                <span :class="{'cursor-pointer':true,'font-blue-color':true}">{{item.createrName}}</span>
                <el-badge :value='item.size' class=" fr marr10 mart5"></el-badge>
              </li>
            </ul>
          </div>   
      </div>
    </div>
    <!-- 添加群组/往现有群组里增加人员 -->
    <el-dialog 
      :title="dialogType === 1 ? '添加群组' : `添加成员${plusform.group_id ? '（'+computed_group(plusform.group_id)+'）' : ''}`"
      :visible.sync="dialogFormVisible" 
      width='750px'>
      <el-form 
        :model="plusform" 
        ref="plusform"
        :label-width="formLabelWidth"
        v-loading="dialogLoading">
        <el-form-item 
          v-if="dialogType === 1"
          label="群组名称" 
          prop="chat_name" 
          :rules="[{ required: true, message: '自定义群组名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' },]">
          <el-input v-model="plusform.chat_name" class="w300" placeholder="自定义群组名称"></el-input>
        </el-form-item>
        <el-form-item 
          v-if="dialogType === 1"
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
        <el-button type="primary" @click="submitPlusForm('plusform',dialogType)">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 历史聊天记录 -->
    <el-dialog
      :visible.sync="historyDialogVisible"
      @close="chatRecord={rows:[],total:0};chatRecord_={rows:[],total:0};elementPageData.pageNum_p_s = 1;elementPageData.pageNum_s = 1;screeningDateVal=null;"
      width="800px">
      <div slot="title" class="history-chat-header" >
        <div class="fl title ellipsis">
          {{current_chat_type === 1 ? (current_group_id ? '（'+computed_group(current_group_id)+'）的聊天记录 '+chatRecord.total+'条' : '') : (current_group_id ? '（'+'我与'+current_member_name+'）的聊天记录 '+chatRecord_.total+'条' : '')}}
        </div>
        <!-- <div class="screeningDate fl">
          <el-date-picker
            v-model="screeningDateVal"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
            @change='elementPageData.pageNum_s = 1;elementPageData.pageNum_p_s = 1;current_chat_type===1?queryChatRecord(true,current_group_id,current_chat_type):queryChatRecord(true,current_member_id,current_chat_type);'
            align="right">
          </el-date-picker>
        </div> -->
      </div>
      <div class="history-chat-area" ref='contentWrap' v-loading='historyLoading' 
        @scroll="current_chat_type===1?scrollLoadMore($event,current_group_id,current_chat_type):scrollLoadMore($event,current_member_id,current_chat_type)">
        
        <!-- 群聊 -->
        <div v-if="current_chat_type === 1" v-for="(item,index) in chatRecord.rows" :key="index">
          <div :class="{'mid-list':true,'left':item.sender != userData.id,'right':item.sender === userData.id}">
            <div class="chat-info">
              <el-avatar icon="el-icon-user-solid" :class="{'info-avatar':true,'fl':item.sender != userData.id,'fr':item.sender === userData.id,'marl10':item.sender === userData.id}"></el-avatar>
              <span :class="{'info-date':true,'fl':item.sender != userData.id,'fr':item.sender === userData.id,'mart10':true,'marl10':item.sender != userData.id,'text-bold':true}">{{item.sender===userData.id ? '我' : computed_creater(item.sender)}}</span>
              <span :class="{'info-date':true,'fl':item.sender != userData.id,'fr':item.sender === userData.id,'mart10':true,'marl10':item.sender != userData.id,'marr10':true}">{{ common._convertDate(item.createTime,'MM/dd hh:mm:ss')}}</span>
            </div>
            <div :class="{'chat-content':true,'fl':item.sender != userData.id,'fr':item.sender === userData.id,'marl40':item.sender != userData.id,'marr40':item.sender === userData.id}" v-html="item.messageInfo ? item.messageInfo.replace(/\r/g,'<br/>').replace(/\n/g,'<br/>') : item.messageInfo"></div>
          </div>
        </div>
        <!-- 私聊 -->
        <div v-if="current_chat_type === 2"  v-for="(item,index) in chatRecord_.rows" :key="index">
          <div :class="{'mid-list':true,'left':item.sender != userData.id,'right':item.sender === userData.id}">
            <div class="chat-info">
              <el-avatar icon="el-icon-user-solid" :class="{'info-avatar':true,'fl':item.sender != userData.id,'fr':item.sender === userData.id,'marl10':item.sender === userData.id}"></el-avatar>
              <span :class="{'info-date':true,'fl':item.sender != userData.id,'fr':item.sender === userData.id,'mart10':true,'marl10':item.sender != userData.id,'text-bold':true}">{{item.sender===userData.id ? '我' : computed_creater(item.sender)}}</span>
              <span :class="{'info-date':true,'fl':item.sender != userData.id,'fr':item.sender === userData.id,'mart10':true,'marl10':item.sender != userData.id,'marr10':true}">{{ common._convertDate(item.createTime,'MM/dd hh:mm:ss')}}</span>
            </div>
            <div :class="{'chat-content':true,'fl':item.sender != userData.id,'fr':item.sender === userData.id,'marl40':item.sender != userData.id,'marr40':item.sender === userData.id}" v-html="item.messageInfo ? item.messageInfo.replace(/\r/g,'<br/>').replace(/\n/g,'<br/>') : item.messageInfo"></div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import qs    from "qs"; //需要传表单时, 引用此包
  import SinaEmotion from './SinaEmotion.vue';//新浪表情
  import WangEditor from './WE.vue';//wangeditor
  import CustomEditor from './CustomEditor.vue';//自定义的编辑容器
  export default {
    data() {
      return {
        userData:sessionStorage.getItem('userData') ? JSON.parse(sessionStorage.getItem('userData')):null,
        myHeaders:{Authorization: 'Bearer ' + JSON.parse(sessionStorage.getItem('Access-Token'))},
        isBtn:false,
        chatLoading:false,
        chatLLoading:false,
        chatLInfoLoading:false,
        chatMLoading:true,
        isShowChatMLoading:false,
        chatRGroupLoading:false,
        chatRNewsLoading:false,

        my_group_total:0,//我的群组个数
        my_group:[],//我的群组列表
        current_chat_type:1,//当前聊天类型，1表示群聊；2表示私聊
        my_default_group:null,//我的group_id
        current_group_id:null,//当前群组id
        activeWS:null,//被激活的群组
        tempAtId:null,//当前浮动选中的节点Id
        current_group_name:null,//当前群组名称
        activeUser:null,//被激活的用户（私聊）
        my_member_id:null,//我的member_id
        current_member_id:null,//当前私聊人员id
        current_member_name:null,//当前私聊人员名称
        
        chat:{
          value:null,//消息体
          messageType:2,//消息类型 1、加群消息，2、文字消息，3、表情消息，4、文件消息，5、语音消息，6、撤回消息
          file_id:null,//文件
        },

        weditor:{
          info:'',
          isClear:false,//为true触发清除文本域内容
        },
        
        group_member_info:null,//某群组该成员个人信息
        current_group_members:{total:0,rows:[]},//当前群组成员
        unReadPrivateNews:{total:0,rows:[]},//未读的私聊消息

        chatArr:sessionStorage.getItem('chatRecord') ? JSON.parse(sessionStorage.getItem('chatRecord')) : [],//记录聊天信息

        emotionArr: this.emotion.emotionArr ? this.emotion.emotionArr : [],
        emotion: '[表情]',
        emotion_icon:'',
        selectionEmotionArr:[],//选中的表情数组

        dialogFormVisible:false,//添加群组弹框
        dialogType:1,//1，添加群组；2，添加成员
        dialogLoading:false,
        selectLoading:false,
        formLabelWidth: '100px',
        plusform: {
          chat_name: null,
          org_id:null,
          members:[],
          group_id:null,
        },
        orgObj:{total:0,rows:[]},
        userObj:{total:0,rows:[]},

        elementPageData: {
          //分页 
          pageNum:        1,//用户查询群组列表
          pageSize:       10,//用户查询群组列表
          pageNum__:      1,//用于获取某群租的成员列表
          pageSize__:     10,//用于获取某群租的成员列表
          //自动滚动加载
          pageNum_:       1,//用于批量阅读新消息(群聊)
          pageSize_:      20,//用于批量阅读新消息(群聊)
          pageNum_p_:      1,//用于批量阅读新消息(私聊)
          pageSize_p_:     20,//用于批量阅读新消息(私聊)
          //滚动加载
          pageNum_s:      1,//用于获取聊天记录(群聊)
          pageSize_s:     10,//用于获取聊天记录(群聊)
          pageNum_p_s:      1,//用于获取聊天记录(私聊)
          pageSize_p_s:     10,//用于获取聊天记录(私聊)
          pageNum_p:      1,//用于获取未读私聊我的用户
          pageSize_p:     10,//用于获取未读私聊我的用户
        },
        scrollLoadSw: true, //滚动加载开关
        unReadNews:{total:0,rows:[]},//批量未读消息(群聊)
        unReadNews_:{total:0,rows:[]},//批量未读消息（私聊）
        chatRecord:{total:0,rows:[]},//群聊聊天记录
        chatRecord_:{total:0,rows:[]},//私聊聊天记录
        historyDialogVisible:false,
        historyLoading:false,
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        screeningDateVal:null,
      };
    },
    components: {
      "sina-emotion":SinaEmotion,
      "wang-editor":WangEditor,
      "custom-editor":CustomEditor,
    },
    watch: {
      // 'my_default_group':{
      //   handler (newV, oldV) {
      //     console.log(newV)
      //     // this.my_default_group = newV;
      //   },
      //   deep: true
      // },
    },
    computed:{
      myImageData(){
        return {type:'chatImage',group_id:this.current_group_id};
      },
      myFileData(){
        return {type:'chatFile',group_id:this.current_group_id};
      },
      chatArr_branch(){//计算我与当前群组或私聊人员应该显示的聊天内容
        return function(id){
          let arr = this.chatArr;
          let newArr = [];
          arr.forEach( (item) => {
            if(this.current_chat_type === 1&&item.t===1){
              JSON.parse(item.m).groupId === this.current_group_id ? newArr.push(item) : '';
            }else if(this.current_chat_type === 2&&item.t===2){
              if(JSON.parse(item.m).creater==='我'){
                JSON.parse(item.m).reader === this.current_member_id ? newArr.push(item) : '';
              }else if(JSON.parse(item.m).creater===this.userData.id){
								JSON.parse(item.m).reader === this.current_member_id ? newArr.push(item) : '';
							}else if(JSON.parse(item.m).creater===this.current_member_id){
								JSON.parse(item.m).reader === this.userData.id ? newArr.push(item) : '';
							}
            }
          }) 
          return newArr;
        }
      },
      computed_group(){//计算群组名称
        return function(id){
          let arr = this.my_group;
          let newVal = id;
          for(var i= 0;i<arr.length;i++){
            arr[i].groupId === id ? newVal = arr[i].groupName : '';
          }
          return newVal;
        }
      },
      computed_creater(){//计算成员姓名
        return function(creater){
          let arr = this.userObj.rows;
          let newVal = '暂无';
          for(var i= 0;i<arr.length;i++){
            arr[i].id === creater ? newVal = arr[i].real_name : '';
          }
          return newVal;
        }
      },
    },
    created () {
      if(sessionStorage.getItem('Access-Token')) {
        this.queryMyChatGroup(false);
      }else {
        this.$message.error("登录失效, 请重新登录!");setTimeout(()=> {this.$router.push({name:"Login"})}, 2000);
      }
    },
    mounted() {
      
    },
    methods: {

      /*==========================================================================================soket init[start]*/
      /**
       * 查询登录人员的拥有的群组
       * init 为false时，初始化；为true时，刷新
       * @return {[type]} [description]
       */
      queryMyChatGroup(init){
        this.chatRGroupLoading = true;
        this.axios.get(`${this.common.baseAuthPath_chat}/online_group/menu`,{params:{pageNum:this.elementPageData.pageNum,pageSize:this.elementPageData.pageSize}}).then((response) => {
          this.my_group_total = response.data.data.total;//我的群组个数
          let arr = response.data.data.total!=0  ? response.data.data.rows :[];
          let myarr = [];//有我消息的群组id所组成的数组
          this.my_group = arr;//我的群组列表
          if(arr.length>0){
            arr.forEach( (item) => {
              item.newsMessage&&item.newsMessage.readerList.split(',').indexOf(String(this.userData.id))!=-1 ? myarr.push(item.groupId) : '';
            }) 
          }
          myarr.length!=0 ? this.common.wsTips=true : this.common.wsTips=false;//有我的群组消息，wsTips设为true
          this.scrollToBottom();
          if(init===false){
            arr.length>0 ? this.my_default_group = arr[0].groupId : this.my_default_group = null;//我的group_id(初始化默认第一个群租)
            arr.length>0 ? this.current_chat_type = 1:'';//当前聊天类型，1表示群聊；2表示私聊

            arr.length>0 ? this.current_group_name = arr[0].groupName:'';//当前群组名称
            arr.length>0 ? this.current_group_id = arr[0].groupId:'';//当前群组id
            arr.length>0 ? this.activeWS=arr[0].groupId : '';//被激活的群组

            arr.length>0 ? this.current_member_name = null:'';//当前私聊人员名称
            arr.length>0 ? this.current_member_id = null:'';//当前私聊人员id
            // arr.length>0 ? this.my_member_id = arr[0].member_id:'';//我的member_id
            arr.length>0 ? this.initWebSocket('init',arr[0].groupId) : this.$message.info('您暂无群组！');
            arr.length>0 ? this.queryGroupMember(arr[0].groupId) : '';
            if(arr.length>0&&arr[0].newsMessage&&arr[0].newsMessage.readerList.split(',').indexOf(String(this.userData.id))!=-1){
              this.unreadNews(true,arr[0].groupId,this.current_chat_type);//在默认群组中，您有消息时，才会调未读消息读取的api
            }
            this.getUnReadPrivateNews(true);
          }
          this.chatRGroupLoading = false;
        }).catch((error) => {
          this.chatRGroupLoading = false;
          this.isBtn = true;//禁用某些按钮
          init===false ? this.$message.error('您未能获取到你的群组，请刷新重试...') : this.$message.error(error);   
          init===false ? setTimeout(()=> {this.$message.error('启动聊天室失败,请刷新重试...')}, 5000) : '';
        });
      },
      /**
       * 改变当前页码触发此事件
       * [handleCurrentChange description]
       * @param  {[type]} val [当前页码]
       * @return {[type]}     [description]
       */
      handleCurrentChange(val,type,id) {
        if(type==='group'){
          this.elementPageData.pageNum = val;
          this.queryMyChatGroup(true);
        }else if(type==='member'){
          this.elementPageData.pageNum__ = val;
          this.queryGroupMember(id);
        }
      },
      /**
       * 初始化weosocket
       * @param  {[type]} gId 群组
       * @param  {[type]} type type为init时，初始化；type为change时，切换；
       * @return {[type]}                  [description]
       */
      initWebSocket(type,gId){//登陆人员有群组才会开启websoket
        if(this.common.websock){//进入聊天室之前，websoket已启动
          this.linkUpWS(type,gId);
        }else{//进入聊天室之前，websoket未启动
          this.startUpWS(type,gId);
        }
      },
      //启动WS（进入聊天室之前，websoket未启动，启动websoket）
      startUpWS(type,gId){
        console.log('启动WS')
        if(typeof(WebSocket) === "undefined"){
          this.$message.error('您的浏览器不支持聊天，请升级浏览器或更换浏览器！');
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
          console.log(wsuri)
          //链接websoket
          this.common.websock.onopen = this.websocketonopen(type,gId); //连接成功,发送数据      
          this.common.websock.onmessage = this.websocketonmessage;  //广播成功,数据接收   
          this.common.websock.onerror = this.websocketonerror;  //连接断开、失败      
          this.common.websock.onclose = this.websocketclose; //各种问题导致连接关闭
          
        }
      },
      //启动WS（进入聊天室之前，websoket已启动,连接websoket）
      linkUpWS(type,gId){
        console.log('连接WS')
        if(typeof(WebSocket) === "undefined"){
          this.$message.error('您的浏览器不支持聊天，请升级浏览器或更换浏览器！');
        }else{

          //启动提示
          // if(type === 'init'){
          //   this.$message('启动中...请稍等!');
          // }else if(type === 'change'){
          //   this.$message('切换中...请稍等!');
          // }

          //你的websockt url
          // let wsuri = '';
          // window.location.protocol === 'http:' ? 
          // wsuri = `ws://${this.common.httpSocketSever}?access_token=Bearer ${JSON.parse(sessionStorage.getItem('Access-Token'))}`:
          // wsuri = `wss://${this.common.httpSocketSever}?access_token=Bearer ${JSON.parse(sessionStorage.getItem('Access-Token'))}`;

          //创建websoket
          // if('WebSocket' in window){
          //   this.common.websock = new WebSocket(wsuri);
          // }else if('MozWebSocket' in window){
          //   this.common.websock = new MozWebSocket(wsuri);
          // }else{
          //   this.common.websock = new SockJS(wsuri);
          // }

          //链接websoket
          this.common.websock.onopen = this.websocketonopen(type,gId); //连接成功,发送数据      
          this.common.websock.onmessage = this.websocketonmessage;  //广播成功,数据接收   
          this.common.websock.onerror = this.websocketonerror;  //连接断开、失败      
          this.common.websock.onclose = this.websocketclose; //各种问题导致连接关闭
          
        }
      },
      /*==========================================================================================soket init[end]*/

      /*==========================================================================================soket 私聊[start]*/
      /**
       * 获取私聊我的用户,请求成功，或者失败，都将滚动状态isLoadMore设置为true
       * @param  {Boolean} isRefresh true为重置数据 false累加数据
       * @return {[type]} [description]
       */
      getUnReadPrivateNews(isRefresh){
        this.chatRNewsLoading = true;
        this.axios.get(`${this.common.baseAuthPath_chat}/online_chat/un_read`,{params:{pageNum:this.elementPageData.pageNum_p,pageSize:this.elementPageData.pageSize_p}}).then((response) => {
          // ---------- 当时加载更多是，就需要累加，否则直接覆盖
          if(!isRefresh) { 
            // ----------- 合并两个数组 ------------
            this.unReadPrivateNews.rows = this.unReadPrivateNews.rows.concat(response.data.data.rows);
            this.unReadPrivateNews.total = response.data.data.total;
          }else{
            // ---------- 查询第一页数据 ---------  
            this.unReadPrivateNews = response.data.data;
          }
          // ------- 请求完毕，将滚动开关设置为true
          this.scrollLoadSw = true;
          this.chatRNewsLoading = false;
        }).catch((error) => {
          this.chatRNewsLoading = false;
          this.$message.error(error); 
          // ------- 请求完毕，将滚动开关设置为true
          this.scrollLoadSw = true; 
        });
      },
      /**
       * 滚动加载更多私聊我的用户
       * @param  {[type]} event [description]
       * @return {[type]}       [description]
       */
      scrollLoadMoreUser(event) {
        if(event.srcElement.scrollHeight - (event.srcElement.scrollTop + event.srcElement.clientHeight) ==0){// 滑动到底部的时候操作数据
          if(this.scrollLoadSw){// ------ 值为true表示可以再次请求
            this.scrollLoadSw = false;
            this.elementPageData.pageNum_p++;
            if(this.elementPageData.pageNum_p < Math.ceil(this.unReadPrivateNews.total / this.elementPageData.pageSize_p)+1){
              this.getUnReadPrivateNews(false);
            } 
          }
        }
      },
      /*==========================================================================================soket 私聊[end]*/

      /*==========================================================================================soket 消息读取[start]*/
      /**
       * 未读消息读取 [批量读取未读消息,并且暂缓消息],请求成功，或者失败，都将滚动状态isLoadMore设置为true
       * @param  {Boolean} isRefresh true为重置数据 false累加数据
       * @param  {[type]} id 群组id
       * @param  {[type]} type  1群聊 点击切换群组时，2私聊 点击切换用户时
       * @return {[type]}     [description]
       */
      unreadNews(isRefresh,id,type){
        this.isShowChatMLoading = true;
        if(type === 1){
          this.axios.post(`${this.common.baseAuthPath_chat_push}/message/list`,{fromType:2,fromId:id,curStatus:1,pageNum:this.elementPageData.pageNum_,pageSize:this.elementPageData.pageSize_} ).then((response) => {
            // ---------- 当时加载更多是，就需要累加，否则直接覆盖
            if(!isRefresh) { 
              // ----------- 合并两个数组 ------------
              this.unReadNews.rows = this.unReadNews.rows.concat(response.data.data.rows);
              this.unReadNews.total = response.data.data.total;
            }else{
              // ---------- 查询第一页数据 ---------  
              this.unReadNews = response.data.data;
            }
            //--------暂缓未读消息 -------
            this.cacheUnReadInfo(this.unReadNews,type);
            this.queryMyChatGroup(true);//刷新
            console.log('暂缓信息(群聊)',this.chatArr)
            this.scrollToBottom();
            // ------- 请求完毕，将滚动开关设置为true
            this.scrollLoadSw = true;
            this.isShowChatMLoading = false;
          }).catch((error) => {
            this.$message.error(error); 
            // ------- 请求完毕，将滚动开关设置为true
            this.scrollLoadSw = true;
            this.isShowChatMLoading = false;
          });
        }else{
          this.axios.post(`${this.common.baseAuthPath_chat_push}/message/chat/list`,{curStatus:1,sender:id,receiver:this.userData.id,fromType:1,pageNum:this.elementPageData.pageNum_p_,pageSize:this.elementPageData.pageSize_p_}).then((response) => {
            // ---------- 当时加载更多是，就需要累加，否则直接覆盖
            if(!isRefresh) { 
              // ----------- 合并两个数组 ------------
              this.unReadNews_.rows = this.unReadNews_.rows.concat(response.data.data.rows);
              this.unReadNews_.total = response.data.data.total;
            }else{
              // ---------- 查询第一页数据 ---------  
              this.unReadNews_ = response.data.data;
            }
            //--------暂缓未读消息 -------
            this.cacheUnReadInfo(this.unReadNews_,type);
            this.getUnReadPrivateNews(true);//刷新
            console.log('暂缓信息(私聊)',this.chatArr,type,this.unReadNews_)
            this.scrollToBottom();
            // ------- 请求完毕，将滚动开关设置为true
            this.scrollLoadSw = true;
            this.isShowChatMLoading = false;
          }).catch((error) => {
            this.$message.error(error); 
            // ------- 请求完毕，将滚动开关设置为true
            this.scrollLoadSw = true;
            this.isShowChatMLoading = false;
          });
        }
      },
      //暂缓未读信息
      cacheUnReadInfo(unReadNews,type){
        if(type===1){
          let m = {};
          if(unReadNews.total!=0){
            unReadNews.rows.forEach( (item) => {
              m = {
                "chatId":item.msgId,
                "createDate":item.createTime,
                "creater":item.sender,
                "curStatus":null,
                "groupId":item.fromId,
                "info":item.messageInfo,
                'messageType':item.messageType,
              };
              let temporary_redata ={
                m: JSON.stringify(m), 
                t: this.current_chat_type,//1表示群聊消息
                whoType:item.sender===this.userData.id?'we':'they',
              }
              console.log('未读消息体(群聊)',temporary_redata)
              this.chatArr.push(temporary_redata);//暂缓未读消息
            });
            sessionStorage.setItem('chatRecord',JSON.stringify(this.chatArr));//session暂缓聊天记录
          }
        }else{
          let m = {};
          if(unReadNews.total!=0){
            unReadNews.rows.forEach( (item) => {
              m = {
                "chatId":item.msgId,
                "createDate":item.createTime,
                "creater":item.sender,//发送者
                "curStatus":null,
                "info":item.messageInfo,
                'reader':item.receiver,//接收者
                'messageType':item.messageType,
              };
              let temporary_redata ={
                m: JSON.stringify(m), 
                t: this.current_chat_type,//1表示群聊,2表示私聊
                whoType:item.sender===this.userData.id?'we':'they',
              }
              console.log('未读消息体(私聊)',temporary_redata)
              this.chatArr.push(temporary_redata);//暂缓未读消息
            });
            sessionStorage.setItem('chatRecord',JSON.stringify(this.chatArr));//session暂缓聊天记录
          }
        }
      },
      /**
       * 自动 滚动加载更多未读消息（批量读取未读消息）
       * @param  {[type]} event [description]
       * @param  {[type]} id    群组id/发送者id
       * @param  {[type]} type  1群聊，2私聊
       * @return {[type]}       [description]
       */
      scrollLoadMoreUnRead(event,id,type) {
        if(type===1){
          if(event.srcElement.scrollHeight - (event.srcElement.scrollTop + event.srcElement.clientHeight) ==0){// 滑动到底部的时候操作数据
            if(this.scrollLoadSw){// ------ 值为true表示可以再次请求
              this.scrollLoadSw = false;
              this.elementPageData.pageNum_++;
              if(this.elementPageData.pageNum_ <= Math.ceil(this.unReadNews.total / this.elementPageData.pageSize_)){
                this.unreadNews(false,id,type);
              } 
            }
          }
        }else{
          if(event.srcElement.scrollHeight - (event.srcElement.scrollTop + event.srcElement.clientHeight) ==0){// 滑动到底部的时候操作数据
            if(this.scrollLoadSw){// ------ 值为true表示可以再次请求
              this.scrollLoadSw = false;
              this.elementPageData.pageNum_p_ ++;
              if(this.elementPageData.pageNum_p_ < Math.ceil(this.unReadNews_.total / this.elementPageData.pageSize_p_)){
                this.unreadNews(false,id,type);
              } 
            }
          }
        }
      },
      /**
       * 未读消息读取（广播到当前群组时）[单条读取未读消息]
       * @param  {[type]} messageId 消息id
       * @return {[type]}     [description]
       */
      readSingleNew(messageId){
        this.isShowChatMLoading = true;
        this.axios.post(`${this.common.baseAuthPath_chat_push}/message/receive`,[messageId]).then((response) => {
          this.queryMyChatGroup(true);//刷新
          this.isShowChatMLoading = false;
        }).catch((error) => {
          this.isShowChatMLoading= false;
          this.$message.error(error);  
        });
      },
      /**
       * 未读消息读取（广播到当前用户时（私聊））[单条读取未读消息]
       * @param  {[type]} messageId 消息id
       * @return {[type]}     [description]
       */
      readSingleNewP(messageId){
        this.isShowChatMLoading = true;
        this.axios.post(`${this.common.baseAuthPath_chat_push}/message/receive`,[messageId]).then((response) => {
          this.getUnReadPrivateNews(true);//刷新
          this.isShowChatMLoading = false;
        }).catch((error) => {
          this.isShowChatMLoading = false;
          this.$message.error(error);  
        });
      },
      /*==========================================================================================soket 消息读取[end]*/

      /*==========================================================================================soket open[start]*/
      //连接成功,发送数据
      websocketonopen(type,gId){
        // this.heatBeat();
        if(type === 'init'){
          this.getUserList();//用于在聊天中，展示用户信息或筛选用户等
          this.$message({type: 'success',message: '欢迎加入聊天室！',center:true,offset:300,iconClass:'0',customClass:'join-message-box',showClose:false,});
        }else if(type === 'change'){
          this.$message({type: 'success',message: '欢迎加入（'+this.computed_group(gId)+'）！',center:true,iconClass:'el-icon-sort',customClass:'change-message-box',offset:130});
          this.scrollToBottom();
        }
      },
      /*==========================================================================================soket open[end]*/

      /*==========================================================================================soket发送消息[start]*/
      //心跳检测+消息发送
      heatBeat_sendMessage(val,type){
        this.sendMessage(val,type);
        return;
        this.common.timeoutObj && clearTimeout(this.common.timeoutObj);
        this.common.serverTimeoutObj && clearTimeout(this.common.serverTimeoutObj);
        this.common.timeoutObj = setTimeout(()=>{
            // this.sendMessage(val,type);
            this.common.serverTimeoutObj = setTimeout(()=> {
              this.common.websock.close(); this.common.websock = null;      //如果  5秒之后我们没有收到 后台返回的心跳检测数据 断开socket，断开后会启动重连机制
            }, 5000);
        }, this.common.timeout)
      },
      /**
       * ctrl+enter换行
       * @return {[type]} [description]
       */
      down_ctrlEnter(){
        console.log('ctrl+enter换行');
        if(this.chat.value){
          this.chat.value += '\r\n';
        }else{
          this.chat.value = '';
          this.chat.value += '\r\n';
        }
      },
      /**
       * enter回车发送消息
       * @param  {[type]} evt [description]
       * @return {[type]}     [description]
       */
      press_enter(evt){
        console.log('enter回车发送消息');
        evt.preventDefault();
        this.chat.messageType=2;
        this.heatBeat_sendMessage(this.chat.value,'textarea') ;
      },
      /**
       * 把选中的表情组成一个数组
       * @param  {[type]} emotion      [description]
       * @param  {[type]} emotion_icon [description]
       * @return {[type]}              [description]
       */
      emotionJsonFun(emotion,emotion_icon){
        this.selectionEmotionArr.push({emotion:emotion,emotion_icon:emotion_icon});
      },
      /**
       * 把表情拼成html字符串,消息类型：infoType为3（表情消息）,然后发送，无法在文本域显示表情，也无法发送表情加文字
       * @param  {[type]} selectionEmotionArr      [description]
       * @return {[type]}                          [description]
       */
      emotionHtmlStr(selectionEmotionArr){
        let val = "";
        selectionEmotionArr.forEach( function(element, index) {
          val += '<img src="'+ element.emotion_icon +'" alt="'+ element.emotion +'"/>';
        });
        this.heatBeat_sendMessage(val,'emotion');
      },
      /**
       * 聊天上传单张图片
       */
      handleSuccessSingleImage(res,file,fileList) {//文件上传成功时的钩子
        if(res.meta.code === 0){
          let val = "";
          if(file.size>185846){//图片太大，限制宽612高334
            val ='<img src="'+ res.data[0].path +'" alt="'+ res.data[0].fileName +'" width="612" height="334" />';
          }else{
            val ='<img src="'+ res.data[0].path +'" alt="'+ res.data[0].fileName +'"/>';
          }
          let fileId = res.data[0].fileId;
          this.heatBeat_sendMessage(val,'upload');
          this.$message({type: 'success',message: '上传成功!'});
        }else{
          this.$message.error(res.meta.message);
        }
      },
      handleErrorSingleImage(err, file, fileList){//文件上传失败时的钩子
        this.$message.error('上传失败!!');
      },
      beforeUploadSingleImage(file) {//限制用户上传的图片格式和大小
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt100M = file.size / 1024 / 1024 < 100;

        if (!isJPG && !isPNG) {
          this.$message({type:'error',message: '上传图片只能是 JPG/PNG 格式!',offset:100});
        }
        if (!isLt100M) {
          this.$message.error('上传图片大小不能超过 100MB!');
        }
        return isLt100M && (isJPG || isPNG);
      },
      /**
       * 聊天上传单个文件
       */
      handleSuccessSingleFile(res,file,fileList) {//文件上传成功时的钩子
        if(res.meta.code === 0){
          let val = '<a class="a" href="'+ res.data[0].path +'" target="_blank"><i class="el-icon-folder el-icon--right"></i> '+ res.data[0].fileName +'</a>';
          let fileId = res.data[0].fileId;
          this.heatBeat_sendMessage(val,"upload");
          this.$message({type: 'success',message: '上传成功!'});
        }else{
          this.$message.error(res.meta.message);
        }
      },
      handleErrorSingleFile(err, file, fileList){//文件上传失败时的钩子
        this.$message.error('上传失败!!');
      },
      beforeUploadSingleFile(file) {//限制用户上传的图片格式和大小
        const isLt100M = file.size / 1024 / 1024 < 100;
        if (!isLt100M) {
          this.$message.error('上传文件大小不能超过 100MB!');
        }
        return isLt100M;
      },
      /**
       * 发送wangeditor的内容，暂时将编辑器的息类型默认为：infoType 2（文字消息）
       * @return {[type]} [description]
       */
      sendWEMessage(){
        if(this.$refs.initWangEditor.info === ''){
          this.$message.error('内容不能为空！');
        }else{
          this.heatBeat_sendMessage(this.$refs.initWangEditor.info,"wangeditor");
        }      
      },
      //消息发送
      sendMessage(val,type){
        if(type==='textarea'){//（仅适用于textarea发送消息）
          this.$refs['chat'].validate((valid) => {
            if (valid) {
              this.sendRequest(val,type);
            } else {
              return false;
            }
          }); 
        }else{
          this.sendRequest(val,type);
        }  
      },
      /**
       * 发送消息的请求
       * @param  {[type]} msg  消息体
       * @param  {[type]} type textarea、wangeditor、emotion
       * @return {[type]}      [description]
       */
      sendRequest(msg,type){
        // this.websock.readyState
        // 0        CONNECTING        连接尚未建立
        // 1        OPEN              WebSocket的链接已经建立
        // 2        CLOSING           连接正在关闭
        // 3        CLOSED            连接已经关闭或不可用
        if(this.common.websock.readyState === 1){
          this.isShowChatMLoading = true;
          //我发送的消息体(群聊)
          let actions = {
            "infoType":1,
            "info":msg,
            'groupId':this.current_group_id,
          };
          //我发送的消息体(私聊)
          let actions_ = {
            "infoType":2,
            "info":msg,
            'readerId':this.current_member_id,
          };
          let val = this.current_chat_type===1 ? actions : actions_;
          console.log(val)
          if(type==="textarea"){if(val.info.replace(/^\s+|\s+$/g, ' ') === ' ' ){this.$message.error('内容不能为空！');this.chat.value =null;this.isShowChatMLoading = false;return;}}
          this.axios.post(this.current_chat_type===1 ? `${this.common.baseAuthPath_chat}/online_group/send` : `${this.common.baseAuthPath_chat}/online_chat/send`,this.current_chat_type===1 ? actions : actions_).then((response) => {   
            // (群聊)
            let m = {
              "chatId":null,
              "createDate":(new Date()).getTime(),
              "creater":'我',
              "curStatus":null,
              "groupId":this.current_group_id,
              "info":msg,
              'messageType':this.chat.messageType,
            };
            //(私聊)
            let m_ = {
              "chatId":null,
              "createDate":(new Date()).getTime(),
              "creater":'我',//发送者
              "curStatus":null,
              "info":msg,
              'reader':this.current_member_id,//接收者
              'messageType':this.chat.messageType,
            };
            //暂缓我发送的信息体(群聊)
            let temporary_actions = {
              m: JSON.stringify(m), 
              t: this.current_chat_type,//1表示群聊消息，2表示私聊消息
              whoType:'we',
            };
            //暂缓我发送的信息体(私聊)
            let temporary_actions_ = {
              m: JSON.stringify(m_), 
              t: this.current_chat_type,//1表示群聊消息，2表示私聊消息
              whoType:'we',
            };

            this.current_chat_type === 1 ? this.chatArr.push(temporary_actions) : this.chatArr.push(temporary_actions_);//暂缓聊天记录
            sessionStorage.setItem('chatRecord',JSON.stringify(this.chatArr));//session暂缓聊天记录
            console.log('暂缓信息',this.chatArr);
            if(type==="emotion"){this.selectionEmotionArr = [];}//发送成功后，清空表情
            if(type==="wangeditor"){this.$refs.initWangEditor.clearContent();}//发送成功后，清空wangeditor的内容
            if(type==="textarea"){this.chat.value = null;}//发送成功后，清空内容
            this.scrollToBottom();
            this.isShowChatMLoading = false;
          }).catch((error) => {
            this.isShowChatMLoading = false;
            this.$message.error(error);  
          });

        }else{
          if(this.common.websock.readyState === 3){
            this.$message.error('聊天室已经关闭或不可用,无法发送信息！');
          }else if(this.common.websock.readyState === 2){
            this.$message.error('聊天室正在关闭,无法发送信息！');
          }else if(this.common.websock.readyState === 0){
            this.$message.error('聊天室尚未建立,无法发送信息！');
          }else{
            this.$message.error('聊天室无法发送信息！');
          }
        }
      },
      /*==========================================================================================soket发送消息[end]*/
      
      /*==========================================================================================soket 广播[start]*/
      //广播成功,数据接收   
      websocketonmessage(e){
        // this.heatBeat();      //收到消息会刷新心跳检测，如果一直收到消息，就推迟心跳发送
        const redata = JSON.parse(e.data);
        console.log(redata)

        if('messageType' in redata&&this.userData.id!=redata.sender){//接收消息
          if(redata.messageType===2){//接受群聊消息
            this.queryMyChatGroup(true);//刷新群组列表
            //当前群组如果有消息，需读取
            if(this.current_group_id === redata.fromId){//表示当前群组
              //有消息时，单条读取
              redata.receivers.indexOf(this.userData.id)!=-1 ? this.readSingleNew(redata.msgId) : '';
            }
            //暂缓接收的信息体(群聊)
            let m = {
              "chatId":redata.msgId,
              "createDate":(new Date()).getTime(),
              "creater":redata.sender,
              "curStatus":null,
              "groupId":redata.fromId,
              "info":redata.messageInfo,
              'messageType':redata.messageType,
            };
            let temporary_redata = {
              m: JSON.stringify(m), 
              t: redata.messageType===1?2:1,//1表示群聊消息，2表示私聊消息
              whoType:'they',
            };
            this.current_group_id === redata.fromId ? this.chatArr.push(temporary_redata) : '';//暂缓接受到的信息
            if(this.userData.id!=redata.sender){
              this.$notify({
                dangerouslyUseHTMLString:true,//是否将 message 属性作为 HTML 片段处理
                message: '<b>'+this.computed_creater(redata.sender)+'</b> 向 <i style="color:#409EFF">'+this.computed_group(redata.fromId)+'</i>  发送了新消息！',
                // type: 'success',
                duration:5000,
                offset: 0
              });
            }
          }else if(redata.messageType===1){//接受私聊消息
            this.getUnReadPrivateNews(true);//刷新获取私聊我的用户
            //当前用户如果有消息，需读取
            if(this.current_member_id === redata.sender){//表示当前用户
              //有消息时，单条读取
              redata.receivers.indexOf(this.userData.id)!=-1 ? this.readSingleNewP(redata.msgId) : '';
            }
            //暂缓接收的信息体(私聊)
            let m = {
              "chatId":redata.msgId,
              "createDate":(new Date()).getTime(),
              "creater":redata.sender,
              "curStatus":null,
              'reader':redata.receivers[0],//接收者
              "info":redata.messageInfo,
              'messageType':redata.messageType,
            };
            let temporary_redata = {
              m: JSON.stringify(m), 
              t: redata.messageType===1?2:1,//1表示群聊消息，2表示私聊消息
              whoType:'they',
            };
            this.current_member_id === redata.sender ? this.chatArr.push(temporary_redata) : '';//暂缓接受到的信息
            if(this.userData.id!=redata.sender){
              this.$notify({
                dangerouslyUseHTMLString:true,//是否将 message 属性作为 HTML 片段处理
                message: '<b>'+this.computed_creater(redata.sender)+'</b> 向 <i style="color:teal">'+this.computed_creater(redata.receivers[0])+'</i>  发送了新消息！',
                // type: 'success',
                duration:5000,
                offset: 0
              });
            }
          }
          sessionStorage.setItem('chatRecord',JSON.stringify(this.chatArr));//session暂缓聊天记录
          console.log('暂缓信息',this.chatArr)
        }else{
         
        }
        this.scrollToBottom();
      },
      /*==========================================================================================soket 广播[end]*/

      /*==========================================================================================soket else[start]*/
      //连接失败,执行重连
      websocketonerror(e){
        this.common.websock = null;
        this.reconnect('init');
      },
      //各种问题导致连接关闭
      websocketclose(e){  
        console.log('各种原因导致soket关闭,错误码为：'+e.code);
        //1000 正常关闭
        e.code===1000 ? this.$message({type: '',message: '已正常关闭聊天室！'}) : this.websock = null;

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
        this.common.timeoutObj && clearTimeout(this.common.timeoutObj);
        this.common.serverTimeoutObj && clearTimeout(this.common.serverTimeoutObj);
        this.common.timeoutObj = setTimeout(()=>{
            console.log("欢迎加入聊天室！")
            this.common.serverTimeoutObj = setTimeout(()=> {
                this.common.websock.close(); this.common.websock = null;      //如果  5秒之后我们没有收到 后台返回的心跳检测数据 断开socket，断开后会启动重连机制
            }, 5000);
        }, this.common.timeout)
      }, 
      //执行重连
      reconnect(type){
        this.$message.error('连接失败！正在尝试重连...');
        if(this.common.lockReconnect){//这里很关键，因为连接失败之后之后会相继触发 连接关闭，不然会连接上两个 WebSocket
          return
        }
        this.common.lockReconnect = true;
        this.common.reconnectData && clearTimeout(this.common.reconnectData);
        this.common.reconnectData = setTimeout(()=>{
          this.initWebSocket(type,null);
          this.common.lockReconnect = false;
        },5000)
      },
      //关闭websoket
      websocketdestroyed(){
        if(this.common.websock){
          this.common.lockReconnect = true;  
          this.common.websock.close();this.common.websock = null;           //全部关闭
          sessionStorage.removeItem('chatRecord') ;                         //清空暂缓聊天记录
          clearTimeout(this.common.reconnectData);                          //离开清除 timeout
          clearTimeout(this.common.timeoutObj);                             //离开清除 timeout
          clearTimeout(this.common.serverTimeoutObj);                       //离开清除 timeout
          this.$router.back(-1);                                            //离开聊天室
        }else{
          this.$message('你尚未启动！')
        }   
      },
      /*==========================================================================================soket else[end]*/

      /*==========================================================================================群组与用户[start]*/
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
      submitPlusForm(formName,type) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            type === 1 ? this.addGroup() : this.addMembers(); 
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
          groupName:this.plusform.chat_name,
          orgId:this.plusform.org_id,
          profile:'',
          userId:this.plusform.members,
        }
        this.axios.post(`${this.common.baseAuthPath_chat}/online_group/addGroup`,plusform).then((response) => {
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
       * 群组成员form添加 POST
       * @return {[type]} [description]
       */
      addMembers(){
        this.dialogLoading = false;
        let plusform = {
          group_id:this.plusform.group_id,
          members:this.plusform.members,
        }
        this.axios.post(`${this.common.baseAuthPath_chat}/online_group/addGroupsMember`,plusform).then((response) => {
          this.dialogLoading = false;
          this.dialogFormVisible = false;
          if(this.current_group_id === this.plusform.group_id){
            this.queryGroupMember(this.plusform.group_id);//刷新
          }else{
            // this.queryMyChatGroup(true);//刷新
          }
          this.$message({type: 'success',message: '添加群组成员成功!'});
        }).catch((error) => {
          this.dialogLoading = false;
          this.$message.error(error);  
        });
      },
      /**
       * 解散群组
       * @param  {[type]} gId [description]
       * @return {[type]}     [description]
       */
      dismissGroup(gId){
        this.axios.get(`${this.common.baseAuthPath_chat}/online_group/dismiss`,{params:{group_id:gId}}).then((response) => {
          this.queryMyChatGroup(true);//刷新
          this.$message({type: 'success',message: '解散（'+this.computed_group(gId)+'）成功!'}); 
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      /**
       * 获取聊天群组成员
       * @param  {[type]} gId [description]
       * @return {[type]}     [description]
       */
      queryGroupMember(gId){
        this.chatLLoading = true;
        this.axios.post(`${this.common.baseAuthPath_chat}/online_group/member`,{group_id:gId,pageNum:this.elementPageData.pageNum__,pageSize:this.elementPageData.pageSize__}).then((response) => {
          this.current_group_members = response.data.data;
          this.chatLLoading = false;
        }).catch((error) => {
          this,chatLLoading= false;
          this.$message.error(error);  
        });
      },
      /**
       * 筛选该群组未添加的成员
       * @param  {[type]} gId [description]
       * @return {[type]}     [description]
       */
      screenUnAddMembers(gId){
        this.dialogLoading = true;
        this.axios.post(`${this.common.baseAuthPath}/user/list`,this._listParams()).then((response) => {
          let arr1 = response.data.data ? response.data.data.rows : [];
          let newArr = [];
          this.axios.post(`${this.common.baseAuthPath_chat}/online_group/member`,{group_id:gId}).then((r) => {
            let arr2 = r.data.data ? r.data.data.rows : [];
            this.dialogLoading = false;
            this.getArrDifference(arr1,arr2).length===0 ? this.$message.info('该群组没有可以添加的成员了！') : this.dialogFormVisible = true;
            this.userObj = {total:0,rows:this.getArrDifference(arr1,arr2)};
          }).catch((error) => {
            this.dialogLoading = false;
            this.dialogFormVisible = false;
            this.userObj = {total:0,rows:[]};
            this.$message.error(error);  
          });
        }).catch((error) => {
          this.dialogLoading = false;
          this.dialogFormVisible = false;
          this.userObj = {total:0,rows:[]};
          this.$message.error(error);  
        });   
      },
      /**
       * 查询群组中的某个成员信息
       * @param  {[type]} gId [description]
       * @param  {[type]} mId [description]
       * @return {[type]}     [description]
       */
      queryMemberInfo(gId,mId){
        this.chatLInfoLoading = false;
        this.axios.get(`${this.common.baseAuthPath_chat}/online_group/findMember`,{params:{group_id:gId,member_id:mId}}).then((response) => {
          this.group_member_info = response.data.data;
          this.chatLInfoLoading = false;
        }).catch((error) => {
          this.chatLInfoLoading = false;
          this.$message.error(error);  
        });
      },
      /*==========================================================================================群组与用户[end]*/

      /*==========================================================================================聊天历史[start]*/
      /**
       * 查询历史聊天记录,请求成功，或者失败，都将滚动状态isLoadMore设置为true
       * @param  {Boolean} isRefresh true为重置数据 false累加数据
       * @param  {[type]}  id       群组id/谁和我私聊的id
       * @param  {[type]}  type      1群聊，2私聊
       * @return {[type]}            [description]
       */
      queryChatRecord(isRefresh,id,type){  
        if(isRefresh){
          this.historyLoading = true;
          if(type === 1){
            // this._queryHistoryRequest(isRefresh,id,type);
            this.axios.post(`${this.common.baseAuthPath_chat_push}/message/list`,this._queryParams(isRefresh,id)).then((response) => {
              this.elementPageData.pageNum_s = Math.ceil(response.data.data.total / this.elementPageData.pageSize_s)
              this._queryHistoryRequest(isRefresh,id,type)
              this.historyLoading = false;
            }).catch((error) => {
              this.$message.error(error); 
              this.historyLoading = false;
            });
          }else{
            this.axios.post(`${this.common.baseAuthPath_chat_push}/message/chat/list`,this.__queryParams(isRefresh,id)).then((response) => {
              this.elementPageData.pageNum_p_s = Math.ceil(response.data.data.total / this.elementPageData.pageSize_p_s)
              this._queryHistoryRequest(isRefresh,id,type)
              this.historyLoading = false;
            }).catch((error) => {
              this.$message.error(error); 
              this.historyLoading = false;
            });
          }
        }else{
          this._queryHistoryRequest(isRefresh,id,type)
        }
      },
      _queryHistoryRequest(isRefresh,id,type){
        this.historyLoading = true;
        if(type === 1){
          this.axios.post(`${this.common.baseAuthPath_chat_push}/message/list`,this._queryParams(isRefresh,id)).then((response) => {
            // ---------- 当时加载更多是，就需要累加，否则直接覆盖
            if(!isRefresh) { 
              // ----------- 合并两个数组 ------------
              this.chatRecord.rows = this.chatRecord.rows.concat(response.data.data.rows);
              this.chatRecord.total = response.data.data.total;
            }else{
              // ---------- 查询第一页数据 ---------  
              this.chatRecord.rows = response.data.data.rows;
              this.chatRecord.total = response.data.data.total;
            }
            // ------- 请求完毕，将滚动开关设置为true
            this.scrollLoadSw = true;
            this.historyLoading = false;
          }).catch((error) => {
            this.$message.error(error); 
            // ------- 请求完毕，将滚动开关设置为true
            this.scrollLoadSw = true;
            this.historyLoading = false;
          });
        }else{
          this.axios.post(`${this.common.baseAuthPath_chat_push}/message/chat/list`,this.__queryParams(isRefresh,id)).then((response) => {
            // ---------- 当时加载更多是，就需要累加，否则直接覆盖
            if(!isRefresh) { 
              // ----------- 合并两个数组 ------------
              this.chatRecord_.rows = this.chatRecord_.rows.concat(response.data.data.rows.reverse());
              this.chatRecord_.total = response.data.data.total;
            }else{
              // ---------- 查询第一页数据 ---------  
              this.chatRecord_.rows = response.data.data.rows.reverse();
              this.chatRecord_.total = response.data.data.total;
            }
            // ------- 请求完毕，将滚动开关设置为true
            this.scrollLoadSw = true;
            this.historyLoading = false;
          }).catch((error) => {
            this.$message.error(error); 
            // ------- 请求完毕，将滚动开关设置为true
            this.scrollLoadSw = true;
            this.historyLoading = false;
          });
        }
      },
      _queryParams(isRefresh,gId){//群聊
        return {
            fromType:2,
            fromId:gId,
						curStatus:2,// 1表示未读，2表示已读
            pageNum:this.elementPageData.pageNum_s,
            pageSize:this.elementPageData.pageSize_s,
            // end_time:this.screeningDateVal ? this.screeningDateVal[1].getTime() : null,
            // start_time:this.screeningDateVal ? this.screeningDateVal[0].getTime() : null,
        };
      },
      __queryParams(isRefresh,mId){//私聊
        return{
          sender:mId,
          receiver:this.userData.id,
          fromType:1,
					curStatus:2,// 1表示未读，2表示已读
          pageNum:this.elementPageData.pageNum_p_s,
          pageSize:this.elementPageData.pageSize_p_s,
          // end_time:this.screeningDateVal ? this.screeningDateVal[1].getTime() : null,
          // start_time:this.screeningDateVal ? this.screeningDateVal[0].getTime() : null,
        }
      },
      /**
       * 滚动加载更多历史聊天记录
       * @param  {[type]} event [description]
       * @param  {[type]} id   [description]
       * @param  {[type]} type  [description]
       * @return {[type]}       [description]
       */
      scrollLoadMore(event,id,type) {
        if(type===1){
          if(event.srcElement.scrollHeight - (event.srcElement.scrollTop + event.srcElement.clientHeight) ==0){// 滑动到底部的时候操作数据
            if(this.scrollLoadSw){// ------ 值为true表示可以再次请求
              this.scrollLoadSw = false;
              this.elementPageData.pageNum_s--;
              if(this.elementPageData.pageNum_s >0){
                this.queryChatRecord(false,id,type);
              } 
            }
          }
        }else{
          if(event.srcElement.scrollHeight - (event.srcElement.scrollTop + event.srcElement.clientHeight) ==0){// 滑动到底部的时候操作数据
            if(this.scrollLoadSw){// ------ 值为true表示可以再次请求
              this.scrollLoadSw = false;
              this.elementPageData.pageNum_p_s --;
              if(this.elementPageData.pageNum_p_s > 0){
                this.queryChatRecord(false,id,type);
              } 
            }
          }
        }
      },
      /*==========================================================================================聊天历史[end]*/

      
      /*==========================================================================================方法[start]*/
      /**清空暂缓
       * [clearChatRecord description]
       * @return {[type]} [description]
       */
      clearChatRecord(){
        this.chatArr = [];
        sessionStorage.removeItem('chatRecord') ;                   //清空暂缓聊天记录
      },
      /**
       * 滚动(聊天框默认滚动到底部)
       * @return {[type]} [description]
       */
      scrollToBottom(){
        // 滚动(聊天框默认滚动到底部)
        this.$nextTick(() => {
          let msgBox = document.getElementById('main-mid') // 获取对象
          msgBox ? msgBox.scrollTop = msgBox.scrollHeight :'';// 滚动高度
        })
      },
      //js比较两个数组对象,取出不同的值
      getArrDifference(arr1, arr2) {
        var result = [];
        for(var i = 0; i < arr1.length; i++){
          var obj = arr1[i];
          var id = obj.id;
          var isExist = false;
          for(var j = 0; j < arr2.length; j++){
            var obj_ = arr2[j];
            var user_id = obj_.user_id;
            if(id == user_id){
              isExist = true;
              break;
            }
          }
          if(!isExist){
            result.push(obj);
          }
        }
        return result;  
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
       * 数组对象去重
       * @param  {[type]} arr [需去重的数组]
       * @return {[type]}     [description]
       */
      unique_creater(oldArr){
        var allArr = [];//新数组
        for(var i=0;i<oldArr.length;i++){
        　　var flag = true;
        　　for(var j=0;j<allArr.length;j++){
        　　　　if(oldArr[i].creater == allArr[j].creater){
        　　　　　　flag = false;
        　　　　};
        　　}; 
        　　if(flag){
        　　　　allArr.push(oldArr[i]);
        　　};
        };
        return allArr;
      },
      /*==========================================================================================方法[end]*/
      
    },
  }
</script>

<style scoped lang="less">
  .chat-house{
    .history-chat-area{
      background:red;
    }
  }
</style>
