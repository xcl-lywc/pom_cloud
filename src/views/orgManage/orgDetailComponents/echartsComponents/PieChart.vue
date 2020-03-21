<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
const debounce = require('debounce');

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
      default: '400px'
    },
    data:{
    	type:Array,
    	default:null
    }
  },
  watch: {
    data(newValue, oldValue) {//监听数据变化
  　　　　this.arr_new = newValue;
  		 this.initChart()
  　　},
    screenWidth(newValue, oldValue) {//监听屏幕宽度变化
  　　　 this.screenWidth = newValue;
      console.log('pie',newValue, oldValue)
      this.initChart();
  　　},
  },
  data() {
    return {
      chart: null,
      arr_new:[],
      screenWidth:document.body.clientWidth,//屏幕宽度
    }
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
      this.chart.resize(this.$el, {width:(this.screenWidth/4-60)+'px',});//设置初始echrts宽度
  		//获取所需数据
      var legendArr = [];
			var seriesArr = this.arr_new;
      seriesArr.forEach( (item) => {
        legendArr.push(item.name);
      }) 
			var obj = {'age':'年龄分布','politics':'政治面貌','year':'工龄分布','degree':'学位分布'};
			//饼状图数据配置
			this.chart.setOption({
				title : {
            text: obj[this.className],
            subtext: '',
            x:'center',
            y:'bottom'
        },
				tooltip: {
					trigger: 'item',
					formatter: '{a} <br/>{b} : {c} ({d}%)'
				},
				legend: {
					// orient: 'vertical',
          type: 'scroll',
					left: 'center',
					bottom: '50',
          width:(this.screenWidth/4-60-100),
					data: legendArr,
				},
				calculable: true,
				series: [
					{
						name: '占比',
						type: 'pie',
						roseType: 'radius',
						radius: [5, 95],//radius : '55%',
						center: ['50%', '50%'],
						data: seriesArr,
						animationEasing: 'cubicInOut',
						animationDuration: 2600,
						itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
					}
				]
			});
    },
		
  }
}
</script>
