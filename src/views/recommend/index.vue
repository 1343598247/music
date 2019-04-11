<template>
  <div>
    <div class="wrapper" ref="wrapper">
      <div class="content">
        <div class="recommend">
          <!-- 轮播图 -->
          <div class="swiper-container">
            <div class="swiper-wrapper">
              <div class="swiper-slide" v-for="item in slide" :key="item.key">
                <img :src="item.picUrl">
              </div>
            </div>
            <div class="swiper-pagination"></div>
          </div>
          <!-- 热门歌单 -->
          <div class="hot">
            <h2>热门歌单推荐</h2>
            <ul>
              <li class="hot_l" v-for="item in list.songList" :key="item.key" @click="selectItem(item)">
                 <img :src="item.picUrl" width="60px" height="60px">
                 <div class="hot_l_info">
                   <p>{{item.songListAuthor}}</p>
                   <p>{{item.songListDesc}}</p>
                 </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import Swiper from "swiper";
import "swiper/dist/css/swiper.css";
import { getRecommend } from "@/api";
import Bscroll from "better-scroll";
export default {
  data() {
    return {
      slide: [],
      list: []
    };
  },
  components: {
    Swiper
  },
  methods: {
    selectItem(item){
       this.$router.push({
        path: `/recommend/${item.id}`
      });
      
    },
    getRecommendData() {
      getRecommend().then(res => {
        console.log(res);
        this.slide = res.data.slider;
        this.list = res.data;
      });
    }
  },
  created() {
    this.getRecommendData();
  },
  mounted() {
    new Swiper(".swiper-container", {
      // loop: true,
      // 如果需要分页器
      pagination: {
        el: ".swiper-pagination"
      },
      observer: true,
      observerParents: true,
      autoplay: {
        delay: 3000,
        //  loop: true,
        //   disableOnInteraction: true,
        // stopOnLastSlide: false,
        disableOnInteraction: false
      }
      // 如果需要前进后退按钮
      // nextButton: '.swiper-button-next',
      // prevButton: '.swiper-button-prev',
      // 如果需要滚动条
      // scrollbar: '.swiper-scrollbar',
    });
    this.$nextTick(() => {
      this.scroll = new Bscroll(this.$refs.wrapper, {
        listenScroll: true,
        probeType: 3,
        click: true
      });
      // if (!this.scroll) {
      //   this.scroll = new Bscroll(this.$refs.wrapper, {})
      //   this.scroll.on('touchend', (pos) => {
      //     // 下拉动作
      //     if (pos.y > 50) {
      //       this.loadData()
      //     }
      //   })
      // } else {
      //   this.scroll.refresh()
      // }
    });
  }
};
</script>

<style lang="less" scoped>
@import "~@/common/less/variable.less";
.wrapper {
  // height: 400px !important;
  position: fixed;
  top: 88px;
  bottom: 0;
  // height: 100%;
  width: 100%;
  overflow: hidden;
  .content {
    // height: 600px;
    // position: absolute;
  }
}
.swiper-container {
  position: relative;
  width: 100%;
  //   height: 150px;
  //   margin: 20px auto;
  //   .swiper-wrapper {
  //     width: 300%;
  //     overflow: hidden;
  //     .swiper-slider {
  //       width: 100%;
  img {
    width: 100%;
    height: 100%;
  }
  //     }
  //   }
  // .swiper-pagination {
  //   position: absolute;
  //   z-index: 999;
  //   width: 100%;
  //   height: 20px;
  //   background: rgba(0, 0, 0, 0.2);
  // }
}
.hot {
  h2 {
    width: 100%;
    height: 60px;
    line-height: 60px;
    text-align: center;
    color: @color-theme;
    background: rgb(48, 47, 47);
  }
  ul {
    padding: 10px;
    li {
      width: 100%;
      height: 80px;
      background: gray;
      img{
        margin:10px;
      }
      .hot_l_info{
        vertical-align: top;
        width:70%;
        height: 100%;
        display: inline-block;
        p{
          display: block;
          height: 24px;
          line-height: 24px;
          padding-top:16px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-size: 16px;
        }
        p:last-of-type{
          font-size: 12px;
          padding-top: 4px;
        }
      }
    }
  }
}
</style>