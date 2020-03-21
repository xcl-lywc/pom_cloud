<!-- 班子成员 -->
<template>
  <div class="team-member" v-loading="loading">
    <div v-if="orgId">
      <el-checkbox-group v-model="ids" size="small">
        <div v-if="teamList.length>0" v-for="(item,index) in positionList">
          <el-collapse v-model="activeIndexs" @change="handleChange" accordion>
            <el-collapse-item :name="item.id">
              <template slot="title">
                <el-checkbox :label="item.id" :key="item.id" class="checkbox-position">&nbsp;</el-checkbox>&nbsp;&nbsp;&nbsp;{{item.name}}
              </template>
              <div v-if="judge(item.id)" class="content-empty line-height-100">该职位暂无班子成员</div>
              <div v-for="(childItem,childIndex) in teamList">
                <el-card class="box-card" shadow="hover" v-if="item.id===childItem.position_id">
                  <el-row :gutter="20">
                    <el-col :span="4" class="head-img">
                      <el-image
                        style="width: 200px; height: 200px"
                        src=""
                        fit="cover">
                      </el-image>
                    </el-col>
                    <el-col :span="20" class="base-info">
                      <el-form ref="form" label-width="100px" class="show-form">
                        <el-row :gutter="20">
                          <el-col :span="12">
                            <el-form-item label="姓 名：">{{childItem.user_name}}</el-form-item>
                            <el-form-item label="职 位：">{{childItem.position_id===item.id ? item.name : ''}}</el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="入职时间：">{{common._convertDate(childItem.create_time, 'yyyy/MM/dd hh:mm')}}</el-form-item>
                            <el-form-item label="任期结束：">{{common._convertDate(childItem.stop_time, 'yyyy/MM/dd hh:mm')}}</el-form-item>
                          </el-col>
                          <el-col :span="24">
                            <el-form-item label="" label-width="40px">{{childItem.description ? childItem.description : '暂无简介'}}</el-form-item>
                          </el-col>
                        </el-row>
                      </el-form>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-button v-if="childItem.cur_status === 20" type="warning" size="mini mart10 fr" @click.stop="" disabled>已离任</el-button>
                    <el-button v-if="childItem.cur_status === 1" type="warning" size="mini mart10 fr" @click.stop="leavingOffice(childItem.id)">离任</el-button>
                  </el-row>
                </el-card>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-checkbox-group>
      <div class="mart10">
        <el-button type="success" size="mini" @click="addPlus(null)">添加职位</el-button>
        <el-button type="danger" size="mini" @click="del" :disabled="ids.length===0 ? true : false">删除职位</el-button>
      </div>
    </div>
    <div v-else class="content-empty">
      <span>暂无班子成员信息，请选择组织</span>
    </div>
    <!-- 添加职位弹框 -->
    <el-dialog 
      title="添加职位" 
      :visible.sync="dialogFormVisible" 
      width='750px'>
      <el-form 
        :model="plusform" 
        ref="plusform"
        :label-width="formLabelWidth"
        v-loading="dialogLoading">
        <el-form-item 
          label="名称" 
          prop="name"
          :rules="[{ required: true, message: '请输入职位名称', trigger: 'blur' },]">
          <el-input v-model="plusform.name" class="w300"></el-input>
        </el-form-item>
        <el-form-item 
          label="描述" 
          prop="description"
          :rules="[{ required: false, message: '请输入描述内容', trigger: 'blur' },
          { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' },]">
          <el-input type="textarea" v-model="plusform.description" rows="5"></el-input>
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
  export default {
    props:['data'],
    data () {
      return {
        newOrgId:null,
        loading:false,
        dialogLoading:false,
        activeIndexs:[],

        teamList:[],//班子成员
        positionList:[],//职位列表
        ids:[],//删除职位的id数组

        //添加职位
        formLabelWidth: '100px',
        dialogFormVisible:false,
        plusform: {
          description: null,
          name:null,
        },
      };
    },
    computed:{
      orgId(){
        return this.data
      },
      /**
       * 判断该职位下是否有班子成员
       * @param  {[type]} id 职位id
       * @return {[type]}    [description]
       */
      judge(){ 
        return function(id){
          let val = false;
          let position_id_arr = [];
          if(this.teamList.length>0){
            this.teamList.forEach( (item) => {position_id_arr.push(item.position_id)});//循环遍历得到position_id的数组
            if(position_id_arr.length>0){
              position_id_arr.indexOf(id)===-1 ? val = true : val = false;
              return val;
            }else{
              return val;
            }
          }else{
            return val;
          };
        }
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
      
    },
    methods: {

      /**
       * 当前激活面板改变时触发
       * @param  {[type]} val [description]
       * @return {[type]}     [description]
       */
      handleChange(val) {
        // console.log(val);
      },

      /**
       * 班子成员 list查询 POST
       * @param  {[type]} data 组织id
       * @return {[type]}      [description]
       */
      getTeamList(id){  
        this.loading = true;
        this.axios.post(`${this.common.baseAuthPath}/leader/list`,this._teamListParams(id)).then((response) => {
          this.loading = false;
          this.teamList = response.data.data ? response.data.data : [];//班子成员
        }).catch((error) => {
          this.loading = false;
          this.teamList = [];
          this.$message.error(error);  
        });
      },
      _teamListParams(id){
        return{
          orgId:id,
        }
      },
      /**
       * 职位列表 list查询 POST
       * @param  {[type]} data 组织id
       * @return {[type]}      [description]
       */
      getPositionList(id){  
        this.loading = false;
        this.axios.post(`${this.common.baseAuthPath}/position/list`,this._positionListParams(id)).then((response) => {
          this.loading = false;
          this.positionList = response.data.data.rows;//职位列表
        }).catch((error) => {
          this.loading = false;
          this.positionList = [];
          this.$message.error(error);  
        });
      },
      _positionListParams(id){
        return{
          org_id:id,
        }
      },

      /**
       * 添加按钮
       * @param {[type]} data 数据
       */
      addPlus(data){
        this.$refs['plusform']?this.$refs['plusform'].resetFields():'';
        this.dialogFormVisible = true;
      },
      /**
       * 提交添加职位的表单
       * @param  {[type]} formName       [表单]
       * @return {[type]}                [description]
       */
      submitPlusForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.newOrgId ? this.addPosition() : this.$message.error('没有选择组织或选择的组织无效，请重新选择...');
          } else {
            return false;
          }
        });
      },
      /**
       * 删除按钮
       * @return {[type]} [description]
       */
      del() {
        this.$confirm('是否执行该删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.newOrgId ? this.delPosition(this.ids) : this.$message.error('没有选择组织或选择的组织无效，请重新选择...');
        }).catch(() => {});    
      },
      /**
       * 离任按钮
       * @return {[type]} [description]
       */
      leavingOffice(id) {
        this.$confirm('是否离任?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.leavingOffice_(id);
        }).catch(() => {});    
      },

      /**
       * 班子成员-职位的form添加 POST
       * @return {[type]} [description]
       */
      addPosition(){
        this.dialogLoading = false;
        let order = this.positionList.length+1;
        let plusform = {
          description:this.plusform.description,
          name:this.plusform.name,
          org_id:this.newOrgId,
          order:order,
        }
        this.axios.post(`${this.common.baseAuthPath}/position/new`,plusform).then((response) => {
          this.dialogLoading = false;
          this.dialogFormVisible = false;
          this.newOrgId ? this.getPositionList(this.newOrgId):this.$message.error('数据无法更新，请刷新页面...');;//刷新
          this.$message({type: 'success',message: '成功!'});
        }).catch((error) => {
          this.dialogLoading = false;
          this.$message.error(error);  
        });
      },
      /**
       * 班子成员的离任 POST
       * @param  {[type]} id [description]
       * @return {[type]}      [description]
       */
      leavingOffice_(id){
        this.axios.post(`${this.common.baseAuthPath}/leader/delete`,{id:id}).then((response) => {
          this.newOrgId ? this.getTeamList(this.newOrgId):this.$message.error('数据无法更新，请刷新页面...');//刷新
          this.$message({type: 'success',message: '成功!'});
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      /**
       * 班子成员-职位的多个删除 POST
       * @param  {[type]} ids [description]
       * @return {[type]}      [description]
       */
      delPosition(ids){
        this.axios.post(`${this.common.baseAuthPath}/position/delete`,{ids:ids,org_id:this.newOrgId}).then((response) => {
          this.newOrgId ? this.getPositionList(this.newOrgId):this.$message.error('数据无法更新，请刷新页面...');//刷新
          this.$message({type: 'success',message: '删除成功!'});
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
     
    }
  }
</script>
<style lang="less" scoped>
   .team-member{
      .box-card{
        margin-bottom:20px
      } 
      .head-img{

      }
      .base-info{
        
      }
   }
</style>