<!-- 详情 -->
<template>
  <div class="content-wrap-box detail" ref="contentWrap">
    <!-- 头部导航栏 -->
    <div class="top-nav">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item><h3 class="title">{{common.showTitle(title).mainName}}</h3></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="middle-content">
      <div class="org-detail">
        <el-select class="org-select fl" size="small" v-loading="selectLoading" v-model="orgValue" placeholder="请选择组织名称" @change="onChange" value-key='name' clearable filterable @clear="orgValue = null" @focus="orgList.length==0 ? getOrgList() : ''">
          <el-option v-for="item in orgList" :label="item.name" :value="item.id" :key="item.id">
            <div class="fill-width overflow-hidden">  <!-- @click.stop="onClick(item.id)" -->
              <span slot="title">{{item.name}}</span>
            </div>
          </el-option>
        </el-select>
        <div class="org-icon fl">
          <i class="sort-line">---</i>
          <i class="el-icon-d-arrow-right"></i>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick" class="org-tabs fl">
          <el-tab-pane label="组织信息" name="1"></el-tab-pane>
          <el-tab-pane label="班子成员" name="2"></el-tab-pane>
          <el-tab-pane label="人员名册" name="3"></el-tab-pane>
          <el-tab-pane label="工作总结" name="4"></el-tab-pane>
          <el-tab-pane label="组织结构" name="5"></el-tab-pane>
        </el-tabs>
      </div>
      <span class="page-title">{{subName}}</span>
      <div class="detail-content">
        <div>
          <org-info v-show="activeName === '1'" :data="orgValue" ref="info"></org-info>
          <team-member v-show="activeName === '2'" :data="orgValue" ref="team"></team-member>
          <person-roster v-show="activeName === '3'" :data="orgValue" ref="roster"></person-roster>
          <work-sum v-show="activeName === '4'" :data="orgValue" ref="work"></work-sum>
          <org-structure v-show="activeName === '5'" :data="orgValue" ref="structure"></org-structure>
        </div>
        <!-- <div v-else class="content-empty">
          暂无数据
        </div> -->
      </div>
    </div>
    <div class="bottom-function"></div>
  </div>
