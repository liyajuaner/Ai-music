<template>
    <div class="page">
        <top :title="title" :img="img" :count="formatData.length"></top>
        <Scroll :data="formatData" class="page-info-list">
          <song-list :data="formatData" @clickItem="addToPlay"></song-list>
        </Scroll>
    </div>
</template>

<script>
    import infoMixin from '../common/js/infoMixin';
    import axios from  'axios';
    import { formatSongDetail } from "../common/js/util";
    import { mapMutations } from 'vuex';

    export default {
        name: 'artists-info',
        mixins: [infoMixin],
        created() {
            this.getInfo(this.$route.params.id);
        },
        methods:{
            //辅助函数可以帮我们把需要用到的方法映射到组件中，使得我们可以像正常调用方法一样在该组件中调用映射过来的方法
            
            ...mapMutations([
                'SET_FULLSCREEN',
                'SET_PLAY_LIST',
                'SET_SEQUENCE_LIST',
                'SET_CURRENT_INDEX'
            ]),
            async getInfo(id) {
                const { data } = await axios.get(`/api/artists?id=${id}`);
                this.formatData = formatSongDetail(data.hotSongs);
            },
            //改变state里的值
            //辅助函数可以帮我们把所调用的方法映射成this.$store.commit的形式。
            addToPlay(item, index) {
                this.SET_FULLSCREEN(true);
                this.SET_PLAY_LIST(this.formatData);
                this.SET_SEQUENCE_LIST(this.formatData);
                this.SET_CURRENT_INDEX(index);
            }
        }
    }
</script>

<style lang="less" scoped>

</style>