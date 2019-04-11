<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div
        class="progress-btn-wrapper"
        ref="progressBtn"
         @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend="progressTouchEnd"
      >
     
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      touchInfo: { 
     initiated: false 
      } 
    }
  },
  props:{
    percent:{
      type:Number,
      default:0
    }
  },
  methods:{
   barMove(l){
    //  console.log(l)
     this.$refs.progressBtn.style.transform=`translate3d(${l}px,0,0)`
    //  console.log( this.$refs.progressBtn.style.transform)
    this.$refs.progress.style.width=`${l}px`
   },
_setOffset(v){
    this.barMove(v)
},
  _triggerPercent() { 
    let barWidth = this.$refs.progressBar.clientWidth - 16;
    let percent = Math.min(1, this.$refs.progress.clientWidth / barWidth) ;
    console.log(barWidth,percent)
    this.$emit('percentChange', percent) 
    this.barMove()
   }, 

   // 进度条点击事件 
   progressClick(e){
      console.log(e.offsetX)
        // 设置进度条及按钮偏移 
      this._setOffset(e.offsetX)
        // 通知父组件播放进度变化 
        this._triggerPercent()
   },
   progressTouchStart(e){
 
      // 记录touch事件已经初始化 
    this.touchInfo.initiated = true
     // 点击位置 
    this.touchInfo.startX = e.touches[0].pageX 
      // 点击时进度条长度 
    this.touchInfo.left = this.$refs.progress.clientWidth 
   },
   progressTouchMove(e) { 
    
    if (!this.touchInfo.initiated) { 
     return 
    } 
    // 计算移动距离 
    const moveX = e.touches[0].pageX - this.touchInfo.startX
    console.log(moveX) 
    // 设置偏移值 
    const offsetWidth = Math.min(Math.max(0, this.touchInfo.left + moveX), 
     this.$refs.progressBar.clientWidth -16) 
    this._setOffset(offsetWidth) 
   }, 
     progressTouchEnd(e) { 
    this.touchInfo.initiated = false 
    // 向父组件派发事件,传递当前百分比值 
    this._triggerPercent() 
   }, 
  },
  computed(){

  },
  updated(){

  },
  mounted(){

  },
  watch:{
     percent(newPercent, oldPercent) { 
    if (newPercent > 0 && !this.touchInfo.initiated) { 
     // 进度条总长度 
     const barWidth = this.$refs.progressBar.clientWidth - 16
     const offsetWidth = barWidth * newPercent 
     // 设置进度条及按钮偏移 
     this._setOffset(offsetWidth) 
    } 
   } 
    // percent(v){
    //   if(v>=0){
    //     // console.log(this.$refs.progressBar.clientWidth)
    //    let w=this.$refs.progressBar.clientWidth-16;
    //    let l=w*v;
    //    this.barMove(l)
    //   }
    // }
  }
 
};
</script>


<style lang="less" scoped > 
.progress-bar {
  height: 30px;

  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background:#678722;
     
    }
     .progress-btn-wrapper {
        position: absolute;
        left: -8px;
        top: -13px;
        width: 30px;
        height: 30px;
        .progress-btn {
          position: relative;
          top: 7px;
          left: 7px;
          box-sizing: border-box;
          width: 16px; //按钮宽度16px
          height: 16px;
          border: 3px solid rgb(55, 185, 55);
          border-radius: 50%;
          background: rgb(114, 224, 200);
        }
      }
  }
}
</style>
