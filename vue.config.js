/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-27 09:47:21
 * @LastEditTime: 2019-09-06 20:26:58
 * @LastEditors: Please set LastEditors
 */
module.exports = {
    publicPath:  './',
    //警告 webpack 的性能提示
    configureWebpack: {
        performance: {
            hints: 'warning',
            //入口起点的最大体积 整数类型（以字节为单位）
            maxEntrypointSize: 50000000,
            //生成文件的最大体积 整数类型（以字节为单位 300k）
            maxAssetSize: 30000000,
            //只给出 js 文件的性能提示
            assetFilter: function (assetFilename) {
                return assetFilename.endsWith('.js');
            }
        }
    },
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',//把以/api开头的接口全部代理到http://localhost:3000上去
                changeOrigin: true,//配置是否需要跨域
                pathRewrite: {
                '/api': '/'
                //重写请求地址。因为我们在项目中发请求的时候为了让我们的代理服务去识别哪些接口需要代理，哪些接口不需要代理，
                //都会在接口前面添加一个统一的/api的标识,但是在我们的api服务当中是没有这个/api的地址的，
                //这样会导致请求不到接口所以我们都会重写请求地址把所有的/api都用/来代替，这样最终请求的地址才是对的。
                //proxy的最终目的判断哪些接口需要通过代理服务器去请求数据并且能正确的请求到我们的数据返回来
                }
            }
        }
    }
}
