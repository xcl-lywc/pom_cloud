<template>
  <div id="app">
    <!-- 根据需要显示不同的布局情况 -->
    <component :is="layout"></component>
  </div>
</template>

<script>
  import BlankLayout from "./layout/BlankLayout.vue";
  import NavLayout from "./layout/NavLayout.vue"

  export default {
    name:'app',
    provide(){
      return{
        reload:this.reload
      };
    },
    data(){
      return{
        isRouterAlive:true
      };
    },
    props: {
      layout: {
        type: String,
        default: "nav-layout"
      }
    },
    watch: {
      "$route": {
        handler (to, from) {
          if(from.path) {
            sessionStorage.setItem("historyName", from.name)
          }
        },
        deep: true
      },
    },
    components: {
      "nav-layout":   NavLayout,                                    
      "blank-layout": BlankLayout
    },
		data() {
      return {

      };
    },
    created(){
      // if(!sessionStorage.getItem('Access-Token')) {
      //   this.$message.error("登录失效, 请重新登录!");
      //   setTimeout(()=> {
      //     this.$router.push({name: "Login"})
      //   }, 2000)
      // } else {}
    },
		mounted() {
      console.log(this.$route);
		},
    methods: {
      reload(){
        this.isRouterAlive = false;
        this.$nextTick(function(){
          this.isRouterAlive = true;
        })
      }
    }
  }
</script>
<style>
  
</style>
