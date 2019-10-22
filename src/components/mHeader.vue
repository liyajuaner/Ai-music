<template>
    <div class="header" :class="{'red':red}">
        <i class="iconfont icon-zuo" @click="goBack"></i>
        <slot></slot>
    </div> 
</template>

<script>
    export default {
        name: 'm-header',
        props:{
            red:{
                type:Boolean,
                default:true
            }
        },
        methods:{
            goBack(){
                // 返回上个页面
                this.$router.go(-1);
            }
        }
    };
</script>

<style lang="less" scoped>
    .header{
        position: fixed;
        top:0;
        left:0;
        right:0;
        height: 90px;
        line-height: 90px;
        color:#fefefe;
        font-size: 34px;
        text-align: center;
        z-index:999;
        

        &.red{
            background-color: #f2353c;
        }

        i{
            font-size: 50px;
            position: absolute;
            left:20px;
        }
    }
</style>