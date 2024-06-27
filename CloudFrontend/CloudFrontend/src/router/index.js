import { createRouter, createWebHistory } from 'vue-router'

import store from '../store'

import Home from '../views/Home.vue'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Chat from '../views/Chat.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
      
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/chat',
      name: 'chat',
      component: Chat
    }
  ]
})

router.beforeEach((to, from, next) => {
  let isAuth = store.state.isAuth;

  if (to.name == "chat" && !isAuth) {
    next({ name: 'login' })
    return
  }
  next()
  return
});

export default router
