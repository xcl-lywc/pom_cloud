<template>
  <div id="wangeditor">
    <div ref="tabbar" class="tabbar-area"></div>
    <div ref="editor" class="editor-area"></div>
  </div>
</template>

<script>
  import WE from 'wangeditor'
  export default {
    name:'wangeditor',
    data() {
      return {
        emotionJson: this.emotion.emotionJson ? this.emotion.emotionJson : {},
        editor:null,
        info:'',
      };
    },
    model:{
      prop:'value',
      event:'change',
    },
    props:{//接收父组件的方法、数据
      value:{
        type:String,
        default:''
      },
      isClear:{
        type:Boolean,
        default:false
      }
    },
    components: {
      
    },
    watch: {
      isClear(val){
        console.log(val)
        //触发清除文本域内容
        if(val){
          this.editor.txt.clear();
          this.info = '';
        }
      },
      value(val){
        console.log(val)
        //使用v-model时，设置初始值
        this.editor.txt.html(val);
      },
    },
    computed:{
      
    },
    created () {

    },
    mounted() {
      this.setEditor();
    },
    methods: {
      setEditor(){
        this.editor = new WE(this.$refs.tabbar,this.$refs.editor);//创建富文本实例
          let that = this;
          // this.editor.$textElem.attr('contenteditable', false);// 禁用编辑功能
          // this.editor.customConfig.showLinkImg = false;//隐藏“网络图片”tab
          
          // 下面两个配置，使用其中一个即可显示“上传图片”的tab。但是两者不要同时使用！！！
          // this.editor.customConfig.uploadImgShowBase64 = true;//base64 存储图片
          // this.editor.customConfig.uploadImgSever ='';//配置服务器端地址，上传图片到服务器

          // this.editor.customConfig.uploadImgHeaders = {//自定义header
          //   'Accept': 'multipart/form-data',
          //   'Authorization':'Bearer ' + JSON.parse(sessionStorage.getItem('Access-Token'))    //头部token
          // };
          // this.editor.customConfig.uploadFileName = 'file';//后端接受上传文件的参数名
          // this.editor.customConfig.uploadImgParams = {//自定义上传参数
          //   // 如果版本 <=v3.1.0 ，属性值会自动进行 encode ，此处无需 encode
          //   // 如果版本 >=v3.1.1 ，属性值不会自动 encode ，如有需要自己手动 encode
          // };
          // this.editor.customConfig.uploadImgParamsWithUrl = true;//将参数拼接到 url 中
          this.editor.customConfig.uploadImgMaxSize = 100*1024*1024;//将图片大小限制为100M
          this.editor.customConfig.uploadImgMaxLength = 6;//限制一次最多上传6张图片
          this.editor.customConfig.customAlert = function (info) {
            // info 是需要提示的内容
            that.$message('提示：' + info)
          };
          this.editor.customConfig.uploadImgTimeout = 3*60*1000;//设置超时时间
          this.editor.customConfig.linkImgCallback = function (url) {//插入网络图片的回调
            console.log(url) // url 即插入图片的地址
          };
          this.editor.customConfig.customUploadImg = function (files,insert) {//自定义上传图片事件
            // files 是 input 中选中的文件列表
            // insert 是获取图片 url 后，插入到编辑器的方法
            let fileObj = files[0];
            //自定义上传单张图片
            fileObj.size>100*1024*1024 ? that.$message.error('上传图片大小不能超过 100MB!') : that.customUploadImage(fileObj,insert);

            // 上传代码返回结果之后，将图片插入到编辑器中
            // insert(imgUrl)
            // this.editor.cmd.do('insertHTML', `<img style="width: 200px;height: 200px;" src=${imgUrl} alt="">`)
          };
          // this.editor.customConfig.uploadImgHooks = {//监听在上传图片的不同阶段做相应处理的函数
          //   before: (xhr, editor, files)=> {
          //       //图片上传之前触发
          //       //xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
                
          //       //如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
          //       //return {
          //       //  prevent: true,
          //       //  msg: '放弃上传'
          //       //}
          //   },
          //   fail:(xhr,editor,result)=>{
          //     //插入图片失败的回调
          //     //xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
          //   },
          //   success:(xhr,editor,result)=>{
          //     //插入图片成功的回调
          //     //xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
          //     //this.imgUrl=Object.values(result.data).toString()
          //   },
          //   timeout:(xhr,editor)=>{
          //     //网络超时的回调
          //     //xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
          //   },
          //   error:(xhr,editor)=>{
          //     //图片上传错误的回调
          //     //xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
          //   },
          //   //如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
          //   //（但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
          //   customInsert:(insertImg,result,editor)=>{
          //     //图片上传成功，插入图片的回调
          //     //图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
          //     //insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
          //     //举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
          //     // let url = Object.values(result.data)      //result.data就是服务器返回的图片名字和链接
          //     // JSON.stringify(url)    //在这里转成JSON格式
          //     // insertImg(url)
          //     //result 必须是一个 JSON 格式字符串！！！否则报错
          //   }
          // };
          this.editor.customConfig.menus = [//配置菜单
            'emoticon',  // 表情
            'image',  // 插入图片
            'link',  // 插入链接
            'list',  // 列表
            'justify',  // 对齐方式
            'quote',  // 引用
            // 'head',  // 标题
            // 'bold',  // 粗体
            // 'fontSize',  // 字号
            // 'fontName',  // 字体
            // 'italic',  // 斜体
            // 'underline',  // 下划线
            // 'strikeThrough',  // 删除线
            'foreColor',  // 文字颜色
            'backColor',  // 背景颜色
            // 'table',  // 表格
            // 'video',  // 插入视频
            // 'code',  // 插入代码
            'undo',  // 撤销
            'redo'  // 重复
          ];
          this.editor.customConfig.linkCheck = function (text, link) {//插入链接的校验
            console.log(text) // 插入的文字
            console.log(link) // 插入的链接
            return true // 返回 true 表示校验成功
            // return '验证失败' // 返回字符串，即校验失败的提示信息
          };
          this.editor.customConfig.linkImgCheck = function (src) {//插入网络图片的校验
            console.log(src) // 图片的链接
            return true // 返回 true 表示校验成功
            // return '验证失败' // 返回字符串，即校验失败的提示信息
          };
          this.editor.customConfig.colors = [// 自定义配置颜色（字体颜色、背景色）
            '#000000',
            '#eeece0',
            '#1c487f',
            '#4d80bf',
            '#c24f4a',
            '#8baa4a',
            '#7b5ba1',
            '#46acc8',
            '#f9963b',
            '#ffffff'
          ];
          this.editor.customConfig.emotions = this.emotionJson.concat([//配置表情
            {
              // tab 的标题
              title: '表情',
              // type -> 'emoji' / 'image'
              type: 'emoji',
              // content -> 数组
              content: ['😀', '😃', '😄', '😁', '😆',]
            }
          ]);
          
          this.editor.customConfig.fontNames = [// 自定义字体
              '宋体',
              '微软雅黑',
              'Arial',
              'Tahoma',
              'Verdana'
          ];
          this.editor.customConfig.zIndex = 100;    //防止富文本编辑器被别的内容所覆盖 
          this.editor.customConfig.pasteFilterStyle = false;//关闭粘贴样式的过滤
          this.editor.customConfig.onchange = (html) => {//用户操作（鼠标点击、键盘打字等）导致的内容变化之后，会自动触发此函数并获取富文本中的所有内容
            this.info = html;//绑定当前组件的值
            this.$emit('change',this.info);//将内容同步到父组件当中
          };


        this.editor.create();//创建
      },

      //自定义上传单张图片
      customUploadImage(fileObj,insert){
        // FormData 对象
        var form = new FormData();
        // 文件对象
        form.append("type", 'chatImage');
        form.append("group_id", 1);
        form.append("file", fileObj);
        this.axios.post(`${this.common.baseAuthPath}/file/upload`,form,{ headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => {
          if(res.data.meta.code === 0){
            let path = res.data.data[0].path;
            let fileName = res.data.data[0].fileName;
            let fileId = res.data.data[0].fileId;
            if(fileObj.size>185846){//图片太大，限制宽612高334
              this.editor.cmd.do('insertHTML', '<img  src="'+ path +'" alt="'+ fileName +'" width="612" height="334"/>') 
            }else{
              insert(path);
            }
            this.$message.success("成功！！", 20);
          }else{
            this.$message.error(res.data.meta.message);
          }
        }).catch((error) => {
          this.$message.error(error);
        });
      },

      //清除文本域内容
      clearContent(){
        this.editor.txt.clear();
        this.info = '';
      },
      
    },
  }
</script>

<style scoped lang="less">
  #wangeditor{
    width:100%;
    margin:0 auto;
    .tabbar-area{
      background: #2196F3;
      height:50px;
      line-height:40px;
    }
    .editor-area{
      border:1px solid #ddd;
      height:300px;
    }
  }
</style>
