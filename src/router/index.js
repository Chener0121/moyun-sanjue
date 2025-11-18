import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  // 新的动态路由
  { 
    // :id 就是路由参数，可以是 hubi, huimo, xuanzhi
    path: '/appreciate/:id', 
    name: 'AppreciateItem', // 最好改个名字，表示这是单个物品页
    component: () => import('../pages/Appreciate.vue'),
    props: true // 这一行很重要，它会将路由参数作为props传递给组件
  },
  { 
    path: '/inherit', 
    name: 'Inherit', 
    component: () => import('../pages/Inherit.vue') 
  },
  { 
    path: '/create', 
    name: 'Create', 
    component: () => import('../pages/Create.vue') 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  // 每次切换路由，页面都回到顶部
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  },
});

export default router;