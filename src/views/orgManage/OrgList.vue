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
          <el-form-item label="名称" prop="orgName">
            <el-input v-model="formInline.orgName" clearable placeholder="名称" @change="elementPageData.pageNum = 1;formInline.orgName = $event;getList();" @clear="formInline.orgName = null"></el-input>
          </el-form-item>
          <el-form-item label="组织性质" prop="orgNature">
            <el-select v-loading="selectLoading_nature" v-model="formInline.orgNature" placeholder="组织性质" @change="elementPageData.pageNum = 1;formInline.orgNature = $event;getList();" value-key='' clearable filterable @clear="formInline.orgNature = null" @focus="orgNatureArr.length==0 ? getSelectList('orgNature') : ''">
              <el-option v-for="(item,index) in orgNatureArr" v-if="index!=0" :label="item" :value="index" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="组织类别" prop="orgType">
            <el-select v-loading="selectLoading_type" v-model="formInline.orgType" placeholder="组织性质" @change="elementPageData.pageNum = 1;formInline.orgType = $event;getList();" value-key='' clearable filterable @clear="formInline.orgType = null" @focus="orgTypeArr.length==0 ? getSelectList('orgType') : ''">
              <el-option v-for="(item,index) in orgTypeArr" v-if="index!=0" :label="item" :value="index" :key="index"></el-option>
            </el-select>
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
          prop="name"
          label="名称"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="buildtime"
          label="建立时间"
          align="center"
          width="180">
          <template slot-scope="scope">
            {{scope.row.buildtime?common._convertDate(scope.row.buildtime.date_time, 'yyyy/MM/dd hh:mm'):'暂无'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="nature"
          label="组织性质"
          align="center"
          width="120">
          <template slot-scope="scope">
            {{orgNatureArr[scope.row.nature]}}
          </template>
        </el-table-column>
        <el-table-column
          prop="typeName"
          label="组织类别"
          align="center"
          width="120">
          <template slot-scope="scope">
            {{orgTypeArr[scope.row.type]}}
          </template>
        </el-table-column>
        <el-table-column
          prop="phone"
          label="电话"
          align="center"
          width="150">
        </el-table-column>
        <el-table-column
          prop="mailbox"
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
          prop="office_start"
          label="任期"
          align="center"
          width="200">
          <template slot-scope="scope">
            <span>{{scope.row.office_start?common._convertDate(scope.row.office_start.date_time, 'yyyy/MM/dd'):'暂无'}}</span>
            <span> ~ </span>
            <span>{{scope.row.office_stop?common._convertDate(scope.row.office_stop.date_time, 'yyyy/MM/dd'):'暂无'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="cur_status"
          label="状态"
          fixed="right"
          align="center"
          width="100">
          <template slot-scope="scope">
            <i class="el-icon-check font-blue-color" v-if="scope.row.cur_status === 1"></i>
            <i class="el-icon-close font-red-color" v-if="scope.row.cur_status === 2"></i>
          </template>
        </el-table-column>
        <!-- <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="200">
          <template slot-scope="scope">
            <el-button @click.native.prevent="" type="info" size="mini">查看</el-button>
            <el-button @click.native.prevent="" type="primary" size="mini">编辑</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <div class="operation-area">
        <div class="fl btn-area">
          <!-- <el-button type="success" size="small" @click="addEdit(1,null)">添加</el-button> -->
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
  </div>
</template>
<script>
  export default {
    data () {
      return {
        title:null,
        loading:false,
        selectLoading_nature:false,
        selectLoading_type:false,
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
          orgName:null,
          orgNature:null,
          orgType:null,
        },
        orgNatureArr:[],
        orgTypeArr:[],
      };
    },
    created() {
     this.title = this.$route.name;
    },
    mounted() {
      // console.log(this.$route)
      this.getList();
      this.getSelectList('orgNature');
      this.getSelectList('orgType');
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
       * list查询 POST
       * @return {[type]} [description]
       */
      getList(){  
        this.loading = true;
        this.axios.post(`${this.common.baseAuthPath}/orgs/list`,this._listParams()).then((response) => {
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
          orgName:this.formInline.orgName,
          orgNature:this.formInline.orgNature,
          orgType:this.formInline.orgType,   
        }
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

      
     
    }
  }
</script>
<style lang="less" scoped>
   .list{

   }
</style>