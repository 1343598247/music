<template>
     <div class="search">
        <div class="search-box-wrapper">
            <div class="search-box">
                <i class="icon-search"></i>
                <input type="text" ref="query" v-model="query" class="box" placeholder="搜索歌曲、歌手" />
                <i v-show="query" class="icon-dismiss"></i>
            </div>
        </div>
        <div class="shortcut-wrapper" ref="shortcutWrapper" v-show="!query">
            <div class="shortcut">
                <div class="hot-key">
                    <h1 class="title">热门搜索</h1>
                    <ul>
                        <li class="item" v-for="item in hotList" @click="addSearch(item)" :key="item.key" >
                            <span> {{item.k}}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div  class="search-result " ref="searchResult" v-show="query">
            <div class="content">
            <div class="search-list">
                <ul>
                    <li class="search-item" v-for="item in searchList" :key="item.key" @click="add(item)">
                        <i class="icon"></i>
                        <h6 class="text">{{item.musicName}}</h6>
                        <p class="subtext"><span v-for="b in item.singer" :key="b.key">{{b.name}} .</span></p>
                    </li>
                </ul>
            </div>
            </div>
        </div>
          <loading v-show="isLoading"></loading>
    </div>
</template>

<script>
import {getHotKey,search} from '@/api'
import Bscroll from 'better-scroll'
import {mapActions} from 'vuex'
import loading from '@/components/loading'
    export default {
        data(){
            return{
                hotList:[],
                query:'',
                pageNum:20,
               pageSize:1,
               searchList:[],
               isLoading:true,
               loadingTitle:'正在加载'
            }
        },
        components:{
           loading,
        },
        created(){
           this.getHotKeyData()
        },
        mounted(){
         this.$nextTick(() => {
        this.scroll = new Bscroll(this.$refs.searchResult, {
        listenScroll:true,
        probeType:3,
        click:true,
    
      });
      this.scroll.on("scroll",this.scroll1)
   
    });
        },
        methods:{
            getHotKeyData(){
                
                getHotKey().then(res =>{
                    this.isLoading=false;
                    console.log(res)
                    let HotArr=[];
                    while(HotArr.length<8){
                        let n=Math.floor(Math.random()*(res.data.hotkey.length))
                        HotArr.push(res.data.hotkey[n])
                    }
                    this.hotList=HotArr;
                   console.log(this.hotList)
                })
                   //console.log(this.hotList)
            },
            //热搜词点击向input提交
            addSearch(item){
                this.isLoading=true;
               this.query=item.k;
               this.goSearch()
            },
            //点击搜索列表内的歌曲
            add(item){
              let list=[];
              list.push(item)
              console.log(list)
              this.addPlayer({
                  list:list,
                  index:0,
              })
     
            },
             ...mapActions(["addPlayer"]),
            goSearch(){
              
                search(this.query,this.pageSize,this.pageNum).then(res=>{
                   console.log(res)
                   let list=this.editSongs(res.data.song.list)
                   this.searchList=list;
                     this.isLoading=false;
               })
            
            },
            editSongs(list){
                console.log(list)
                let nSongsList = [];
               for(var i=0;i<list.length;i++){
                   let item = {
                    //歌曲ID
                    id:list[i].id,
                    //mid
                    songmid:list[i].mid,
                    //歌曲名
                    musicName:list[i].name,
                    //专辑名
                    albumname:list[i].album.name,
                    //歌曲时长
                    interval:list[i].interval,
                    //专辑封面
                    img:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${list[i].album.mid}.jpg?max_age=2592000`,
                    //歌曲链接
                    url:`http://dl.stream.qqmusic.qq.com/C400${list[i].mid}/${list[i].id}.m4a?guid=983915916&fromtag=66`,
                    //歌手
                    singer:list[i].singer,
                    musicSong:list[i].singer[0].name,
                    }
                     nSongsList.push(item)
                }
            // console.log(nSongsList)
            return nSongsList
            },
       
        },
        watch:{
            query(newVal,oldVal){
                this.goSearch()
            }
        }
    }
</script>

<style lang="less" scoped>
@import "~@/common/less/variable.less";
.search{
    .search-box-wrapper{
      margin: 20px;
      .search-box{
        display: flex;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
        padding: 0 6px;
        height: 40px;
        background: @color-highlight-background;
        border-radius: 6px;
        .icon-search{
        font-size: 24px;
        color: @color-background;
        }
        .box{
            flex: 1;
            margin: 0 5px;
            line-height: 18px;
            background: @color-highlight-background;
            color: @color-text;
            font-size: @font-size-medium;
            &:focus{
                outline: none;
            }
        }
        &::placeholder{
            color: @color-text-d;
        }
        .icon-dismiss{
            font-size: 16px;
            color: @color-background;
        }
      }
    }
    .shortcut-wrapper{
      position: fixed;
      top: 178px;
      bottom: 0;
      width: 100%;
      .shortcut{
        height: 100%;
        overflow: hidden;
        .hot-key{
          margin: 0 20px 20px 20px;
          .title{
            margin-bottom: 20px;
            font-size: @font-size-medium;
            color: @color-text-l;
          }
          .item{
            display: inline-block;
            padding: 5px 10px;
            margin: 0 20px 10px 0;
            border-radius: 6px;
            background: @color-highlight-background;
            font-size: @font-size-medium;
            color: @color-text-d;
          }
        }
        .search-history{
          position: relative;
          margin: 0 20px;
          .title{
            display: flex;
            align-items: center;
            height: 40px;
            font-size: @font-size-medium;
            color: @color-text-l;
            .text{
              flex: 1;
            }
            .clear{
              .icon-clear{
                font-size: @font-size-medium;
                color: @color-text-d;
              }
            }
          }
        }
      }
    }
    .search-result{
      position: fixed;
      width: 100%;
      top: 168px;
      overflow: hidden;
      bottom: 60px;
      .search-list{
        .search-item{
            position: relative;
            height: 55px;
            padding-left: 56px;
            overflow: hidden;
            .icon{
                position: absolute;
                top: 18px;
                left: 18px;
                width: 22px;
                height: 20px;
                background-position: 0 0;
                background-image: url(./search_sprite.png);
                background-repeat: no-repeat;
                background-size: 22px 30px;
            }
            .text {
                margin: 10px 0 2px;
                line-height: 18px;
                font-weight: normal;
                color: @color-text-ll;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                font-size: @font-size-medium;
            }
            .subtext{
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                color: @color-text-l;
                font-size: @font-size-small;
            }
            &::after{
                content: "";
                position: absolute;
                height: 1px;
                bottom: 0;
                left: 0;
                right: 0;
                background: #333;
            }
        }
      }
    }
}
.loading-wrapper{
    width: 100%;
    text-align: center;
    padding: 10px 0;
    color:@color-text-d;
    font-size: 12px;
    .loading{
        margin-top: 0;
    }
}
</style>
