<template>
  <div>
    <div v-show="!fullScreen" class="mini-player">
      <div class="player-info" @click="toggleShow(true)">
        <div class="player-img rotate" :class="rotateStop">
          <img :src="songImg" alt="" />
        </div>
        <div>
          <p class="player-name">{{songName}}</p>
          <p class="player-artists">
            <span v-for="(item, index) in songArtists" :key="index">{{item.name}}</span>
          </p>
        </div>
      </div>
      <div class="player-operate">
        <i class="iconfont icon-op" :class="playIcon" @click="togglePlay"></i>
        <i class="iconfont icon-xiayiqu" @click="next"></i>
      </div>
      <div class="mini-progress" :style="{width: `${barPercent}`}"></div>
    </div>
    <transition name="player">
      <div class="player" v-show="fullScreen" :style="{'backgroundImage': `url(${songImg})`}">
        <div class="player-mask"></div>
        <div class="player-header">
          <i class="iconfont icon-xia" @click="toggleShow(false)"></i>
          <div class="header-info">
            <p>{{songName}}</p>
            <p class="header-artists">
              <span v-for="(item, index) in songArtists" :key="index">{{item.name}}</span>
            </p>
          </div>
        </div>
        <swiper :options="swiperOption">
          <swiper-slide class="img-container">
            <img class="rotate" :class="rotateStop" :src="songImg" alt="" />
            <i class="iconfont icon-xiai" :class="{'icon-xiai-red': isLove}" @click="addToLove"></i>
          </swiper-slide>
          <swiper-slide class="lyric-container">
            <scroll ref="lyricScroll" class="lyric-scroll">
              <div>
                <ul v-if="lyricLines.length > 0">
                  <li ref="lyricLine" class="list-item" :class="{'active': index === currentLineNumber}" v-for="(item, index) in lyricLines" :key="index">
                    {{item.txt}}
                  </li>
                </ul>
                <div v-else>暂无歌词</div>
              </div>
            </scroll>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
        <div class="player-operate">
          <div class="operate-mask"></div>
          <div class="progress">
            <span class="time">{{formatTime(currentTime)}}</span>
            <div class="progress-bar" ref="progressBar" @click="progressClick">
              <div class="bar-moved" :style="{width: `${barPercent}`}"></div>
              <div class="bar-btn" :style="{left: `${barPercent}`}" 
                  @touchmove.prevent="progressMove" @touchend="progressEnd">
              </div>
            </div>
            <span class="time">{{formatTime(overTime)}}</span>
          </div>
          <div class="operate-icon">
            <i class="iconfont ft-40" :class="modeIcon" @click="changeMode"></i>
            <i class="iconfont icon-shangyiqu ft-80" @click="prev"></i>
            <i class="iconfont ft-100" :class="playIcon" @click="togglePlay"></i>
            <i class="iconfont icon-xiayiqu ft-80" @click="next"></i>
            <i class="iconfont icon-more ft-40" @click="togglePlaylistShow"></i>
          </div>
        </div>
      </div>
    </transition>
    <div v-if="playlistShow" @click="togglePlaylistShow" class="playlist-mask"></div>
    <transition name="playlist">
      <scroll v-if="playlistShow" class="playlist-scroll">
        <ul>
          <li v-for="(item, index) in playList" :key="index" @click="addToPlay(index)">
            <p>{{item.name}} - <span class="artists-name" v-for="(arItem, arIndex) in item.ar" :key="arIndex">{{arItem.name}}</span></p>
            <i class="iconfont icon-shanchu2" @click.stop="delFromPlayList(item)"></i>
          </li>
        </ul>
        <div class="close" @click="togglePlaylistShow">关闭</div>
      </scroll>
    </transition>
    <audio :src="musicData.url" ref="audio" @ended="end" @timeupdate="updateTime"></audio>
  </div>
</template>

<script>
  import axios from 'axios';
  import { mapGetters, mapMutations } from 'vuex';
  import { playMode } from '../common/js/aliasConfig';
  import Scroll from './scroll';

