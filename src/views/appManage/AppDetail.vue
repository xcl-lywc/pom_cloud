<!-- 表单详情 -->
<template>
  <div class="content-wrap-box detail" ref="contentWrap">
    <!-- 头部导航栏 -->
    <div class="top-nav">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item><h3 class="title">{{common.showTitle(title).mainName}}</h3></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="middle-content">
      <div class="detail-content" v-loading="loading">
        <div v-if="data" class="app-info">
          <el-row class="base-info">
            <el-card class="box-card" shadow="hover">
              <div slot="header" class="clearfix">
                <span>应用信息</span>
              </div>
              <el-form ref="editForm" :model="editForm" label-width="120px" class="">
                <el-form-item label="名 称：">
                  <el-input v-model="editForm.name" class="w300"></el-input>
                </el-form-item>
                <el-form-item label="简 介：">
                  <el-input type="textarea" v-model="editForm.brief" rows="4"  class="w600"></el-input>
                </el-form-item>
                <el-form-item label="唯一标识：">
                  <el-input v-model="editForm.ids" class="w300"></el-input>
                </el-form-item>
                <el-form-item label="支持授权类型：">
                  <el-checkbox-group v-model="editForm.type">
                    <el-checkbox label="授权码" name="type"></el-checkbox>
                    <el-checkbox label="密码" name="type"></el-checkbox>
                    <el-checkbox label="简单" name="type"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="默认授权：">
                  <el-radio-group v-model="editForm.resource">
                    <el-radio label="是"></el-radio>
                    <el-radio label="否"></el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
            </el-card>
          </el-row> 

          <el-row :gutter="20" class="mart20">
            <el-col :span="8">
              <el-card class="box-card tag-info" shadow="hover">
                <div slot="header" class="clearfix">
                  <span>回调地址</span>
                </div>
                <div v-for="o in 4" :key="o" class="mart10">
                  <el-tag 
                    type="info" 
                    closable 
                    color="#fff"
                    :disable-transitions="false"
                    @close="handleClose(o)">{{'回调地址' + o }}</el-tag>
                </div>
                <el-button type="success" size="mini mart10">添加</el-button> 
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card class="box-card tag-info" shadow="hover">
                <div slot="header" class="clearfix">
                  <span>资源配置</span>
                </div>
                <div v-for="o in 4" :key="o" class="mart10">
                  <el-tag 
                    type="info" 
                    closable 
                    color="#fff"
                    :disable-transitions="false"
                    @close="handleClose(o)">{{'资源配置' + o }}</el-tag>
                </div>
                <el-button type="success" size="mini mart10">添加</el-button> 
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card class="box-card tag-info" shadow="hover">
                <div slot="header" class="clearfix">
                  <span>附加信息</span>
                </div>
                <div v-for="o in 4" :key="o" class="mart10">
                  <el-tag 
                    type="info" 
                    closable 
                    color="#fff"
                    :disable-transitions="false"
                    @close="handleClose(o)">{{'附加信息' + o }}</el-tag>
                </div>
                <el-button type="success" size="mini mart10">添加</el-button> 
              </el-card>
            </el-col>
          </el-row>

          <el-button type="primary" size="mini mart20">保存</el-button> 
        </div>
        <div v-else class="content-empty">
          暂无数据
        </div>
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
        data:'null',
        editForm: {
          name: null,
          resource:null,
          type:[],
          brief:'举头三尺无神明，掌心三寸是人间。这是耳根继《仙逆》《求魔》《我欲封天》《一念永恒》后，创作的第五部长篇小说《三寸人间》。举头三尺无神明，掌心三寸是人间。这是耳根继《仙逆》《求魔》《我欲封天》《一念永恒》后，创作的第五部长篇小说《三寸人间》。',
          ids:null,
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
       * 关闭 Tag 时触发的事件
       * @param  {[type]} tag [description]
       * @return {[type]}     [description]
       */
      handleClose(tag) {
        console.log(tag)     
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
   .detail{
      .app-info{
        .base-info{

        }
        .tag-info{
          max-height:500px;
          overflow:auto;
        }
     }
   }
</style>