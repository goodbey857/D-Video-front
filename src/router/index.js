import Vue from 'vue'
import VueRouter from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import StudioNavBar from '@/components/StudioNavBar.vue'
import AdminNavBar from '@/components/AdminNavBar.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    components: {
      NavBar,
      default: () => import(/* webpackChunkName: "about" */ '../views/Home.vue')
    }
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: () =>
      import(/* webpackChunkName: "signin" */ '../views/Auth/SignIn.vue')
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () =>
      import(/* webpackChunkName: "signup" */ '../views/Auth/SignUp.vue')
  },
  {
    path: '/trending',
    name: 'Trending',
    components: {
      NavBar,
      default: () =>
        import(/* webpackChunkName: "trending" */ '../views/Trending.vue')
    }
  },
  {
    path: '/studio',
    components: {
      StudioNavBar,
      default: () =>
        import(/* webpackChunkName: "dashboard" */ '../views/Studio/Index.vue')
    },
    children: [
      {
        path: '/',
        name: 'Dashboard',
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ '../views/Studio/Analytics.vue'
          )
      },
      {
        path: 'videos',
        name: 'Video',
        component: () =>
          import(/* webpackChunkName: "video" */ '../views/Studio/Video.vue')
      },
      {
        path: 'details/:id',
        name: 'Detail',
        component: () =>
          import(/* webpackChunkName: "video" */ '../views/Studio/Details.vue')
      },
      {
        path: 'analytics',
        name: 'Analytics',
        component: () => import(/* webpackChunkName: "video" */ '../views/Studio/Analytics.vue')
      },
      {
        path: 'comments',
        name: 'Comments',
        component: () => import(/* webpackChunkName: "video" */ '../components/cards/CommentTable.vue')
      },
      {
        path: 'tokenRecord',
        name: 'TokenRecord',
        component: () => import(/* webpackChunkName: "video" */ '../views/Studio/TokenRecord.vue')
      },
      
    ]
  },
  {
    path: '/admin',
    components: {
      AdminNavBar,
      default: () =>
        import(/* webpackChunkName: "admin" */ '../views/Admin/Index.vue')
    },
    children:[
      {
        path: 'userData',
        name: 'UserData',
        component: () => import(/* webpackChunkName: "admin" */ '../views/Admin/UserData.vue')
      },
      {
        path: 'videoData',
        name: 'VideoData',
        component: () => import(/* webpackChunkName: "admin" */ '../views/Admin/VideoData.vue')
      },
      {
        path: 'commentData',
        name: 'CommentData',
        component: () => import(/* webpackChunkName: "admin" */ '../views/Admin/CommentData.vue')
      },
      {
        path: 'videoTransferData',
        name: 'VideoTransferData',
        component: () => import(/* webpackChunkName: "admin" */ '../views/Admin/VideoTransferData.vue')
      },
      {
        path: 'rewardData',
        name: 'RewardData',
        component: () => import(/* webpackChunkName: "admin" */ '../views/Admin/RewardData.vue')
      },
      {
        path: 'judge',
        name: 'Judge',
        component: () => import(/* webpackChunkName: "admin" */ '../views/Admin/Judge.vue')
      }
      

    ]
  },
  {
    path: '/channels/:id',
    components: {
      NavBar,
      default: () =>
        import(/* webpackChunkName: "dashboard" */ '../views/Channel/Index.vue')
    },
    children: [
      {
        path: '/',
        name: 'ChannelHome',
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ '../views/Channel/Home.vue'
          )
      }
    ]
  },
  {
    path: '/watch/:id',
    name: 'Watch',
    components: {
      NavBar,
      default: () =>
        import(/* webpackChunkName: "video" */ '../views/Watch.vue')
    }
  },
  {
    path: '/history',
    name: 'History',
    components: {
      NavBar,
      default: () =>
        import(/* webpackChunkName: "video" */ '../views/History.vue')
    }
  },
  {
    path: '/search',
    name: 'Search',
    components: {
      NavBar,
      default: () =>
        import(/* webpackChunkName: "video" */ '../views/Search.vue')
    }
  },
  {
    path: '/subscribe',
    name: 'Subscribe',
    components: {
      NavBar,
      default: () => import(/* webpackChunkName: "video" */ '../views/Subscribe.vue')
    }

  },
  {
    path: '/series/:id',
    name: 'Series',
    components: {
      NavBar,
      default: () => import(/* webpackChunkName: "video" */ '../views/SeriesDetail.vue')
    }
  },
  {
    path: '/starred',
    name: 'starred',
    components: {
      NavBar,
      default: () => import(/* webpackChunkName: "video" */ '../views/StarredVideo.vue')
    }

  },
  {
    path: '/liked',
    name: 'liked',
    components: {
      NavBar,
      default: () => import(/* webpackChunkName: "video" */ '../views/LikedVideo.vue')
    }

  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    console.log(to);
    console.log(from);
    if (savedPosition) {
      console.log(1)
      return savedPosition
    } else if(to.name == "Watch") {
      console.log(2)
      return { x: 0,y:0 }
    }
  },
})

export default router
