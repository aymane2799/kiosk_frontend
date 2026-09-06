export const tenantKeys = {
  all: ['tenant'] as const,
  config: (slug: string) => ['tenant', slug] as const,
}
