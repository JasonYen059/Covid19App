module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
  ? '/Covid19_Data_App/'
  : '/',


    configureWebpack: {
      devServer: {
        open: true, //是否自動彈出瀏覽器頁面
        host: "localhost", 
        port: '8080',
        https: false,
        hotOnly: false,
        proxy: {
            '/api': {
                target: 'https://covid-19.nchc.org.tw', //API伺服器的地址
                ws: true,  //代理websockets
                changeOrigin: true, // 虛擬的站點需要更管origin
                pathRewrite: {   //重寫路徑 比如'/api/aaa/ccc'重寫為'/aaa/ccc'
                    '^/api': ''
                }
            }
        },
      }
    }
  }