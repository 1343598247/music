<template>
  <song-list class="singer-detail" :songdetail="singerDetail" :title="title" :bgimg="bgimg"></song-list>
</template>

<script>
import Bscroll from "better-scroll";
import {getCdInfo} from "@/api";
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
    this.getCdInfoData();
    console.log("aa")
  },
  components: {
    SongList
  },
  methods: {
   getCdInfoData(){
     console.log("aa")
      getCdInfo(this.$route.params.id).then(res => {
        if (res) {
          console.log(res.data);
          this.bgimg =res.data.cdlist[0].logo;
          this.title = res.data.cdlist[0].dissname;
          // console.log( this.title)
          this.singerDetail = this.editSongList(res.data.cdlist[0].songlist);
          //  console.log(this.singerDetail)
        }
      });
    },
    editSongList(list) {
      console.log(list)
      var nlist = [];
      for (let i = 0; i < list.length; i++) {
        let item = {
          musicName: list[i].songname,
          id: list[i].songid,
          albumname: list[i].albumname,
          musicSong:list[i].singer[0].name,
          img:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${list[i].albummid}.jpg?max_age=2592000`,
         interval:list[i].interval,
         songmid:list[i].songmid
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