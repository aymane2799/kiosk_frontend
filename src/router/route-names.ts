export const ROUTE_NAMES = {
  tenantHome: 'tenant-home',
  tenantLogin: 'tenant-login',
  tenantCatalog: 'tenant-catalog',
  tenentContentDetail: 'tenant-content-detail',
  tenantPlans: 'tenant-plans',
  adminHome: 'admin-home',
  adminLogin: 'admin-login',
  adminTenants: 'admin-tenants',
}
export type RouteName = (typeof ROUTE_NAMES)[keyof typeof ROUTE_NAMES]
