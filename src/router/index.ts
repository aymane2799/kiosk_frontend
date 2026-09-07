import TenantLandingPage from '@/features/tenant/pages/TenantLandingPage.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import DefaultTenantLayout from '@/layouts/DefaultTenantLayout.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { ROUTE_NAMES } from './route-names'
import { installAuthGuards } from './gurads'
import AdminAuthLayout from '@/layouts/AdminAuthLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: { name: ROUTE_NAMES.adminTenants } },

    {
      path: '/t/:tenantSlug',
      component: DefaultTenantLayout,
      meta: { identity: 'tenant' },
      children: [
        { path: '', name: ROUTE_NAMES.tenantHome, component: TenantLandingPage },
        {
          path: 'catalog',
          name: ROUTE_NAMES.tenantCatalog,
          meta: { requiresAuth: true },
          component: () => import('@/features/content/pages/CatalogPage.vue'),
        },
        {
          path: 'catalog/:contentId',
          name: ROUTE_NAMES.tenentContentDetail,
          meta: { requiresAuth: true },
          component: () => import('@/features/content/pages/ContentDetailPage.vue'),
        },
        {
          path: 'plans',
          name: ROUTE_NAMES.tenantPlans,
          component: () => import('@/features/subscription/pages/TenantPlansPage.vue'),
        },
      ],
    },
    {
      path: '/t/:tenantSlug/login',
      component: AuthLayout,
      meta: { identity: 'tenant' },
      children: [
        {
          path: '',
          name: ROUTE_NAMES.tenantLogin,
          component: () => import('@/features/auth/pages/TenantLoginPage.vue'),
        },
      ],
    },

    {
      path: '/admin',
      component: AdminLayout,
      meta: { identity: 'admin', requiresAuth: true },
      children: [
        { path: '', name: ROUTE_NAMES.adminHome, redirect: { name: 'admin-tenants' } },
        {
          path: 'tenants',
          name: ROUTE_NAMES.adminTenants,
          component: () => import('@/features/admin/pages/AdminTenantsPage.vue'),
        },
      ],
    },

    {
      path: '/admin/login',
      component: AdminAuthLayout,
      meta: { identity: 'admin' },
      children: [
        {
          path: '',
          name: ROUTE_NAMES.adminLogin,
          component: () => import('@/features/auth/pages/AdminLoginPage.vue'),
        },
      ],
    },
  ],
})

installAuthGuards(router)

export default router
