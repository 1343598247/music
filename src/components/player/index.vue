<template>
  <div class="player" v-if="playList.length>0">
    <!-- 播放页面全屏 -->
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
        <!-- 背景模糊 -->
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.img">>
        </div>
        <!-- 顶部 -->
        <div class="top">
          <div class="back">
            <i class="icon-back" @click="changeFull"></i>
          </div>
          <h1 class="title">{{currentSong.musicName}}</h1>
          <h2 class="subtitle">{{currentSong.musicSong}}</h2>
        </div>
        <!-- cd中间部分 -->
        <div class="middle swiper-container">
          <!-- cd图片部分 -->
          <div class="swiper-wrapper">
            <div class="middle-l swiper-slide" ref="middleL">
              <div class="cd-wrapper" ref="cdWrapper">
                <div class="cd" :class="cdStatus">
                  <img class="image" :src="currentSong.img">
                </div>
              </div>
              <div class="playing-lyric-wrapper">
                <div class="playing-lyric">{{playlyric}}</div>
              </div>
            </div>
            <!-- 中间歌词部分 -->
            <div class="middle-r swiper-slide" ref="lyricList">
              <div class="content">
                <div class="lyric-wrapper">
                  <div>
                    <p ref="lyricLine" class="text" :class="{'current': currentLineNum === index}"
                      v-for="(item,index) in lyric.lines" :key="item.key">{{item.txt}}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="dot-wrapper swiper-pagination">
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{startTime}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="changeP"></progress-bar>
            </div>
            <span class="time time-r">{{songTime}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeStatus">
              <i :class="Status"></i>
            </div>
            <div class="icon i-left">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center">
              <i :class="btnStatus" @click="changePlay"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" @click="bigshow" v-show="!fullScreen">
        <div class="icon">
          <img width="40" height="40" :class="cdStatus" :src="currentSong.img">
        </div>
        <div class="text">
          <h2 class="name">{{currentSong.musicName}}</h2>
          <p class="desc">{{currentSong.musicSong}}</p>
        </div>
        <div class="control">
          <!-- <progress-circle> -->
          <i class="icon-mini" :class="btnStatus" @click.stop.prevent="changePlay"></i>
          <!-- </progress-circle> -->
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <!-- <play-list ref="playlist"></play-list> -->
    <audio ref="audio" :src="url" @canplay="readyState" @error="readyState" @ended="ended"
      @timeupdate="timeupdate"></audio>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from "vuex";
  import Swiper from "swiper";
  import Bscroll from "better-scroll";
  import "swiper/dist/css/swiper.css";
  import { getkey, getLyric } from "@/api";
  import { Base64 } from "js-base64";
  import Lyric from "lyric-parser";
  import ProgressBar from "@/components/progressBar";
  export default {
    data() {
      return {
        Status: "icon-sequence",
        Mode: 0,
        url: "",
        isReady: false,
        playlyric: "",
        lyric: {},
        currentLineNum: 0,
        currentTime: 0,
        // songReady:false,
        // getLyric
      };
    },
    components: {
      Swiper,
      ProgressBar
    },
    computed: {
      ...mapGetters([
        "playList",
        "currentIndex",
        "currentSong",
        "mode",
        "fullScreen",
        "playing"
      ]),
      // 当前播放时间
      startTime() {
        if (this.currentTime == 0) {
          return `00:00`;
        }
        let m = (this.currentTime / 60) | 0;
        let s = this.currentTime % 60 | 0;
        if (m.toString().length < 2) {
          m = "0" + m;
        }
        if (s.toString().length < 2) {
          s = "0" + s;
        }
        return `${m}:${s}`;
      },
      //总的时间
      songTime() {
        let m = (this.currentSong.interval / 60) | 0;
        let s = this.currentSong.interval % 60 | 0;
        if (m.toString().length < 2) {
          m = "0" + m;
        }
        if (s.toString().length < 2) {
          s = "0" + s;
        }
        return `${m}:${s}`;
      },
      //当前已播放歌曲时长占总时长百分比
      percent() {
        return this.currentTime / this.currentSong.interval;
      },
      cdStatus() {
        // console.log(this.playing)
        return this.playing ? "play" : "pause";
      },
      btnStatus() {
        return this.playing ? "icon-pause" : "icon-play";
      }
    },
    created() { },
    updated() {
      // this.aaa();
    },
    methods: {
      ...mapMutations([
        "changeMode",
        "changeFullScreen",
        "changePlaying",
        "changeCurrentIndex"
      ]),
      timeupdate(ev) {
        this.currentTime = ev.target.currentTime;
      },
      //
      changeP(v) {
        let t = this.currentSong.interval * v;
        console.log(v);
        this.$refs.audio.currentTime = t;
        //  this.lyric.seek(t)
        if(this.currentLyric){
   this.currentLyric.seek(t* 1000)//偏移歌词到拖动时间的对应位置
      }
      },
      prev() {
        var index = this.currentIndex - 1;
        if (index < 0) {
          index = this.playList.length - 1;
          // console.log(index)
        }

        this.changeCurrentIndex(index);
      },
      next() {
        let index = this.currentIndex + 1;
        if (index > this.playList.length - 1) {
          index = 0;
        }
        this.changeCurrentIndex(index);
        if (!this.playing) {
          this.changePlay();
        }
      },
      bigshow() {
        this.changeFullScreen(true);
      },
      //歌曲加载改变播放器状态
      readyState() {
        this.isReady = true;
      },
      //播放结束后
      ended() {
        this.next();
      },
      //获取歌词
      getLyric() {
        //       if(this.lyric){
        //     return Promise.resolve()
        // }
        // this.lyric = {};
        getLyric(this.currentSong.id).then(res => {
          //  console.log(res)
          this.currentLyric = new Lyric(Base64.decode(res.lyric), this.handleLyric);
          // console.log(this.lyric);
          if (this.playing) {
         this.currentLyric.play();
         this.lyric=this.currentLyric
          }
        });
      },
      handleLyric({ lineNum, txt }) {
        console.log(lineNum, txt);
        // this.playlyric ="";
        this.playlyric = txt;
        this.currentLineNum = lineNum;
        if (lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5];
          this.scroll.scrollToElement(lineEl, 1000);
        } else {
          this.scroll.scrollTo(0, 0, 1000);
        }
      },
      //改变循环播放方式
      changeStatus() {
        if (this.Mode < 3) {
          this.Mode++;
        } else if ((this.Mode = 3)) {
          this.Mode = 0;
        }
        this.changeMode(this.Mode);
      },
      changeFull() {
        this.changeFullScreen(false);
      },
      //控制播放状态
      changePlay() {
        // if(!this.songReady){
        //       return
        // }
        console.log("aa")
        this.changePlaying(!this.playing);
        if(this.currentLyric){
         this.currentLyric.togglePlay();
        }
        
      },
      aaa() {
        console.log(this.playList);
      }
    },
    watch: {
      playing(v) {
        this.$nextTick(() => {
          this.playing ? this.$refs.audio.play() : this.$refs.audio.pause();
        });
      },
      currentSong(newValue, oldValue) {
        
        console.log(newValue);
        if (!newValue) {
          return;
        }
        if (newValue == oldValue) {
          return;
        }
        
         if(this.currentLyric){
          this.currentLyric.stop() //切换歌曲后，清空前一首歌歌词Layric实例中的定时器
          this.currentTime = 0
          this.playingLyric = ''
          this.currentLineNum = 0
        }
        this.$nextTick(() => {
          var banner = new Swiper(".middle", {
            pagination: {
              el: ".swiper-pagination",
          
              // bulletClass: "dot"
              // bulletActiveClass: "active"
            },
            // observer: true,
            // observeParents: true
          });
          this.$nextTick(() => {
            this.scroll = new Bscroll(this.$refs.lyricList, {
              listenScroll: true,
              probeType: 3,
              click: true
            });
          });
          getkey(newValue.songmid).then(res => {
            // console.log(res)
            this.url = `http://ws.stream.qqmusic.qq.com/${
              res.data.items[0].filename
              }?fromtag=0&guid=126548448&vkey=${res.data.items[0].vkey}`;
            // console.log(this.url)
            this.$nextTick(() => {
              this.getLyric();
              this.$refs.audio.play();
            });
          });
        });
      },

      Mode() {
        if (this.mode == 1) {
          this.Status = "icon-random";
        }
        if (this.mode == 2) {
          this.Status = "icon-loop";
        }
        if (this.mode == 0) {
          this.Status = "icon-sequence";
        }
      }
    }
  };
