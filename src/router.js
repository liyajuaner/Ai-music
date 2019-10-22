/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-27 08:04:12
 * @LastEditTime: 2019-08-27 13:08:56
 * @LastEditors: Please set LastEditors
 */
import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Artists from './views/artists.vue'
import Rank from './views/rank.vue'
import PlayListView from './views/playListView.vue'
import Recommend from './views/recommend.vue'
import PlayListInfo from './views/playListInfo';
import RankInfo from './views/rankInfo';
import ArtistsInfo from './views/artistsInfo';
import Search from './views/search';
import UserCenter from './views/userCenter';
import UserHistoryList from './views/userHistoryList';
import UserLoveList from './views/userLoveList';
import UserPlayList from './views/userPlayList';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          path: '/recommend',
          name: 'recommend',
          component: Recommend
        },
        {
          path: '/playListView',
          name: 'playListView',
          component: PlayListView,
          children: [
            {
              path: ':id',
              name: 'playListInfo',
              component: PlayListInfo
            }
          ]
        },
        {
          path: '/rank',
          name: 'rank',
          component: Rank,
          children: [
            {
              path: ':id',
              name: 'RankInfo',
              component: RankInfo
            }
          ]
        },
        {
          path: '/artists',
          name: 'artists',
          component: Artists,
          children: [
            {
              path: ':id',
              name: 'artistsInfo',
              component: ArtistsInfo
            }
          ]
        },
        {
          path: '/search',
          name: 'search',
          component: Search
        },
        {
          path: '/userCenter',
          name: 'userCenter',
          component: UserCenter,
          children: [{
            path: '/userHistoryList',
            name: 'userHistoryList',
            component: UserHistoryList
          },
          {
            path: '/userLoveList',
            name: 'userLoveList',
            component: UserLoveList
          },
          {
            path: '/userPlayList',
            name: 'userPlayList',
            component: UserPlayList
          }]
        }
      ]
    },
  ],
});