export default {
  name: "player",
  components: {
      Scroll
    },
  data() {
    return {
      swiperOption: {
        pagination: {
          el: ".swiper-pagination"
        }
      },
      musicData: {},    //播放地址
      lyricData: null,  //歌词信息
      playing: false,   //当前播放状态
      loaded: false,   
      currentTime: 0,   //当前时长
      overTime: 0,      //总时长
      touchBarWillMove: false,  //是否有拖动
      lyricLines: [],   //存储格式化之后的数据状态
      currentLineNumber: 0,
      playlistShow: false //展开还是关闭的状态
    };
  },
  computed: {
    //通过辅助函数mapGetters获取state中的值
    ...mapGetters([
        'fullScreen',
        'playList',
        'sequencesList',
        'currentIndex',
        'currentSong',
        'mode',
        'isLove'
      ]),
      //借助辅助函数获取播放器上具体的内容信息
      songName(){
        return this.currentSong ? this.currentSong.name : '暂无数据'
      },
      songArtists() {
        return this.currentSong ? this.currentSong.ar : [];
      },
      songImg() {
        return this.currentSong && this.currentSong.al.picUrl ? `${this.currentSong.al.picUrl}?param=400y400` : require('../assets/image/user-bg.png');
      },
      playIcon() {
        return this.playing ? 'icon-bofang' : 'icon-zanting';
      },
      //如果mode的值等于playMode.sequence，给对应图标添加'icon-liebiaoxunhuan'，以此类推
      modeIcon() {
        return this.mode === playMode.sequence ? 'icon-liebiaoxunhuan' : (this.mode === playMode.loop ? 'icon-danquxunhuan' : 'icon-suiji');
      },
      //计算当前歌曲播放时间占歌曲总时长的百分比
      barPercent() {
        let p = this.currentTime / this.overTime;
        if (p === 0) {
          return 0;
        }
        p = Number(p * 100).toFixed();
        return `${p}%`;
      },
      //添加转动的时机，当播放状态为播放的时候转动它，为暂停的时候让它停下来，然后将这个样式动态的添加到img标签上
      rotateStop() {
        return this.playing ? '' : 'rotate-stop';
      }
  },
  //监听currentSong的值是否变化，如果改变就去调用接口请求数据
    watch: {
      currentSong(newVal, oldVal) {
        if (oldVal === undefined || newVal.id !== oldVal.id) {
          this.getMusicUrl(newVal.id);
          this.getLyricData(newVal.id);
        }
      }
    },
  methods: {
    //将mutations中的方法映射到组件中，使得组件可以调用这个方法做一些其他操作
      ...mapMutations([
        'SET_FULLSCREEN',
        'SET_CURRENT_INDEX',
        'SET_MODE',
        'SET_PLAY_LIST',
        'DEL_FROM_PLAY_LIST',
        'SET_HISTORY_LIST',
        'SET_LOVE_LIST',
        'DEL_FROM_LOVE_LIST'
      ]),
      //借助映射过来的方法对state中的值进行更改。
      //辅助函数映射方法本质是和this.$store.commit起的是同样的作用。
      toggleShow(val) {
         this.SET_FULLSCREEN(val);
      },
      //获取歌曲的播放地址
      async getMusicUrl(id) {
          const { data } = await axios.get(`/api/song/url?id=${id}`);
          if (data.code === 200 && data.data[0].code === 200) {
            this.musicData = data.data[0];
            //获取到播放地址之后实现播放歌曲的功能
            //需要dom更新之后再去调用播放歌曲的方法，所以这个方法要放到this.$nextTick的回调函数里
            this.$nextTick(() => {
              this.togglePlay(true);
              //播放完当前歌曲后把该歌曲添加到历史播放记录中
              this.SET_HISTORY_LIST(this.currentSong);
            });
          }
        },
      //获取歌词信息
      async getLyricData(id) {
        const { data } = await axios.get(`/api/lyric?id=${id}`);
        if (data.code === 200 && data.lrc) {
          this.lyricData = data.lrc.lyric;
          this.initLines();
        } else {
          this.lyricData = null;
        }
      },
      //播放歌曲的方法
      togglePlay(val) {
        if (!this.currentSong) return;
        if (val === true || val === false) {
          this.playing = val;
        } else {
          this.playing = !this.playing;
        }
        //通过this.$refs.audio获取到audio，在结合playing的状态来控制播放的状态是暂停还是播放。
        const audio = this.$refs.audio;
        if (this.playing) {
          audio.play(); //playing为播放的话状态就是播放
        } else {
          audio.pause(); //playing为暂停的话状态就是暂停
        }
      },
      //上一曲
       prev() {
        // if (!this.loaded) return;
        //   this.loaded = false;
          const len = this.playList.length; //获取播放列表的长度
          let newIndex = this.currentIndex - 1;
        if (newIndex < 0) {
          //如果当前歌曲已经是整个播放列表的第一首歌曲，那么再去切换的话就会切换到最后一首歌曲，所以是len-1
          newIndex = len - 1; 
        }
        //调用SET_CURRENT_INDEX方法更新newIndex的值，同时currentSong也就会同步的更新
        this.SET_CURRENT_INDEX(newIndex);
       },
      //下一曲
      next() {
        // if (!this.loaded) return;
        //   this.loaded = false;
          const len = this.playList.length;
          let newIndex = this.currentIndex + 1;
        //如果当前歌曲已经是整个播放列表的最后一首歌曲，那么再去切换的话就会切换到第一首歌曲
        if (newIndex === len) {
          newIndex = 0;
        }
          this.SET_CURRENT_INDEX(newIndex); 
      },
      changeMode() {
        const modeNumber = (this.mode + 1) % 3; //拿到当前模式的值
        this.SET_MODE(modeNumber); //通过SET_MODE方法更细modeNumber的值
        //根据modeNumber的值进行播放列表模式的更新
        let newPlayList = []; //当前播放列表的状态
        if (this.mode === playMode.random) {
          //当前播放模式为随机播放，播放列表更新为随机播放
          newPlayList = this.getRandomList(this.sequencesList);
        } else {
          //否则还是保持最原始的列表顺序
          newPlayList = this.sequencesList;
        }
        //找到当前播放歌曲的在新的播放列表中的index值
        const newIndex = newPlayList.findIndex(item => item.id === this.currentSong.id);
        //更新当前播放列表的状态
        this.SET_PLAY_LIST(newPlayList);
        //更新当前歌曲在新的播放列表中的index值
        this.SET_CURRENT_INDEX(newIndex);
      },
      //将原有的播放列表顺序打乱，随机排序
      getRandomList(arr) {
        const newArr = [].concat(arr);
        return newArr.sort((a, b) => (Math.random() > 0.5 ? -1 : 1));
      },
      //当前歌曲播放完成之后
      end() {
        if (this.mode === playMode.loop) {
          //如果当前模式为单曲循环，那就执行单曲循环的方法
          this.loop();
        } else {
          //否则执行下一首的方法
          this.next();
        }
      },
      //单曲循环
      loop() {
        const audio = this.$refs.audio;
        audio.currenTime = 0;
        audio.play();
      },
      //播放歌曲
       updateTime(e) {
        if (!this.touchBarWillMove) {
          //拿到歌曲的当前播放事件和总时长
          //如果没有不在拖动了就执行底下的方法，如果拖动就不执行
          this.currentTime = e.target.currentTime;
          this.overTime = e.target.duration;
        }
        if (this.lyricData) {
          this.moveLyric();
        }
      },
      //时间转换方法
      formatTime(val) {
        //判断val是不是一个数值，如果不是的话返回00:00
        if (isNaN(val)) return '00:00';
        //除以60，数值向下取整获取分钟。
        let m = Math.floor(val / 60);
        //除以60后取余数，获得到的数值向下取整获取秒数。
        let s = Math.floor(val % 60);
        //若数值小于四位数，而且分钟数小于10，给他前面加上0
        if (m < 10) {
          m = `0${m}`;
        }
        //同理，秒数小于10的话给它前面也加上0
        if (s < 10) {
          s = `0${s}`;
        }
        return `${m}:${s}`;
      },

      //滚动条上的按钮绑定拖动事件触发的方法
      progressMove(e) {
        //当不拖动时
        this.touchBarWillMove = true;
        //当前鼠标点击按钮时，按钮距离左边起始位置的坐标
        const pageX = e.touches[0].pageX;
        //调用calcPercent方法重新计算当前坐标占总时长的百分比
        this.calcPercent(pageX);
      },

      //按钮直接点击进度条的任意一处来改变播放状态
      progressClick(e) {
        this.touchBarWillMove = true;
        const pageX = e.pageX;
        this.calcPercent(pageX);
        //调用resetPlayer方法，重新设置播放器的播放进度
        this.resetPlayer();
      },
      //重新计算按钮当前坐标占总时长的百分比
      calcPercent(x) {
        //按钮距离最左边的距离
        const offsetLeft = this.$refs.progressBar.offsetLeft;
        //进度条的宽度
        const barWidth = this.$refs.progressBar.clientWidth;
        //得到最终移动的距离=拖动的最终坐标-进度条距离左边的距离
        let movedWidth = x - offsetLeft;
        //如果移动的距离等于进度条的宽度，那移动的距离就等于进度条的总长度
        if (movedWidth > barWidth) movedWidth = barWidth;
        if (movedWidth < 0) movedWidth = 0;
        //滑动的百分比
        const p = movedWidth / barWidth;
        //当前播放时长=总时长*滑动的百分比
        this.currentTime = this.overTime * p;
        
        this.moveLyric();
      },
      //拖动完成后，调用resetPlayer方法，重新设置播放器的播放进度
      progressEnd() {
        this.resetPlayer();
      },
      //拿到当前播放时长后就可以重新设置播放器的播放进度
      resetPlayer() {
        this.$refs.audio.currentTime = this.currentTime;
        this.togglePlay(true);
        //当拖动时，又可以继续更新当前时长和总时长
        this.touchBarWillMove = false;
      },
      //格式化歌词数据
      initLines() {
        //格式化数据为空
        this.lyricLines = [];
        if (this.lyricData) {
          //将lyricData用\n分割成一个个数组
          const lines = this.lyricData.split('\n');
          //遍历数组，对数组的每一行的歌词进行处理
          for (let i = 0; i < lines.length; i += 1) {
            //拿到每一行的值
            const line = lines[i];
            //使用正则
            const timeExp = /\[(\d{2}):(\d{2}\.\d{2,3})\]/g;
            //匹配出分钟和秒数
            const result = timeExp.exec(line);
            if (result) {
              //格式化分钟和秒数
              const time = Number(result[1] * 60 * 1000) + Number(result[2] * 1000);
              //匹配出歌词
              //把正则匹配出来的时间用空字符串代替，其实就是将数组中的时间删除就只剩下歌词。
              const txt = line.replace(timeExp, '').trim();
              //将匹配出来的时间和文本保存到用来存储格式化后歌词的数组中
              this.lyricLines.push({
                time,
                txt
              });
            }
          }
        }
      },
      moveLyric() {
        this.currentLineNumber = this.findCurrentNumber(this.currentTime * 1000);
        //歌词播放6行以后才去滚动歌词
        if (this.currentLineNumber > 6) {
          //调用crollToElement方法
          this.$refs.lyricScroll.scrollToElement(this.$refs.lyricLine[this.currentLineNumber - 6], 1000);
        } else {
          this.$refs.lyricScroll.scrollTo(0, 0, 1000);
        }
      },
      //当前播放时间
      findCurrentNumber(time) {
        //遍历格式化的歌词数组
        for (let i = 0; i < this.lyricLines.length; i += 1) {
          //如果歌词显示的时间<播放时的时间，返回当前行的歌词
          if (time < this.lyricLines[i].time) {
            return i - 1;
          }
        }
        //当当前播放时间>歌词中的时间时，那段时间只有音乐，让歌词一直停留在最后一句即可
        return this.lyricLines.length - 1;
      },
      //展开还是关闭
      togglePlaylistShow() {
        this.playlistShow = !this.playlistShow;
      },
      //点击任意一首歌曲，播放当前歌曲
      addToPlay(index) {
        //将当前歌曲的index传递给SET_CURRENT_INDEX方法，播放当前歌曲
        this.SET_CURRENT_INDEX(index);
        //关闭当前播放列表
        this.togglePlaylistShow();
      },
      delFromPlayList(item) {
        this.DEL_FROM_PLAY_LIST({
          delSong: item,
          curSong: this.currentSong
        });
      },
      addToLove() {
        if (this.isLove) {
          //如果存在，删除当前歌曲
          this.DEL_FROM_LOVE_LIST(this.currentSong);
        } else {
          //如果不不存在，将当前歌曲添加到收藏列表当中
          this.SET_LOVE_LIST(this.currentSong);
        }
      }
  }
};
</script>

