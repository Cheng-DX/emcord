import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import TheContainer from '~/layouts/TheContainer.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/channels/@me',
  },
  {
    path: '/login',
    component: () => import('~/pages/auth/Login.vue'),
  },
  {
    path: '/register',
    component: () => import('~/pages/auth/Register.vue'),
  },
  {
    path: '/channels',
    component: TheContainer,
    children: [{
      path: ':serverId',
      component: () => import('~/pages/channels/ChannelContainer.vue'),
      children: [{
        path: ':channelId',
        component: () => import('~/pages/channels/ChannelMain.vue'),
      }],
    }, {
      path: '@me',
      component: () => import('~/pages/channels/Me.vue'),
    }],
  },
]

export const router = createRouter({
  routes,
  history: createWebHashHistory(),
})

const { hasToken } = useToken()

router.beforeEach((to, _from, next) => {
  if (['/login', '/register'].includes(to.path) || hasToken.value)
    next()
  else
    router.push('/login')
})
