import { createRouter, createWebHistory,RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import store from '@/store';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/About.vue'),
  },
  {
    path: '/manage',
    //alias:'manage-music',
    name: 'Manage',
    component:() => import('../views/Manage.vue'),
    beforeEnter:(to,from,next)=>{
      console.log('Manage Route Guard')
      next()
    },
    meta:{
      requiresAuth:true
    }
  },
  {
    path: '/manage-music',
    redirect:{name:'Manage'}
  },
  {
    path:'/:catchAll(.*)*',
    redirect:{name:'Home'}
  },
  {
    name:"Song",
    path:"/song/:id",
    component:() => import('../views/Song.vue')
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass:"text-yellow-500"
});

router.beforeEach((to,from,next)=>{
  // console.log(to.matched)
  if(!to.matched.some((route)=>route.meta.requiresAuth)){
    next()
    return 
  }
  if(store.state.isLoggedIn){
    next()
    return
  }
  next({name:'Home'})
})

export default router;
