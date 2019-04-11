<template>
    <div>
        <div class="head">
    
                <img src="./default.png">

            <div class="name">
                ABC  Music
            </div>
        
        </div>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang='less' scoped>
@import "~@/common/less/variable.less";
.head{
    height: 44px;
    width:100%;
    text-align: center;
    img{
        display:inline-block;
        width:30px;
        height: 30px;
        margin-top: 6px;
        vertical-align: top;
    }
    .name{
         display:inline-block;
         font-size:@font-size-large;
         line-height: 44px;
         color: @color-theme;
    }
}
</style>