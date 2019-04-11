<template>
  <div class="singer">
    <!-- <div class="wrapper" ref="wrapper">
      <div class="content">  -->
        <singer-list :singers="getsingerlist" @select="selectSinger"></singer-list>
        <!-- <div class="singer">
          <div class="char_item">
            <div class="char">
              A
            </div>
            <div class="singer">
              <div class="tx">
               
              </div>
              <div class="singer_name">
                周杰伦
              </div>
            </div>
          </div>
        </div>-->
      <!-- </div>
    </div> -->
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { getSingerList } from "@/api";
import Bscroll from "better-scroll";
import SingerList from "@/components/singerlist";
export default {
  //     selectSinger(singer){
  //   this.$router.push({
  //     path: `/singer/${singer.id}`
  //   })
  // },
  data() {
    return {
      getsingerlist: []
    };
  },
  created() {
    this.getSingerListData();
  },
  components: {
    SingerList
  },
  methods: {
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      });
    },
    getSingerListData() {
      // let _this=this
      getSingerList().then(res => {
        console.log(res);
        this.getsingerlist = this.newSinger(res.data.list);
      });
    },
    newSinger(list) {
      // console.log(list)
      let nlist = {
        hot: {
          title: "热门",
          list: []
        }
      };
      //取10条数据
      list.forEach((item, index) => {
        if (index < 10) {
          nlist.hot.list.push({
            id: item.Fsinger_mid,
            name: item.Fsinger_name,
            img: `http://y.gtimg.cn/music/photo_new/T001R300x300M000${
              item.Fsinger_mid
            }.jpg?max_age=2592000`
          });
        }

        let key = item.Findex;
        if (!nlist[key]) {
          nlist[key] = {
            title: key,
            list: []
          };
        }
        nlist[key].list.push({
          id: item.Fsinger_mid,
          name: item.Fsinger_name,
          img: `http://y.gtimg.cn/music/photo_new/T001R300x300M000${
            item.Fsinger_mid
          }.jpg?max_age=2592000`
        });
      });
      //  console.log(nlist)
      let hot = [];
      let other = [];
      for (let i in nlist) {
        if (nlist[i].title.match(/[a-zA-Z]/)) {
          other.push(nlist[i]);
        } else if (nlist[i].title == "热门") {
          hot.push(nlist[i]);
        }
      }
      other.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      //  console.log(hot.concat(other))
      return hot.concat(other);
    }
  },
  // mounted() {
  //   this.$nextTick(() => {
  //     this.scroll = new Bscroll(this.$refs.wrapper, {});
  //   });
  // }
};
</script>

<style lang="less" scoped>
@import "~@/common/less/variable.less";
.singer{
  position: fixed;
  top:88px;
  bottom:0;
  // height: 100%;
  width: 100%;
}
.wrapper {
   position: fixed;
    height: 100%;
    width: 100%;
  overflow: hidden;

  .content {
  //  height: 100%;
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s;
}

.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
