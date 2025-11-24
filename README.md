# LifeSci Academy - Regulatory Compliance Learning Management System

A **production-ready**, regulatory-compliant learning management system designed for life sciences professionals, featuring AI-powered content monitoring, adaptive learning paths, and comprehensive compliance tracking across pharmacovigilance, clinical operations, quality assurance, regulatory affairs, and Good Practice standards (GMP, GCP, GPVP, GMLP).

## 🎯 Overview

LifeSci Academy is a complete, full-stack LMS platform combining an interactive React frontend with a GxP-compliant Node.js backend. The system supports AI-assisted regulatory content management with 21 CFR Part 11 electronic signatures, GAMP 5 audit trails, and multi-provider AI integration.

**Current Status:** ✅ **Production-ready full stack** with frontend UI, backend API, authentication, AI integration, and cloud deployment configurations for AWS and Azure.

## ✨ Key Features

### ✅ Fully Implemented

**Frontend (React + TypeScript)**
- **Interactive Learning Modules** - Multi-format content delivery with progress tracking
- **Module Viewer** - Rich content player with section navigation and progress updates
- **Assessment System** - Multiple question types (MCQ, multi-select, scenario-based) with scoring
- **Progress Dashboard** - Real-time tracking of learner progress, certifications, and recommendations
- **Analytics & Insights** - Comprehensive learner performance metrics and module effectiveness visualizations
- **Certification Management** - Automated certificate issuance with verification codes and expiry tracking
- **Content Management System** - Admin interface for viewing learning modules and audit logs
- **Regulatory Glossary** - Searchable database of 20 key life sciences terms and regulatory concepts

**Backend (Node.js + Express)**
- **GxP-Compliant API Server** - Production-ready REST API with comprehensive security
- **21 CFR Part 11 E-Signatures** - Compliant electronic signature implementation with password verification
- **GAMP 5 Audit Trail** - Immutable audit logging with comprehensive metadata capture
- **JWT Authentication** - Secure token-based authentication with role-based access control
- **AI Provider Integration** - Support for OpenAI, Anthropic, and local Llama models
- **Deterministic Guardrails** - Content validation with regulatory URL whitelisting
- **RegWatch Service** - Automated regulatory monitoring scaffolding (FDA, EMA, ICH, etc.)
- **Rate Limiting & Security** - Helmet.js security headers, CORS, input validation

**Deployment & Infrastructure**
- **Docker Support** - Complete containerization with Docker Compose
- **AWS Deployment** - Guides for ECS/Fargate, Lambda, Elastic Beanstalk
- **Azure Deployment** - Guides for App Service, AKS, Container Instances
- **PostgreSQL & Redis** - Database and caching layer configuration

### 🔧 Ready for Integration

- **RegWatch AI** - Backend service implemented, ready to connect to regulatory authority APIs/web scraping
- **AI Content Generation** - Multi-provider backend ready, can be activated with API keys
- **Persistent Storage** - Database schema ready for PostgreSQL migration from local storage
- **SSO Integration** - Backend endpoints scaffolded for OIDC/SAML providers

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern UI framework with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server with API proxy
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Smooth animations and transitions
- **Recharts & D3** - Data visualization for analytics
- **React Query** - Server state management

### Backend
- **Node.js 20+** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe backend development
- **PostgreSQL 16** - Relational database for audit compliance
- **Redis 7** - Session management and caching
- **Winston** - Structured logging
- **JWT** - Token-based authentication
- **Zod** - Schema validation
- **Helmet.js** - Security headers

### AI Integration
- **OpenAI** - GPT models (gpt-4o-mini, gpt-4, etc.)
- **Anthropic** - Claude models (claude-3-haiku, claude-3-sonnet, etc.)
- **Local LLM** - Llama models via OpenAI-compatible endpoints (llama.cpp, ollama, vLLM)
- **Deterministic Guardrails** - Custom validation and content safety

### Infrastructure & Deployment
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **AWS** - ECS, Lambda, RDS, ElastiCache
- **Azure** - App Service, AKS, PostgreSQL, Redis Cache

