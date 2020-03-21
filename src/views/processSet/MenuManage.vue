/*!
 * 菜单管理
 * @author chuanlin.Xiao
 * @date   2019-10-23T10:19:57+0800
 * @version v1.0.0 (2019/10/23)
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
        <div class="left-nav" >
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
            <i class="el-icon-circle-plus fr mart5" title="添加菜单" @click="addOrEditMenu(1,'data')"></i>
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
              <draggable v-model="menuData" @end="datadragEnd" v-bind="{animation:150}">
              <transition-group>
              <div v-for="(item,index) in menuData" :key="item.id">
                <el-submenu :index="item.id+''" v-if="item.optionInfoVos.length>0">
                  <template slot="title">
                    <div @mouseover=" tempAtId = item.id " @mouseout="tempAtId = null">
                      <i class="el-icon-location"></i>
                      <span>{{item.group_name}}</span>
                      <i class="el-icon-edit fr padr15 padt17" v-show="tempAtId===item.id" @click.stop="addOrEditMenu(2,item)" title="编辑菜单"></i>
                      <i class="el-icon-circle-plus-outline fr padr20 padt17" @click.stop="activeParentNav = item.id;addOrEditMenuItem(1,'data')" title="添加菜单项"></i>
                    </div>
                  </template>
                  <div v-for="(itemChild,indexChild) in item.optionInfoVos">
                    <el-menu-item  :index="itemChild.id+'-child'">{{itemChild.option_name}}</el-menu-item>
                  </div>
                </el-submenu>
                <el-menu-item :index="item.id+''"  v-else>
                  <template slot="title">
                    <div @mouseover=" tempAtId = item.id " @mouseout="tempAtId = null">
                      <i class="el-icon-location"></i>
                      <span>{{item.group_name}}</span>
                      <i class="el-icon-edit fr padr15 padt17" v-show="tempAtId===item.id" @click.stop="addOrEditMenu(2,item)" title="编辑菜单"></i>
                      <i class="el-icon-circle-plus-outline fr padr20 padt17" @click.stop="activeParentNav = item.id;addOrEditMenuItem(1,'data')" title="添加菜单项"></i>
                    </div>
                  </template>
                </el-menu-item>
              </div>
              </transition-group>
              </draggable>
            </el-menu>
            <div class="no-data" v-else>
              暂无数据
            </div>
          </div>
        </div>
      </el-col>
      <!-- 内容区域 -->
      <el-col :span="18"  v-loading="contentLoading">
        <div class="right-content"  v-if="isMenuItem">
          <span class="page-title">{{common.showTitle(title).subName}}</span>
          <div class="content-area">
            <!-- 基本信息 -->
            <el-card class="box-card" shadow="hover">
              <div slot="header">
                <span>基本信息</span>
              </div>
              <el-form label-width="100px" class="show-form" v-if="menuItemDetailData">
                <el-row :gutter='20'>
                  <el-col :span="12">
                    <el-form-item label="名称：">{{menuItemDetailData.option_name}}</el-form-item>
                    <el-form-item label="描述：">{{menuItemDetailData.description}}</el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="状态：">
                      <span v-if="menuItemDetailData.cur_status===1" class="text-primary">正常</span>
                      <span v-if="menuItemDetailData.cur_status===20" class="text-danger">禁用</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <div class="no-data" v-else>
                暂无数据
              </div>
              <div class="operation-area" v-if="menuItemDetailData">
                <el-button type="primary" size="small fr" @click="addOrEditMenuItem(2,menuItemDetailData)" icon="el-icon-edit"></el-button>
              </div>
            </el-card>
            <!-- 表单配置 -->
            <el-card class="box-card mart10" shadow="hover">
              <div slot="header">
                <span>表单配置</span>
              </div>
              <el-form label-width="100px" class="show-form" v-if="formDetailData.total>0">
                <div v-for="(item,index) in formDetailData.rows" :key="index">
                  <el-card shadow="never">
                    <el-form-item label="配置信息：">{{item.wf_config}}</el-form-item>
                    <el-form-item label="表单状态：">
                      <span v-if="item.cur_status===1" class="text-primary">正常</span>
                      <span v-if="item.cur_status===20" class="text-danger">禁用</span>
                    </el-form-item>
                    <div class="operation-area">
                      <el-button type="primary" size="small fr" @click="addOrEditForm(2,item)" icon="el-icon-edit"></el-button>
                    </div>
                  </el-card>          
                </div>
              </el-form>
              <div class="no-data" v-else>
                暂无数据
              </div>
              <div class="operation-area">
                <el-button type="success" size="small fl" @click="addOrEditForm(1,'data')" icon="el-icon-circle-plus-outline"></el-button>
                <el-pagination
                  class="fr page-area"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="elementPageData.pageNum"
                  :page-sizes="elementPageData.defaultData.pageSizes"
                  :page-size="elementPageData.defaultData.pageSizeDefault"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="formDetailData.total">
                </el-pagination>
              </div>
            </el-card>
          </div>
          <div class="operation-area">
            <el-button type="success" size="small" @click="addOrEditMenuItem(1,'data')" icon="el-icon-circle-plus-outline">添加菜单项</el-button>
          </div>
        </div>
        <div class="no-data" v-else>
          该菜单下没有菜单项！请添加！
          <div class="operation-area">
            <el-button type="success" size="small marl10" @click="addOrEditMenuItem(1,'data')" icon="el-icon-circle-plus-outline">添加菜单项</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="bottom-mark">备注：...............</div>

    <!-- 添加或编辑菜单 -->
    <el-dialog 
      :title="dialogFormType === 1 ? '添加菜单' : '编辑菜单' " 
      :visible.sync="dialogFormVisible" 
      width='750px'>
      <el-form 
        :model="form" 
        ref="form"
        :label-width="formLabelWidth"
        v-loading="dialogLoading">
        <el-form-item 
          label="名称" 
          prop="group_name" 
          :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]">
          <el-input v-model="form.group_name" class="w300"></el-input>
        </el-form-item>
        <el-form-item 
          v-if="dialogFormType === 2"
          label="状态" 
          prop="cur_status" 
          :rules="[{ required: true, message: '请选择状态', trigger: 'change' }]">
          <el-switch
            v-model="form.cur_status"
            active-text="正常"
            inactive-text="禁用">
          </el-switch>
        </el-form-item>
        <el-form-item 
          label="描述" 
          prop="group_info"
          :rules="[{ required: true, message: '请输入描述内容', trigger: 'blur' },
          { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' },]">
          <el-input type="textarea" v-model="form.group_info" rows="5"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button @click="$refs['form'].resetFields();">重 置</el-button>
        <el-button type="primary" @click="submitMenuForm('form',dialogFormType)">保 存</el-button>
      </div>
    </el-dialog>

    <!-- 添加或编辑菜单项 -->
    <el-dialog 
      :title="dialogFormTypes === 1 ? '添加菜单项' : '编辑菜单项' " 
      :visible.sync="dialogFormVisibles" 
      width='750px'>
      <el-form 
        :model="forms" 
        ref="forms"
        :label-width="formLabelWidth"
        v-loading="dialogLoading">
        <el-form-item 
          label="名称" 
          prop="option_name" 
          :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]">
          <el-input v-model="forms.option_name" class="w300"></el-input>
        </el-form-item>
        <el-form-item 
          v-if="dialogFormTypes === 2"
          label="状态" 
          prop="cur_status" 
          :rules="[{ required: true, message: '请选择状态', trigger: 'change' }]">
          <el-switch
            v-model="forms.cur_status"
            active-text="正常"
            inactive-text="禁用">
          </el-switch>
        </el-form-item>
        <el-form-item 
          label="描述" 
          prop="description"
          :rules="[{ required: true, message: '请输入描述内容', trigger: 'blur' },
          { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' },]">
          <el-input type="textarea" v-model="forms.description" rows="5"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibles = false">取 消</el-button>
        <el-button @click="$refs['forms'].resetFields();">重 置</el-button>
        <el-button type="primary" @click="submitMenuItemForm('forms',dialogFormTypes)">保 存</el-button>
      </div>
    </el-dialog>

    <!-- 添加或编辑表单配置 -->
    <el-dialog 
      :title="dialogFormTypess === 1 ? '添加表单配置' : '编辑表单配置' " 
      :visible.sync="dialogFormVisibless" 
      width='750px'>
      <el-form 
        :model="formss" 
        ref="formss"
        :label-width="formLabelWidth"
        v-loading="dialogLoading">
        <el-form-item 
          label="配置" 
          prop="wf_config"
          :rules="[{ required: true, message: '请输入描述内容', trigger: 'blur' },
          { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' },]">
          <el-input type="textarea" v-model="formss.wf_config" rows="5"></el-input>
        </el-form-item>
        <el-form-item 
          v-if="dialogFormTypess === 2"
          label="状态" 
          prop="cur_status" 
          :rules="[{ required: true, message: '请选择状态', trigger: 'change' }]">
          <el-switch
            v-model="formss.cur_status"
            active-text="正常"
            inactive-text="禁用">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibless = false">取 消</el-button>
        <el-button @click="$refs['formss'].resetFields();">重 置</el-button>
        <el-button type="primary" @click="submitForm('formss',dialogFormTypess)">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Sortable from "sortablejs";
  import draggable from 'vuedraggable'
  export default {
    components: {
      draggable,
    },
    data () {
      return {
        title:null,
        loading:false,
        contentLoading:false,
        dialogLoading:false,
        formLabelWidth: '100px',
        elementPageData: { // 分页需要的数据
          defaultData:  this.common.elementPagination,
          pageNum:      this.common.elementPagination.pageNumDefault,
          pageSize:     this.common.elementPagination.pageSizeDefault,
        },
        activeNav:'',// 被激活的菜单项 string类型
        openNav:[],// 默认被激活的菜单 数组类型，元素是string类型
        activeParentNav:null,// 被激活的菜单项所属菜单，即被激活的菜单项的父级id number类型
        isMenuItem:false,// 是否有菜单项
        searchInput:null,
        menuData:[],// 菜单数据
        menuDetailData:null,// 菜单详情数据
        menuItemDetailData:null,// 菜单项详情数据
        formDetailData:{total:0,rows:[]},// 表单配置信息数据
        formDetailItemData:null,// 表单单个配置详情
        tempAtId:null,// 浮动的编辑图标id

        // 添加或编辑菜单  
        dialogFormVisible: false,
        dialogFormType:1,// 1为添加；2为编辑
        form: {
          group_name: null,
          group_info: null,
          cur_status: true,
        },
        editId:null,
        
        // 添加或编辑菜单项
        dialogFormVisibles: false,
        dialogFormTypes:1,// 1为添加；2为编辑
        forms: {
          option_name: null,
          description: null,
          cur_status: true,
        },
        editIds:null,

        // 添加或编辑表单配置
        dialogFormVisibless: false,
        dialogFormTypess:1,// 1为添加；2为编辑
        formss: {
          wf_config: null,
          cur_status: true,
        },
        editIdss:null,
      };
    },
    created() {
     this.title = this.$route.name;
    },
    mounted() {
      this.queryMenu(false);
    },
    methods: {
      /**
       * 改变每页条数触发此事件
       * @author chuanlin.Xiao
       * @date   2019-10-24T16:29:58+0800
       * @param  {[type]}                 val [description]
       * @return {[type]}                     [description]
       */
      handleSizeChange(val) {
        this.elementPageData.pageSize = val;
        this.queryFormDetail(Number(this.activeNav.split('-child')[0]));
      },
      /**
       * 改变当前页码触发此事件
       * @author chuanlin.Xiao
       * @date   2019-10-24T16:30:06+0800
       * @param  {[type]}                 val [description]
       * @return {[type]}                     [description]
       */
      handleCurrentChange(val) {
        this.elementPageData.pageNum = val;
        this.queryFormDetail(Number(this.activeNav.split('-child')[0]));
      },
      /**
       * 选择菜单项
       * @author chuanlin.Xiao
       * @date   2019-10-23T15:54:19+0800
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
          this.queryFormDetail(Number(key.split('-child')[0]))
        }else{//无菜单项
          
        }
        
      },
      /**
       * 查询菜单
       * @author chuanlin.Xiao
       * @date   2019-10-23T16:38:15+0800
       * @param  {Boolean}                isRefesh 是否用于刷新
       * @return {[type]}                          [description]
       */
      queryMenu(isRefesh){ 
        this.loading = true; 
        this.axios.post(`${this.common.baseProcessPath}/menu/find_menu`).then((response) => {
          if(isRefesh){
            this.menuData = response.data.data;
            console.log(this.menuData)
          }else{
            if(response.data.data&&response.data.data.length>0){
              this.menuData = response.data.data;
              this.activeParentNav = response.data.data[0].id;
              this.openNav = [response.data.data[0].id+''];
              if(response.data.data[0].optionInfoVos.length>0){
                this.activeNav = response.data.data[0].optionInfoVos[0].id+'-child';
                this.isMenuItem = true;
                this.queryMenuItemDetail(response.data.data[0].optionInfoVos[0].id,true)
                this.queryFormDetail(response.data.data[0].optionInfoVos[0].id)
              }else{
                this.activeNav = ''; 
                this.isMenuItem = false;
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
       * 查询菜单详情 或回显详情
       * @author chuanlin.Xiao
       * @date   2019-10-23T16:44:20+0800
       * @param  {[type]}                 id [description]
       * @return {[type]}                    [description]
       */
      queryMenuDetail(id){ 
        this.dialogLoading = true; 
        this.axios.post(`${this.common.baseProcessPath}/menu/find_info/?id=${id}`).then((response) => {
          // this.menuDetailData = response.data.data; 
          this.form = response.data.data;// 回显信息
          this.form.cur_status = response.data.data.cur_status===1?true:false;
          this.dialogLoading = false;
        }).catch((error) => {
          this.dialogLoading = false;
          this.$message.error(error);  
        });
      },
      /**
       * 查询菜单项详情 或刷新详情、回显详情
       * @author chuanlin.Xiao
       * @date   2019-10-23T17:05:22+0800
       * @param  {[type]}                 id   [description]
       * @param  {[type]}                 init 为true时，查询详情或刷新；为false时，回显详情
       * @return {[type]}                      [description]
       */
      queryMenuItemDetail(id,init){ 
        this.contentLoading = true; 
        this.axios.post(`${this.common.baseProcessPath}/option/find_info?id=${id}`).then((response) => {
          if(init){
            this.menuItemDetailData = response.data.data; 
          }else{
            this.forms = response.data.data;
            this.forms.cur_status = response.data.data.cur_status===1?true:false; 
          }  
          this.contentLoading = false;
        }).catch((error) => {
          this.contentLoading = false;
          this.$message.error(error);  
        });
      },
      /**
       * 查询表单配置信息
       * @author chuanlin.Xiao
       * @date   2019-10-24T14:11:10+0800
       * @param  {[type]}                 id   表单项id
       * @return {[type]}                      [description]
       */
      queryFormDetail(id){ 
        this.contentLoading = true;
        this.axios.post(`${this.common.baseProcessPath}/field/find_by_option?id=${id}`,{pageSize:this.elementPageData.pageSize,pageNum:this.elementPageData.pageNum}).then((response) => {
          this.formDetailData = response.data.data;
          this.contentLoading = false;
        }).catch((error) => {
          this.contentLoading = false;
          this.$message.error(error);  
        });
      },
      /**
       * 查询单个表单配置信息
       * @author chuanlin.Xiao
       * @date   2019-10-24T16:20:06+0800
       * @param  {[type]}                 id [description]
       * @return {[type]}                    [description]
       */
      queryFormItemDetail(id){ 
        this.dialogLoading = true;
        this.axios.post(`${this.common.baseProcessPath}/field/find_info/?id=${id}`).then((response) => {
          // this.formDetailItemData = response.data.data; 
          this.formss = response.data.data;// 回显信息
          this.formss.cur_status = response.data.data.cur_status===1?true:false;  
          this.dialogLoading = false;
        }).catch((error) => {
          this.dialogLoading = false;
          this.$message.error(error);  
        });
      },
      /**
       * 添加或编辑菜单按钮的操作
       * @author chuanlin.Xiao
       * @date   2019-10-23T16:13:54+0800
       * @param  {[type]}                 type [description]
       * @param  {[type]}                 data [description]
       */
      addOrEditMenu(type,data){
        this.dialogFormType = type;
        this.$refs['form']?this.$refs['form'].resetFields():'';
        this.dialogFormVisible = true;
        type === 2 ? this.queryMenuDetail(data.id):'';
        type === 2 ? this.editId = data.id:'';
      },
      /**
       * 提交添加或编辑的菜单
       * @author chuanlin.Xiao
       * @date   2019-10-23T16:12:21+0800
       * @param  {[type]}                 formName       [description]
       * @param  {[type]}                 dialogFormType [description]
       * @return {[type]}                                [description]
       */
      submitMenuForm(formName,dialogFormType) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(dialogFormType===1){// 添加
              this.dialogLoading = false;
              let form = {
                group_name:this.form.group_name,
                group_info:this.form.group_info,
              }
              this.axios.post(`${this.common.baseProcessPath}/menu/create_menu`,form).then((response) => {
                this.queryMenu(true);//刷新
                this.$message({type: 'success',message: '成功!'});
                this.dialogFormVisible = false;
                this.dialogLoading = false;
              }).catch((error) => {
                this.dialogLoading = false;
                this.$message.error(error);  
              });
            }else {// 编辑
              this.dialogLoading = false;
              let form = {
                group_name:this.form.group_name,
                group_info:this.form.group_info,
                cur_status:this.form.cur_status?1:20,
                id:this.editId,
              }
              this.axios.post(`${this.common.baseProcessPath}/menu/edit_menu`,form).then((response) => {
                this.queryMenu(true);//刷新
                this.$message({type: 'success',message: '成功!'});
                this.dialogFormVisible = false;
                this.dialogLoading = false;
              }).catch((error) => {
                this.dialogLoading = false;
                this.$message.error(error);  
              });
            }
          } else {
            return false;
          }
        });
      },
      /**
       * 添加或编辑菜单项按钮的操作
       * @author chuanlin.Xiao
       * @date   2019-10-23T16:23:40+0800
       * @param  {[type]}                 type [description]
       * @param  {[type]}                 data [description]
       */
      addOrEditMenuItem(type,data){
        this.dialogFormTypes = type;
        this.$refs['forms']?this.$refs['forms'].resetFields():'';
        this.dialogFormVisibles = true;
        type === 2 ? this.queryMenuItemDetail(data.id,false):'';
        type === 2 ? this.editIds = data.id:'';
      },
      /**
       * 提交添加或编辑的菜单项
       * @author chuanlin.Xiao
       * @date   2019-10-23T16:27:39+0800
       * @param  {[type]}                 formName       [description]
       * @param  {[type]}                 dialogFormType [description]
       * @return {[type]}                                [description]
       */
      submitMenuItemForm(formName,dialogFormType) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(dialogFormType===1){// 添加
              this.dialogLoading = false;
              let form = {
                option_name:this.forms.option_name,
                description:this.forms.description,
                group_id:this.activeParentNav,
              }
              this.axios.post(`${this.common.baseProcessPath}/option/create_option`,form).then((response) => {
                this.queryMenu(true);//刷新
                this.$message({type: 'success',message: '成功!'});
                this.dialogFormVisibles = false;
                this.dialogLoading = false;
              }).catch((error) => {
                this.dialogLoading = false;
                this.$message.error(error);  
              });
            }else {// 编辑
              this.dialogLoading = false;
              let form = {
                option_name:this.forms.option_name,
                description:this.forms.description,
                group_id:this.activeParentNav,
                cur_status:this.forms.cur_status?1:20,
                id:this.editIds,
              }
              this.axios.post(`${this.common.baseProcessPath}/option/edit_option`,form).then((response) => {
                this.queryMenu(true);//刷新
                this.queryMenuItemDetail(this.editIds,true);//刷新
                this.$message({type: 'success',message: '成功!'});
                this.dialogFormVisibles = false;
                this.dialogLoading = false;
              }).catch((error) => {
                this.dialogLoading = false;
                this.$message.error(error);  
              });
            }
          } else {
            return false;
          }
        });
      },
      /**
       * 添加或编辑表单配置的操作
       * @author chuanlin.Xiao
       * @date   2019-10-24T15:00:05+0800
       * @param  {[type]}                 type [description]
       * @param  {[type]}                 data [description]
       */
      addOrEditForm(type,data){
        this.dialogFormTypess = type;
        this.$refs['formss']?this.$refs['formss'].resetFields():'';
        this.dialogFormVisibless = true;
        type === 2 ? this.queryFormItemDetail(data.id):'';
        type === 2 ? this.editIdss = data.id:'';
      },
      /**
       * 提交添加或编辑的表单配置
       * @author chuanlin.Xiao
       * @date   2019-10-24T14:59:56+0800
       * @param  {[type]}                 formName       [description]
       * @param  {[type]}                 dialogFormType [description]
       * @return {[type]}                                [description]
       */
      submitForm(formName,dialogFormType) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(dialogFormType===1){// 添加
              this.dialogLoading = false;
              let form = {
                wf_config:this.formss.wf_config,
                option_id:Number(this.activeNav.split('-child')[0]),
              }
              this.axios.post(`${this.common.baseProcessPath}/field/create_field`,form).then((response) => {
                this.queryFormDetail(Number(this.activeNav.split('-child')[0]));//刷新
                this.$message({type: 'success',message: '成功!'});
                this.dialogFormVisibless = false;
                this.dialogLoading = false;
              }).catch((error) => {
                this.dialogLoading = false;
                this.$message.error(error);  
              });
            }else {// 编辑
              this.dialogLoading = false;
              let form = {
                wf_config:this.formss.wf_config,
                option_id:Number(this.activeNav.split('-child')[0]),
                cur_status:this.formss.cur_status?1:20,
                id:this.editIdss,
              }
              this.axios.post(`${this.common.baseProcessPath}/field/edit_field`,form).then((response) => {
                this.queryFormDetail(Number(this.activeNav.split('-child')[0]));//刷新
                this.$message({type: 'success',message: '成功!'});
                this.dialogFormVisibless = false;
                this.dialogLoading = false;
              }).catch((error) => {
                this.dialogLoading = false;
                this.$message.error(error);  
              });
            }
          } else {
            return false;
          }
        });
      },
      /**
       * 拖拽菜单功能 Sortable
       * @author chuanlin.Xiao
       * @date   2019-10-24T09:54:31+0800
       * @return {[type]}                 [description]
       */
      /*dragInit() {
        // 一定要等页面先加载完后才调用，否则会报错
        this.$nextTick(() => {
          this._initSort()
        })
      },
      _initSort() {
        let el = document.querySelectorAll(".my-drag-menu")[0];// 获取拖拽的容器 .my-drag-menu 一定是menu上的class 如果是其他上的class名称，可能会无法拖拽
        console.log(el)
        this.sortable = Sortable.create(el, {
          group: "drag-menu",  //命名
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
              let menuArr = this.menuData;
              let targetObj = menuArr.splice(evt.oldIndex, 1)[0];
              menuArr.splice(evt.newIndex, 0, targetObj);
              menuArr.forEach( function(element, index) {// 更新group_index
                element.group_index = index;
              });
              console.log(menuArr);
              this._dragSortRequest(menuArr);
            })
          },
        })
      },*/
      _dragSortRequest(menuArr){ 
        this.loading = true; 
        this.axios.post(`${this.common.baseProcessPath}/menu/change_index`,{menuInfoVos:menuArr}).then((response) => {
          this.queryMenu(false);//刷新
          this.loading = false;
        }).catch((error) => {
          this.loading = false;
          this.$message.error(error);  
        });
      },
      /**
       * 菜单拖拽的结束事件 vuedraggable
       * @author chuanlin.Xiao
       * @date   2019-10-24T11:51:53+0800
       * @param  {[type]}                 e [description]
       * @return {[type]}                   [description]
       */
      datadragEnd(evt){
        console.log(evt)
        let menuArr = this.menuData;
        menuArr.forEach( function(element, index) {// 更新group_index
          element.group_index = index;
        });
        this._dragSortRequest(menuArr);
      },
     
    }
  }
</script>
<style lang="less" scoped>
   .manage{

   }
</style>