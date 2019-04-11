<template>
  <div class="rank">
    <div class='wrapper' ref='wrapper'>
      <div class='content'>
        <ul class='rankList'>
          <li class='rankList_item' v-for='item in  rankListData' @click="select(item)" :key="item.key">
            <img width='160px' height='160px' :src="item.picUrl">
            <div class='txt'>
            <p v-for='(item1,index) in item.songList' :key="item1.key">{{index+1}}.{{item1.songname}}</p>
            </div>
             <div class="blur">
            </div>
          </li>
        </ul>
      </div>
    </div>
     <router-view></router-view>
  </div>
  
</template>

<script>
  import {  getRankList,getRankInfo} from '@/api';
 import Bscroll from 'better-scroll'
  export default {
    data() {
      return {
        rankListData: [],
      }
    },
    created() {
      this.getRankData()
    },
    mounted() {
      this.$nextTick(() => {
        this.scroll = new Bscroll(this.$refs.wrapper, {
          listenScroll: true,
          probeType: 3,
          click: true
        });
      });
    },
    methods: {
      getRankData() {
        getRankList().then(res => {
          console.log(res)
          this.rankListData = res.data.topList;
          console.log(this.rankListData)
        })
      },
         select(item){
        this.$router.push(`/rank/${item.id}`)
    }
    },

  }

</script>

<style lang='less' scoped>
  .rank {
    position: fixed;
    top: 88px;
    bottom: 60px;
    width: 100%;
  }

  .wrapper {
    height: 100%;
    position: relative;
    overflow: hidden;
  }

  .rankList {
    padding: 10px;
    .rankList_item {
        position:relative;
      width: 100%;
      height: 160px;
      margin-top: 20px;
      background:gray;
      box-sizing:border-box;
      img{
          display:inline-block;
      }
      .txt{
          width:30%;
          padding:30px;
          vertical-align:top;
          display:inline-block;
         
          p{
            width:100%;
             text-overflow:hidden;
          overflow:hidden;
          white-space:nowrap;
              display:block;
              height:32px;
              line-height:32px;
              font-weight:bold;
          }
          
      }
        .blur{
        position:absolute;
        top:0;
        left:0;
        height:160px;
        width:100%;
        background:rgba(0,0,0,0.2)
    }
    }
  
  }

</style>
