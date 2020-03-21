<template>
  <div class="feedback">
    <div class="build-form">
      <el-row :gutter="20">
        <el-col :span="14">
          <div class="form-box">
            <el-form :model="buildForm" ref="buildForm" label-width="100px" class="demo-dynamic" size="middle">
              <el-form-item
                prop="name"
                label="标题："
                :rules="[{ required: true, message: '请输入标题', trigger: 'blur' },]">
                <el-input v-model="buildForm.name"></el-input>
              </el-form-item>
              <el-form-item
                prop="enclosure"
                label="图片："
                :rules="[{ required: true, message: '请上传图片', trigger: 'blur' },]">
                <el-upload
                  class="avatar-uploader"
                  :action="`${common.baseMSPath}/file/uplode`"
                  :show-file-list="false"
                  :auto-upload="true"
                  multiple
                  :limit="9999"
                  :before-upload="beforeAvatarUpload"
                  :http-request="uploadFile">
                  <img v-if="buildForm.enclosure" :src="'https://static.crledu.com'+buildForm.enclosure" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
              <el-form-item
                prop="desc"
                label="问题描述："
                :rules="[{ required: true, message: '请输入问题描述的内容', trigger: 'blur' },{ min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' },]">
                <el-input type="textarea" v-model="buildForm.desc" rows="6"></el-input>
              </el-form-item>
              <el-form-item
                prop="tel"
                label="你的手机："
                :rules="[{ required: true, message: '请输入你的手机号', trigger: 'blur' },{ pattern: /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/, message: '手机号不符合规范' }]">
                <el-input v-model="buildForm.tel"></el-input>
              </el-form-item> 
            </el-form>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="function-box">
            <el-form class="function-box-title"><el-form-item label="发生位置：" class="is-required"></el-form-item></el-form>
            <el-tree
              v-loading="loading"
              :data="projectFunctionList"
              show-checkbox
              node-key="id"
              ref="tree"
              :default-expanded-keys="expandedKeysArr"
              highlight-current
              :props="defaultFunctionProps"
              @node-click="handleNodeClick"
              @check="handleNodeCheckedClick">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span @click="" class="fl">{{ node.label }}</span>
                <!-- <el-button type="text" size="mini">{{ node.label }}</el-button> -->
                <i class="el-icon-arrow-right fr i-mart2" :ref="`arrow${data.id}`" v-if="data.childrens.length==0"></i>
                <i class="fr i-mart2" :ref="`arrow${data.id}`" v-if="data.childrens.length!=0"></i>
              </span>
            </el-tree>
          </div>
        </el-col>
      </el-row>
      <div class="build-btns">
        <el-button @click="displayDialog" size="small">取 消</el-button>
        <el-button @click="resetForm('buildForm')" size="small">重 置</el-button>
        <el-button type="primary" @click="submitForm('buildForm')" size="small">提 交</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        loading:false,
        buildForm: {//新建表单
          enclosure: null,
          desc: null,
          tel: null,
          name: null,
        },
        projectFunctionList:null,//产品功能列表
        defaultFunctionProps: {
          children: 'childrens',
          label: 'name'
        },
        addList:null,//增加的子功能列表（子节点）
        expandedKeysArr:[],//展开节点的数组
      }
    },
    props:{
      dialogVisible: Boolean,  //定义传值的类型
    },
    methods: {
      /*点击让弹框消失*/
      displayDialog() {
        this.$emit('changeDialogVisible',false);//displayDialog事件触发后，自动触发changeDialogVisible事件
      },
      //-------------------------------------------------------------------------------------上传文件
      /* 
        上传文件前，限制用户上传的文件格式
       */
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';

        if (!isJPG&&!isPNG) {
          this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
        }
        return isJPG || isPNG;
      },  
      /* 
        自定义文件上传
      */
      uploadFile(param){
        var fileObj = param.file;
        // FormData 对象
        var form = new FormData();
        // 文件对象
        form.append("multipartFile", fileObj);
        this.axios.post(`${this.common.baseMSPath}/other/upload`,form,{ headers: { 'Content-Type': 'multipart/form-data' } }).then((response) => {
          this.$message.success("文件上传成功！！", 20);
          this.buildForm.enclosure = response.data.data;
        }).catch((error) => {
          this.$message.error(error);
        });
      },

      //-------------------------------------------------------------------------------------新建反馈信息
      //获取发生位置的id数组
      getCheckedKeys() {
        this.function = this.$refs.tree.getCheckedKeys()
      },
      //清空发生位置的选择项
      resetChecked() {
        this.$refs.tree.setCheckedKeys([]);
      },
      /*
        提交
      */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.getCheckedKeys();//获取发生位置的id数组
            if(this.function.length!=0){
              let form = {
                title:this.buildForm.name,
                enclosure:this.buildForm.enclosure,
                detailed:this.buildForm.desc,
                phone:this.buildForm.tel,
                function:this.function.join(","),
                project_id:this.activeIndex?this.activeIndex:null,
                deploy_id:1,
                /*"backcontent": "string",
                "checktime": "2019-01-10T09:18:15.648Z",
                "content": "string",*/
              }
              this.axios.post(`${this.common.baseMSPath}/other/insert`,form).then( (response) => {
                if(response.data.meta.code === 0){
                  this.$message.success('新建反馈信息成功！！！', 20);
                  this.$emit('changeDialogVisible',false);//displayDialog事件触发后，自动触发changeDialogVisible事件 
                }else{
                  this.$message.error(response.data.meta.message, 20);   
                }
              }).catch( (error) => {
                this.$message.error(error);
              });
            }else{
              this.$message.error("新建反馈信息的发生位置未选择！！！");
            }
          } else {return false;}
        });
      },
      /*
        重置
      */
     
      resetForm(formName) {
        this.getFunctionList();//查询功能列表(一级)
        this.resetChecked();//清空发生位置的选择项
        this.$refs[formName].resetFields();//清空表单信息
      },

      //-------------------------------------------------------------------------------------功能列表
      /* 
        GET  查询一级功能列表
      */
      getFunctionList(){
        this.loading = true;
        this.axios.get(`${this.common.baseMSPath}/other/show`,{params:{id:null,deploy_id:6,}}).then( (response) => {
          if(response.data.meta.code === 0){
            this.projectFunctionList = response.data.data?response.data.data:null;//一级产品功能列表
          }else{
            this.$message.error(response.data.meta.message, 20);   
          }
          this.loading = false;
        }).catch( (error) => {
          this.$message.error(error);
          this.loading = false;
        });
      },
      handleNodeClick(data,node,VueComponent) {
        if(data.childrens.length===0){
          this.loading = true;
          this.axios.get(`${this.common.baseMSPath}/other/show`,{params:{id:data.id,deploy_id:6,}}).then( (response) => {//GET  根据id查询功能列表（一级功能列表除外）
            if(response.data.meta.code === 0){
              let addList = response.data.data?response.data.data:null;//增加的子功能列表（子节点）
              if(addList.length===0){
                this.$message.info('没有下一级啦...', 20);
                let el = 'arrow'+data.id;
                this.$refs[el].style.display = 'none';
              }else{

                this.expandedKeysArr.push(data.id);
                if(this.expandedKeysArr.length>1){
                  this.expandedKeysArr = this.expandedKeysArr.slice(this.expandedKeysArr.length-1)
                }

                if (!data.childrens) {
                  this.$set(data, 'childrens', []);
                }
                for(var i = 0;i<addList.length;i++){
                  data.childrens.push(addList[i]);
                }
              }
            }else{
              this.$message.error(response.data.meta.message, 20);   
            }
            setTimeout(() => {
              this.loading = false;
            }, 100)
          }).catch( (error) => {
            this.$message.error(error);
            this.loading = false;
          });
        }else{
          // this.$message.info('已请求过啦...', 20); 
        }
      },
      handleNodeCheckedClick(data,val){
        if( val.checkedKeys.indexOf(data.id) > -1){//表示选中
          if(data.childrens.length===0){
            this.loading = true;
            this.axios.get(`${this.common.baseMSPath}/other/show`,{params:{id:data.id,deploy_id:6,}}).then( (response) => {//GET  根据id查询功能列表（一级功能列表除外）
              if(response.data.meta.code === 0){
                let addList = response.data.data?response.data.data:null;//增加的子功能列表（子节点）
                if(addList.length===0){
                  this.$message.info('没有下一级啦...', 20);
                  let el = 'arrow'+data.id;
                  this.$refs[el].style.display = 'none';
                }else{

                  this.expandedKeysArr.push(data.id);
                  if(this.expandedKeysArr.length>1){
                    this.expandedKeysArr = this.expandedKeysArr.slice(this.expandedKeysArr.length-1)
                  }

                  if (!data.childrens) {
                    this.$set(data, 'childrens', []);
                  }
                  for(var i = 0;i<addList.length;i++){
                    data.childrens.push(addList[i]);
                  }
                }
              }else{
                this.$message.error(response.data.meta.message, 20);   
              }
              setTimeout(() => {
                 this.loading = false;
              }, 100)
            }).catch( (error) => {
              this.$message.error(error);
              this.loading = false;
            });
          }else{
            // this.$message.info('已请求过啦...', 20);
          }
        }
      },
    },
    mounted(){
      //清空信息
      if(this.$refs['buildForm']){
        this.$refs['buildForm'].resetFields();
      }
      //查询功能列表(一级)
      this.getFunctionList();
      console.log(this.dialogVisible)
    },
  }
</script>
<style lang="less">
  .function-box .el-tree{
    max-height: 400px;padding: 10px 5px;overflow:auto;
  }
  /*发生位置style*/
  .custom-tree-node{
    display:block;width:100%;
    .i-mart2{
      margin-top: 2px;
    }
  }
  /* 新建反馈信息 */
  .build-form{
    padding: 20px;
    box-sizing: border-box;
    .form-box{
      border-right: 1px solid #ddd;
      padding-right: 20px;
      .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
      }
      .avatar-uploader-icon{
        font-size: 28px;
        color: #8c939d;
        width: 150px;
        height: 150px;
        line-height: 150px;
        text-align: center;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        background: white;
      }
      .avatar-uploader-icon:hover{
        border-color: #409EFF;
      }
      .avatar {
        width: 150px;
        height: 150px;
        display: block;
      }
    }
    .function-box{
      box-sizing: border-box;
      .function-box-title{
        .el-form-item{
          margin-bottom: 0;
        }
      }
    }
    .build-btns{
      margin: 10px auto 0;
      text-align: right;
      border-top: 1px solid #ddd;
      padding-top: 10px;
    }
  }
</style>