<style lang="less" scoped>
.mini-player {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #150a06;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: white;
  padding: 10px 30px 10px 20px;
  z-index: 9999;

  .player-info {
    display: flex;
    flex-direction: row;
    align-items: center;

    .player-img {
      width: 80px;
      height: 80px;
      flex-shrink: 0;
      overflow: hidden;
      border-radius: 50%;
      border: 4px solid #695945;
      margin-right: 20px;

      img {
        width: 100%;
      }
    }
  }
  .player-name {
    font-size: 26px;
    margin-bottom: 10px;
    line-height: 30px;
  }

  .player-artists {
    font-size: 20px;
    color: #b2b2b2;
  }
  .player-operate {
    i {
      font-size: 65px;
      color: #c9c3c1;
    }

    .icon-op {
      margin-right: 50px;
    }
  }

  .mini-progress {
    height: 6px;
    background-color: #f2353c;
    position: absolute;
    left: 0;
    bottom: 0;
  }
}
.player {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  overflow: hidden;
  color: white;

  &:after {
    content: "";
    background: inherit;
    position: absolute;
    top: -40px;
    left: -40px;
    width: calc(100% + 80px);
    height: calc(100% + 80px);
    filter: blur(20px);
    z-index: -2;
  }

  .player-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    opacity: 0.5;
    z-index: -1;
  }
  .player-header {
    height: 60px;
    padding: 30px;

    i {
      font-size: 46px;
      position: absolute;
      left: 30px;
      top: 30px;
    }

    .header-info {
      width: 70%;
      margin: 0 auto;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 30px;
    }

    .header-artists {
      font-size: 18px;
      color: #b2b2b2;
      margin-top: 12px;
    }
  }

  .swiper-container {
    width: 100%;
    height: calc(100% - 360px);
  }

  .img-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    img {
      width: 500px;
      height: 500px;
      border-radius: 50%;
      border: 20px solid #2b433c;
    }

    i {
      position: absolute;
      left: 30px;
      bottom: 30px;
      font-size: 50px;
      color: #c4b9bb;
    }
  }
  .progress {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 50px;
    padding: 30px;

    .time {
      width: 60px;
    }

    .progress-bar {
      width: 560px;
      height: 4px;
      background-color: #7e7374;
      position: relative;
      margin: 0 30px;
    }

    .bar-moved {
      position: absolute;
      left: 0;
      top: 0;
      height: 4px;
      background-color: #f2353c;
    }

    .bar-btn {
      position: absolute;
      top: 0;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: white;
      border: 5px solid #5d5759;
      transform: translate3d(-50%, -50%, 0);
    }
  }

  .operate-icon {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px;
    color: #c4b9bb;

    .ft-40 {
      font-size: 40px;
    }

    .ft-80 {
      font-size: 80px;
    }

    .ft-100 {
      font-size: 100px;
    }
  }
}

