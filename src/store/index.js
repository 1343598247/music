import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
    //状态
    state:{
        //播放状态 boolean
        playing:false,
        //播放是否全屏
        fullScreen:false,
        //播放列表
        playList:[],
        //播放歌曲索引
        currentIndex:-1,
        //是否随机播放 顺序0 ,随机 1, 单曲 2
        mode:0,
    },
    //过滤
    getters:{
      playing:state=> state.playing,
      fullScreen:state=>state.fullScreen,
      playList:state=>state.playList,
      currentIndex:state=>state.currentIndex,
      mode:state=>state.mode,
      //当前播放的歌曲
      currentSong:state=>{
        return state.playList[state.currentIndex]
      }
    },
    //更改state
    mutations:{
        changePlaying(state,playing){
            state.playing=playing
        },
        changeFullScreen(state,fullScreen){
            state.fullScreen=fullScreen
        },
        changePlayList(state,playList){
            state.playList=[...playList]
        },
        changeCurrentIndex(state,currentIndex){
            state.currentIndex=currentIndex
        },
        changeMode(state,mode){
            state.mode=mode
        },
    },
    actions:{
        //添加歌曲
        //1.改变播放状态  把播放器设置为全屏 添加播放列表 指定播放歌曲
        addPlayer({commit},{list,index}){
            commit('changePlaying',true)
            commit('changeFullScreen',true)
            commit('changePlayList',list)
            commit('changeCurrentIndex',index)
        },
        //删除歌曲
        delSong({commit},song){
            let playList=state.playList;
            let index=0;
            for(let i=0;i<playList.length;i++){
                if(playList[i]==song.id){
                    index=i
                }
            }
            playList.splice(index,1)
            if(state.currentIndex==playList.length){
            currentIndex--
            }
            commit('changePlaying',true)
            commit('changePlayList',playList)
            commit('changeCurrentIndex', currentIndex)
        },
        //清空播放列表
        clearPlayList({commit}){
            commit('changePlaying',false)
            commit('changePlayList',[])
            commit('changeCurrentIndex', -1)
        }
        
    },
    // strict: debug,
    // plugins: debug ? [createLogger()] : []
})