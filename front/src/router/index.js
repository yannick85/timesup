import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import JoinGame from '@/views/JoinGame.vue'
import CreateGame from '@/views/CreateGame.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/join',
    name: 'JoinGame',
    component: JoinGame
  },
  {
    path: '/create',
    name: 'CreateGame',
    component: CreateGame
  },
]

const router = new VueRouter({
  routes
})

export default router
