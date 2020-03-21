<!-- 列表 -->
<template>
  <div class="content-wrap-box list" ref="contentWrap">
    <!-- 头部导航栏 -->
    <div class="top-nav">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item><h3 class="title">{{common.showTitle($route.name).mainName}}</h3></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row :gutter="20" v-loading="loading"> 
      <!-- 左侧导航栏 -->
      <el-col :span="6">
        <div class="left-nav"> 
          <div class="bottom-area">
            <el-menu
              v-if="menuData.length>0"
              :default-active="activeNav"
              :default-openeds="openNav"
              mode="vertical"
              class="el-menu-vertical-demo my-drag-menu"
              @open=""
              @close=""
              @select="handleSelect"
              background-color="#eee"
              text-color="#000"
              active-text-color="#409EFF">  
              <div v-for="(item,index) in menuData" :key="item.id">
                <el-submenu :index="item.id+''" v-if="item.optionInfoVos.length>0">
                  <template slot="title">
                    <div>
                      <i class="el-icon-location"></i>
                      <span>{{item.group_name}}</span> 
                    </div>
                  </template>
                  <div v-for="(itemChild,indexChild) in item.optionInfoVos">
                    <el-menu-item  :index="itemChild.id+'-child'">{{itemChild.option_name}}</el-menu-item>
                  </div>
                </el-submenu>
                <el-menu-item :index="item.id+''"  v-else>
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>{{item.group_name}}</span>
                  </template>
                </el-menu-item>
              </div> 
            </el-menu>
            <div class="no-data" v-else>
              暂无数据
            </div>
          </div>
        </div>
      </el-col> 
      <!-- 自定义表单 -->
      <el-col :span="18">
        <div class="right-content" v-if="isMenuItem">
          <div class="content-area">
            <!-- CustomForm：组件库数据为后台获取 -->
            <!-- <CustomForm @saveCustomForm="handleSubmit" :dataDict="dataDict" :sortable_item="sortable_item" :component_list="component_list" :type="'component'"></CustomForm> -->
            
            <!-- CustomForm：组件库数据为默认的，component_list需传空数组 -->
            <CustomForm @saveCustomForm="handleSubmit" :dataDict="dataDict" :sortable_item="sortable_item" :type="'form'" :component_list="[]"></CustomForm>
          </div>
        </div>
        <div class="no-data" v-else>
          该菜单下没有菜单项！请前往菜单管理添加！
        </div>
      </el-col> 
    </el-row> 
  </div>
</template>
<script> 
  export default { 
    data () { 
      return { 
        loading:  false,
        searchInput:null,
        activeNav:'',// 被激活的菜单项 string类型
        activeParentNav:null,// 被激活的菜单项所属菜单，即被激活的菜单项的父级id number类型
        isMenuItem:false,// 是否有菜单项
        menuData: [],   
        dataDict: [],
        sortable_item: [], //最后需要保存的表单数据
      };
    },
    computed: { 
    },
    created() {  
    },
    mounted() { 
      this.queryMenu(false);
      this.getFormDictJson();
    },
    methods: {  
      /**
       * 查询菜单
       * @author chuanlin.Xiao
       * @date   2019-10-23T16:38:15+0800
       * @param  {Boolean}                isRefesh 是否用于刷新
       * @return {[type]}                          [description]
       */
      queryMenu(isRefesh){ 
        this.loading = true; 
        this.axios.post(`${this.common.basePath}/activiti/menu/find_menu`).then((response) => {
          if(response.data.data&&response.data.data.length>0){
            this.menuData = response.data.data;
            this.activeParentNav = response.data.data[0].id;
            this.openNav = [response.data.data[0].id+''];
            if(response.data.data[0].optionInfoVos.length>0){
              this.activeNav = response.data.data[0].optionInfoVos[0].id+'-child'; 
              this.isMenuItem = true;
              this.getFormData(response.data.data[0].optionInfoVos[0].id);
            }else{
              this.isMenuItem = false;
              this.activeNav = ''; 
            } 
          }
          this.loading = false;
        }).catch((error) => {
          this.loading = false;
          this.$message.error(error);  
        });
      },
      /**
       * 根据左侧菜单栏Id查询表单数据 
       * @param  {String}     menuId 菜单栏Id
       * @return {[type]}     
       */
      getFormData(menuId){ 
        this.loading = true; 
        this.axios.post(`${this.common.basePath}/activiti/field/find_by_option?id=${menuId}`).then((response) => {
          this.sortable_item = response.data.data ? JSON.parse(response.data.data.wf_config) : [];
          this.loading = false;
        }).catch((error) => {
          this.loading = false;
          this.$message.error(error);  
        });
      },
      getFormDictJson(){
        this.axios.post(`${this.common.basePath}/user/dictionary/type/json`,{}).then((response) => {
          this.dataDict = response.data.data.items;
          this.loading = false;
        }).catch((error) => {
          this.loading = false;
          this.$message.error(error);  
        });
      },
      /**
       * 选择菜单项
       * @author chuanlin.Xiao
       * @date   2019-10-23T15:54:19+0800
       * @param  {[type]}                 key     菜单项的id
       * @param  {[type]}                 keyPath [菜单的id，菜单项的id]
       * @return {[type]}                         [description]
       */
      handleSelect(key, keyPath) { 
        this.activeNav = key; 
        keyPath.length>1?this.isMenuItem = true : this.isMenuItem = false;
        if(keyPath.length>1){//有菜单项
          this.getFormData(Number(key.split('-child')[0]));
        }else{//无菜单项
          
        }
      }, 
      /**
       * 提交表单
       * @param  {[type]} name [description]
       * @return {[type]}      [description]
       */
      handleSubmit(foromData) { 
        let params = {
          "cur_status": 0,
          "option_id": Number(this.activeNav.split('-child')[0]),
          "wf_config": JSON.stringify(foromData)
        } 
        this.loading = true; 
        this.axios.post(`${this.common.basePath}/activiti/field/create_field`, params).then((response) => {
          this.$message.success(response.data.meta.message);
          this.getFormData(this.activeNav.split('-child')[0])
          this.loading = false;
        }).catch((error) => {
          this.getFormData(this.activeNav.split('-child')[0])
          this.loading = false;
          this.$message.error(error);  
        }); 
      },  
    }
  }
</script> 
