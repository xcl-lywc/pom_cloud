<!-- 列表 -->
<template>
  <div class="content-wrap-box list" ref="contentWrap">
    <!-- 头部导航栏 -->
    <div class="top-nav">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item><h3 class="title">{{common.showTitle(title).mainName}}</h3></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="middle-content">
      <div class="input-area">
        <el-form :inline="true" ref="formInline" :model="formInline" class="demo-form-inline" size="small">
          <el-form-item label="参数类型" prop="type">
            <el-select v-model="formInline.type" v-loading="selectLoading" placeholder="参数类型" @change="paramTypeId = $event;elementPageData.pageNum = 1;formInline.type = $event;getList();" value-key='name' clearable filterable @clear="formInline.type = null" @focus="paramType.length==0 ? getTypeList() : ''">
              <el-option v-for="item in paramType" :label="item.name" :value="item.id" :key="item.id">
                <!-- <div @mouseover=" tempAtId = item.id " @mouseout="tempAtId = null" class="fill-width overflow-hidden">
                  <span slot="title" class="fl">{{item.name}}</span>
                  <div class="fr" v-show="tempAtId == item.id">
                    <i class="el-icon-edit font-blue-color" @click.stop="$message('没有api')"></i>
                    <i class="el-icon-delete marl10 font-red-color" @click.stop="$message('没有api')"></i>
                  </div>
                </div> -->
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item>
            <el-button type="success" @click="$message('没有api')">添加</el-button>
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" @click="elementPageData.pageNum = 1;getList();">搜索</el-button>
            <el-button type="default" @click="$refs['formInline'].resetFields()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <span class="page-title">{{common.showTitle(title).subName}}</span>
      <el-table
        class="table-area"
        :data="tableData.rows"
        stripe
        border
        :max-height="common.tableMaxHeight"
        style="width: 100%"
        v-loading="loading"
        :row-key="getRowKeys"
        ref="multipleTable"
        @selection-change="handleSelectionChange">
        <!-- <el-table-column
          fixed
          type="selection"
          label=""
          :reserve-selection="true"
          width="55">
        </el-table-column> -->
        <el-table-column
          fixed
          type="index"
          label="序号"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          prop="code"
          label="编号"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop=""
          label="原编号"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="description"
          label="简介"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop=""
          label="状态"
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="200">
          <!-- scope.row -->
          <template slot-scope="scope">
            <el-button @click.native.prevent="addEdit(2,scope.row)" type="primary" size="mini">编辑</el-button>
            <el-button @click.native.prevent="del(scope.row)" type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="operation-area">
        <div class="fl btn-area">
          <el-button type="success" size="small" @click="addEdit(1,null)" :disabled="!formInline.type ? true:false">添加</el-button>
        </div>
        <el-pagination
          class="fr page-area"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="elementPageData.pageNum"
          :page-sizes="elementPageData.defaultData.pageSizes"
          :page-size="elementPageData.defaultData.pageSizeDefault"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total">
        </el-pagination>
      </div>    
    </div>
    <div class="bottom-function"></div>

    <!-- 添加或编辑弹框 -->
    <el-dialog 
      :title="dialogFormType === 1 ? `添加参数${paramTypeId ? idConversionText(paramTypeId) : ''}` : `编辑参数${paramTypeId ? idConversionText(paramTypeId) : ''}` " 
      :visible.sync="dialogAddFormVisible" 
      width='750px'>
      <el-form 
        :model="addform" 
        ref="addform"
        :label-width="formLabelWidth"
        v-loading="dialogLoading">
        <el-form-item 
          label="名称" 
          prop="name" 
          :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]">
          <el-input v-model="addform.name" class="w300"></el-input>
        </el-form-item>
        <el-form-item 
          label="编号" 
          prop="code"
          :rules="[{ required: true, message: '请输入编号', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z_-]{1,}$/, message: '编号不符合要求' },]">
          <el-input v-model="addform.code" class="w300"></el-input>
        </el-form-item>
        <el-form-item 
          label="描述" 
          prop="description"
          :rules="[{ required: false, message: '请输入描述内容', trigger: 'blur' },
          { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' },]">
          <el-input type="textarea" v-model="addform.description" rows="5"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddFormVisible = false">取 消</el-button>
        <el-button @click="$refs['addform'].resetFields();">重 置</el-button>
        <el-button type="primary" @click="submitForm('addform',dialogFormType)">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        title:null,
        loading:false,
        dialogLoading:false,
        selectLoading:false,
        tempAtId:null,//当前浮动选中的节点Id
        elementPageData: { //分页需要的数据
          defaultData:  this.common.elementPagination,
          pageNum:      this.common.elementPagination.pageNumDefault,
          pageSize:     this.common.elementPagination.pageSizeDefault,
        },
        tableData:{rows:[],total:0},//表格数据
        getRowKeys(row) {//列表 获取row的key值(vue + element-ui Table 的数据多选 多页选择数据回显，分页记录保存选中的数据)
          return row.id;
        },
        multipleSelection:null,
        formInline: {
          type: null,
        },
        paramType:[],
        paramTypeId:null,

        dialogAddFormVisible: false,
        dialogFormType:1,//1为添加；2为编辑
        addform: {
          name: null,
          code: null,
          description: null,
        },
        editId:null,
        formLabelWidth: '100px',
      };
    },
    created() {
     this.title = this.$route.name;
    },
    mounted() {
      // console.log(this.$route)
      this.getList();
      this.getTypeList();
    },
    methods: {
      
      /**
       * 数据多选
       * [handleSelectionChange description]
       * @param  {[type]} val [被选中数组数据]
       * @return {[type]}     [description]
       */
      handleSelectionChange(val) {
        console.log(val)
        this.multipleSelection = val;
      },
      /**
       * 改变每页条数触发此事件
       * [handleSizeChange description]
       * @param  {[type]} val [当前数据]
       * @return {[type]}     [description]
       */
      handleSizeChange(val) {
        this.elementPageData.pageSize = val;
        this.getList();
      },
      /**
       * 改变当前页码触发此事件
       * [handleCurrentChange description]
       * @param  {[type]} val [当前页码]
       * @return {[type]}     [description]
       */
      handleCurrentChange(val) {
        this.elementPageData.pageNum = val;
        this.getList();
      },
      /**
       * id转化为文本 用于添加或者编辑参数弹框title展示
       * @param  {[type]} id 参数类型id
       * @return {[type]}    [description]
       */
      idConversionText(id){
        let arr = this.paramType
        if(arr.length === 0){
          return '';
        }else{
          for(var i = 0 ;i<arr.length;i++){
            if(arr[i].id === id){
              return "（"+arr[i].name+"）"
            }
          }
        }
      },

      /**
       * list查询 POST
       * @return {[type]} [description]
       */
      getList(){
        this.loading = true;
        this.axios.post(`${this.common.baseAuthPath}/dictionary/type`,this._listParams()).then((response) => {
          this.formInline.type ? '':sessionStorage.setItem('dictionary',JSON.stringify(response.data.data));//查询全部字典的时候，session字典（防止字典数据变更）
          this.loading = false;
          this.tableData = response.data.data;
        }).catch((error) => {
          this.loading = false;
          this.$message.error(error);  
        });
      },
      _listParams(){
        return{
          pageNum:this.elementPageData.pageNum,
          pageSize:this.elementPageData.pageSize,
          typeId:this.formInline.type,
        }
      },
      /**
       * detail查询 GET
       * @return {[type]} [description]
       */
      getDetail(data){  
        this.dialogLoading = true;
        this.axios.get(`${this.common.baseAuthPath}/dictionary/one`,this._detailParams(data)).then((response) => {
          this.dialogLoading = false;
          this.paramTypeId = response.data.data.type_id;
          this.addform = response.data.data;//回显信息 
        }).catch((error) => {
          this.dialogLoading = false;
          this.$message.error(error);  
        });
      },
      _detailParams(data){
        return{
          params:{
            id:data.id,
          }
        }
      },
      /**
       * 系统参数类型list查询 GET
       * @return {[type]} [description]
       */
      getTypeList(){  
        this.selectLoading = true;
        this.axios.get(`${this.common.baseAuthPath}/dType/list`,this._listTypeParams()).then((response) => {
          this.selectLoading = false;
          let paramType = response.data.data;
          this.paramType = paramType;
        }).catch((error) => {
          this.selectLoading = false;
          this.$message.error(error);  
        });
      },
      _listTypeParams(){
        return{
          params:{
            // pageNum:this.elementPageData.pageNum,
            // pageSize:this.elementPageData.pageSize,
          }
        }
      },

      /**
       * 添加或编辑按钮
       * @param {[type]} type 1为添加；2为编辑
       * @param {[type]} data 数据
       */
      addEdit(type,data){
        type === 2 ? this.getDetail(data):'';
        type === 2 ? this.editId = data.id:'';
        this.dialogFormType = type;
        this.$refs['addform']?this.$refs['addform'].resetFields():'';
        this.dialogAddFormVisible = true;
      },
      /**
       * 提交表单
       * @param  {[type]} formName       [表单]
       * @param  {[type]} dialogFormType [1为添加、2为编辑]
       * @return {[type]}                [description]
       */
      submitForm(formName,dialogFormType) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            dialogFormType === 1 ? this.addSysParams() : this.editSysParams();
          } else {
            return false;
          }
        });
      },
      /**
       * 删除
       * @param  {[type]} data [description]
       * @return {[type]}    [description]
       */
      del(data){
        this.$confirm('是否执行该删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delSysParams(data);
        }).catch(() => {});
      },

      /**
       * 系统参数form添加 POST
       * @return {[type]} [description]
       */
      addSysParams(){
        this.dialogLoading = false;
        let addform = {
          name:this.addform.name,
          description:this.addform.description,
          code:this.addform.code,
          typeId:this.formInline.type,//添加时的typeId
        }
        this.axios.post(`${this.common.baseAuthPath}/dictionary/new`,addform).then((response) => {
          this.dialogLoading = false;
          this.dialogAddFormVisible = false;
          this.getList();//刷新
          this.$message({type: 'success',message: '成功!'});
        }).catch((error) => {
          this.dialogLoading = false;
          this.$message.error(error);  
        });
      },
      /**
       * 系统参数form编辑 POST
       * @return {[type]} [description]
       */
      editSysParams(){
        this.dialogLoading = false;
        let editform = {
          name:this.addform.name,
          description:this.addform.description,
          code:this.addform.code,
          id:this.editId,//编辑的id
        }
        this.axios.post(`${this.common.baseAuthPath}/dictionary/update`,editform).then((response) => {
          this.dialogLoading = false;
          this.dialogAddFormVisible = false;
          this.getList();//刷新
          this.$message({type: 'success',message: '成功!'});
        }).catch((error) => {
          this.dialogLoading = false;
          this.$message.error(error);  
        });
      },
      /**
       * 系统参数单个删除 DELETE
       * @return {[type]} [description]
       */
      delSysParams(data){
        this.axios.delete(`${this.common.baseAuthPath}/dictionary/delete`,{params:{id:data.id}}).then((response) => {
          this.getList();//刷新
          this.$message({type: 'success',message: '删除成功!'});
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
     
    }
  }
</script>
<style lang="less" scoped>
   .list{

   }
</style>