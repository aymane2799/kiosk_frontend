import { timestamp } from '@vueuse/core'
import axios, { AxiosError } from 'axios'
import { NETWORK_ERROR_CODE, type ApiError, type ApiFieldError } from '../types/api-error'

interface ServletErrorBody {
  timestamp?: string
  status?: number
  error?: string
  path?: string
}

export function isApiError(error: unknown): error is ApiError {
  if (typeof error !== 'object' || error == null) return false
  const e = error as Record<string, unknown>

  return (
    typeof e.code === 'string' &&
    typeof e.status === 'number' &&
    typeof e.message === 'string' &&
    Array.isArray(e.errors)
  )
}

function codeFromStatus(status: number): string {
  switch (status) {
    case 400:
      return 'MALFORMED_REQUEST'
    case 401:
      return 'UNAUTHENTICATED'
    case 403:
      return 'UNAUTHORIZED'
    case 404:
      return 'NOT_FOUND'
    case 409:
      return 'CONFLICT'
    default:
      return status >= 500 ? 'INTERNAL_ERROR' : 'UNKNOWN'
  }
}

export function normalizeError(error: unknown): ApiError {
  const nowIso = new Date().toISOString()

  if (!axios.isAxiosError(error)) {
    return {
      code: 'UNKNOWN',
      message: error instanceof Error ? error.message : 'Unknown error',
      status: 0,
      path: '',
      timestamp: nowIso,
      errors: [],
    }
  }

  const axiosError = error as AxiosError
  const path = axiosError.config?.url ?? ''

  if (!axiosError.response) {
    return {
      code: NETWORK_ERROR_CODE,
      message: axiosError.message || 'Network error - the serveris unreachable',
      status: 0,
      path: '',
      timestamp: nowIso,
      errors: [],
    }
  }

  const { status, data } = axiosError.response

  if (isApiError(data)) {
    return { ...data, errors: data.errors ?? [] }
  }

  const servlet = (typeof data === 'object' && data !== null ? data : {}) as ServletErrorBody
  const errors: ApiFieldError[] = []

  return {
    code: codeFromStatus(status),
    message: servlet.error ?? axiosError.message ?? `Request failed with status ${status}`,
    status,
    path: servlet.path ?? path,
    timestamp: servlet.timestamp ?? nowIso,
    errors,
  }
}
