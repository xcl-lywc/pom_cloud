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
        <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline" size="small">
          <el-form-item label="账号" prop="account">
            <el-input v-model="formInline.account" placeholder="账号" clearable @change="elementPageData.pageNum = 1;formInline.account = $event;getList();" @clear="formInline.account = null"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="realName">
            <el-input v-model="formInline.realName" placeholder="姓名" clearable @change="elementPageData.pageNum = 1;formInline.realName = $event;getList();" @clear="formInline.realName = null"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="phone">
            <el-input v-model="formInline.phone" placeholder="手机" clearable @change="elementPageData.pageNum = 1;formInline.phone = $event;getList();" @clear="formInline.phone = null"></el-input>
          </el-form-item>
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
        max-height="600"
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
          prop="account"
          label="账号"
          align="center"
          width="150">
        </el-table-column>
        <el-table-column
          prop="real_name"
          label="姓名"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="sex"
          label="性别"
          align="center"
          width="60">
          <template slot-scope="scope">
            {{common.conversionDictionary(scope.row.sex)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机"
          align="center"
          width="150">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          align="center"
          width="150">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="id_card"
          label="身份证号"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column
          prop="work_num"
          label="工号"
          align="center"
          width="150">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          align="center"
          width="80">
          <template slot-scope="scope">
            {{scope.row.status}}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="200">
          <template slot-scope="scope">
            <el-button @click.native.prevent="modify(scope.row)" type="primary" size="mini">编辑</el-button>
            <el-button @click.native.prevent="del(scope.row)" type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="operation-area">
        <!-- <div class="fl btn-area">
          <el-button type="primary" size="small" @click="">编辑</el-button>
          <el-button type="success" size="small" @click="">添加</el-button>
          <el-button type="danger" size="small" @click="">删除</el-button>
        </div> -->
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
    <!-- 编辑用户信息弹框 -->
    <el-dialog 
      title="编辑用户信息" 
      :visible.sync="dialogModifyVisible" 
      width='750px'>
      <el-form 
        :model="modifyform" 
        ref="modifyform"
        :label-width="formLabelWidth"
        v-loading="dialogLoading">
        <el-form-item 
          label="账号" 
          prop="account" 
          :rules="[{ required: true, message: '请输入账号', trigger: 'blur' }]">
          <el-input v-model="modifyform.account" class="w300"></el-input>
        </el-form-item>
        <el-form-item 
          label="姓名" 
          prop="real_name" 
          :rules="[{ required: true, message: '请输入姓名', trigger: 'blur' }]">
          <el-input v-model="modifyform.real_name" class="w300"></el-input>
        </el-form-item>
        <el-form-item 
          label="性别" 
          prop="sex"
          :rules="[{ required: true, message: '请选择性别', trigger: 'change' }]">
          <el-select class="w300" v-loading="selectLoading_sex" v-model="modifyform.sex" placeholder="请选择性别" @change="" value-key='name' clearable filterable @clear="modifyform.sex = null" @focus="sexArr.length==0 ? getSexList() : ''">
            <el-option v-for="(item,index) in sexArr" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item 
          label="手机" 
          prop="phone"
          :rules="[{ required: true, message: '请输入手机号码', trigger: 'blur' }]">
          <el-input v-model.number="modifyform.phone" class="w300"></el-input>
        </el-form-item>
        <el-form-item 
          label="邮箱" 
          prop="email"
          :rules="[{ required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]">
          <el-input v-model="modifyform.email" class="w300"></el-input>
        </el-form-item>
        <el-form-item 
          label="地址" 
          prop="address"
          :rules="[{ required: true, message: '请输入描述内容', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' },]">
          <el-input type="textarea" v-model="modifyform.address" rows="3"></el-input>
        </el-form-item>
        <el-form-item 
          label="身份证号" 
          prop="id_card"
          :rules="[{ required: true, message: '请输入身份证号', trigger: 'blur' },
          ]"><!-- { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证号不符合要求' } -->
          <el-input v-model="modifyform.id_card" class="w300"></el-input>
        </el-form-item>
        <el-form-item 
          label="工号" 
          prop="work_num"
          :rules="[{ required: true, message: '请输入工号', trigger: 'blur' }]">
          <el-input v-model="modifyform.work_num" class="w300"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogModifyVisible = false">取 消</el-button>
        <el-button @click="$refs['mf'].resetFields();">重 置</el-button>
        <el-button type="primary" @click="submitModifyForm('modifyform')">保 存</el-button>
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
        selectLoading_sex:false,
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
          account: null,
          realName: null,
          phone: null,
        },

        //修改组织信息
        dialogModifyVisible: false,
        modifyform: {
          account: null,
          real_name:null,
          sex:null,
          phone: null,
          email: null,
          address:null,
          id_card: null,
          work_num:null,
        },
        sexArr:[],
        formLabelWidth: '100px',
        editId:null,//编辑用户的id

      };
    },
    created() {
     this.title = this.$route.name;
    },
    mounted() {
      // console.log(this.$route)
      this.getList();
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
       * 用户列表list查询 POST
       * @param  {[type]} id 组织id
       * @return {[type]}    [description]
       */
      getList(){  
        this.loading = true;
        this.axios.post(`${this.common.baseAuthPath}/user/list`,this._listParams()).then((response) => {
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
          account:this.formInline.account,
          realName:this.formInline.realName,
          phone:this.formInline.phone,
        }
      },
      /**
       * 回显用户信息
       * @param  {[type]} id [description]
       * @return {[type]}    [description]
       */
      getInfo(id){
        this.dialogLoading = true;
        this.axios.get(`${this.common.baseAuthPath}/user/one`,{params:{id:id}}).then((response) => {
          this.dialogLoading = false;
          this.modifyform = response.data.data;//回显用户信息
        }).catch((error) => {
          this.dialogLoading = false;
          this.$message.error(error);  
        });
      },
      /**
       * 性别的list查询 POST
       * @return {[type]} [description]
       */
      getSexList(){
        this.selectLoading_sex = true;
        this.axios.post(`${this.common.baseAuthPath}/dictionary/type`,{typeId:1}).then((response) => {
          this.selectLoading_sex = false;
          response.data.data ? this.sexArr = response.data.data.rows : [];   
        }).catch((error) => {
          this.selectLoading_sex = false;
          this.$message.error(error);  
        });
      },

      /**
       * 编辑用户信息
       * @return {[type]} [description]
       */
      modify(data){
        let editId = data.id;
        this.editId = editId;
        editId ? this.getInfo(editId) : '';
        this.$refs['modifyform']?this.$refs['modifyform'].resetFields():'';
        this.dialogModifyVisible = true;
      },
      /**
       * 提交编辑用户信息的表单
       * @param  {[type]} formName       [表单]
       * @return {[type]}                [description]
       */
      submitModifyForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.editId ? this.modifyUserInfo() : this.$message.error('没有选中需要编辑的用户，请重新选择...');
          } else {
            return false;
          }
        });
      },
      /**
       * 删除按钮
       * @param  {[type]} data [description]
       * @return {[type]}      [description]
       */
      del(data) {
        this.$confirm('是否执行该删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delUser(data.id);
        }).catch(() => {});    
      },

      /**
       * 用户信息form修改 POST
       * @return {[type]} [description]
       */
      modifyUserInfo(){
        this.dialogLoading = false;
        let editform = {
          account: this.modifyform.account,
          real_name:this.modifyform.real_name,
          sex:this.modifyform.sex,
          phone: this.modifyform.phone,
          email: this.modifyform.email,
          address:this.modifyform.address,
          id_card: this.modifyform.id_card,
          work_num:this.modifyform.work_num,
          ids:[this.editId],//编辑的id
        }
        this.axios.post(`${this.common.baseAuthPath}/user/update`,editform).then((response) => {
          this.dialogLoading = false;
          this.dialogModifyVisible = false;
          this.getList();//刷新
          this.$message({type: 'success',message: '成功!'});
        }).catch((error) => {
          this.dialogLoading = false;
          this.$message.error(error);  
        });
      },
      /**
       * 用户的单个删除 POST
       * @param  {[type]} id [description]
       * @return {[type]}      [description]
       */
      delUser(id){
        this.axios.post(`${this.common.baseAuthPath}/user/delete`,{ids:[id]}).then((response) => {
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