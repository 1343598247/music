<template>
  <!-- <div class="wrapper" ref="wrapper1">
  <div class="content">-->
  <!-- <transition name="slide"> -->
  <!-- <div class="singer-detail" :style="{'background':'url('+bgimg+') no-repeat','backgroundSize':'100%'}"> -->
  <!-- </div> -->
  <song-list class="singer-detail" :songdetail="singerDetail" :title="title" :bgimg="bgimg"></song-list>
  <!-- </transition> -->
  <!-- </div>
  </div>-->
  <!-- </div> -->
</template>

<script>
import Bscroll from "better-scroll";
import { getSingerInfo } from "@/api";
import SongList from "@/components/songlist";
export default {
  data() {
    return {
      bgimg: "",
      singerDetail: [],
      title: ""
    };
  },
  created() {
    this.getsingerdetailData();
  },
  components: {
    SongList
  },
  //     mounted() {
  //   this.$nextTick(() => {
  //     this.scroll = new Bscroll(this.$refs.wrapper1, {})
  //   })
  // },
  methods: {
    getsingerdetailData() {
      console.log("aa")
      getSingerInfo(this.$route.params.id).then(res => {
        if (res) {
          console.log(res.data);
          this.bgimg =
            "http://y.gtimg.cn/music/photo_new/T001R300x300M000" +
            res.data.singer_mid +
            ".jpg?max_age=2592000";
          // console.log(this.bgimg)
          this.title = res.data.singer_name;
          // console.log( this.title)
          this.singerDetail = this.editSongList(res.data.list);
          //  console.log(this.singerDetail)
        }
      });
    },
    editSongList(list) {
      var nlist = [];
      for (let i = 0; i < list.length; i++) {
        let item = {
          musicName: list[i].musicData.songname,
          id: list[i].musicData.songid,
          albumname: list[i].musicData.albumname,
          musicSong:list[i].musicData.singer[0].name,
          img:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${list[i].musicData.albummid}.jpg?max_age=2592000`,
         interval:list[i].musicData.interval,
         songmid:list[i].musicData.songmid,
          singer:list[i].musicData.singer
        };
        nlist.push(item);
      }
        //  console.log(nlist)
      return nlist;
    }
  }
  // watch: {
  //     bgimg(){
  //         this.bgimg="http://y.gtimg.cn/music/photo_new/T001R300x300M000"+this.singerDetail.singer_mid+".jpg?max_age=2592000";
  //          console.log(this.bgimg)
  //     }
  // },
};
</script>

<style lang="less" scoped>
@import "~@/common/less/variable.less";
.singer-detail {
  position: fixed;
  z-index: 100;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 1);
  background-size: 100% 100%;
}
//      .slide-enter-active, .slide-leave-active{
//            transition: all 1.5s;
//      }

// .slide-enter, .slide-leave-to{
// transform: translate3d(100%, 0, 0);
// }
</style>