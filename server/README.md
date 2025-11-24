# Life Sciences LMS Backend Server

**GxP-Compliant Backend API** for the Life Sciences Learning Management System.

This production-ready backend implements:
- ✅ 21 CFR Part 11 compliant e-signature workflows
- ✅ GAMP 5 audit trail architecture
- ✅ AI provider integration (OpenAI, Anthropic, local Llama)
- ✅ Deterministic guardrails for content validation
- ✅ RegWatch regulatory monitoring service
- ✅ Role-based access control (RBAC)
- ✅ JWT authentication
- ✅ Comprehensive security controls

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ and npm
- PostgreSQL 16+ (for production)
- Redis 7+ (for session management)
- Docker and Docker Compose (optional)

### Local Development

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start development server:**
```bash
npm run dev
```

Server will start on http://localhost:3000

### Using Docker Compose

```bash
# Start all services (server, PostgreSQL, Redis)
docker-compose up -d

# View logs
docker-compose logs -f server

# Stop services
docker-compose down
```

## 📋 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### AI Integration
- `POST /api/ai/chat` - Proxy AI chat requests (requires authentication)
- `GET /api/ai/config` - Get AI configuration
- `POST /api/ai/validate` - Validate content against guardrails

### E-Signatures (21 CFR Part 11)
- `POST /api/esign/request` - Request electronic signature
- `GET /api/esign/:signatureId` - Retrieve signature record
- `POST /api/esign/verify` - Verify signature integrity

### User Management
- `GET /api/user` - Get current user
- `GET /api/user/profile` - Get detailed user profile

### Learning Modules
- `GET /api/modules` - List all modules
- `GET /api/modules/:moduleId` - Get module details
- `POST /api/modules` - Create module (admin only)

### Health Check
- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed health with dependencies

## 🔒 Security Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (learner, instructor, admin)
- Permission-based endpoint protection
- Rate limiting (100 requests per 15 minutes)
- Stricter rate limiting for auth endpoints (5 attempts per 15 minutes)

### Audit Trail (GAMP 5)
- Comprehensive logging of all API requests
- Immutable audit logs
- Automatic redaction of sensitive data
- Separate audit log file with long retention

### E-Signatures (21 CFR Part 11)
- Password verification required
- Cryptographic signature hashing (SHA-256)
- Document binding and integrity verification
- Full audit trail of signature events
- Configurable retention period (25 years default)

### Input Validation
- Zod schema validation
- Sanitization of user inputs
- XSS protection
- SQL injection prevention

### Security Headers
- Helmet.js for secure headers
- CORS configuration
- Content Security Policy
- HSTS enabled

## 🤖 AI Provider Integration

### Supported Providers

**OpenAI:**
```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_DEFAULT_MODEL=gpt-4o-mini
```

**Anthropic:**
```env
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_DEFAULT_MODEL=claude-3-haiku-20240307
```

**Local Llama (OpenAI-compatible):**
```env
AI_PROVIDER=llama
LLAMA_API_BASE=http://localhost:8000/v1
LLAMA_DEFAULT_MODEL=llama-3.1-8b-instruct
```

### Deterministic Guardrails

The backend includes comprehensive guardrails:
- Input validation for malicious content
- Output validation for sensitive data
- Regulatory URL whitelisting
- Keyword-based domain alignment
- Content quality checks

Enable deterministic mode:
```env
GUARDRAIL_DETERMINISTIC=true
```

## 📡 RegWatch Service

Automated regulatory monitoring service that checks:
- FDA guidance documents
- EMA guidelines
- ICH standards
- PMDA, MHRA, CDSCO, Health Canada updates

Configuration:
```env
REGWATCH_ENABLED=true
REGWATCH_INTERVAL_HOURS=24
REGWATCH_AUTHORITIES=FDA,EMA,ICH,PMDA,MHRA,CDSCO,Health Canada
```

## 🌐 Cloud Deployment

### AWS Deployment
See [deployment/aws/README.md](./deployment/aws/README.md) for:
- ECS/Fargate deployment
- Lambda + API Gateway
- Elastic Beanstalk
- RDS PostgreSQL setup
- ElastiCache Redis

### Azure Deployment
See [deployment/azure/README.md](./deployment/azure/README.md) for:
- App Service deployment
- Container Instances
- AKS (Kubernetes)
- Azure Database for PostgreSQL
- Azure Cache for Redis

### Docker Deployment
```bash
# Build image
docker build -t lifesci-lms-server .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL=postgresql://... \
  -e JWT_SECRET=... \
  lifesci-lms-server
```

## 🔧 Configuration

All configuration via environment variables. See `.env.example` for full list.

**Required:**
- `JWT_SECRET` - Secret for JWT signing
- `DATABASE_URL` - PostgreSQL connection string

**Optional:**
- AI provider credentials
- SSO configuration
- Cloud platform credentials
- Logging configuration

## 📊 Monitoring & Logging

### Application Logs
- Winston logger with multiple transports
- Configurable log levels (error, warn, info, http, debug)
- File rotation (5MB max, 5 files)

### Audit Logs
- Separate audit trail for compliance
- 10MB max file size, 100 file retention
- Captures all API requests with user context

### Metrics
- Request/response logging
- Performance timing
- Error tracking

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Type checking
npm run typecheck

# Linting
npm run lint
```

## 🔐 GxP Compliance

This backend is designed to support GxP-regulated environments:

**21 CFR Part 11 Requirements:**
- ✅ Electronic signatures with password verification
- ✅ Audit trail with user identification
- ✅ Record integrity (cryptographic hashing)
- ✅ Secure, computer-generated timestamps
- ✅ Document binding verification

**GAMP 5 Requirements:**
- ✅ Comprehensive audit trail
- ✅ User access controls
- ✅ Data integrity (ALCOA+)
- ✅ Change control ready
- ✅ Validation support structure

**Note:** Full GxP compliance requires validated infrastructure, which must be implemented during deployment.

## 📝 Development

### Project Structure
```
server/
├── src/
│   ├── index.ts              # Application entry point
│   ├── routes/               # API route handlers
│   │   ├── auth.ts
│   │   ├── ai.ts
│   │   ├── esign.ts
│   │   ├── user.ts
│   │   └── modules.ts
│   ├── middleware/           # Express middleware
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   ├── rateLimiter.ts
│   │   └── auditMiddleware.ts
│   ├── services/             # Business logic
│   │   ├── ai.service.ts
│   │   ├── guardrail.service.ts
│   │   └── regwatch.service.ts
│   └── utils/                # Utilities
│       └── logger.ts
├── deployment/               # Cloud deployment configs
│   ├── aws/
│   └── azure/
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## 🤝 Contributing

This is a production backend. All changes must:
1. Pass type checking
2. Include appropriate error handling
3. Add audit logging for sensitive operations
4. Maintain security controls
5. Update documentation

## 📜 License

See LICENSE file in repository root.
