import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import { useAuthStore } from '@/stores/auth'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import EmployeeView from '@/views/EmployeeView.vue'
import UsersView from '@/views/UsersView.vue'
import ReportView from '@/views/ReportView.vue'
import ClientView from '@/views/ClientView.vue'
import SupportView from '@/views/SupportView.vue'
import SettingView from '@/views/SettingView.vue'
import PermissionView from '@/views/settings/PermissionView.vue'
import RoleView from '@/views/settings/RoleView.vue'
import PriorityDelayTimeView from '@/views/settings/PriorityDelayTimeView.vue'
import PersonalAccountView from '@/views/settings/PersonalAccountView.vue'

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
      { path: 'employees', component: EmployeeView },
      { path: 'users', component: UsersView },
      { path: 'reports', component: ReportView },
      {
        path: 'reports/cases',
        component: () => import('@/views/reports/CasesReportView.vue')
      },

      {
        path: 'reports/employees',
        name: 'employees-report',
        component: () => import('@/views/reports/EmployeesReportView.vue')
      },
      {
        path: 'reports/clients',
        name: 'clients-report',
        component: () => import('@/views/reports/ClientsReportView.vue')
      },

      {
        path: 'settings',
        component: SettingView
      },
      {
        path: 'settings/permission',
        component: PermissionView
      },
      {
        path: 'settings/role',
        component: RoleView
      },
      {
        path: 'settings/cases_delay_time',
        component: PriorityDelayTimeView
      },
      {
        path: 'settings/personalAccount',
        component: PersonalAccountView
      },
      {
        path: 'statistics',
        component: () => import('@/views/StatisticsView.vue')
      },
      {
        path: 'statistics/cases',
        component: () => import('@/views/statistics/CasesStatisticsView.vue')
      },
      {
        path: 'statistics/employees',
        component: () => import('@/views/statistics/EmployeesStatisticsView.vue')
      },
      {
        path: 'statistics/clients',
        component: () => import('@/views/statistics/ClientsStatisticsView.vue')
      }
    ]
  }

  // {
  //   path: '/app/settings/role',
  //   component: () => import('@/views/settings/RoleView.vue'),
  // },
  // {
  //   path: '/app/settings/account',
  //   component: () => import('@/views/settings/AccountView.vue'),
  // },
  // {
  //   path: '/app/settings/complaints',
  //   component: () => import('@/views/settings/ComplaintsDelayView.vue'),
  // },
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
