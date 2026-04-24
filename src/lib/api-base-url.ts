const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

export function getApiBaseUrl() {
  if (configuredApiBaseUrl) {
    return configuredApiBaseUrl
  }

  return import.meta.env.PROD ? '/api/v1' : 'http://localhost:3001/api/v1'
}
