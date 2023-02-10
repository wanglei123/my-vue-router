import Vue from 'vue'
import MyVueRouter from './my-vue-router.js'
import Home from '../views/Home.vue'

Vue.use(MyVueRouter)

const routes = [
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
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    children: [{
      path: '/about/info',
      name: 'info',
      component: {render(h){return h('div', 'info page')}}
    }]
  }
]

const router = new MyVueRouter({
  routes
})

export default router
