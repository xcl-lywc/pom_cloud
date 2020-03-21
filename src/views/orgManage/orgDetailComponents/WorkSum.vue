<!-- 工作总结 -->
<template>
  <div class="work-sum" v-loading="loading">
    <div v-show="orgId">
        <span>成员组成</span>
        <el-divider></el-divider>
        <el-row :gutter="32">
          <el-col :xs="24" :sm="12" :lg="6" v-loading="loading_age">
            <pie-chart className="age" :data="arr_age"></pie-chart>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6" v-loading="loading_politics">
            <pie-chart className="politics" :data="arr_politics"></pie-chart>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6" v-loading="loading_year">
            <pie-chart className="year" :data="arr_year"></pie-chart>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6" v-loading="loading_degree">
            <pie-chart className="degree" :data="arr_degree"></pie-chart>
          </el-col>
        </el-row>

        <span>工作总结</span>
        <el-divider></el-divider>
        <el-row :gutter="32">
          <el-col :xs="24" :sm="24" :lg="12" v-loading="loading_induceTask">
            <el-select v-model="value" placeholder="请选择" size="small" class="work-select-box marb20 marl20" @change="getBarData(newOrgId,'induceTask',$event);"> 
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <bar-chart className="induceTask" :data="arr_induceTask"></bar-chart>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="12" v-loading="loading_induceIntegral">
            <el-select v-model="value1" placeholder="请选择" size="small" class="work-select-box marb20 marl20" @change="getBarData(newOrgId,'induceIntegral',$event);"> 
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <bar-chart className="induceIntegral" :data="arr_induceIntegral"></bar-chart>
          </el-col>
        </el-row>
    </div>
    <div v-show="!orgId" class="content-empty">
      <span>暂无工作总结，请选择组织</span>
    </div>   
  </div>
</template>
<script>
  import echarts from 'echarts'
  import PieChart from './echartsComponents/PieChart'
  import BarChart from './echartsComponents/BarChart'
  export default {
    name: 'dashboard-admin',
    components: {
      PieChart,
      BarChart,
    },
    props:['data'],
    data () {
      return {
        newOrgId:null,
        loading:false,
        loading_age:false,
        loading_politics:false,
        loading_year:false,
        loading_degree:false,
        loading_induceTask:false,
        loading_induceIntegral:false,
        arr_age:[],
        arr_politics:[],
        arr_year:[],
        arr_degree:[],
        arr_induceTask:[],
        arr_induceIntegral:[],



        options: [
          {
            value: 4,
            label: '最近四年内'
          }, {
            value: 3,
            label: '最近三年内'
          }, {
            value: 2,
            label: '最近两年内'
          }, {
            value: 1,
            label: '最近一年内'
          }
        ],
        value: 4,
        value1: 4,
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
      // this.initEcharts();
    },
    methods: {

        /**
         * 初始化请求
         * @param  {[type]} orgId 组织id
         * @return {[type]}       [description]
         */
        initEcharts(orgId){
          this.value = 4;
          this.value1 = 4;
          this.getPieData(orgId,'ags');
          this.getPieData(orgId,'political');
          this.getPieData(orgId,'wAgs');
          this.getPieData(orgId,'aDegree');
          this.getBarData(orgId,'induceTask',4);
          this.getBarData(orgId,'induceIntegral',4);
        },

        /**
         * 获取饼图数据
         * @param  {[type]} id   组织id
         * @param  {[type]} path 请求地址
         * @return {[type]}      [description]
         */
        getPieData(id,path){
          this.loading_age = true;
          this.loading_politics = true;
          this.loading_year = true;
          this.loading_degree = true;
          this.axios.get(`${this.common.baseAuthPath}/orgs/work/${path}`,{params:{org_id:id}}).then( (response) => {
              if(response.data.meta.code === 0){
                  //请求获取所需数据
                  if(path==='ags'){
                    this.arr_age = response.data.data ? response.data.data : [];
                    this.loading_age = false;
                  }else if(path==='political'){
                    this.arr_politics = response.data.data ? response.data.data : [];
                    this.loading_politics = false;
                  }else if(path==='wAgs'){
                    this.arr_year = response.data.data ? response.data.data : [];
                    this.loading_year = false;
                  }else if(path==='aDegree'){
                    this.arr_degree = response.data.data ? response.data.data : [];
                    this.loading_degree = false;
                  }
              }else{
                  this.$message.error(response.data.meta.message, 20);   
              }
              this.loading = false;
          }).catch( (error) => {
              this.loading_age = false;
              this.loading_politics = false;
              this.loading_year = false;
              this.loading_degree = false;
              this.$message.error(error);
          });
        },

        /**
         * 获取柱状图数据
         * @param  {[type]} id   组织id
         * @param  {[type]} year 年
         * @param  {[type]} path 请求地址
         * @return {[type]}      [description]
         */
        getBarData(id,path,year){
          path==='induceTask' ? this.loading_induceTask = true:this.loading_induceIntegral = true;
          this.axios.post(`${this.common.baseAuthPath}/integralO/${path}`,{org_id:id,year:year}).then( (response) => {
              if(response.data.meta.code === 0){
                  //请求获取所需数据
                  if(path==='induceTask'){
                    this.arr_induceTask = response.data.data ? response.data.data : [];
                    this.loading_induceTask = false;
                  }else if(path==='induceIntegral'){
                    this.arr_induceIntegral = response.data.data ? response.data.data : [];
                    this.loading_induceIntegral = false;
                  }
              }else{
                  this.$message.error(response.data.meta.message, 20);   
              }
              this.loading = false;
          }).catch( (error) => {
              this.loading_induceTask = false;
              this.loading_induceIntegral = false;
              this.$message.error(error);
          });
        },
    }
  }
</script>

<style lang="less" scoped>
   .work-sum{
      
   }
</style>