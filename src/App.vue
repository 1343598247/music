<template>
  <div id="app">
     <music-header></music-header>
     <tab></tab>
     <router-view></router-view>
     <!-- 音乐播放器 -->
     <player></player>
  </div>
</template>

<script>
import MusicHeader from '@/components/musicheader'
import Tab from '@/components/tabs'
import Player from '@/components/player'
export default {
  name: 'App',
  components:{
    MusicHeader,
    Tab,
    Player,
  }
}
</script>

<style lang="less">
 @import '~@/common/less/index.less';
</style>

