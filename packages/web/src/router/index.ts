import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/home/HomePage.vue'),
  },
  {
    path: '/look',
    name: 'Look',
    component: () => import(/* webpackChunkName: "look" */ '../views/look/LookPage.vue'),
  },
  {
    path: '/dress-checker',
    name: 'Dress Checker',
    component: () => import(/* webpackChunkName: "dress-checker" */ '../views/dressChecker/DressCheckerPage.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