### UI Components
- **Phosphor Icons** - Comprehensive icon library (1500+ icons)
- **Lucide React** - Additional icon support
- **shadcn/ui** - High-quality, customizable component library (46 components implemented)
- **Sonner** - Toast notifications
- **next-themes** - Dark mode support

### Development Tools
- **ESLint** - Code linting
- **GitHub Spark** - Development platform integration
- **SWC** - Fast TypeScript/JSX compilation

## 🚀 Getting Started

### Quick Setup (Automated)

Run the setup script to install all dependencies and build the backend:

```bash
./setup-dev.sh
```

Then configure `server/.env` with your settings and start both servers.

### Manual Setup

#### Prerequisites
- Node.js 20+ and npm
- PostgreSQL 16+ (optional for production)
- Redis 7+ (optional for production)
- Docker and Docker Compose (optional)

#### Frontend Only (Mock Data)

1. **Clone the repository:**
```bash
git clone <repository-url>
cd life-sciences-lms-pr
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

4. **Open your browser to** `http://localhost:5173`

#### Full Stack (Frontend + Backend)

1. **Install frontend dependencies:**
```bash
npm install
```

2. **Install backend dependencies:**
```bash
cd server
npm install
```

3. **Configure backend environment:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Build backend:**
```bash
npm run build
```

5. **Start backend server (in one terminal):**
```bash
npm run dev
# Server runs on http://localhost:3000
```

6. **Start frontend server (in another terminal):**
```bash
cd ..
npm run dev
# Frontend runs on http://localhost:5173
# API requests automatically proxied to backend
```

#### Docker Compose (Recommended)

Run the entire stack with PostgreSQL and Redis:

```bash
cd server
docker-compose up -d
```

This starts:
- Backend API on port 3000
- PostgreSQL on port 5432
- Redis on port 6379

Then start the frontend:
```bash
cd ..
npm run dev
```

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint on codebase
- `npm run optimize` - Optimize dependencies

