<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-27 08:04:12
 * @LastEditTime: 2019-08-27 13:06:08
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div id="app">
    <router-view/>
    <player></player>
  </div>
</template>

<script>
import eruda from 'eruda';
import Player from './components/player.vue'
export default {
  name:'app',
  components:{
    Player 
  },
  //初始化eruda，并将它添加到页面中
   created() {
      const el = document.createElement('div');
      document.body.appendChild(el);
      eruda.init({
        container: el,//打印后最终展现的位置
        tool: ['console', 'elements'] //调试工具需要哪些项目，可以在这里添加
      });
    }
}
</script>
<style lang="less">

</style>
