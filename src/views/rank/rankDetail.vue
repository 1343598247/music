<template>
  <song-list class="singer-detail" :songdetail="singerDetail" :title="title" :bgimg="bgimg"></song-list>
</template>

<script>
import Bscroll from "better-scroll";
import {getRankInfo} from "@/api";
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
    this.getRankInfoData();
    console.log("aa")
  },
  components: {
    SongList
  },
  methods: {
 getRankInfoData(){
     console.log("aa")
     getRankInfo(this.$route.params.id).then(res => {
        if (res) {
          console.log(res);
          this.bgimg =res.topinfo.pic_v12;
          this.title = res.topinfo.ListName;
          // console.log( this.title)
          this.singerDetail = this.editSongList(res.songlist);
          //  console.log(this.singerDetail)
        }
      });
    },
    editSongList(list) {
      console.log(list)
      var nlist = [];
      for (let i = 0; i < list.length; i++) {
        let item = {
          musicName: list[i].data.songname,
          id: list[i].data.songid,
          albumname: list[i].data.albumname,
          musicSong:list[i].data.singer[0].name,
          img:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${list[i].data.albummid}.jpg?max_age=2592000`,
         interval:list[i].data.interval,
         songmid:list[i].data.songmid
        };
        nlist.push(item);
      }
      //    console.log(nlist)
      return nlist;
    }
  }
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