**Backend (in server/):**
- `npm run dev` - Start development server with auto-reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run typecheck` - Type check without emitting
- `npm run lint` - Run ESLint on backend code

## 📁 Project Structure

```
life-sciences-lms-pr/
├── src/                        # Frontend React application
│   ├── components/
│   │   ├── ui/                 # 46 shadcn/ui components
│   │   ├── views/              # 11 application views
│   │   └── AppLayout.tsx
│   ├── lib/
│   │   ├── ai/                 # AI client integration
│   │   ├── security/           # Auth, RBAC, E-sign types
│   │   ├── types.ts
│   │   ├── mockData.ts
│   │   └── helpers.ts
│   └── main.tsx
│
├── server/                     # Backend Node.js API
│   ├── src/
│   │   ├── index.ts            # Server entry point
│   │   ├── routes/             # API endpoints
│   │   │   ├── auth.ts         # Authentication (JWT)
│   │   │   ├── ai.ts           # AI proxy
│   │   │   ├── esign.ts        # E-signatures (21 CFR Part 11)
│   │   │   ├── user.ts         # User management
│   │   │   ├── modules.ts      # Learning modules
│   │   │   └── health.ts       # Health checks
│   │   ├── middleware/         # Express middleware
│   │   │   ├── auth.ts         # JWT verification, RBAC
│   │   │   ├── auditMiddleware.ts  # GAMP 5 audit trail
│   │   │   ├── errorHandler.ts
│   │   │   └── rateLimiter.ts
│   │   ├── services/           # Business logic
│   │   │   ├── ai.service.ts   # AI provider integration
│   │   │   ├── guardrail.service.ts  # Content validation
│   │   │   └── regwatch.service.ts   # Regulatory monitoring
│   │   └── utils/
│   │       └── logger.ts       # Winston logging
│   ├── deployment/
│   │   ├── aws/                # AWS deployment guides
│   │   └── azure/              # Azure deployment guides
│   ├── Dockerfile
│   ├── docker-compose.yml      # PostgreSQL + Redis + Server
│   └── package.json
│
├── vite.config.ts              # Vite config with API proxy
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── setup-dev.sh                # Automated setup script
└── README.md
```

## 🎓 Supported Training Domains

- **Good Clinical Practice (GCP)** - ICH-GCP guidelines and clinical trial standards
- **Good Manufacturing Practice (GMP)** - Manufacturing quality standards
- **Good Pharmacovigilance Practice (GPVP)** - Drug safety monitoring
- **Good Laboratory Practice (GMLP)** - Laboratory quality standards
- **Pharmacovigilance** - Adverse event reporting and safety surveillance
- **Clinical Operations** - Trial management and execution
- **Quality Assurance** - Quality management systems
- **Regulatory Affairs** - Regulatory compliance and submissions
- **Quality Control** - Testing and validation procedures

## 🔐 GxP Compliance & Security

### 21 CFR Part 11 Implementation

**✅ Fully Implemented:**
- Electronic signatures with password verification (backend)
- Cryptographic signature hashing (SHA-256)
- Document binding and integrity verification
- Full audit trail of signature events
- Configurable retention period (25 years default)

**Backend Endpoints:**
- `POST /api/esign/request` - Create electronic signature
- `GET /api/esign/:signatureId` - Retrieve signature record
- `POST /api/esign/verify` - Verify signature integrity

### GAMP 5 Audit Trail

**✅ Fully Implemented:**
- Comprehensive logging of all API requests
- Immutable audit log storage
- User identification and session tracking
- Automatic redaction of sensitive data (passwords, tokens)
- Separate audit log file with long retention
- Captures: user, action, timestamp, IP, user agent

**ALCOA+ Principles:**
- **Attributable** - User ID and name captured
- **Legible** - Structured JSON logging
- **Contemporaneous** - Real-time timestamp
- **Original** - Immutable audit log
- **Accurate** - Complete metadata capture
- **Complete** - All actions logged
- **Consistent** - Standardized format
- **Enduring** - Long-term retention
- **Available** - Queryable logs

### Security Architecture

**Authentication & Authorization:**
- JWT-based authentication
- Role-based access control (learner, instructor, admin)
- Permission-based endpoint protection
- Secure password hashing (bcrypt with 12 rounds)
- Token expiration and refresh

**API Security:**
- Helmet.js security headers
- CORS with configurable origins
- Rate limiting (100 req/15min, 5 auth req/15min)
- Input validation with Zod schemas
- XSS and injection prevention
- HTTPS enforcement (HSTS)

**Data Protection:**
- Encryption at rest (database level)
- Encryption in transit (TLS/SSL)
- Sensitive data redaction in logs
- Secure secret management
- Environment variable isolation

## 🤖 AI Integration

**✅ Production-Ready Multi-Provider Support:**

### Supported AI Providers

**OpenAI:**
- Models: gpt-4o, gpt-4o-mini, gpt-4-turbo, gpt-3.5-turbo
- Endpoint: `POST /api/ai/chat`
- Configuration: `OPENAI_API_KEY` in backend `.env`

**Anthropic:**
- Models: claude-3-opus, claude-3-sonnet, claude-3-haiku
- Endpoint: `POST /api/ai/chat`
- Configuration: `ANTHROPIC_API_KEY` in backend `.env`

**Local LLM (Llama):**
- OpenAI-compatible endpoint support
- Platforms: llama.cpp, ollama, vLLM, LocalAI
- Models: llama-3.1-8b-instruct, llama-3.1-70b, custom models
- Configuration: `LLAMA_API_BASE` for local server URL

### Deterministic Guardrails

**✅ Implemented Content Safety:**
- Regulatory URL whitelisting (FDA, EMA, ICH, etc.)
- Prohibited pattern detection (PII, PHI, credentials)
- Malicious content filtering (XSS, script injection)
- Keyword-based domain alignment validation
- Content quality checks (minimum length, context)

**Configurable Modes:**
- Standard mode: AI-assisted with guardrails
- Deterministic mode: Pure rule-based validation
- Configuration: `GUARDRAIL_DETERMINISTIC=true`

### RegWatch Regulatory Monitoring

**✅ Service Implemented:**
- Automated monitoring scaffolding
- Configurable authorities: FDA, EMA, ICH, PMDA, MHRA, CDSCO, Health Canada
- Draft content generation from regulatory updates
- Interval-based checking (default: 24 hours)
- Integration hooks for web scraping or API connections

**Configuration:**
```env
REGWATCH_ENABLED=true
REGWATCH_INTERVAL_HOURS=24
REGWATCH_AUTHORITIES=FDA,EMA,ICH,PMDA,MHRA,CDSCO,Health Canada
```

### AI API Endpoints

- `POST /api/ai/chat` - Proxy AI requests (requires authentication + content.approve permission)
- `GET /api/ai/config` - Get current AI configuration
- `POST /api/ai/validate` - Validate content against guardrails

## 🌐 Cloud Deployment

**✅ Complete deployment guides and configurations for AWS and Azure:**

### AWS Deployment Options

1. **ECS/Fargate (Recommended)**
   - Containerized deployment with auto-scaling
   - Application Load Balancer
   - RDS PostgreSQL + ElastiCache Redis
   - CloudWatch logging and monitoring

2. **Lambda + API Gateway**
   - Serverless deployment
   - Cost-effective for variable loads
   - RDS Proxy for connection pooling

3. **Elastic Beanstalk**
   - PaaS deployment with minimal configuration
   - Built-in auto-scaling

**Documentation:** See `server/deployment/aws/README.md`

### Azure Deployment Options

1. **App Service (Recommended)**
   - Fully managed platform
   - Built-in scaling and monitoring
   - Azure Database for PostgreSQL
   - Azure Cache for Redis

2. **Container Instances**
   - Serverless container deployment
   - Simple and fast deployment

3. **AKS (Azure Kubernetes Service)**
   - Enterprise-grade orchestration
   - Complex multi-service deployments

**Documentation:** See `server/deployment/azure/README.md`

### Docker Deployment

```bash
# Build and run with Docker
cd server
docker build -t lifesci-lms-server .
docker run -p 3000:3000 --env-file .env lifesci-lms-server

