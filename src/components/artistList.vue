<template>
    <div>
        <ul class="artist-list">
        <li v-for="(item,index) in data" :key="index" @click="handleClick(item)">
          <img v-lazy="`${item.picUrl}?param=400y400`" alt="">
          <div class="singer">
            <p class="name">{{item.name}}</p>
            <p class="info">专辑{{item.albumSize}}张，共{{item.musicSize}}首歌</p>
          </div>
        </li>
      </ul>
    </div>
</template>

<script>
    export default {
        name: 'artist-list',
        props: {
           data: {
               type:Array,
               default(){
                   return []
               }
           }
        },
    methods: {
      handleClick(item) {
        this.$emit('clickItem', item);
      }
    }

    }
</script>

<style lang="less" scoped>
    .artist-list li{
    display:flex;
    flex-direction: row;
    align-items: center;
    padding:30px;
    border-top:1PX solid #e6e6e6;
    margin-left: -20px;
    margin-right:-20px;
  }
  .artist-list li img{
    width: 80px;
    height: 80px;
    margin-right: 30px;
  }
  .artist-list li .name{
    font-size: 30px;
    color:#000;
    margin-bottom: 20px;
  }
  .artist-list li .info{
    font-size: 24px;
    color:#b2b2b2;
  }
  .artist-list li .singer{
    text-align: left;
  }
</style>