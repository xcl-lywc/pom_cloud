<!-- 组织信息 -->
<template>
  <div class="org-info" v-loading="loading">
    <div v-if="orgId">
      <el-row :gutter="20">
        <el-col :span="14" class="base-info">
          <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
              <span>基本信息</span>
            </div>
            <div v-if="orgInfo_base">
              <el-form ref="form" label-width="100px" class="show-form">
                <el-row :gutter='20'>
                  <el-col :span="18">
                    <el-form-item label="组织名称：">{{orgInfo_base.name}}</el-form-item>
                    <el-form-item label="组织性质：">{{orgNatureArr[orgInfo_base.nature]}}</el-form-item>
                    <el-form-item label="组织类型：">{{orgTypeArr[orgInfo_base.type]}}</el-form-item>
                    <el-form-item label="电 话：">{{orgInfo_base.phone}}</el-form-item>
                    <el-form-item label="邮 箱：">{{orgInfo_base.mailbox}}</el-form-item>
                    <el-form-item label="地 址：">{{orgInfo_base.address}}</el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-image
                      style="width: 200px; height: 200px"
                      :src="orgInfo_base.photo"
                      fit="cover">
                    </el-image>
                  </el-col>
                </el-row>
                <el-form-item label="简 介：">{{orgInfo_base.description}}</el-form-item>
              </el-form>
              <el-button type="primary" size="mini mart10" @click="modify">修改</el-button>
            </div>
            <div v-else class="content-empty line-height-300">
              暂无信息
            </div>
          </el-card>
        </el-col>
        <el-col :span="10" class="team-set">
          <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
              <span>班子设置</span>
            </div>
            <el-tree
              v-if="orgInfo_team.length!=0"
              :data="orgInfo_team"
              node-key="id"
              class="drag-tree-tag"
              @node-drop="handleDrop"
              draggable
              :allow-drop="allowDrop"
              :allow-drag="allowDrag">
              <div slot-scope="{ node, data }" class="" >
                <el-tag 
                  type="info" 
                  closable 
                  color="#fff"
                  effect="plain"
                  style="width:220px"
                  :disable-transitions="false"
                  class="tag-close-position"
                  @close="handleClose(data,1)">
                   <span class="ellipsis w180">{{data.userName+'（'+ data.position +'）'}}</span>
                </el-tag>
              </div>
            </el-tree>
            <el-button type="success" size="mini mart10 marl25"@click="addPlus(1,null)">添加</el-button>
          </el-card>
        </el-col>
      </el-row> 
      <el-row class="mart20">
        <el-card class="box-card public-info" shadow="hover">
          <div slot="header" class="clearfix">
            <span>组织公示信息</span>
          </div>
          <el-row :gutter="20">
            <el-col :span="18">
              <div v-if="orgInfo_notice.length!=0">
                <el-form ref="ueditorform" :model="ueditorform" label-width="60px">
                  <el-form-item 
                    label="标题"
                    prop="title" 
                    :rules="[{ required: true, message: '请输入标题', trigger: 'blur' }]">
                    <el-input v-model="ueditorform.title" size="small" class="w300" clearable @clear="ueditorform.title = null"></el-input>
                  </el-form-item>
                  <el-form-item
                    label="信息"
                    prop="info" 
                    class="info-line-height"
                    :rules="[{ required: true, message: '请输入组织公示信息', trigger: 'blur' }]">
                    <vue-ueditor-wrap 
                      v-model="ueditorform.info" 
                      @beforeInit="addCustomButtom($event,axios,common,$message,newOrgId)"
                      :config="config" 
                      @ready="readyUE"
                      :destroy="true"/> 
                  </el-form-item>
                </el-form>
                <el-button type="primary" size="mini mart10" @click="saveUE('ueditorform')">保存</el-button>
                <span v-if='isShowTips' class="font-red-color marl10 font-size-12">您尚未修改组织公示信息，无法保存！</span>
              </div>
            </el-col>
            <el-col :span="6">
              <el-tree
                v-if="orgInfo_notice.length!=0"
                :data="orgInfo_notice"
                node-key="id"
                class="drag-tree-tag"
                @node-drop="handleDrop_"
                draggable
                :allow-drop="allowDrop_"
                :allow-drag="allowDrag_">
                <div slot-scope="{ node, data }" class="" >
                  <el-tag 
                    :type="activeTag === data.id ? '':'info'" 
                    closable 
                    :color="activeTag === data.id ? '#eee':'#fff'"
                    effect="plain"
                    style="width:180px"
                    :disable-transitions="false"
                    class="tag-close-position"
                    @close="handleClose(data,2)"
                    @click="tagClick(data)">
                     <span class="ellipsis w140">{{data.title}}</span>
                  </el-tag>
                </div>
              </el-tree>
              <el-button type="success" size="mini mart10 marl25" @click="addPlus(2,null)">添加</el-button>
            </el-col>
          </el-row> 
        </el-card>
      </el-row>
    </div>
    <div v-else class="content-empty">
      <span>暂无组织信息，请选择组织</span>
    </div>
    <!-- 修改组织信息弹框 -->
    <el-dialog 
      :title="`修改组织信息（${orgInfo_base ? orgInfo_base.name : ''}）`" 
      :visible.sync="dialogModifyVisible" 
      width='750px'>
      <el-form 
        :model="modifyform" 
        ref="modifyform"
        :label-width="formLabelWidth"
        v-loading="dialogLoading">
        <el-row :gutter='20'>
          <el-col :span="14">
            <el-form-item 
              label="组织名称" 
              prop="name" 
              :rules="[{ required: true, message: '请输入组织名称', trigger: 'blur' }]">
              <el-input v-model="modifyform.name" class="w300"></el-input>
            </el-form-item>
            <el-form-item 
              label="组织性质" 
              prop="nature"
              :rules="[{ required: true, message: '请选择组织性质', trigger: 'change' }]">
              <el-select class="w300" v-loading="selectLoading_nature" v-model="modifyform.nature" placeholder="请选择组织性质" @change="" value-key='' clearable filterable @clear="modifyform.nature = null" @focus="orgNatureArr.length==0 ? getSelectList('orgNature') :''">
                <el-option v-for="(item,index) in orgNatureArr"  v-if="index!=0" :label="item" :value="index" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item 
              label="组织类型" 
              prop="type"
              :rules="[{ required: true, message: '请选择组织类型', trigger: 'change' }]">
              <el-select class="w300" v-loading="selectLoading_type" v-model="modifyform.type" placeholder="请选择组织性质" @change="" value-key='' clearable filterable @clear="modifyform.type = null" @focus="orgTypeArr.length==0 ? getSelectList('orgType') : ''">
                <el-option v-for="(item,index) in orgTypeArr"  v-if="index!=0" :label="item" :value="index" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item 
              label="电话" 
              prop="phone"
              :rules="[{ required: true, message: '请输入电话号码', trigger: 'blur' }]">
              <el-input v-model.number="modifyform.phone" class="w300"></el-input>
            </el-form-item>
            <el-form-item 
              label="邮箱" 
              prop="mailbox"
              :rules="[{ required: true, message: '请输入邮箱', trigger: 'blur' },
              { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]">
              <el-input v-model="modifyform.mailbox" class="w300"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item 
              label="上传图片" 
              prop="photo"
              label-position="top"
              :rules="[{ required: false, message: '请选择要上传的图片', trigger: 'blur' }]">
              <el-upload
                class="avatar-uploader"
                :action="`${common.baseAuthPath}/file/upload`"
                :headers="myHeaders"
                :show-file-list="false"
                :limit="100"
                name="file"
                :data="myData"
                :on-success="handleSuccess"
                :on-error="handleError"
                :before-upload="beforeUpload">
                <el-image
                  v-if="modifyform.photo"
                  class="avatar"
                  :src="modifyform.photo"
                  fit="cover">
                </el-image>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item 
          label="地址" 
          prop="address"
          :rules="[{ required: true, message: '请输入地址', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' },]">
          <el-input type="textarea" v-model="modifyform.address" rows="3"></el-input>
        </el-form-item>
        <el-form-item 
          label="简介" 
          prop="description"
          :rules="[{ required: false, message: '请输入描述内容', trigger: 'blur' },
          { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' },]">
          <el-input type="textarea" v-model="modifyform.description" rows="5"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogModifyVisible = false">取 消</el-button>
        <el-button @click="$refs['modifyform'].resetFields();">重 置</el-button>
        <el-button type="primary" @click="submitModifyForm('modifyform')">保 存</el-button>
      </div>
    </el-dialog>
    
    <!-- 添加班子成员、添加组织公示信息弹框 -->
    <el-dialog 
      :title="dialogType === 1 ? '添加班子成员':'添加组织公示信息标题'" 
      :visible.sync="dialogFormVisible" 
      width='750px'>
      <el-form 
        :model="plusform" 
        ref="plusform"
        :label-width="formLabelWidth"
        v-loading="dialogLoading">
        <div v-if="dialogType===1">
          <el-form-item 
            label="用户" 
            prop="user_id"
            :rules="[{ required: true, message: '请选择用户', trigger: 'change' }]">
            <el-select class="w300" v-loading="selectLoading_user" v-model="plusform.user_id" placeholder="请选择用户" @change="" value-key='account' clearable filterable @clear="plusform.user_id = null" @focus="userArr.length==0 ? getSelectList_('user') : getSelectList_('user')">
              <el-option v-for="item in userArr" :label="item.account" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item 
            label="职位" 
            prop="position_id"
            :rules="[{ required: true, message: '请选择职位', trigger: 'change' }]">
            <el-select class="w300" v-loading="selectLoading_position" v-model="plusform.position_id" placeholder="请选择职位" @change="" value-key='name' clearable filterable @clear="plusform.position_id = null" @focus="positionTypeArr.length==0 ? getSelectList_('positionType') : getSelectList_('positionType')">
              <el-option v-for="item in positionTypeArr" :label="item.name" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-if="dialogType===2">
          <el-form-item 
            label="标题" 
            prop="title" 
            :rules="[{ required: true, message: '请输入标题', trigger: 'blur' }]">
            <el-input v-model="plusform.title" class="w300"></el-input>
          </el-form-item>
          <!-- <el-form-item 
            label="内容" 
            prop="info"
            :rules="[{ required: false, message: '请输入描述内容', trigger: 'blur' },
            { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' },]">
            <el-input type="textarea" v-model="plusform.info" rows="5"></el-input>
          </el-form-item> -->
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button @click="$refs['plusform'].resetFields();">重 置</el-button>
        <el-button type="primary" @click="submitPlusForm('plusform',dialogType)">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import qs    from "qs"; //需要传表单时, 引用此包
  //引入ueditor编辑器容器组件
  import VueUeditorWrap from 'vue-ueditor-wrap'
  export default {
    components: {VueUeditorWrap},
    props:['data'],
    data () {
      return {
        newOrgId:null,
        loading:false,
        dialogLoading:false,
        selectLoading_nature:false,
        selectLoading_type:false,
        selectLoading_position:false,
        selectLoading_user:false,
        myHeaders:{Authorization: 'Bearer ' + JSON.parse(sessionStorage.getItem('Access-Token'))},

        orgInfo_base:null,//组织信息-基本信息
        orgInfo_team:[],//组织信息-班子设置
        orgInfo_notice:[],//组织信息-班子设置
        //修改组织信息
        dialogModifyVisible: false,
        modifyform: {
          name: null,
          nature:null,
          type:null,
          phone: null,
          mailbox: null,
          address:null,
          description: null,
          photo:null,
        },
        orgNatureArr:[],
        orgTypeArr:[],
        formLabelWidth: '100px',
        //添加班子成员和添加组织公示信息
        dialogFormVisible:false,
        dialogType:null,//1为添加班子成员，2为添加组织公示信息
        plusform: {
          title: null,
          info: null,
          user_id:null,
          position_id:null,
        },
        positionTypeArr:[],
        userArr:[],

        //富文本编辑器
        isShowTips:false,
        activeTag:null,//被激活的tag
        ueditorform: {title: null,info: '',id:null,org_id:null},
        config: {
          toolbars: [
            [
              'fullscreen', 'source', '|', 
              'undo', 'redo', '|',
              'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|',
              'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
              'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
              'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
              'directionalityltr', 'directionalityrtl', 'indent', '|',
              'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 
              'touppercase', 'tolowercase', '|',
              'link', 'unlink', 'anchor', '|',
              'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
              'insertimage', 'emotion', 'scrawl', 'insertvideo', 'music', 'attachment', 'map', 'gmap', 'insertframe', 'insertcode', 'webapp', 'pagebreak', 'template', 'background', '|',
              'horizontal', 'date', 'time', 'spechars', 'snapscreen', 'wordimage', '|',
              'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
              'print', 'preview', 'searchreplace', 'drafts', 'help'
            ]
          ],
          initialFrameHeight: 500,//初始容器高度
          autoHeightEnabled:false,//编辑器不会自动被内容撑高
          initialFrameWidth:'100%',//初始容器宽度
          serverUrl: window.location.origin + "/api/home/sys/ueditor/exec",//上传文件接口
          UEDITOR_HOME_URL:'/ueditor/',
          maximumWords:1000,//限制内容长度
          enableAutoSave: false,//是否启用自动保存
          saveInterval: 1000,//自动保存间隔时间， 单位ms
        }
      };
    },
    computed:{
      orgId(){
        return this.data;
      },
      myData(){
        return {type:'orgImage',org_id:this.newOrgId};
      },
    },
    watch: {
      orgId(newValue, oldValue) {
    　　　　this.newOrgId = newValue;
    　　},
      'ueditorform.title'(newValue, oldValue) {
        this.isShowTips = false
    　　},
      'ueditorform.info'(newValue, oldValue) {
        this.isShowTips = false
    　　},
    },
    mounted() {
      // console.log("orgId："+this.orgId)
    },
    methods: {
      /**
       * UE 自定义单图片跨域上传
       * @param {[type]} editorId 编辑器id
       * @param {[type]} axios    跨域请求axios
       * @param {[type]} common   common.js
       * @param {[type]} msg      this.$message
       * @param {[type]} orgId    组织id
       */
      addCustomButtom (editorId,axios,common,msg,orgId) {
        window.UE.registerUI('custom_simpleupload', function (editor, uiName) {
          // 注册按钮执行时的 command 命令，使用命令默认就会带有回退操作
          editor.registerCommand(uiName, {
            execCommand: function () {
              
              let input = document.createElement('input')
              input.type = "file"
              input.style.display = 'none'
              document.body.appendChild(input)
              input.click()
              input.addEventListener('change',(e)=>{
                // 利用 axios 上传，上传成功之后销毁 DOM
                let fileObj = e.target.files[0];
                //自定义文件上传
                // FormData 对象
                var form = new FormData();
                // 文件对象
                form.append("type", 'orgImage');
                form.append("org_id", orgId);
                form.append("file", fileObj);
                axios.post(`${common.baseAuthPath}/file/upload`,form,{ headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => {
                  if(res.data.meta.code === 0){
                    msg.success("成功！！", 20);
                    let path = res.data.data[0].path;
                    let fileId = res.data.data[0].fileId;
                    editor.execCommand('inserthtml', '<img class="" id="'+fileId+'" src="' + path + '">');
                  }else{
                    msg.error(res.data.meta.message);
                  }
                  input.remove();//销毁 DOM
                }).catch((error) => {
                  msg.error(error);
                });
              })
            }
            
          })
       
          // 创建一个 button
          var btn = new window.UE.ui.Button({
            // 按钮的名字
            name: uiName,
            // 提示
            title: '未选择任何图片',
            // 需要添加的额外样式，可指定 icon 图标，图标路径参考常见问题 2
            cssRules: "background-position: -380px 0px!important;",
            // 点击时执行的命令
            onclick: function () {
              // 这里可以不用执行命令，做你自己的操作也可
              editor.execCommand(uiName)
            }
          })
       
          // 当点到编辑内容上时，按钮要做的状态反射
          editor.addListener('selectionchange', function () {
            var state = editor.queryCommandState(uiName)
            if (state === -1) {
              btn.setDisabled(true)
              btn.setChecked(false)
            } else {
              btn.setDisabled(false)
              btn.setChecked(state)
            }
          })
       
          // 因为你是添加 button，所以需要返回这个 button
          return btn
        }, 56 /* 指定添加到工具栏上的哪个位置，默认时追加到最后 */, editorId /* 指定这个 UI 是哪个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮 */)
      },
      /**
       * 获取UEditor 实例
       * @param  {[type]} editorInstance [description]
       * @return {[type]}                [description]
       */
      readyUE (editorInstance) {
        console.log(`编辑器实例${editorInstance.key}: `, editorInstance)
      },
      /**
       * 保存组织公示信息编辑的内容
       * @return {[type]} [description]
       */
      saveUE(formName){
        let obj = {title:'',info:''}
        JSON.parse(sessionStorage.getItem('orgInfo_notice')).forEach( (item) => {
          this.activeTag === item.id ? obj.info  = item.info : '';
        }) 
        this.ueditorform.info === obj.info ? this.isShowTips = true : this._save(formName);
      },
      _save(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let booleanValue = false;
            this.loading = true;
            let editform = {
              title:this.ueditorform.title,
              info:this.ueditorform.info,
              org_id:this.ueditorform.org_id,//组织id
              id:this.ueditorform.id,
            }
            this.axios.post(`${this.common.baseAuthPath}/notice/update`,editform).then((response) => {
              this.loading = false;
              this.newOrgId ? this.getNoticeList(this.newOrgId,booleanValue):this.$message.error('数据无法更新，请刷新页面...');//刷新
              this.$message({type: 'success',message: '成功!'});
            }).catch((error) => {
              this.loading = false;
              this.$message.error(error);  
            });
          } else {
            return false;
          }
        });
      },
      /**
       * 组织公示信息标题tag点击事件
       * @param  {[type]} data [description]
       * @return {[type]}      [description]
       */
      tagClick(data){
        //清空
        // this.ueditorform.title = null;
        // this.ueditorform.info = '';

        // this.loading = false;
        // this.axios.get(`${this.common.baseAuthPath}/notice/one`,{params:{id:data.id}}).then((response) => {
        //   this.loading = false;
        //   //回显组织公示信息
        //   this.activeTag = data.id;
        //   this.ueditorform = response.data.data;
        //   this.ueditorform.info = response.data.data.info ? response.data.data.info : '';//info不能为null
        // }).catch((error) => {
        //   this.loading = false;
        //   this.$message.error(error);  
        // }); 
        
        //回显组织公示信息
        this.activeTag = data.id;
        this.ueditorform = data;
        this.ueditorform.info = data.info ? data.info : '';//info不能为null
      },

      /**
       * 拖拽成功完成时触发的事件（班子设置）
       * @param  {[type]} draggingNode [description]
       * @param  {[type]} dropNode     [description]
       * @param  {[type]} dropType     [description]
       * @param  {[type]} ev           [description]
       * @return {[type]}              [description]
       */
      handleDrop(draggingNode, dropNode, dropType, ev) {
        console.log('拖拽成功完成时触发的事件: ', dropNode.label, dropType);
        //拖拽成功后，给班子设置重新排序
        var teamArr =this.orgInfo_team;
        for(var i = 0 ; i<teamArr.length ; i++ ){
          teamArr[i].order = i+1;
        }
        this.dragSuccessResponse(teamArr);
      },
      /**
       * 拖拽成功的请求（班子设置）
       * @param  {[type]} teamArr 重新排序的班子设置
       * @return {[type]}         [description]
       */
      dragSuccessResponse(teamArr){
        this.loading = false;
        this.axios.post(`${this.common.baseAuthPath}/leader/order`,teamArr).then((response) => {
          this.loading = false;
          this.newOrgId ? this.getTeamSetList(this.newOrgId):this.$message.error('数据无法更新，请刷新页面...');//刷新
          this.$message({type: 'success',message: '成功!'});
        }).catch((error) => {
          this.loading = false;
          this.$message.error(error);  
        });
      },
      /**
       * 拖拽时判定目标节点能否被放置（班子设置）
       * @param  {[type]} draggingNode 正在被放置的节点
       * @param  {[type]} dropNode     放置的节点
       * @param  {[type]} type         type参数有三种情况：'prev'、'inner' 和 'next'，分别表示放置在目标节点前、插入至目标节点和放置在目标节点后
       * @return {[type]}              [description]
       */
      allowDrop(draggingNode, dropNode, type) {
        if (dropNode.data.userName) {
          return type !== 'inner';//表示不能 插入至目标节点
        } else {
          return true;//表示能 放置在目标节点前和放置在目标节点后
        }
      },
      /**
       * 判断节点能否被拖拽（班子设置）
       * @param  {[type]} draggingNode 正在被拖拽的节点
       * @return {[type]}              [description]
       */
      allowDrag(draggingNode) {
        return true;
        // return draggingNode.data.userName.indexOf('0') === -1;//表示username的值为0的节点，不能被拖拽
      },
      /**
       * 拖拽成功完成时触发的事件（组织公示信息标题）
       * @param  {[type]} draggingNode [description]
       * @param  {[type]} dropNode     [description]
       * @param  {[type]} dropType     [description]
       * @param  {[type]} ev           [description]
       * @return {[type]}              [description]
       */
      handleDrop_(draggingNode, dropNode, dropType, ev) {
        console.log('拖拽成功完成时触发的事件: ', dropNode.label, dropType);
        //拖拽成功后，给班子设置重新排序
        var noticeArr =this.orgInfo_notice;
        for(var i = 0 ; i<noticeArr.length ; i++ ){
          noticeArr[i].order = i+1;
        }
        this.dragSuccessResponse_(noticeArr);
      },
      /**
       * 拖拽成功的请求（组织公示信息标题）
       * @param  {[type]} noticeArr 重新排序的组织公示信息标题
       * @return {[type]}         [description]
       */
      dragSuccessResponse_(noticeArr){
        let booleanValue = false;
        this.loading = false;
        this.axios.post(`${this.common.baseAuthPath}/notice/order`,noticeArr).then((response) => {
          this.loading = false;
          this.newOrgId ? this.getNoticeList(this.newOrgId,booleanValue):this.$message.error('数据无法更新，请刷新页面...');//刷新
          this.$message({type: 'success',message: '成功!'});
        }).catch((error) => {
          this.loading = false;
          this.$message.error(error);  
        });
      },
      /**
       * 拖拽时判定目标节点能否被放置（组织公示信息标题）
       * @param  {[type]} draggingNode 正在被放置的节点
       * @param  {[type]} dropNode     放置的节点
       * @param  {[type]} type         type参数有三种情况：'prev'、'inner' 和 'next'，分别表示放置在目标节点前、插入至目标节点和放置在目标节点后
       * @return {[type]}              [description]
       */
      allowDrop_(draggingNode, dropNode, type) {
        if (dropNode.data.title) {
          return type !== 'inner';//表示不能 插入至目标节点
        } else {
          return true;//表示能 放置在目标节点前和放置在目标节点后
        }
      },
      /**
       * 判断节点能否被拖拽（组织公示信息标题）
       * @param  {[type]} draggingNode 正在被拖拽的节点
       * @return {[type]}              [description]
       */
      allowDrag_(draggingNode) {
        return true;
        // return draggingNode.data.title.indexOf('0') === -1;//表示title的值为0的节点，不能被拖拽
      },

      /**
       * 文件上传成功时的钩子
       * @param  {[type]} res      [description]
       * @param  {[type]} file     [description]
       * @param  {[type]} fileList [description]
       * @return {[type]}          [description]
       */
      handleSuccess(res,file,fileList) {
        if(res.meta.code === 0){
          this.$message({type: 'success',message: '上传成功!'});
          this.modifyform.photo = res.data[0].path;
        }else{
          this.$message.error(res.meta.message);
        }
      },
      /**
       * 文件上传失败时的钩子
       * @param  {[type]} err      [description]
       * @param  {[type]} file     [description]
       * @param  {[type]} fileList [description]
       * @return {[type]}          [description]
       */
      handleError(err, file, fileList){
        this.$message.error('上传失败!!');
      },
      /**
       * 限制用户上传的图片格式和大小
       * @param  {[type]} file [description]
       * @return {[type]}      [description]
       */
      beforeUpload(file) {
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
       * 组织信息-基本信息 detail查询 GET
       * @param  {[type]} data 组织id
       * @return {[type]}      [description]
       */
      getOrgDetail(id){  
        this.loading = true;
        this.axios.get(`${this.common.baseAuthPath}/orgs/one`,this._detailParams(id)).then((response) => {
          this.loading = false;
          this.orgInfo_base = response.data.data;//组织信息-基本信息
        }).catch((error) => {
          this.loading = false;
          this.orgInfo_base = null;
          this.$message.error(error);  
        });
      },
      _detailParams(id){
        return{
          params:{
            id:id,
          }
        }
      },
      /**
       * 组织信息-班子设置 list查询 POST
       * @param  {[type]} data 组织id
       * @return {[type]}      [description]
       */
      getTeamSetList(id){  
        this.loading = true;
        this.axios.post(`${this.common.baseAuthPath}/leader/list/item`,this._infoListParams(id)).then((response) => {
          this.loading = false;
          this.orgInfo_team = response.data.data;//组织信息-班子设置
        }).catch((error) => {
          this.loading = false;
          this.orgInfo_team = [];
          this.$message.error(error);  
        });
      },
      _infoListParams(id){
        return{
          orgId:id,
        }
      },
      /**
       * 组织信息-公示信息标题 list查询 POST
       * @param  {[type]} data 组织id
       * @param  {[booleanValue]} booleanValue false/true/'false'
       * @return {[type]}      [description]
       */
      getNoticeList(id,booleanValue){  
        this.loading = true;
        this.axios.post(`${this.common.baseAuthPath}/notice/list`,this._infoListParams(id)).then((response) => {
          this.loading = false;
          this.orgInfo_notice = response.data.data;//组织信息-公示信息标题
          sessionStorage.setItem("orgInfo_notice",JSON.stringify(response.data.data));
          if(booleanValue === true){
            if(this.orgInfo_notice.length>0){
              // alert('归一');
              this.activeTag = this.orgInfo_notice[0].id;
              this.ueditorform = this.orgInfo_notice[0];
              this.ueditorform.info = this.orgInfo_notice[0].info ? this.orgInfo_notice[0].info : '';//info不能为null
            }else{
              // alert('清空');
              this.activeTag = null;
              this.ueditorform =  {title: null,info: '',id:null,org_id:null};
            }
          }else if(booleanValue === 'false'){
            // alert('清空123');
            this.activeTag = null;
            this.ueditorform =  {title: null,info: '',id:null,org_id:null};
          }
        }).catch((error) => {
          this.loading = false;
          this.orgInfo_notice = [];
          this.$message.error(error);  
        });
      },
      /**
       * 回显组织信息
       * @return {[type]} [description]
       */
      getInfo(){
        this.dialogLoading = true;
        this.axios.get(`${this.common.baseAuthPath}/orgs/one`,{params:{id:this.newOrgId}}).then((response) => {
          this.dialogLoading = false;
          this.modifyform = response.data.data;//回显组织信息
        }).catch((error) => {
          this.dialogLoading = false;
          this.$message.error(error);  
        });
      },
      /**
       * 组织性质、组织类别的list查询 GET
       * @param  {[type]} type   orgNature组织性质，orgType组织类别
       * @return {[type]}        [description]
       */
      getSelectList(type){
        type === 'orgNature' ? this.selectLoading_nature = true : this.selectLoading_type = true;
        this.axios.get(type === 'orgNature' ? `${this.common.baseAuthPath}/orgs/nature` : `${this.common.baseAuthPath}/orgs/type`).then((response) => {
          type === 'orgNature' ? this.selectLoading_nature = false : this.selectLoading_type = false;
          if(type === 'orgNature'){
            let obj = response.data.data;
            let arr = ['未找到'];
            for (let i in obj) {arr.push(obj[i]);}
            this.orgNatureArr=arr;
          }else{
            let obj = response.data.data;
            let arr = ['未找到'];
            for (let i in obj) {arr.push(obj[i]);}
            this.orgTypeArr=arr;
          }
        }).catch((error) => {
          type === 'orgNature' ? this.selectLoading_nature = false : this.selectLoading_type = false;
          this.$message.error(error);  
        });
      },
      /**
       * 用户、职位的list查询 POST
       * @param  {[type]} type   user用户列表，positionType职位
       * @return {[type]}        [description]
       */
      getSelectList_(type){
        this.newOrgId ? this._responseData(type) : this.$message.error('没有选择组织或选择的组织无效，请重新选择...');
      },
      _responseData(type){
        type === 'user' ? this.selectLoading_user = true : this.selectLoading_position = true;
        this.axios.post(type==='user' ? `${this.common.baseAuthPath}/user/list` : `${this.common.baseAuthPath}/position/list`,type==='user' ? {orgId:this.newOrgId} : {org_id:this.newOrgId}).then((response) => {
          type === 'user' ? this.selectLoading_user = false : this.selectLoading_position = false;
          type === 'user' ? this.userArr=response.data.data.rows : this.positionTypeArr=response.data.data.rows;
        }).catch((error) => {
          type === 'user' ? this.selectLoading_user = false : this.selectLoading_position = false;
          this.$message.error(error);  
        });
      },

      /**
       * 修改组织信息
       * @return {[type]} [description]
       */
      modify(){
        this.newOrgId ?　this.getInfo()　:  this.$message.error('没有选择组织或选择的组织无效，请重新选择...');
        this.$refs['modifyform']?this.$refs['modifyform'].resetFields():'';
        this.dialogModifyVisible = true;
      },
      /**
       * 提交修改组织信息的表单
       * @param  {[type]} formName       [表单]
       * @return {[type]}                [description]
       */
      submitModifyForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.newOrgId ? this.modifyOrgInfo() : this.$message.error('没有选择组织或选择的组织无效，请重新选择...');
          } else {
            return false;
          }
        });
      },
      /**
       * 添加按钮
       * @param {[type]} type 1为添加班子成员；2添加组织公示信息
       * @param {[type]} data 数据
       */
      addPlus(type,data){
        this.dialogType = type;
        this.$refs['plusform']?this.$refs['plusform'].resetFields():'';
        this.dialogFormVisible = true;
      },
      /**
       * 提交添加班子设置和组织公示信息标题的表单
       * @param  {[type]} formName       [表单]
       * @return {[type]}                [description]
       */
      submitPlusForm(formName,type) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(type===1){
              this.newOrgId ? this.addTeamSet() : this.$message.error('没有选择组织或选择的组织无效，请重新选择...'); ;
            }else if(type===2){
              this.newOrgId ? this.addNoticeTitle() : this.$message.error('没有选择组织或选择的组织无效，请重新选择...'); ;
            }
            
          } else {
            return false;
          }
        });
      },
      /**
       * 关闭 Tag 时触发的删除事件
       * @param  {[type]} tag  [description]
       * @param  {[type]} type 1表示班子设置、2表示组织公示标题
       * @return {[type]}      [description]
       */
      handleClose(tag,type) {
        this.$confirm('是否执行该删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          type === 1 ? this.delTeamSet(tag) : this.delNoticeTitle(tag)
        }).catch(() => {});    
      },

      /**
       * 组织信息form修改 POST
       * @return {[type]} [description]
       */
      modifyOrgInfo(){
        this.dialogLoading = false;
        let editform = {
          name: this.modifyform.name,
          nature:this.modifyform.nature,
          type:this.modifyform.type,
          phone: this.modifyform.phone,
          mailbox: this.modifyform.mailbox,
          address:this.modifyform.address,
          description: this.modifyform.description,
          photo:this.modifyform.photo,
          id:this.newOrgId,//编辑的id
        }
        this.axios.post(`${this.common.baseAuthPath}/orgs/update`,editform).then((response) => {
          this.dialogLoading = false;
          this.dialogModifyVisible = false;
          this.newOrgId ? this.getOrgDetail(this.newOrgId):this.$message.error('数据无法更新，请刷新页面...');//刷新
          this.$message({type: 'success',message: '成功!'});
        }).catch((error) => {
          this.dialogLoading = false;
          this.$message.error(error);  
        });
      },
      /**
       * 班子成员form添加 POST
       * @return {[type]} [description]
       */
      addTeamSet(){
        this.dialogLoading = false;
        let plusform = {
          user_id:this.plusform.user_id,
          position_id:this.plusform.position_id,
        }
        this.axios.post(`${this.common.baseAuthPath}/leader/add`,plusform).then((response) => {
          this.dialogLoading = false;
          this.dialogFormVisible = false;
          this.newOrgId ? this.getTeamSetList(this.newOrgId):this.$message.error('数据无法更新，请刷新页面...');//刷新
          this.$message({type: 'success',message: '成功!'});
        }).catch((error) => {
          this.dialogLoading = false;
          this.$message.error(error);  
        });
      },
      /**
       * 组织公示信息form添加 POST
       * @return {[type]} [description]
       */
      addNoticeTitle(){
        let booleanValue = true;
        this.dialogLoading = false;
        let order = this.orgInfo_notice.length+1;
        let plusform = {
          title:this.plusform.title,
          // info:this.plusform.info,
          org_id:this.newOrgId,//组织id
          order:order,
        }
        this.axios.post(`${this.common.baseAuthPath}/notice/new`,plusform).then((response) => {
          if(this.orgInfo_notice.length === 0){//新增前有0个标题
            booleanValue = true;
          }else{//新增前有一个或一个以上的标题
            booleanValue = false;
          }
          this.dialogLoading = false;
          this.dialogFormVisible = false;
          this.newOrgId ? this.getNoticeList(this.newOrgId,booleanValue):this.$message.error('数据无法更新，请刷新页面...');//刷新
          this.$message({type: 'success',message: '成功!'});
        }).catch((error) => {
          this.dialogLoading = false;
          this.$message.error(error);  
        });
      },
      /**
       * 班子设置单个删除 POST
       * @param  {[type]} data [description]
       * @return {[type]}      [description]
       */
      delTeamSet(data){
        this.axios.post(`${this.common.baseAuthPath}/leader/delete`,{id:data.id}).then((response) => {
          this.newOrgId ? this.getTeamSetList(this.newOrgId):this.$message.error('数据无法更新，请刷新页面...');//刷新
          this.$message({type: 'success',message: '删除成功!'});
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      /**
       * 组织公示标题单个删除 DELETE
       * @param  {[type]} data [description]
       * @return {[type]}      [description]
       * 1 true；2 删active true、删非active false；3 删active true、删非active false
       * let nextTab = tabs[index + 1] || tabs[index - 1];
       */
      delNoticeTitle(data){
        let booleanValue = true;
        this.axios.delete(`${this.common.baseAuthPath}/notice/delete`,{params:{id:data.id}}).then((response) => {
          if(this.orgInfo_notice.length === 1){//删除前有一个标题
            booleanValue = 'false';
          }else{//删除前有两个或两个以上的标题
            if(data.id === this.activeTag){//删除被激活的tag
              booleanValue = true;
            }else{//删除未被激活的tag
              booleanValue = false;
            }
          }
          this.newOrgId ? this.getNoticeList(this.newOrgId,booleanValue):this.$message.error('数据无法更新，请刷新页面...');//刷新
          this.$message({type: 'success',message: '删除成功!'});
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
     
    }
  }
</script>
<style lang="less" scoped>
   .org-info{
      .base-info{

      }
      .team-set{
        max-height:500px;
        overflow:auto;
      }
      .public-info{

      }
   }
</style>