# Or use Docker Compose for full stack
docker-compose up -d
```

## 📊 Production Readiness

### ✅ What's Production-Ready

**Frontend:**
- Complete UI with 46 shadcn/ui components
- 11 integrated application views
- Responsive design with dark mode
- TypeScript type safety
- Vite build optimization

**Backend:**
- RESTful API with Express.js
- JWT authentication and RBAC
- 21 CFR Part 11 e-signatures
- GAMP 5 audit trail
- Rate limiting and security headers
- Multi-provider AI integration
- Deterministic guardrails
- Health check endpoints

**Infrastructure:**
- Docker containerization
- PostgreSQL database configuration
- Redis caching configuration
- Cloud deployment guides (AWS, Azure)
- Environment-based configuration

### 🔧 Ready for Configuration

**Data Persistence:**
- Frontend currently uses local storage for demonstration
- Backend supports PostgreSQL for production data
- Migration path documented

**AI Providers:**
- Backend ready for OpenAI, Anthropic, or Llama
- Requires API keys in environment variables
- Guardrails active for content safety

**Regulatory Monitoring:**
- RegWatch service implemented
- Ready for web scraping or API integration
- Configurable monitoring intervals

**Authentication:**
- JWT implementation ready
- SSO scaffolding for OIDC/SAML
- Session management with Redis

## 🎨 Design System

The platform uses a carefully crafted design system optimized for life sciences:

- **Color Scheme** - Clinical Blue (primary), Regulatory Green (secondary), Insight Orange (accent) with WCAG AAA contrast ratios
- **Typography** - Inter (UI/data) and Source Serif 4 (instructional content) for professional readability
- **Components** - 46 accessible, themeable shadcn/ui components with consistent styling
- **Animations** - Purposeful, professional transitions (200-600ms) for state feedback
- **Responsive** - Mobile-first design with collapsible sidebar and touch-optimized controls
- **Dark Mode** - Full theme support via next-themes

## 📄 License

Unless otherwise agreed in writing, this repository is licensed under the Broad Spectrum GXP LLC Proprietary License. All rights reserved. See the LICENSE file for full terms.

## 🔗 Additional Resources

- **PRD.md** - Complete product requirements and feature specifications
- **SECURITY.md** - Security policy and vulnerability reporting
- **server/README.md** - Backend API documentation and deployment guides
