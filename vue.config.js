module.exports = {
  lintOnSave: false,
  outputDir: "dist",
  assetsDir: "assets",
  devServer: {
    proxy: {
      '^/file': {//文件api代理
        target: 'http://192.168.31.10:19001',
        pathRewrite: {'^/file' : ''}, //重定向
        secure: false
      }, 
      '/api': {//通用api代理
        target: 'http://192.168.31.10:19999',
        ws:true, // 为true表示可以给webscoket使用
        pathRewrite: {'^/api' : ''}, //重定向
        secure: false
      },
      '/chat': {//聊天api代理
        target: 'http://192.168.31.10:19007',
        ws:true, // 为true表示可以给webscoket使用
        pathRewrite: {'^/chat' : ''}, //重定向
        secure: false
      },
      '/ms': {//维护系统api代理
        target: 'http://192.168.31.9:8081',
        pathRewrite: {'^/ms' : ''}, //重定向
        secure: false
      }, 
    }
  }
}