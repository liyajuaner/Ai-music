<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-30 08:25:53
 * @LastEditTime: 2019-08-30 08:50:07
 * @LastEditors: Please set LastEditors
 -->
<!--  -->
<template>
<div class='play-list'>
    <ul>
        <li v-for="(item,index) in data" :key="index" @click="handleClick(item)">
            <img v-lazy="`${item.picUrl}?param=400y400`" alt="">
            <p>{{item.name}}</p>
            <i class="iconfont icon-zanting"></i>
        </li>
    </ul>
</div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
    name:'play-list',
    props:{
        data:{
            type:Array,
            default (){
                return []
            }
        }
    },
    methods:{
        handleClick(val){
            this.$emit('clickItem', val)
        }
    }
}
</script>
<style lang='less' scoped>
/* @import url(); 引入公共css类 */
    li{
        width:220px;
        display: inline-block;
        margin-right: 25px;
        margin-bottom: 25px;
        position: relative;
        color:#333;
        font-size: 24px;
        vertical-align: top;
    }
    li:nth-child(3n){
        margin-right:0;
    }
    img{
        width: 220px;
        height: 220px;
        margin-bottom: 15px;
    }
    i{
        position: absolute;
        top:140px;
        right: 10px;
        font-size: 40px;
        color: white;
    }
</style>