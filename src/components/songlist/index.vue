<template>
  <div>
    <div class="back">
      <i class="icon-back" @click="rback"></i>
      <div class="title" v-text="title"></div>
    </div>
    <div class="bgimg" ref="bgimg" :style="bgImg">
      <div class="play-wrapper">
        <div class="play" ref="playBtn">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <div class="wrapper" ref="wrapper1">
      <div class="content">
        <div class="songlist">
          <div
            class="songlist_item"
            v-for="(item,index) in  songdetail"
            :key="item.key"
            @click="addplayer(index)"
            
          >
            <div class="rank" v-text="index+1"></div>
            <div class="songlistInfor">
              <p v-text="item.musicName"></p>
              <p>{{item.albumname}}--{{item.musicSong}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Bscroll from "better-scroll";
import {mapActions,mapMutations} from 'vuex';
export default {
  data() {
    return {
      scrollY: 0,
      imageHeight: 0,
      minTranslateY: 0,
    };
  },
  props: {
    songdetail: {
      type: Array,
      defalut: []
    },
    title: {
      type: String,
      defalut: ""
    },
    bgimg: {
      type: String,
      defalut: ""
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.scroll = new Bscroll(this.$refs.wrapper1, {
        listenScroll: true,
        probeType: 3,
        click: true
      });
      this.scroll.on("scroll", this.scroll2);
    });
    let iconH = 40;
    this.imageHeight = this.$refs.bgimg.clientHeight;
    this.minTranslateY = -this.imageHeight + iconH;
    // console.log(this.imageHeight);
    // console.log(this.$refs.wrapper1.$el);
    this.$refs.wrapper1.style.top = this.imageHeight + "px";
  },
  computed: {
    bgImg() {
      return `background-image: url(${this.bgimg})`;
    }
  },
  methods: {
     addplayer(index){
          // console.log("aa")
              this.addPlayer({
                    list:this.songdetail,
                    index:index,
              }) 
            // this.changePlaying(true)
        },

        
        ...mapMutations(['changePlaying']),
        ...mapActions(['addPlayer']),

    rback() {
      // console.log("aa");
      this.$router.back();
    },
    scroll2(obj) {
      //  console.log("12321")
      //  console.log(obj)
      this.scrollY = obj.y;
      // console.log(this.scrollY);
    }
  },
  watch: {
    scrollY(newY) {
      let zIndex = 0;
      let translateY = Math.max(this.minTranslateY, newY); //最大滚动量
      this.$refs.layer.style[
        "transform"
      ] = `translate3d(0, ${translateY}px, 0)`;
      this.$refs.layer.style[
        "webkitTransform"
      ] = `translate3d(0, ${translateY}px, 0)`;
      let scale = 1;
      const p = Math.abs(newY / this.imageHeight);
      if (newY > 0) {
        scale += 2* p;
        // console.log(scale)
        // console.log(newY);
        zIndex = 10;
      }
      this.$refs.bgimg.style["transform"] = `scale(${scale})`;
      // this.$refs.bgimg.style["webkitTransform"] = `scale(${scale})`;
      // this.$refs.bgimg.style.zIndex = zIndex;

      if (newY <= this.minTranslateY) {
        zIndex = 12;
        let iconH = 40;
        this.$refs.bgimg.style.paddingTop = 0;
        this.$refs.bgimg.style.height = `${iconH}px`;
       this.$refs.playBtn.style.display="none";
        // console.log(this.$refs.bgimg.style.height);
      } else {
        this.$refs.bgimg.style.paddingTop = "70%";
        this.$refs.bgimg.style.height = 0;
          this.$refs.playBtn.style.display="block";
      }
      this.$refs.bgimg.style.zIndex = zIndex;
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/common/less/icon.less";
.back {
  position: absolute;
  z-index: 15;
  top: 0;
  width: 100%;
  height: 40px;

  .icon-back {
    position: absolute;
    z-index: 15;
    top: 0;
    left: 0;
    display: inline-block;
    width: 40px;
    height: 40px;
    text-align: center;
  }
  .title {
    position: absolute;
    width: 100%;
    text-align: center;
    display: inline-block;
    vertical-align: top;
    height: 40px;
    line-height: 40px;
    font-size: 24px;
  }
  .icon-back::before {
    color: #ffcd32;
    font-size: 24px;
    width: 24px;
    height: 24px;
    padding: 8px;
    display: block;
  }
}
.bg-layer {
  position: relative;
  height: 100%; //屏幕高度的100%
  background-color: rgba(0, 0, 0, 0.5);
}
.songlist {
  padding: 10px;
  height: 100%;
}
.songlist_item {
  width: 100%;
  height: 60px;
  // background: rgba(131, 124, 124, 0.959);
  // margin-bottom: 20px;
  // z-index: 5;
  .rank {
    color: #ffcd32;
    display: inline-block;
    width: 44px;
    height: 44px;
    line-height: 44px;
    text-align: center;
    padding: 8px;
    font-size: 22px;
    font-weight: bold;
    vertical-align: top;
  }
  .songlistInfor {
    display: inline-block;
    width: 60%;
    height: 60px;
    padding: 8px;
    box-sizing: border-box;
    p {
      display: block;
      height: 22px;
      font-size: 18px;
      line-height: 22px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    p:last-of-type {
      font-size: 12px;
      color: rgba(228, 216, 216, 0.5);
    }
  }
}
.wrapper {
  // height: 660px !important;
  height: 60%;
  // z-index: 10;
  position: absolute;
  width: 100%;
  // overflow: hidden;
  .content {
    // width: 100%;
    background: rgba(0, 0, 0, 1);
  }
}
.bgimg {
  position: relative;
  // z-index: 0;
  width: 100%;
  height: 0;
  padding-top: 70%;
  background-size: 100%;
  .play-wrapper {
    position: absolute;
    bottom: 20px;
    z-index: 50;
    width: 100%;
    .play {
      box-sizing: border-box;
      width: 135px;
      padding: 7px 0;
      margin: 0 auto;
      text-align: center;
      border: 1px solid #ffcd32;
      color: #ffcd32;
      border-radius: 100px;
      font-size: 16px;
      .icon-play {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        // font-size: $font-size-medium-x;
      }
      .text {
        display: inline-block;
        vertical-align: middle;
        // font-size: $font-size-small;
      }
    }
  }
}
</style>