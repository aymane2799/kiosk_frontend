import TenantLandingPage from '@/features/tenant/pages/TenantLandingPage.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import DefaultTenantLayout from '@/layouts/DefaultTenantLayout.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: { name: 'admin-tenants' } },

    {
      path: '/t/:tenantSlug',
      component: DefaultTenantLayout,
      children: [{ path: '', name: 'tenant-home', component: TenantLandingPage }],
    },
    {
      path: '/t/:tenantSlug/login',
      component: AuthLayout,
      children: [
        {
          path: '',
          name: 'tenant-login',
          component: () => import('@/features/auth/pages/TenantLoginPage.vue'),
        },
      ],
    },

    {
      path: '/admin',
      component: AdminLayout,
      children: [
        { path: '', name: 'admin-home', redirect: { name: 'admin-tenants' } },
        {
          path: 'tenants',
          name: 'admin-tenants',
          component: () => import('@/features/admin/pages/AdminTenantsPage.vue'),
        },
      ],
    },

    {
      path: '/admin/login',
      component: AuthLayout,
      children: [
        {
          path: '',
          name: 'admin-login',
          component: () => import('@/features/auth/pages/AdminLoginPage.vue'),
        },
      ],
    },
  ],
})

export default router
