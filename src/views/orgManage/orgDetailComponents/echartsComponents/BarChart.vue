<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
const debounce = require('debounce');
const animationDuration = 6000;

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '500px'
    },
    data:{
    	type:Array,
    	default:null
    },
  },
  data() {
    return {
      chart: null,
      arr_new:[],
      screenWidth:document.body.clientWidth,//屏幕宽度
    }
  },
  watch: {
    data(newValue, oldValue) {//监听数据变化
  　　　　this.arr_new = newValue;
  		 this.initChart()
  　　},
  	screenWidth(newValue, oldValue) {//监听屏幕宽度变化
  　　　　this.screenWidth = newValue;
  		 console.log('bar',newValue, oldValue)
       this.initChart();
  　　},
  },
  mounted() {
    //初始化echarts
    this.initChart();
    //自适应浏览器大小
    window.addEventListener('resize', this.__resizeHanlder);
  },
  created(){
  	// 获取屏幕宽度
  	const that = this
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        that.screenWidth = window.screenWidth
      })()
    };
		this.__resizeHanlder = debounce(() => {if (this.chart) {this.chart.resize()}}, 100) 
	},
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHanlder)
    this.chart.dispose()
    this.chart = null
  },
  methods: {

  	/* 
		 初始化echarts实例
		 */
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons');
      this.chart.resize(this.$el, {width:(this.screenWidth/2-240)+'px',});//设置初始echrts宽度
  		//获取所需数据
  		var arr = this.arr_new;
			var xBarData = [];
			var yBarData = [];
			arr.forEach( (item) => {
        xBarData.push(item.name);
        yBarData.push(item.value);
      })
			var obj = {'induceTask':'工作任务处理统计','induceIntegral':'工作任务积分统计'};
			//柱状图数据配置
			this.chart.setOption({
        title : {
          text: obj[this.className],
          subtext: '',
          x:'center',
          y:'bottom',
    		},
				tooltip: {
					trigger: 'axis',
					axisPointer: { // 坐标轴指示器，坐标轴触发有效
						type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
					}
				},
				grid: {
					top: 10,
					left: '2%',
					right: '2%',
					bottom: 60,
					containLabel: true
				},
				xAxis: [{
					type: 'category',
					data: xBarData,
					axisTick: {
						alignWithLabel: true
					}
				}],
				yAxis: [{
					type: 'value',
					axisTick: {
						show: false
					}
				}],
				series: [{
					itemStyle: {
						normal: {
							color: function(params) { 
									var colorList = ['#B74AE5','#16A085','#BA4A00',]; 
									return colorList[params.dataIndex] 
							}
						},
					},
					name: '统计',
					type: 'bar',
					stack: 'vistors',
					barWidth: '60%',
					data: yBarData,
					animationDuration: 2600,
				},]
			});
    },
  }
}
</script>
