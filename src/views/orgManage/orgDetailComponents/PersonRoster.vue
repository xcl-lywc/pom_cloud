<!-- 列表 -->
<template>
  <div class="content-wrap-box person-roster" v-loading="loading">
    <div v-if="orgId">
      <div class="middle-content">
        <div class="input-area">
          <el-form :inline="true" ref='formInline' :model="formInline" class="demo-form-inline" size="small">
            <el-form-item label="账号" prop="account">
              <el-input v-model="formInline.account" placeholder="账号"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="realName">
              <el-input v-model="formInline.realName" placeholder="姓名"></el-input>
            </el-form-item>
            <el-form-item label="民族" prop="nation">
              <el-select v-loading="selectLoading_nation" v-model="formInline.nation" placeholder="民族" @change="formInline.nation = $event;" value-key='name' clearable filterable @clear="formInline.nation = null" @focus="nationArr.length==0 ? getSelectList('nation') : ''">
                <el-option v-for="(item,index) in nationArr" :label="item.name" :value="item.id" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="政治面貌" prop="political_outlook">
              <el-select v-loading="selectLoading_political" v-model="formInline.political_outlook" placeholder="政治面貌" @change="formInline.political_outlook = $event;" value-key='name' clearable filterable @clear="formInline.political_outlook = null" @focus="politicalArr.length==0 ? getSelectList('political') : ''">
                <el-option v-for="(item,index) in politicalArr" :label="item.name" :value="item.id" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="籍贯" prop="nativePlace">
              <el-input v-model="formInline.nativePlace" placeholder="籍贯"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="elementPageData.pageNum = 1;newOrgId ? getPersonList(newOrgId) : $message.error('数据无法更新，请刷新页面...');">搜索</el-button>
              <el-button type="default" @click="$refs['formInline'].resetFields()">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <span class="page-title">人员列表</span>
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
            prop="nation"
            label="民族"
            align="center"
            width="100">
            <template slot-scope="scope">
              {{common.conversionDictionary(scope.row.nation)}}
            </template>
          </el-table-column>
          <el-table-column
            prop="political_outlook"
            label="政治面貌"
            align="center"
            width="100">
            <template slot-scope="scope">
              {{common.conversionDictionary(scope.row.political_outlook)}}
            </template>
          </el-table-column>
          <el-table-column
            prop="native_place"
            label="籍贯"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
          <!-- <el-table-column
            fixed="right"
            label="操作"
            align="center"
            width="200">
            <template slot-scope="scope">
              <el-button @click.native.prevent="" type="info" size="mini">查看</el-button>
              <el-button @click.native.prevent="" type="text" size="mini">编辑</el-button>
            </template>
          </el-table-column> -->
        </el-table>
        <div class="operation-area">
          <div class="fl btn-area">
            <!-- <el-button type="primary" size="small" @click="">编辑</el-button>
            <el-button type="success" size="small" @click="">添加</el-button>
            <el-button type="danger" size="small" @click="">删除</el-button> -->
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
    <div v-else class="content-empty">
      <span>暂无用户名册信息，请选择组织</span>
    </div>
  </div>
</template>
<script>
  export default {
    props:['data'],
    data () {
      return {
        newOrgId:null,
        loading:false,
        selectLoading_nation:false,
        selectLoading_political:false,
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
          nation: null,
          political_outlook: null,
          nativePlace: null,
        },
        nationArr:[],
        politicalArr:[],
      };
    },
    computed:{
      orgId(){
        return this.data
      },
    },
    watch: {
      orgId(newValue, oldValue) {
    　　　　this.newOrgId = newValue;
    　　}
    },
    created() {
     
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
        this.getPersonList(this.newOrgId);
      },
      /**
       * 改变当前页码触发此事件
       * [handleCurrentChange description]
       * @param  {[type]} val [当前页码]
       * @return {[type]}     [description]
       */
      handleCurrentChange(val) {
        this.elementPageData.pageNum = val;
        this.getPersonList(this.newOrgId);
      },

      /**
       * 人员名册list查询 POST
       * @param  {[type]} id 组织id
       * @return {[type]}    [description]
       */
      getPersonList(id){  
        this.loading = true;
        this.axios.post(`${this.common.baseAuthPath}/user/list`,this._listParams(id)).then((response) => {
          this.loading = false;
          this.tableData = response.data.data;
        }).catch((error) => {
          this.loading = false;
          this.$message.error(error);  
        });
      },
      _listParams(id){
        return{
          orgId:id,
          pageNum:this.elementPageData.pageNum,
          pageSize:this.elementPageData.pageSize,
          account:this.formInline.account,
          realName:this.formInline.realName,
          nation:this.formInline.nation,
          political_outlook:this.formInline.political_outlook,
          nativePlace:this.formInline.nativePlace,
        }
      },
      /**
       * 民族、政治面貌的list查询 POST
       * @param  {[type]} type   nation民族，political政治面貌
       * @return {[type]}        [description]
       */
      getSelectList(type){
        type === 'nation' ? this.selectLoading_nation = true : this.selectLoading_political = true;
        this.axios.post(`${this.common.baseAuthPath}/dictionary/type`,{typeId:type==='nation'?2:6}).then((response) => {
          type === 'nation' ? this.selectLoading_nation = false : this.selectLoading_political = false;
          type === 'nation' ? this.nationArr = response.data.data.rows : this.politicalArr = response.data.data.rows;
        }).catch((error) => {
          type === 'nation' ? this.selectLoading_nation = false : this.selectLoading_political = false;
          this.$message.error(error);  
        });
      },
     
    }
  }
</script>
<style lang="less" scoped>
   .person-roster{
      margin-top:0px;
   }
</style>