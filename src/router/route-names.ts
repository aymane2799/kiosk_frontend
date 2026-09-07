export const ROUTE_NAMES = {
  // User Tenant routes
  tenantHome: 'tenant-home',
  tenantLogin: 'tenant-login',
  tenantCatalog: 'tenant-catalog',
  tenantFavorites: 'tenant-favorites',
  tenentContentDetail: 'tenant-content-detail',
  tenantPlans: 'tenant-plans',

  // Admin routes
  adminHome: 'admin-home',
  adminLogin: 'admin-login',
  adminTenants: 'admin-tenants',
  adminTenantDetail: 'admin-tenant-detail',
  adminCreateTenant: 'admin-create-tenants',
  adminUpdateTenant: 'admin-update-tenants',
  adminTenantPlans: 'admin-tenant-plans',
  adminTenantCreatePlan: 'admin-tenant-create-plan',
  adminTenantUsers: 'admin-tenant-users',
}
export type RouteName = (typeof ROUTE_NAMES)[keyof typeof ROUTE_NAMES]
