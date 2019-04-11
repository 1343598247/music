import Vue from 'vue'
import Router from 'vue-router'
import Rank from '@/views/rank/'
import Singer from '@/views/singer/'
import Recommend from '@/views/recommend/'
import rankDetail from '@/views/rank/rankDetail.vue'
import Sousuo from '@/views/sousuo/'
import singerDetail from '@/views/singer/singerDetail.vue'
import recommendDetail from '@/views/recommend/recommendDetail.vue'

Vue.use(Router)

export default new Router({
  mode:"history",
  routes: [
    {
      path: '/',
      redirect:"/recommend"

    },
    {
      path: '/recommend/',
      component:Recommend,
      children: [
        {
          path: ':id', // 表示 id 为变量
          component:recommendDetail,
        }
      ]
    },
   
      // {
      //   path: '/recommend/:id', // 表示 id 为变量
      //   component:recommendDetail,
      // },
  
    {
      path: '/singer',
      component:Singer,
      children: [
        {
          path: ':id', // 表示 id 为变量
          component:singerDetail,
        }
      ],
  
    },
    {
      path: '/rank',
      component:Rank,
      children: [
        {
          path: ':id', // 表示 id 为变量
          component:rankDetail,
        }
      ]
    },
    // {
    //   path: '/rank/:id', // 表示 id 为变量
    //   component:rankDetail,
    // },
    {
      path: '/sousuo',
      component:Sousuo
    }
  ]
})