</template>
<script>
  import OrgInfo from "./orgDetailComponents/OrgInfo.vue"
  import TeamMember from "./orgDetailComponents/TeamMember.vue"
  import PersonRoster from "./orgDetailComponents/PersonRoster.vue"
  import WorkSum from "./orgDetailComponents/WorkSum.vue"
  import OrgStructure from "./orgDetailComponents/OrgStructure.vue"
  export default {
    components: {
      'org-info': OrgInfo,
      'team-member': TeamMember,
      'person-roster': PersonRoster,
      'work-sum': WorkSum,
      'org-structure': OrgStructure,
    },
    data () {
      return {
        title:null,
        selectLoading:false,
        orgList: [],
        orgValue: null,//组织id

        activeName: '1',
        subName:'组织信息',
      };
    },
    created() {
     this.title = this.$route.name;
    },
    mounted() {
      // console.log(this.$route)
      this.getOrgList();
    },
    methods: {

      /**
       * 组织列表select onClick事件
       * @param  {[type]} val 组织id
       * @return {[type]}     [description]
       */
      onClick(val){
        this.orgValue = val;
        let active = this.activeName;

        if(active === '1'){
          this.orgValue ? this.$refs.info.getOrgDetail(this.orgValue) : '';
          this.orgValue ? this.$refs.info.getTeamSetList(this.orgValue) : '';
          this.orgValue ? this.$refs.info.getNoticeList(this.orgValu,true) : '';
          this.orgValue ? this.$refs.info.getSelectList('orgNature') : '';
          this.orgValue ? this.$refs.info.getSelectList('orgType') : '';
        }else if(active === '2'){
          this.orgValue ? this.$refs.team.getPositionList(this.orgValue) : '';
          this.orgValue ? this.$refs.team.getTeamList(this.orgValue) : '';
        }else if(active === '3'){
          this.orgValue ? this.$refs.roster.getPersonList(this.orgValue) : '';
        }else if(active === '4'){
          this.orgValue ? this.$refs.work.initEcharts(this.orgValue) : '';
          // this.orgValue ? this.$refs.work.queryAge(this.orgValue) : '';
        }else if(active === '5'){
          this.orgValue ? this.$refs.structure.getOrgTypeList() : '';
          this.orgValue ? this.$refs.structure.getOrgsChildList(this.orgValue) : '';
          this.orgValue ? this.$refs.structure.getSelectList('orgNature') : '';
        }
      },

      /**
       * 组织列表select onChange事件
       * @param  {[type]} val 组织id
       * @return {[type]}     [description]
       */
      onChange(val){
        this.orgValue = val;
        let active = this.activeName;

        if(active === '1'){
          this.orgValue ? this.$refs.info.getOrgDetail(this.orgValue) : '';
          this.orgValue ? this.$refs.info.getTeamSetList(this.orgValue) : '';
          this.orgValue ? this.$refs.info.getNoticeList(this.orgValue,true) : '';
          this.orgValue ? this.$refs.info.getSelectList('orgNature') : '';
          this.orgValue ? this.$refs.info.getSelectList('orgType') : '';
        }else if(active === '2'){
          this.orgValue ? this.$refs.team.getPositionList(this.orgValue) : '';
          this.orgValue ? this.$refs.team.getTeamList(this.orgValue) : '';
        }else if(active === '3'){
          this.orgValue ? this.$refs.roster.getPersonList(this.orgValue) : '';
        }else if(active === '4'){
          this.orgValue ? this.$refs.work.initEcharts(this.orgValue) : '';
          // this.orgValue ? this.$refs.work.queryAge(this.orgValue) : '';
        }else if(active === '5'){
          this.orgValue ? this.$refs.structure.getOrgTypeList() : '';
          this.orgValue ? this.$refs.structure.getOrgsChildList(this.orgValue) : '';
          this.orgValue ? this.$refs.structure.getSelectList('orgNature') : '';
        }
      },

      /**
       * tab 被选中时触发
       * @param  {[type]} tab   [description]
       * @return {[type]}       [description]
       */
      handleClick(tab) {
        if(tab.name === '1'){
          this.subName = '组织信息' ;
          this.orgValue ? this.$refs.info.getOrgDetail(this.orgValue) : '';
          this.orgValue ? this.$refs.info.getTeamSetList(this.orgValue) : '';
          this.orgValue ? this.$refs.info.getNoticeList(this.orgValue,true) : '';
          this.orgValue ? this.$refs.info.getSelectList('orgNature') : '';
          this.orgValue ? this.$refs.info.getSelectList('orgType') : '';
        }else if(tab.name === '2'){
          this.subName = '班子成员' ;
          this.orgValue ? this.$refs.team.getPositionList(this.orgValue) : '';
          this.orgValue ? this.$refs.team.getTeamList(this.orgValue) : '';
        }else if(tab.name === '3'){
          this.subName = '人员名册' ;
          this.orgValue ? this.$refs.roster.getPersonList(this.orgValue) : '';
        }else if(tab.name === '4'){
          this.subName = '工作总结' ;
          this.orgValue ? this.$refs.work.initEcharts(this.orgValue) : '';
          // this.orgValue ? this.$refs.work.queryAge(this.orgValue) : '';
        }else if(tab.name === '5'){
          this.subName = '组织结构' ;
          this.orgValue ? this.$refs.structure.getOrgTypeList() : '';
          this.orgValue ? this.$refs.structure.getOrgsChildList(this.orgValue) : '';
          this.orgValue ? this.$refs.structure.getSelectList('orgNature') : '';
        }
      },

      /**
       * 组织的selectList查询 POST
       * @return {[type]} [description]
       */
      getOrgList(){
        this.selectLoading = true;
        this.axios.post(`${this.common.baseAuthPath}/orgs/list`,{}).then((response) => {
          this.selectLoading = false;
          this.orgList=response.data.data.rows;
          if(response.data.data.total>0){//默认显示第一个组织的详情
            this.orgValue = response.data.data.rows[0].id;
            this.orgValue ? this.handleClick({name:this.activeName}) : '';
          }
        }).catch((error) => {
          this.selectLoading = false;
          this.$message.error(error);  
        });
      },
     
    }
  }
</script>
<style lang="less" scoped>
   .detail{

   }
</style>