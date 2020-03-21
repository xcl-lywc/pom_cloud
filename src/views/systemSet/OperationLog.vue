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
        <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
          <el-form-item label="审批人">
            <el-input v-model="formInline.user" placeholder="审批人"></el-input>
          </el-form-item>
          <el-form-item label="活动区域">
            <el-select v-model="formInline.region" placeholder="活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="">查询</el-button>
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
        <el-table-column
          fixed
          type="selection"
          label=""
          :reserve-selection="true"
          width="55">
        </el-table-column>
        <el-table-column
          fixed
          type="index"
          label="序号"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          prop="date"
          label="日期"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="200">
          <!-- scope.row -->
          <template slot-scope="scope">
            <el-button @click.native.prevent="" type="info" size="mini">查看</el-button>
            <el-button @click.native.prevent="" type="text" size="mini">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="operation-area">
        <div class="fl btn-area">
          <el-button type="primary" size="small" @click="">编辑</el-button>
          <el-button type="success" size="small" @click="">添加</el-button>
          <el-button type="danger" size="small" @click="">删除</el-button>
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
          user: null,
          region: null,
        }
      };
    },
    created() {
     this.title = this.$route.name;
    },
    mounted() {
      // console.log(this.$route)
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
        console.log(`每页 ${val} 条`);
      },
      /**
       * 改变当前页码触发此事件
       * [handleCurrentChange description]
       * @param  {[type]} val [当前页码]
       * @return {[type]}     [description]
       */
      handleCurrentChange(val) {
        this.elementPageData.pageNum = val;
        console.log(`当前页: ${val}`);
      },

      /**
       * 查询
       */
      // getClassList(){  
      //   this.axios.get(`${this.common.basePath}/class/list`,{params:{pageNum:1,pageSize:10,}}).then((response) => {
      //     this.axios.get(`${this.common.basePath}/class/list`,{params:{pageNum:1,pageSize:response.data.data.total,}}).then((response) => {
      //        this.classListData = response.data.data.rows;
      //     }).catch((error) => {
      //       this.$message.error(error);  
      //     });
      //   }).catch((error) => {
      //     this.$message.error(error);  
      //   });
      // },
     
    }
  }
</script>
<style lang="less" scoped>
   .list{

   }
</style>