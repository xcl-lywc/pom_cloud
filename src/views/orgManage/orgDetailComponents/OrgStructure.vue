<!-- 组织解构 -->
<template>
  <div class="org-structure" v-loading="loading">
    <div v-if="orgId">
      <div v-if="orgsChildren.length>0" v-for="(item,index) in orgTypeArr">
        <el-collapse v-model="activeIndexs" @change="handleChange" accordion>
          <el-collapse-item :title="item" :name="index+1">
            <div v-if="judge(index+1)" class="content-empty line-height-100">该{{item}}暂无人员</div>
            <div v-for="(childItem,childIndex) in orgsChildren">
              <el-card class="box-card" shadow="hover" v-if="index+1===childItem.type">
                <el-row :gutter="20">
                  <el-col :span="4" class="head-img">
                    <el-image
                      style="width: 200px; height: 200px"
                      src="childItem.photo"
                      fit="cover">
                    </el-image>
                  </el-col>
                  <el-col :span="20" class="base-info">
                    <el-form ref="form" label-width="100px" class="show-form">
                      <el-row :gutter="20">
                        <el-col :span="12">
                          <el-form-item label="部门名称：">{{childItem.name}}</el-form-item>
                          <el-form-item label="邮 箱：">{{childItem.mailbox}}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="部门性质：">{{orgNatureArr[childItem.nature]}}</el-form-item>
                          <el-form-item label="地 址：">{{childItem.address}}</el-form-item>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label="" label-width="40px">{{childItem.description ? childItem.description : '暂无简介'}}</el-form-item>
                        </el-col>
                      </el-row>
                    </el-form>
                  </el-col>
                </el-row>
                <el-row>
                  <el-button type="danger" size="mini mart10 fr marl20" @click.stop="dismiss(childItem.id)">解散</el-button>
                  <el-button type="warning" size="mini mart10 fr" @click.stop="leaving(childItem.id)">脱离</el-button>
                </el-row>
              </el-card>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="mart10">
        <el-button type="success" size="mini" @click="addPlus(2)">增设部门</el-button>
        <el-button type="success" size="mini" @click="addPlus(1)">增设机构</el-button>
        <el-button type="success" size="mini" @click="addPlus(3)">增选机构</el-button>
      </div>
    </div>
    <div v-else class="content-empty">
      <span>暂无下级组织信息，请选择组织</span>
    </div>
    <!-- 增设部门/增设机构、增选机构 -->
    <el-dialog 
      :title="dialogTitleArr[dialogType-1]" 
      :visible.sync="dialogFormVisible" 
      :width='dialogType===3?"900px":"750px"'>
      <el-form 
        :model="plusform" 
        ref="plusform"
        :label-width="formLabelWidth"
        v-loading="dialogLoading">
        <!-- 增设部门/增设机构 -->
        <div v-if="dialogType!=3">
          <el-row :gutter='20'>
            <el-col :span="14">
              <el-form-item 
                label="名称" 
                prop="name" 
                :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]">
                <el-input v-model="plusform.name" class="w300"></el-input>
              </el-form-item>
              <el-form-item 
                label="性质" 
                prop="nature"
                :rules="[{ required: true, message: '请选择性质', trigger: 'change' }]">
                <el-select class="w300" v-loading="selectLoading_nature" v-model="plusform.nature" placeholder="请选择性质" @change="" value-key='' clearable filterable @clear="plusform.nature = null" @focus="orgNatureArr.length==0 ? getSelectList('orgNature') :''">
                  <el-option v-for="(item,index) in orgNatureArr"  v-if="index!=0" :label="item" :value="index" :key="index"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item 
                label="建立时间" 
                prop="buildtime" 
                :rules="[{ required: true, message: '请选择建立时间', trigger: 'blur' }]">
                <el-date-picker
                  v-model="plusform.buildtime"
                  type="date"
                  class="w300"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item 
                label="任期" 
                prop="officeTime"
                :rules="[{ required: true, message: '请选择任期', trigger: 'blur' }]">
                <el-date-picker
                  class="w300" 
                  v-model="plusform.officeTime"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item 
                label="电话" 
                prop="phone"
                :rules="[{ required: true, message: '请输入电话号码', trigger: 'blur' }]">
                <el-input v-model.number="plusform.phone" class="w300"></el-input>
              </el-form-item>
              <el-form-item 
                label="邮箱" 
                prop="mailbox"
                :rules="[{ required: true, message: '请输入邮箱', trigger: 'blur' },
                { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]">
                <el-input v-model="plusform.mailbox" class="w300"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item 
                label="上传图片" 
                prop="photo"
                label-position="top"
                :rules="[{ required: false, message: '请选择要上传的图片', trigger: 'blur' }]">
                <el-upload
                  disabled
                  class="avatar-uploader"
                  :action="`${common.baseAuthPath}/upload/file`"
                  :headers="myHeaders"
                  :show-file-list="false"
                  :limit="100"
                  name="file"
                  :on-success="handleSuccess"
                  :on-error="handleError"
                  :before-upload="beforeUpload"
                  :http-request="uploadFile">
                  <el-image
                    v-if="plusform.photo"
                    class="avatar"
                    :src="plusform.photo"
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
            <el-input type="textarea" v-model="plusform.address" rows="3"></el-input>
          </el-form-item>
          <el-form-item 
            label="简介" 
            prop="description"
            :rules="[{ required: false, message: '请输入描述内容', trigger: 'blur' },
            { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' },]">
            <el-input type="textarea" v-model="plusform.description" rows="5"></el-input>
          </el-form-item>
        </div>
        <!-- 增选机构 -->
        <div v-if="dialogType===3">
          <el-form-item 
            label="机构" 
            prop="sourceOrg"
            :rules="[{ required: false, message: '请选择机构', trigger: 'change' },]">
            <el-transfer 
              v-model="plusform.sourceOrg" 
              :props="{
                key: 'id',
                label: 'name'
              }"
              class="org-filter"
              filterable
              :filter-method="filterMethod"
              filter-placeholder="请输入机构名称"
              :titles="['所有的机构', '选择的机构']"
              :data="allOrgList.rows">
              
              <div slot-scope="{ option }" style="width:220px" class="ellipsis">
                <el-tooltip effect="light" :content="option.name+'（'+orgNatureArr[option.nature]+'）'" placement="bottom-end" disabled>
                  <span>{{ option.name }}（{{orgNatureArr[option.nature]}}）</span>
                </el-tooltip>
              </div>

            </el-transfer>
          </el-form-item>
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
  export default {
    props:['data'],
    data () {
      return {
        newOrgId:null,
        loading:false,
        dialogLoading:false,
        selectLoading_nature:false,
        activeIndexs:[],
        orgsChildren:null,
        myHeaders:{Authorization: 'Bearer ' + JSON.parse(sessionStorage.getItem('Access-Token'))},

        orgsChildren:[],//下级组织架构
        orgTypeArr:[],//组织类别

        //添加职位
        formLabelWidth: '100px',
        dialogType:1,//type为2，增设部门；type为1，增设机构；type为3，增选机构
        dialogTitleArr:['增设机构','增设部门','增选机构'],
        dialogFormVisible:false,
        plusform: {
          name:null,//增设机构、部门的名称
          nature: null,//增设机构、部门的性质
          buildtime:null,
          officeTime:null,
          mailbox: null,
          phone: null,
          address: null,
          description: null,
          photo: null,
          sourceOrg:[],
        },
        orgNatureArr:[],
        allOrgList:{rows:[],total:0},
        filterMethod(query, item) {
          return item.name.indexOf(query) > -1;
        },
      };
    },
    computed:{
      orgId(){
        return this.data
      },
      /**
       * 判断该机构、部门下是否有人员
       * @param  {[type]} id 下级组织类别id
       * @return {[type]}    [description]
       */
      judge(){ 
        return function(id){
          let val = false;
          let type_arr = [];
          if(this.orgsChildren.length>0){
            this.orgsChildren.forEach( (item) => {type_arr.push(item.type)});//循环遍历得到type的数组
            if(type_arr.length>0){
              type_arr.indexOf(id)===-1 ? val = true : val = false;
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
       * 文件上传成功时的钩子
       * @param  {[type]} res      [description]
       * @param  {[type]} file     [description]
       * @param  {[type]} fileList [description]
       * @return {[type]}          [description]
       */
      handleSuccess(res,file,fileList) {
        console.log(res,file,fileList)
      },
      /**
       * 文件上传失败时的钩子
       * @param  {[type]} err      [description]
       * @param  {[type]} file     [description]
       * @param  {[type]} fileList [description]
       * @return {[type]}          [description]
       */
      handleError(err, file, fileList){
        this.$message.error('文件上传失败!!', 20);
      },
      /**
       * 限制用户上传的图片格式和大小
       * @param  {[type]} file [description]
       * @return {[type]}      [description]
       */
      beforeUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';

        if (!isJPG && !isPNG) {
          this.$message.error('上传文件只能是 JPG/PNG 格式!');
        }
        return isJPG || isPNG;
      },
      /**
       * 自定义文件上传
       * @param  {[type]} param [description]
       * @return {[type]}       [description]
       */
      uploadFile(param){
        console.log(param)
        var fileObj = param.file;
        // FormData 对象
        var form = new FormData();
        // 文件对象
        form.append("file", fileObj);
        this.axios.post(`${this.common.baseAuthPath}/upload/file`,form,{ headers: { 'Content-Type': 'multipart/form-data' } }).then((response) => {
          this.$message.success("上传成功！！", 20);
          this.getLabSchedule();
        }).catch((error) => {
          this.$message.error(error);
        });
      },

      /**
       * 当前激活面板改变时触发
       * @param  {[type]} val [description]
       * @return {[type]}     [description]
       */
      handleChange(val) {
        console.log(val);
      },

      /**
       * 下级组织list查询 POST
       * @param  {[type]} id 组织id
       * @return {[type]}    [description]
       */
      getOrgsChildList(id){  
        this.loading = true;
        this.axios.post(`${this.common.baseAuthPath}/orgs/children`,this._listParams(id)).then((response) => {
          this.loading = false;
          this.orgsChildren = response.data.data ? response.data.data.rows : [];
        }).catch((error) => {
          this.loading = false;
          this.orgsChildren = [];
          this.$message.error(error);  
        });
      },
      _listParams(id){
        return{
          orgId:id,
        }
      },
      /**
       * 组织类别的list查询 GET
       * @return {[type]}        [description]
       */
      getOrgTypeList(){
        this.loading = false;
        this.axios.get(`${this.common.baseAuthPath}/orgs/type`).then((response) => {
          this.loading = false;
          let obj = response.data.data ? response.data.data : {};
          let arr = [];
          for (let i in obj) {i!=0 ? arr.push(obj[i]) : '';}
          this.orgTypeArr=arr;
        }).catch((error) => {
          this.loading = false;
          this.orgTypeArr = [];
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
       * 所有组织类别为机构的list查询 POST
       * @return {[type]} [description]
       */
      getAllOrgList(){  
        this.dialogLoading = true;
        this.axios.post(`${this.common.baseAuthPath}/orgs/list`,this._allParams()).then((response) => {
          this.dialogLoading = false;
          //筛选出当前组织未有的组织机构
          this.allOrgList.rows = this.getArrDifference(response.data.data.rows ? response.data.data.rows :[],this.orgsChildren);
          this.allOrgList.total = this.allOrgList.rows.length;
        }).catch((error) => {
          this.dialogLoading = false;
          this.$message.error(error);  
        });
      },
      _allParams(){
        return{
          orgType:1,   
        }
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
            var id_ = obj_.id;
            if(id == id_){
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
       * 添加按钮
       * @param {[type]} type type为2，增设部门；type为1，增设机构；type为3，增选机构
       */
      addPlus(type){
        type===3 ? this.getAllOrgList() : '';
        this.$refs['plusform']?this.$refs['plusform'].resetFields():'';
        this.dialogType=type;
        this.dialogFormVisible = true;
      },
      /**
       * 提交增设或增选组织结构的表单
       * @param  {[type]} formName       [表单]
       * @param  {[type]} type   type为2，增设部门；type为1，增设机构；type为3，增选机构
       * @return {[type]}                [description]
       */
      submitPlusForm(formName,type) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(type!=3){
              this.newOrgId ? this.addOrg(type) : this.$message.error('没有选择组织或选择的组织无效，请重新选择...');
            }else{
              this.newOrgId ? this.addSelectOrg(type) : this.$message.error('没有选择组织或选择的组织无效，请重新选择...');
            }
          } else {
            return false;
          }
        });
      },
      /**
       * 解散按钮
       * @return {[type]} [description]
       */
      dismiss(id) {
        this.$confirm('是否解散?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.dismissOrg(id);
        }).catch(() => {});    
      },
      /**
       * 脱离按钮
       * @return {[type]} [description]
       */
      leaving(id) {
        this.$confirm('是否脱离?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.leavingOrg(id);
        }).catch(() => {});    
      },

      /**
       * 组织结构（组织下级）的form添加 POST
       * @param  {[type]} type   type为2，增设部门；type为1，增设机构；type为3，增选机构
       * @return {[type]} [description]
       */
      addOrg(type){
        this.dialogLoading = false;
        let plusform = {
          superior_id: this.newOrgId,//上级组织id
          type: type,//增设机构、部门的类别（2部门，1机构）
          buildtime: this.plusform.buildtime,//增设部门或机构的时间
          name:this.plusform.name,//增设机构、部门的名称
          nature: this.plusform.nature,//增设机构、部门的性质
          office_start: this.plusform.officeTime ? this.plusform.officeTime[0].getTime() : null,//任期开始
          office_stop: this.plusform.officeTime ? this.plusform.officeTime[1].getTime() : null,//任期结束
          mailbox: this.plusform.mailbox,
          phone: this.plusform.phone,
          address: this.plusform.address,
          description: this.plusform.description,
          photo: this.plusform.photo,
        }
        this.axios.post(`${this.common.baseAuthPath}/orgs/new`,plusform).then((response) => {
          this.dialogLoading = false;
          this.dialogFormVisible = false;
          this.newOrgId ? this.getOrgsChildList(this.newOrgId):this.$message.error('数据无法更新，请刷新页面...');;//刷新
          this.$message({type: 'success',message: '成功!'});
        }).catch((error) => {
          this.dialogLoading = false;
          this.$message.error(error);  
        });
      },
      /**
       * 组织机构（组织下级的机构）的form添加 POST
       * @param  {[type]} type   type为2，增设部门；type为1，增设机构；type为3，增选机构
       * @return {[type]} [description]
       */
      addSelectOrg(type){
        this.dialogLoading = false;
        let plusform = {
          targetOrg: this.newOrgId,//上级组织id
          sourceOrg: this.plusform.sourceOrg,//增选的组织机构
        }
        this.axios.post(`${this.common.baseAuthPath}/orgs/addSubOrg`,plusform).then((response) => {
          this.dialogLoading = false;
          this.dialogFormVisible = false;
          this.newOrgId ? this.getOrgsChildList(this.newOrgId):this.$message.error('数据无法更新，请刷新页面...');;//刷新
          this.$message({type: 'success',message: '成功!'});
        }).catch((error) => {
          this.dialogLoading = false;
          this.$message.error(error);  
        });
      },
      /**
       * 组织结构的脱离 GET
       * @param  {[type]} id [description]
       * @return {[type]}      [description]
       */
      leavingOrg(id){
        this.axios.get(`${this.common.baseAuthPath}/orgs/leave`,{params:{org_id:id,superior_id:this.newOrgId}}).then((response) => {
          this.newOrgId ? this.getOrgsChildList(this.newOrgId):this.$message.error('数据无法更新，请刷新页面...');//刷新
          this.$message({type: 'success',message: '成功!'});
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      /**
       * 组织结构的解散 GET
       * @param  {[type]} id [description]
       * @return {[type]}      [description]
       */
      dismissOrg(id){
        this.axios.get(`${this.common.baseAuthPath}/orgs/dismiss`,{params:{org_id:id}}).then((response) => {
          this.newOrgId ? this.getOrgsChildList(this.newOrgId):this.$message.error('数据无法更新，请刷新页面...');//刷新
          this.$message({type: 'success',message: '成功!'});
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
     
    }
  }
</script>
<style lang="less" scoped>
   .org-structure{
      .box-card{
       margin-bottom:20px
      } 
      .head-img{

      }
      .base-info{
        
      }
   }
</style>