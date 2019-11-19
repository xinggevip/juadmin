import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Index from '../components/Index.vue'
import User from '../components/User.vue'
import Album from '../components/Album.vue'
import Sentence from '../components/Sentence.vue'
import PushHot from '../components/PushHot.vue'
import Sets from '../components/Sets.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    redirect:'/',
    meta:{
      requireAuth: true  // 添加该字段，表示进入这个路由是需要登录的
    },
    children:[
      {
        path:'/',
        name:'index',
        component:Index
      },
      {
        path:'/user',
        name:'user',
        component:User
      },
      {
        path:'/album',
        name:'album',
        component:Album
      },
      {
        path:'/sentence',
        name:'sentence',
        component:Sentence
      },
      {
        path:'/pushhot',
        name:'pushhot',
        component:PushHot
      },
      {
        path:'/sets',
        name:'sets',
        component:Sets
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