</script>

<style lang="less" scoped>
  @import "~@/common/less/icon.less";
  @import "~@/common/less/variable.less";

  .player {
    .normal-player {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 150;
      background: #000;

      .background {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20px); //背景模糊
      }

      .top {
        position: relative;
        margin-bottom: 25px;

        .back {
          position: absolute;
          top: 0;
          left: 6px;
          z-index: 50;

          .icon-back {
            display: block;
            padding: 9px;
            /* font-size: $font-size-large-x;
          color: $color-theme; */
            transform: rotate(-90deg);
          }
        }

        .title {
          width: 70%;
          margin: 0 auto;
          line-height: 40px;
          text-align: center;
          //   no-wrap();
          /* font-size: $font-size-large;
          color: $color-text; */
        }

        .subtitle {
          line-height: 20px;
          text-align: center;
          /* font-size: $font-size-medium;
        color: $color-text; */
        }
      }

      .middle {
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 170px;
        white-space: nowrap;
        font-size: 0;

        .middle-l {
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;

          .cd-wrapper {
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            height: 100%;

            .cd {
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border: 10px solid rgba(255, 255, 255, 0.1);
              border-radius: 50%;

              &.play {
                animation: rotate 20s linear infinite; //CD 旋转
              }

              &.pause {
                animation-play-state: paused;
              }

              .image {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }
          }

          .playing-lyric-wrapper {
            width: 80%;
            margin: 30px auto 0 auto;
            overflow: hidden;
            text-align: center;

            .playing-lyric {
              height: 20px;
              line-height: 20px;
              font-size: 14px;
              color: #fff;
            }
          }
        }

        .middle-r {
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          overflow: hidden;

          .lyric-wrapper {
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
            text-align: center;

            .text {
              line-height: 32px;
              color: rgba(255, 255, 255, 0.534);
              font-size: 14px;

              &.current {
                color: #fff;
              }
            }
          }
        }
      }

      .bottom {
        position: absolute;
        bottom: 50px;
        width: 100%;

        .dot-wrapper {
          position: relative;
          z-index: 99;
          text-align: center;
          // font-size: 0;
          height: 20px;
          // background: rgba(0, 0, 0, 0.5);

         
        }

          .progress-wrapper {
            display: flex; //flex布局
            align-items: center;
            width: 80%;
            margin: 0px auto;
            padding: 10px 0;

            .time {
              /* color: $color-text;
            font-size: $font-size-small; */
              flex: 0 0 42px;
              line-height: 30px;
              width: 30px;

              &.time-l {
                text-align: left;
              }

              &.time-r {
                text-align: right;
              }
            }

            .progress-bar-wrapper {
              flex: 1;
            }
          }

          .operators {
            display: flex;
            align-items: center;

            .icon {
              flex: 1;

              /* color: $color-theme; */
              /* &.disable { */
              /* color: $color-theme-d; */
              /* } */
              i {
                font-size: 30px;
              }
            }

            .i-left {
              text-align: right;
            }

            .i-center {
              padding: 0 20px;
              text-align: center;

              &.play {
                animation: rotate 10s linear infinite;
              }

              &.pause {
                animation-play-state: paused;
              }
            }

            .i-right {
              text-align: left;
            }

            .icon-favorite {
              color: #fff;

              &.normal-enter-active,
              &.normal-leave-active {
                transition: all 0.4s;
              }
            }
          }
      
      }

      .top,
      .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);

        &.normal-enter,
        &.normal-leave-to {
          opacity: 0;

          .top {
            transform: translate3d(0, -100px, 0);
          }

          .bottom {
            transform: translate3d(0, 100px, 0);
          }
        }
      }

  }
      .mini-player {
        display: flex;
        align-items: center;
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 180;
        width: 100%;
        height: 60px;
        background: @color-highlight-background;

        &.mini-enter-active,
        &.mini-leave-active {
          transition: all 0.4s;
        }

        &.mini-enter,
        &.mini-leave-to {
          opacity: 0;
        }

        .icon {
          flex: 0 0 40px;
          width: 40px;
          padding: 0 10px 0 20px;

          img {
            border-radius: 50%;

            &.play {
              animation: rotate 10s linear infinite;
            }

            &.pause {
              animation-play-state: paused;
            }
          }
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;

          .name {
            margin-bottom: 2px;
            //   no-wrap();
            font-size: 14px;
            color: #fff;
          }

          .desc {
            //   no-wrap();
            font-size: 12px;
            color: #fff;
          }
        }

        .control {
          flex: 0 0 30px;
          width: 30px;
          padding: 0 10px;

          .icon-play-mini,
          .icon-pause-mini,
          .icon-playlist {
            font-size: 30px;
            /* color: $color-theme-d; */
          }

          .icon-mini {
            font-size: 32px;
            // position: absolute;
            right: 0;
            top: 0;
          }
        }
      }
  } 
    @keyframes rotate {
      0% {
        transform: rotate(0);
      }

      100% {
        transform: rotate(360deg);
      }
  }

  
</style>
<style>
 .swiper-pagination-bullet{
            display: inline-block;
            vertical-align: middle;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background:rgba(255,255,255,0.5)

          }
          
          .dot-wrapper .swiper-pagination-bullet-active {
              width: 20px;
              border-radius: 5px;
              background: rgba(255,255,255,0.8);
            }
</style>