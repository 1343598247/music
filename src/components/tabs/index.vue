<template>
  <div>
    <div class="tab">
      <router-link class="tab_item" to="recommend">
        <span class="tab-link">推荐</span>
      </router-link>
      <router-link class="tab_item" to="singer">
        <span class="tab-link">歌手</span>
      </router-link>
      <router-link class="tab_item" to="rank">
        <span class="tab-link">排行</span>
      </router-link>
      <router-link class="tab_item" to="sousuo">
        <span class="tab-link">搜索</span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
@import "~@/common/less/variable.less";
.tab{
    display: flex;
    height: 44px;
    line-height: 44px;
    .tab_item{
        flex:1;
        text-align:center;
        .tab-link{
            font-size:@font-size-medium-x;
        }
        &.router-link-active {
        color: @color-theme-d ;
    }
    }
    
}
</style>