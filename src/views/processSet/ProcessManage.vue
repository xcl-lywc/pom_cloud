/*!
 * 流程管理
 * @author chuanlin.Xiao
 * @date   2019-10-25T16:41:06+0800
 * @version v1.0.0 (2019/10/25)
 * @company chuangxiangyuan
 */
<template>
  <div class="content-wrap-box manage" ref="contentWrap" v-loading="loading">
    <!-- 头部导航栏 -->
    <div class="top-nav">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item><h3 class="title">{{common.showTitle(title).mainName}}</h3></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 管理内容 -->
    <el-row :gutter="20" v-loading="loading">
      <!-- 左侧导航栏 -->
      <el-col :span="6">
        <div class="left-nav">
          <div class="top-area">
            <el-dropdown>
              <span class="el-dropdown-link">
                全部<i class="el-icon-menu"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>选项一</el-dropdown-item>
                <el-dropdown-item>选项二</el-dropdown-item>
                <el-dropdown-item divided>选项三</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-input
              class="marb10 mart10"
              placeholder="请输入内容"
              prefix-icon="el-icon-search"
              v-model="searchInput"
              size="small">
            </el-input>
          </div>
          <div class="bottom-area">
            <el-menu
              v-if="menuData.length>0"
              :default-active="activeNav"
              :default-openeds="openNav"
              mode="vertical"
              class="el-menu-vertical-demo my-drag-menu"
              @open=""
              @close=""
              @select="handleSelect"
              background-color="#eee"
              text-color="#000"
              active-text-color="#409EFF">
              <div v-for="(item,index) in menuData" :key="item.id">
                <el-submenu :index="item.id+''" v-if="item.optionInfoVos.length>0">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>{{item.group_name}}</span>
                  </template>
                  <div v-for="(itemChild,indexChild) in item.optionInfoVos">
                    <el-menu-item  :index="itemChild.id+'-child'">{{itemChild.option_name}}</el-menu-item>
                  </div>
                </el-submenu>
                <el-menu-item :index="item.id+''"  v-else>
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>{{item.group_name}}</span>
                  </template>
                </el-menu-item>
              </div>
            </el-menu>
            <div class="no-data" v-else>
              暂无数据
            </div>
          </div>
        </div>
      </el-col>
      <!-- 内容区域 -->
      <el-col :span="18"  v-loading="contentLoading">
        <div class="right-content" v-if="isMenuItem">
          <span class="page-title">{{common.showTitle(title).subName}}</span>
          <div class="content-area">
            <!-- 流程图展示 -->
            <el-card class="box-card" shadow="hover">
              <div slot="header">
                <span>流程图展示</span>
              </div>
              <div v-if="menuItemDetailData">
                <div v-if="menuItemDetailData.act_deploy_id" class="activiti-area no-data">
                  有流程图！可以修改！
                </div>
                <div v-else class="no-data">
                  没有流程图！要自己画！
                </div>
                <bpmn-model ref="activiti_bpmn" :config="bpmnConfig" @communicationEvent="communicationEvent"></bpmn-model>
              </div>
              <div class="no-data" v-else>
                暂无数据
              </div>
              <div class="operation-area" v-if="menuItemDetailData">
                <!-- <a ref="saveDiagram" href="javascript:">本地下载画板（Xml）</a> -->
                <!-- <a ref="saveSvg" href="javascript:">本地下载画板（SVG）</a> -->
                <el-button type="primary" size="small fl" icon="el-icon-edit" v-if="menuItemDetailData.act_deploy_id" @click="$refs.activiti_bpmn.initModel(bpmnConfig.defaultXmlStr)">重构</el-button>
                <el-button type="primary" size="small fr" icon="el-icon-edit" @click="createOrSaveProcess();" v-if="menuItemDetailData.act_deploy_id">保存</el-button>
                <el-button type="success" size="small fr" @click="createOrSaveProcess();" icon="el-icon-circle-plus-outline" v-else>创建</el-button>
                <el-button type="primary" size="small fr marr10" icon="el-icon-magic-stick" @click="deployModel(menuItemDetailData.act_deploy_id)" v-if="menuItemDetailData.act_deploy_id">部署</el-button>
                <el-button type="primary" size="small fr marr10" icon="el-icon-edit" v-if="bpmnConfig.type==='Viewer'&&menuItemDetailData.act_deploy_id" @click="changeStatus('Modeler')">编辑</el-button>
                <el-button type="primary" size="small fr marr10" icon="el-icon-view" v-if="bpmnConfig.type==='Modeler'&&menuItemDetailData.act_deploy_id" @click="changeStatus('Viewer')">预览</el-button>
              </div>
            </el-card>
          </div>
        </div>
        <div class="no-data" v-else>
          该菜单下没有菜单项！请前往菜单管理添加！
        </div>
      </el-col>
    </el-row>
    <div class="bottom-mark">备注：...............</div>

    <!-- 保存流程模版、创建模版 -->
    <el-dialog
      :title="dialogType===1?'创建模版':'保存模版'"
      :visible.sync="createDialogVisible"
      width="500px"
      center>
      <el-form
        :model="createform" 
        ref="createform"
        :label-width="formLabelWidth"
        v-loading="dialogLoading">
        <el-form-item 
          label="名称"
          prop="name"
          :rules="[{ required: true, message: '请输入名称', trigger: 'blur' },]">
          <el-input v-model="createform.name" class="w300" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item 
          label="Key"
          prop="key"
          :rules="[{ required: true, message: '请输入Key', trigger: 'blur' },]">
          <el-input v-model="createform.key" class="w300" placeholder="建议英文 + 数字，例如：test01"></el-input>
        </el-form-item>
        <el-form-item 
          label="类型"
          prop="category"
          :rules="[{ required: true, message: '请选择类型', trigger: 'change' },]">
          <el-select v-model="createform.category" placeholder="请选择类型" class="w300">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createDialogVisible = false" size="small">取 消</el-button>
        <el-button @click="$refs['createform'].resetFields();" size="small">重 置</el-button>
        <el-button type="primary" size="small" @click="submitCreate('createform')" v-if="dialogType===1">创 建</el-button>
        <el-button type="primary" size="small" @click="submitSave('createform')" v-if="dialogType===2">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 表单配置 -->
    <el-dialog
      title="表单配置"
      top="5vh"
      custom-class="peizhi"
      :visible.sync="isShowForm"
      width="1200px">
      <div v-loading="formLoading">
        <!-- CustomForm：组件库数据为后台获取 -->
        <CustomForm @saveCustomForm="handleSubmit" :dataDict="dataDict" :sortable_item="sortable_item" :component_list="component_list" :type="'component'"></CustomForm>
        
        <!-- CustomForm：组件库数据为默认的，component_list需传空数组 -->
        <!-- <CustomForm @saveCustomForm="handleSubmit" :dataDict="dataDict" :sortable_item="sortable_item" :type="'form'" :component_list="[]"></CustomForm> -->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowForm = false" size="small">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import BpmnModel from "custom-bpmn-activiti"
  export default {
    components:{
      BpmnModel
    },
    data () {
      return {
        title:null,
        loading:false,
        contentLoading:false,
        activeNav:'',// 被激活的菜单项 string类型
        openNav:[],// 默认被激活的菜单 数组类型，元素是string类型
        activeParentNav:null,// 被激活的菜单项所属菜单，即被激活的菜单项的父级id number类型
        searchInput:null,
        isMenuItem:false,// 是否有菜单项
        menuData:[],// 菜单数据
        menuItemDetailData:null,// 菜单项详情数据

        bpmnConfig:{
          width:'',//流程图容器宽度
          height:'600px',//流程图容器高度
          type:'Modeler',// 'Modeler'可编辑 'Viewer'预览
          defaultXmlStr:
          '<?xml version="1.0" encoding="UTF-8"?>\n'+
          '<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:activiti="http://activiti.org/bpmn" targetNamespace="http://www.activiti.org/processdef">\n'+
            '<process id=""/>\n'+
            '<bpmndi:BPMNDiagram>\n'+
              '<bpmndi:BPMNPlane bpmnElement=""/>\n'+
            '</bpmndi:BPMNDiagram>\n'+
          '</definitions>\n',// 默认的XML字符串
          showDownloadLink:false,//是否展示本地下载链接
        },
        // 自定义表单配置Dialog
        formLoading:false,
        isShowForm:false,
        element:null,
        getBusinessObject:null,
        formKey:null,
        dataDict: [],
        component_list:[],// 组件库数据（组件库，由后台查询得到）
        sortable_item: [], //最后需要保存的表单数据

        //保存流程模版、创建模版Dialog
        dialogLoading:false,
        createDialogVisible:false,
        dialogType:1,// 1创建模版，2保存模版
        dialogLoading:false,
        formLabelWidth: '100px',
        createform:{
          category:null,//string
          id: null,//string
          key: null,//string
          name: null,//string
          tenantId: null,//string
          xmlResource: null,//string
        },
        options: [
          {
            id: '1',
            name: '类型 A'
          }, {
            id: '2',
            name: '类型 B'
          }, {
            id: '3',
            name: '类型 C'
          }, {
            id: '4',
            name: '类型 D'
          }
        ],
      };
    },
    created() {
     this.title = this.$route.name;
    },
    mounted() {
      this.queryMenu(false);
      this.getFormDictJson();// 获取表单配置所需字典
    },
    methods: {

      /**
       * 选择菜单项
       * @author chuanlin.Xiao
       * @date   2019-10-25T16:57:57+0800
       * @param  {[type]}                 key     菜单项的id
       * @param  {[type]}                 keyPath [菜单的id，菜单项的id]
       * @return {[type]}                         [description]
       */
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
        this.activeNav = key;
        this.activeParentNav = Number(keyPath[0]);
        keyPath.length>1?this.isMenuItem = true : this.isMenuItem = false;
        if(keyPath.length>1){//有菜单项
          this.queryMenuItemDetail(Number(key.split('-child')[0]),true);
        }else{//无菜单项
          
        }
        
      },
      /**
       * 查询菜单
       * @author chuanlin.Xiao
       * @date   2019-10-25T16:54:53+0800
       * @param  {Boolean}                isRefesh 是否用于刷新
       * @return {[type]}                          [description]
       */
      queryMenu(isRefesh){ 
        this.loading = true; 
        this.axios.post(`${this.common.baseProcessPath}/menu/find_menu`).then((response) => {
          if(isRefesh){
            this.menuData = response.data.data;
          }else{
            if(response.data.data&&response.data.data.length>0){
              this.menuData = response.data.data;
              this.activeParentNav = response.data.data[0].id;
              this.openNav = [response.data.data[0].id+''];
              if(response.data.data[0].optionInfoVos.length>0){
                this.isMenuItem = true;
                this.activeNav = response.data.data[0].optionInfoVos[0].id+'-child';
                this.queryMenuItemDetail(response.data.data[0].optionInfoVos[0].id,true)
              }else{
                this.isMenuItem = false;
                this.activeNav = ''; 
             }
             // this.dragInit();
            }else{
              this.menuData = [];
              this.activeParentNav = null;
              this.openNav = [];
              this.message('您未配置菜单！请添加菜单!')
            } 
          }
          this.loading = false;
        }).catch((error) => {
          this.loading = false;
          this.$message.error(error);  
        });
      },
      /**
       * 查询菜单项详情 或刷新详情、回显详情
       * @author chuanlin.Xiao
       * @date   2019-10-25T16:57:31+0800
       * @param  {[type]}                 id   [description]
       * @param  {[type]}                 init 为true时，查询详情或刷新；为false时，回显详情
       * @return {[type]}                      [description]
       */
      queryMenuItemDetail(id,init){ 
        this.contentLoading = true; 
        this.axios.post(`${this.common.baseProcessPath}/option/find_info/?id=${id}`).then((response) => {
          if(init){
            this.menuItemDetailData = response.data.data;
            response.data.data.act_deploy_id?this.getModelXmlStr(response.data.data.act_deploy_id):this.$refs.activiti_bpmn.initModel(this.bpmnConfig.defaultXmlStr);
          }else{
            // this.forms = response.data.data;
            // this.forms.cur_status = response.data.data.cur_status===1?true:false; 
          }  
          this.contentLoading = false;
        }).catch((error) => {
          // this.$refs.activiti_bpmn.initModel(this.bpmnConfig.defaultXmlStr)
          this.contentLoading = false;
          this.$message.error(error);  
        });
      },
      
      /**
       * 子组件向父组件通讯事件（表单配置）
       */
      communicationEvent(element,getBusinessObject) {
        this.sortable_item = [];//清空表单配置右侧的数据
        this.isShowForm = true;
        console.log(element,getBusinessObject);

        this.element = element
        this.getBusinessObject = getBusinessObject;

        this.getComponentsData(Number(this.activeNav.split('-child')[0]));// 获取组件库
        let formKey = getBusinessObject(element).get('activiti:formKey');// 获取formKey
        formKey!=undefined?this.formKey=formKey:this.formKey=null;
        formKey!=undefined?this.getFormData(formKey):'';
      },  
      /**
       * 提交表单配置
       */
      handleSubmit(foromData) { 
        let params = {
          "uuid":     this.formKey, // formKey
          "value":    this.element.id,// taskId
          "formData": foromData
        } 
        let self = this;
        this.formLoading = false
        let config = {
          method: "post",
          url: `${this.common.basePath}/activiti/form/save`,
          data: params,
        }
        this.axios(config).then((response) => {
          this.$message.success(response.data.meta.message);
          // 设置formkey到bpmn里面
          var bo      = this.getBusinessObject(this.element),
              formKey = response.data.data || undefined;
          bo.set('activiti:formKey',formKey)
      
          // this.getFormData(formKey);// 刷新
          this.isShowForm = false;
          this.formLoading = false;
        }).catch((errorMsg) => {
          this.formLoading = false
          this.$message.error(errorMsg)
        })
      }, 
      /**
       * 获取字典（表单配置）
       */
      getFormDictJson(){
        let config = {
          method: "post",
          url: `${this.common.basePath}/user/dictionary/type/json`,
          data: {},
        }
        this.axios(config).then((response) => {
          this.dataDict = response.data.data.items;
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })
      },
      /**
       * 获取表单配置
       */
      getFormData(formKey){ 
        this.formLoading = true
        let config = {
          method: "get",
          url: `${this.common.basePath}/activiti/form/id`,
          params: {id:formKey},
        }
        this.axios(config).then((response) => {
          this.sortable_item = response.data.data ? response.data.data.formData : [];
          this.formLoading = false;
        }).catch((errorMsg) => {
          this.formLoading = false
          this.$message.error(errorMsg)
        })
      },
      /**
       * 获组件库取配置
       * Number(this.activeNav.split('-child')[0])
       */
      getComponentsData(menuId){ 
        this.formLoading = true; 
        this.axios.post(`${this.common.basePath}/activiti/field/find_by_option?id=${menuId}`).then((response) => {
          this.component_list = response.data.data ? JSON.parse(response.data.data.wf_config) : [];
          this.formLoading = false;
        }).catch((error) => {
          this.formLoading = false;
          this.$message.error(error);  
        });
      },

      /**
       * 从服务器获取xmlStr
       * @author chuanlin.Xiao
       * @date   2019-10-28T16:00:29+0800
       * @param  {[type]}                 id [description]
       * @return {[type]}                    [description]
       */
      getModelXmlStr(id){ 
        this.contentLoading = true;
        this.axios.get(`${this.common.baseProcessPath}/repository/resource`,{params:{id:id}}).then((response) => {
          let xmlStr = response.data.data?response.data.data:this.bpmnConfig.defaultXmlStr;
          console.log('服务器获取的xml',xmlStr);
          this.$refs.activiti_bpmn.initModel(xmlStr)
          this.contentLoading = false;
        }).catch((error) => {
          this.$message.error(error);
          this.contentLoading = false;
        });
      },
      /**
       * 创建或则保存流程图
       * @author chuanlin.Xiao
       * @date   2019-10-28T09:46:04+0800
       */
      createOrSaveProcess(){
        console.log('bpmnModeler',this.$refs.activiti_bpmn.bpmnModeler)
        if(this.$refs.activiti_bpmn.bpmnModeler._definitions.rootElements[0].id===''){
          this.$message({type:'warning',message:'您尚未填写流程编号!!!'});
          return;//中断后续操作
        }else{
          console.log(this.menuItemDetailData.act_deploy_id)
          this.menuItemDetailData.act_deploy_id?this.getModelDetail(this.menuItemDetailData.act_deploy_id):'';
          this.menuItemDetailData.act_deploy_id?this.dialogType=2:this.dialogType=1;
          this.$refs['createform'] ? this.$refs['createform'].resetFields():'';
          if(true){// 创建或保存流程图时，保持弹框的key和name与流程图的key、name相同
            this.createform.key = this.$refs.activiti_bpmn.bpmnModeler._definitions.rootElements[0].id
            this.createform.name = this.$refs.activiti_bpmn.bpmnModeler._definitions.rootElements[0].name
          }
          this.createDialogVisible=true;
        }
      },
      /**
       * 获取流程模版详情，回显信息
       * @author chuanlin.Xiao
       * @date   2019-10-28T14:15:48+0800
       * @param  {[type]}                 id [description]
       * @return {[type]}                    [description]
       */
      getModelDetail(id){
        this.dialogLoading = true;
        this.axios.get(`${this.common.baseProcessPath}/repository/model/detail`,{params:{id:id}}).then((response) => {
          this.createform.category = response.data.data.category;// 仅需回显种类信息
          this.dialogLoading = false;
        }).catch((error) => {
          this.$message.error(error);
          this.dialogLoading = false;
        });
      },
      /**
       * 实时返回xml
       */
      _returnXmlStr(){
        let xmlStr = '';
        this.$refs.activiti_bpmn.saveDiagram(function (err, xml) {
          xmlStr = xml
        })
        return xmlStr;
      }, 
      /**
       * 创建模版，先画流程图，然后保存信息
       * @author chuanlin.Xiao
       * @date   2019-10-28T14:53:03+0800
       * @return {[type]}                 [description]
       */
      createModel(){ 
        this.dialogLoading = false;

        console.log('创建流程xml',this._returnXmlStr())
        let xmlStr = this._returnXmlStr();

        //key
        let newKey = this.createform.key;
        let oldkey = this.$refs.activiti_bpmn.bpmnModeler._definitions.rootElements[0].id;
        if(newKey!=oldkey){// 流程编号发生改变
          xmlStr = xmlStr.replace('id="'+oldkey+'"', 'id="'+newKey+'"');
          xmlStr = xmlStr.replace('bpmnElement="'+oldkey+'"', 'bpmnElement="'+newKey+'"')
        }
        //name
        let newName = this.createform.name;
        let oldName = this.$refs.activiti_bpmn.bpmnModeler._definitions.rootElements[0].name;
        console.log(oldName)
        if(oldName!=undefined){// 弹出弹框之前定义了流程名称时
          if(newName!=oldName){// 流程名称发生改变
            xmlStr = xmlStr.replace('name="'+oldName+'"', 'name="'+newName+'"');
          }
        }else{// 弹出弹框之前未定义流程名称时
          xmlStr = xmlStr.replace('<process id="'+newKey+'" ', '<process id="'+newKey+'" name="'+newName+'"',);
        }
        
        let form = {
          category: this.createform.category,
          key: this.createform.key,
          name: this.createform.name,
          tenantId: this.createform.tenantId,
          xmlResource: xmlStr,
          optionId:this.menuItemDetailData.id,
        }
        this.axios.post(`${this.common.baseProcessPath}/repository/save`,form).then((response) => {
          this.queryMenu(true);// 刷新
          this.getModelXmlStr(this.menuItemDetailData.act_deploy_id);// 刷新
          this.createDialogVisible = false;
          this.$message({type:'success',message:'创建流程图成功！'})
          this.dialogLoading = false;
        }).catch((error) => {
          this.$message.error(error);
          this.dialogLoading = false;
        });
      },
      /**
       * 创建模版
       * @author chuanlin.Xiao
       * @date   2019-10-28T14:52:54+0800
       * @param  {[type]}                 formName [description]
       * @return {[type]}                          [description]
       */
      submitCreate(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.createModel();
          } else {
            return false;
          }
        });
      },
      /**
       * 保存模版，根据id保存该模版的xml至服务器
       * @author chuanlin.Xiao
       * @date   2019-10-28T15:32:26+0800
       * @return {[type]}                 [description]
       */
      saveModel(){ 
        this.dialogLoading = false;
        console.log('保存/修改流程xml',this._returnXmlStr())
        let xmlStr = this._returnXmlStr();

        //key
        let newKey = this.createform.key;
        let oldkey = this.$refs.activiti_bpmn.bpmnModeler._definitions.rootElements[0].id;
        if(newKey!=oldkey){// 流程编号发生改变
          xmlStr = xmlStr.replace('id="'+oldkey+'"', 'id="'+newKey+'"');
          xmlStr = xmlStr.replace('bpmnElement="'+oldkey+'"', 'bpmnElement="'+newKey+'"')
        }
        //name
        let newName = this.createform.name;
        let oldName = this.$refs.activiti_bpmn.bpmnModeler._definitions.rootElements[0].name;
        console.log(oldName)
        if(oldName!=undefined){// 弹出弹框之前定义了流程名称时
          if(newName!=oldName){// 流程名称发生改变
            xmlStr = xmlStr.replace('name="'+oldName+'"', 'name="'+newName+'"');
          }
        }else{// 弹出弹框之前未定义流程名称时
          xmlStr = xmlStr.replace('<process id="'+newKey+'" ', '<process id="'+newKey+'" name="'+newName+'"',);
        }

        let form = {
          id:this.menuItemDetailData.act_deploy_id,
          category: this.createform.category,
          key: this.createform.key,
          name: this.createform.name,
          tenantId: this.createform.tenantId,
          xmlResource: xmlStr,
          optionId:this.menuItemDetailData.id,
        }
        this.axios.post(`${this.common.baseProcessPath}/repository/save`,form).then((response) => {
          this.queryMenu(true);// 刷新
          this.getModelXmlStr(this.menuItemDetailData.act_deploy_id);// 刷新
          this.createDialogVisible = false;
          this.$message({type:'success',message:'保存流程图至服务器，成功！'})
          this.dialogLoading = false;
        }).catch((error) => {
          this.$message.error(error);
          this.dialogLoading = false;
        });
      },
      /**
       * 保存模版
       * @author chuanlin.Xiao
       * @date   2019-10-28T15:38:30+0800
       * @param  {[type]}                 formName [description]
       * @return {[type]}                          [description]
       */
      submitSave(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.saveModel();
          } else {
            return false;
          }
        });
      },
      /**
       * 部署模版
       * @param  {[type]} id [description]
       * @return {[type]}    [description]
       */
      deployModel(id){ 
        if(this.$refs.activiti_bpmn.bpmnModeler._definitions.rootElements[0].id===''){
          this.$message({type:'warning',message:'请填写流程编号!!!'});
          return;//中断后续操作
        }else{
          this.axios.post(`${this.common.baseProcessPath}/repository/deploy?id=${id}`).then((response) => {
            this.$message({type:'success',message:'部署成功！'})
          }).catch((error) => {
            this.$message.error(error);
          });
        }
      },
      /**
       * 切换流程图的编辑与预览状态
       * @author chuanlin.Xiao
       * @date   2019-10-28T15:57:09+0800
       * @param  {[type]}                 type [description]
       * @return {[type]}                      [description]
       */
      changeStatus(type){
        this.bpmnConfig.type=type;
        console.log('切换流程时的xml',this._returnXmlStr())
        let xmlStr = this._returnXmlStr();
        this.menuItemDetailData.act_deploy_id?this.getModelXmlStr(this.menuItemDetailData.act_deploy_id):this.$refs.activiti_bpmn.buildModel(type,xmlStr);
      }, 

     
    }
  }
</script>
<style lang="less">
   .manage{
    .el-dialog__wrapper{
      z-index:5000 !important;
      .el-dialog.peizhi{
        background: #f7f7f7;
      }
    }
   }
   .el-select-dropdown.el-popper{
    z-index:9999 !important;
   }
</style>