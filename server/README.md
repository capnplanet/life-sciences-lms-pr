# Backend Scaffolding (Azure + AWS)

This frontend includes scaffolding hooks for a backend API to support:

- AI chat proxy (OpenAI, Anthropic, Llama via OpenAI-compatible APIs)
- Role-Based Access Control (RBAC)
- E-Signatures (21 CFR Part 11 aligned workflows)
- Single Sign-On (OIDC/SAML)

No backend code is bundled here to keep the frontend lightweight. Implement the following endpoints on your preferred platform.

## API Endpoints (to implement)

- POST /api/ai/chat
  - body: { provider: 'openai'|'anthropic'|'llama', model: string, messages: [{role, content}] }
  - returns: { output: string }

- POST /api/esign/request
  - body: { documentId, signerId, reason? }
  - returns: { requestId }

- GET /api/esign/:signatureId
  - returns: { id, documentId, signerId, signedAt, signatureHash }

- GET /api/auth/login?provider=oidc|saml
  - Redirects to IdP.

- GET /api/auth/callback
  - Handles IdP response and establishes session.

- POST /api/auth/logout
  - Clears session and redirects to homepage.

- GET /api/user
  - returns: { id, name, role, permissions: string[] }

## Azure Deployment Options

- Azure App Service (Node.js)
- Azure Kubernetes Service (AKS)
- Azure Static Web Apps (frontend) + Azure Functions (APIs)

Recommended: Static Web Apps + Functions for minimal ops.

## AWS Deployment Options

- AWS Amplify (frontend) + API Gateway + Lambda (APIs)
- Amazon ECS/Fargate (containerized) or Elastic Beanstalk (Node.js)

Recommended: Amplify + Lambda for serverless simplicity.

## Security Notes

- Keep all API keys and secrets on the server side.
- Implement RBAC checks server-side; client RBAC is advisory only.
- For Part 11, ensure audit trails, identity verification, and signature/record binding are handled by the backend.

## Local Development

- Create a simple Node/Express proxy for the above routes.
- Configure the frontend to call the same origin (avoid CORS in dev).

```
/frontend (this repo)
/server   (your Node/Express/Fastify/.NET/etc)
```

## Observability

- Add structured logging, request IDs, and audit trails for regulated events.
- Capture AI prompts/responses with redaction for PHI/PII.
