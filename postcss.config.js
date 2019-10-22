/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-27 08:04:12
 * @LastEditTime: 2019-08-27 19:44:31
 * @LastEditors: Please set LastEditors
 */
module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-pxtorem':{
       rootValue: 75,//设置根节点的font-size值
       propsList: ['*']//需要匹配的属性有哪些
    } 
  },
};
