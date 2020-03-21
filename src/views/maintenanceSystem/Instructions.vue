<template>
  <div class="instructions content-wrap-box" v-loading="loading">
    <!-- <div class="instructions-top-box">
      <p class="fl instructions-title">产品说明书</p>
      <p class="fr instructions-back">
        <el-button type="info" icon="el-icon-back" size="mini" round>返回</el-button>
      </p>
    </div> -->
    <!-- 头部导航栏 -->
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>产品说明书</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button type="primary" icon="el-icon-back" size="mini" round class="instructions-back" @click="$router.go(-1)">返回</el-button>
    </el-card>
    <div class="router-view-wrap" id="editormd2">
      <!-- 预览状态下的markdown -->
      <mavon-editor ref="md" :toolbarsFlag="false" :subfield="false" defaultOpen="preview" v-model="value" :navigation="true" class="mavon-height"/>
    </div>
    
  </div>
</template>
<script>
  export default {
    data () {
      return {
        value:"# 一级标题",
        loading:false,
      }
    },
    methods: {
      /* 
        GET  查询--根据产品id查询产品说明书
      */
      getInstructions(){
        this.loading = true;
        this.axios.get(`${this.common.baseMSPath}/other/instructions`,{params:{project_id:22,}}).then( (response) => {
          if(response.data.meta.code === 0){
            this.value = response.data.data?response.data.data:'';//产品---说明书
          }else{
            this.$message.error(response.data.meta.message, 20);   
          }
          this.loading = false;
        }).catch( (error) => {
          this.$message.error(error);
          this.loading = false;
        });
      },
    },
    mounted(){
      this.getInstructions();
    },
  }
</script>

<style lang="less">
  
  .vertical-box{
    .instructions-back{
      position: fixed;
      right: 20px;
      top: 72px;
    }
    #editormd2{
      .mavon-height{
        height: calc(100vh - 175px);
      }
    }
    
  }
  .horizontal-box{
    .instructions-back{
      position: fixed;
      right: 20px;
      top: 134px;
    }
    #editormd2{
      .mavon-height{
        height: calc(100vh - 243px);
      }
    }
  }
  
  /*
    预览模式markdown样式修改
   */
  .vertical-box #editormd2 .v-note-show.single-show{
    width: calc(100vw - 550px);
    position: absolute;
    height: 100vh;
    right: 0px;
    .v-show-content{
      padding: 8px 25px 170px 25px;
    }
  } 
  .horizontal-box #editormd2 .v-note-show.single-show{
    width: calc(100vw - 310px);
    position: absolute;
    height: 100vh;
    right: 0px;
    .v-show-content{
      padding: 8px 25px 240px 25px;
    }
  } 
  #editormd2 .v-note-navigation-wrapper.shadow{
    position: absolute;
    left: 0;
  }
  #editormd2 .v-note-navigation-wrapper.shadow .v-note-navigation-close{
    display: none;
  }
</style>