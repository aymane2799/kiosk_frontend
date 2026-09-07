export const API_ERROR_CODES = [
  'INSUFFICIENT_TIER',
  'VALIDATION_ERROR',
  'MALFORMED_REQUEST',
  'NOT_FOUND',
  'UNAUTHORIZED',
  'CONFLICT',
  'INTERNAL_ERROR',
] as const

export type ApiErrorCode = (typeof API_ERROR_CODES)[number]

export const NETWORK_ERROR_CODE = 'NETWORK_ERROR'

export interface ApiFieldError {
  field: string
  message: string
}

export interface ApiError {
  code: ApiErrorCode | typeof NETWORK_ERROR_CODE | (string & {})
  message: string
  status: number
  path: string
  timestamp: string
  errors: ApiFieldError[]
}
