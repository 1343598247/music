<template>
    <div class="wrapper" ref="wrapper">
      <div class="content" ref="listview">
        <ul class="singer">
          <li class="char_item" ref="lists" v-for="item in singers" :key="item.key">
            <div class="char">{{item.title}}</div>
            <ul>
              <li class="singer_info" @click="selectItem(item1)" v-for="item1 in item.list" :key="item1.key">
          
                <div class="tx">
                  <img :src="item1.img">
                </div>
                <div class="singer_name">{{item1.name}}</div>
              </li>
            </ul>
          </li>
        </ul>
       
      </div>
       <ul class="singer_alphabet">
          <li v-for="(item,index) in resingers" :data-index='index' @touchstart="onTouchStart"  @touchmove.stop.prevent="onTouchMove"  :class="{'on':index==currentIndex}" :key="item.key">
            {{item}}
          </li>
        </ul>
    </div>
</template>

<script>
import Bscroll from "better-scroll";
export default {
  data() {
    return {
      // cuttitle:[]
      scrollY:0,
      listHeight:[],
      currentIndex:0,
      touch:{}
    };
  },
  props: {
    singers: {
      type: Array,
      default: [],
    },
    dataIndex:{
       type:String,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.scroll = new Bscroll(this.$refs.wrapper, {
        listenScroll:true,
        probeType:3,
        click:true,
    
      });
      this.scroll.on("scroll",this.scroll1)
   
    });
  //  this.cut(this.singers)
  },
  computed:{
    resingers:function(){
      let arr=[]
       for(let i in  this.singers){
        arr.push(this.singers[i].title.substring(0,1))
       }
      return  arr
    }
  },
  updated(){
    this.getliH()
  },
  methods: {
    selectItem(item){
    this.$emit('select', item)
},
   
     onTouchStart(ev){
      //  console.log(ev)
      //获取当前点击的下标
      let vIndex=ev.target.attributes['data-index'].value;
      // console.log(vIndex)
      this.touch.y=ev.touches[0].pageY;
      this.touch.index=vIndex;
      //调用scrollto
      this.scrollTo(vIndex)
    },
    onTouchMove(ev){
      // console.log("aa")
      //记录滑动位置
       this.touch.y2=ev.touches[0].pageY;
    //  console.log(this.touch.y2)
      let a1=(this.touch.y2-this.touch.y)/22 | 0;
      let a2= parseInt(this.touch.index)+parseInt(a1);
      // console.log(a2)
        this.scrollTo(a2)
    },
    scrollTo(index){
    //  console.log(this.$refs.listview.scrollToElement(this.$refs.lists[index],0)) 
      this.scroll.scrollToElement(this.$refs.lists[index],0)
    },
   scroll1(obj){
    //  console.log("12321")
    //  console.log(obj)
    this.scrollY=obj.y
    // console.log(this.scrollY)
   },
   //获取li高度
   getliH(){
    //  console.log("aa")
   let lists=this.$refs.lists;
  //  console.log(lists)
   let h=0;
   this.listHeight.push(0)
   for(let i=0;i<lists.length;i++){
     h+=lists[i].clientHeight;
     this.listHeight.push(h)
   }
  //  console.log(this.listHeight)
   }
  },
  watch: {
    scrollY(v){
      let _this=this;
      //超过头部
      // console.log(v)
      if(v>0){
        this.currentIndex=0
        return
      }
      //中间
      for(let j=0;j<this.listHeight.length-1;j++){
        let h1=this.listHeight[j];
        let h2=this.listHeight[j+1];
        // console.log(this.currentIndex)
        if(-v<h2&&-v>=h1){
          // console.log(j)
          this.currentIndex=j;
          // console.log(this.currentIndex)
          return
        }
      }
      // //底部
      
      // this.currentIndex=this.listHeight.length-1
    }
  },
};
</script>

<style lang="less" scoped>
.wrapper {
  // height: 600px !important;
  height: 100%;
  position: relative;
  overflow: hidden;

  .content {
    // height: 600px;
  }
}
.singer {
  width: 100%;
  height: 100%;
  position: relative;
  .char_item {
    width: 100%;
     ul{
    li:last-of-type{
        margin-bottom:0;
    }
  }
    .char {
      width: 100%;
      height: 22px;
      line-height: 22px;
      font-size: 14px;
      padding-left: 10px;
      box-sizing: border-box;
      background: rgb(44, 46, 44);
    }

    .singer_info {
      width: 100%;
      height: 80px;
      padding: 10px;
      box-sizing: border-box;
      background: rgb(107, 100, 100);
      .singer_i{
        display:block;
      }
      .tx {
        width: 60px;
        height: 60px;
        display: inline-block;
        border-radius: 50%;
        background: rgb(92, 64, 64);

        img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
        }
      }

      .singer_name {
        vertical-align: top;
        height: 60px;
        line-height: 60px;
        margin-left: 20px;
        display: inline-block;
      }
    }
  }
}
.singer_alphabet {
  position: fixed;
  bottom:40px;
  right: 20px;
  height: 500px;
  width:20px;
  border-radius: 10px;
  padding:16px 0 16px 0;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.1);
  li{
    width:18px;
    height:18px;
    line-height: 18px;
    border-radius: 4px;
    text-align: center;
    margin:2px 0 2px 0;
    background: rgba(255,255,255,0.1);
    &.on{
      color:#f00;
    }
  }
}
</style>