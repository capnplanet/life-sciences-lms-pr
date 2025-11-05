export type SSOProvider = 'oidc' | 'saml'

export interface SSOConfig {
  provider: SSOProvider
  issuer?: string
  clientId?: string
  redirectUri?: string
}

export async function startLogin(config: SSOConfig) {
  // Redirect to backend-initiated SSO flow, keeping secrets/server config off the client
  const params = new URLSearchParams({ provider: config.provider })
  window.location.href = `/api/auth/login?${params.toString()}`
}

export async function logout() {
  window.location.href = '/api/auth/logout'
}
