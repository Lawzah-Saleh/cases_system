import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import { useAuthStore } from '@/stores/auth'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import TeamView from '@/views/TeamView.vue'
import UsersView from '@/views/UsersView.vue'
import StatisticsView from '@/views/StatisticsView.vue'
import ReportView from '@/views/ReportView.vue'
import ClientView from '@/views/ClientView.vue'
import SupportView from '@/views/SupportView.vue'


const routes = [
  {
    path: '/',
    redirect: '/login'
  },

  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false }
  },

  {
    path: '/app',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
       { path: 'dashboard', component: DashboardView },
      { path: 'supports', component: SupportView },
      { path: 'clients', component: ClientView },
      { path: 'team', component: TeamView },
      { path: 'users', component: UsersView },
      { path: 'statistics', component: StatisticsView },
      { path: 'reports', component: ReportView }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


router.beforeEach((to) => {
  const auth = useAuthStore()

 
  if (to.meta.requiresAuth && !auth.token) {
    return '/login'
  }
})

export default router