.player-enter-active,.player-leave-active{
    transition: all .3s;
    opacity: 1;

    .player-header, .player-operate{
      transform: translate3d(0, 0, 0);
      transition: all .3s cubic-bezier(0.86, 0.18, 0.82, 1.32);
    }
  }

  .player-enter, .player-leave-to{
    opacity: 0;

    .player-header{
      transform: translate3d(0, -100px, 0);
    }

    .player-operate{
      transform: translate3d(0, 100px, 0);
    }
  }

  .lyric-container{
    height: 100%;
    box-sizing: border-box;
    padding: 30px 30px 70px 30px;
    overflow: hidden;
  }
  .lyric-scroll{
    height: 100%;
    width: 100%;
    color: white;
    overflow: hidden;
    text-align: center;

    .list-item{
      font-size: 24px;
      line-height: 1.5;
      min-height: 50px;
      opacity: .5;

      &.active{
        opacity: 1;
      }
    }
  }

  .playlist-scroll{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 800px;
    overflow: hidden;
    z-index: 99999;
    background-color: rgba(255, 255, 255, .95);
    border-radius: 10px 10px 0 0;

    ul{
      padding-bottom: 80px;

      li{
        padding: 30px 20px;
        font-size: 24px;
        border-bottom: 1PX solid #e6e6e6;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }

      .artists-name{
        font-size: 18px;
        color: #b3b3b3;
      }

      i{
        font-size: 24px;
        color: lightgray;
      }
    }

    .close{
      line-height: 80px;
      font-size: 30px;
      color: #333;
      text-align: center;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      border-top: 1PX solid #e6e6e6;
      background-color: white;
    }
  }

  .playlist-mask{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99999;
    background-color: rgba(0, 0, 0, .4);
  }

  .playlist-enter-active,.playlist-leave-active{
    transition: all .3s;
  }

  .playlist-enter, .playlist-leave-to{
    transform: translate3d(0, 100%, 0);
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to{
      transform: rotate(360deg);
    }
  }
  .rotate{
    animation: rotate 30s linear infinite;
  }

  .rotate-stop{
    animation-play-state: paused;
  }

</style>