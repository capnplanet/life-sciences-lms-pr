# LifeSci Academy - Regulatory Compliance Learning Management System

A regulatory-compliant learning management system designed for life sciences professionals, featuring AI-powered content monitoring, adaptive learning paths, and comprehensive compliance tracking across pharmacovigilance, clinical operations, quality assurance, regulatory affairs, and Good Practice standards (GMP, GCP, GPVP, GMLP).

## 🎯 Overview

LifeSci Academy is a **frontend prototype** for a modern, web-based LMS platform designed to combine interactive learning modules with AI-assisted regulatory content management. This repository contains a fully functional frontend application with comprehensive UI components and scaffolding for AI features, backend integration, and compliance features.

**Current Status:** Frontend application with mock data and local storage. Backend API implementation is required for production use.

## ✨ Key Features

### ✅ Fully Implemented (Frontend)
- **Interactive Learning Modules** - Multi-format content delivery with progress tracking (stored in browser local storage)
- **Module Viewer** - Rich content player with section navigation and progress updates
- **Assessment System** - Multiple question types (MCQ, multi-select, scenario-based) with scoring
- **Progress Dashboard** - Real-time tracking of learner progress, certifications, and recommendations
- **Analytics & Insights** - Comprehensive learner performance metrics and module effectiveness visualizations
- **Certification Management** - Automated certificate issuance with verification codes and expiry tracking (mock data)
- **Content Management System** - Admin interface for viewing learning modules and audit logs
- **Regulatory Glossary** - Searchable database of 20 key life sciences terms and regulatory concepts

### 🔧 Scaffolded (Requires Backend Implementation)
- **RegWatch AI** - Frontend simulation of regulatory monitoring; generates mock proposals from predefined regulatory updates
  - Requires backend implementation to actually monitor FDA, EMA, ICH, Health Canada, PMDA, MHRA, CDSCO websites
- **AI Content Review** - UI workflow for reviewing AI-generated drafts with approval/rejection actions
  - Requires backend AI integration (OpenAI, Anthropic, or Llama) for actual content generation
- **AI Health Dashboard** - UI for displaying AI system metrics and guardrails status
  - Requires backend AI infrastructure and telemetry
- **Agentic Updates** - Frontend authorization workflow for AI-proposed changes
  - Requires backend AI agent implementation

### 🚧 Partially Implemented (Frontend Only)
- **Audit Trail** - Client-side logging to browser local storage; requires backend database for production compliance
- **Role-Based Access Control (RBAC)** - Type definitions and permission checks; requires backend authentication
- **E-Signature Support** - TypeScript interfaces and placeholder API calls; requires backend implementation per 21 CFR Part 11
- **SSO Integration** - Client redirect scaffolding; requires backend OIDC/SAML provider integration
- **Draft Workflow** - Frontend state management for content approval; requires backend persistence

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern UI framework with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Smooth animations and transitions
- **Recharts & D3** - Data visualization for analytics
- **React Query** - Server state management

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

### Prerequisites
- Node.js 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd life-sciences-lms-pr
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint on codebase
- `npm run optimize` - Optimize dependencies

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components (46 shadcn/ui components)
│   │   ├── views/           # Main application views (11 views, all integrated)
│   │   │   ├── DashboardView.tsx
│   │   │   ├── LearningView.tsx
│   │   │   ├── ModuleViewer.tsx
│   │   │   ├── AssessmentView.tsx         # Individual assessment runner
│   │   │   ├── AssessmentsView.tsx        # Assessment catalog
│   │   │   ├── AnalyticsView.tsx
│   │   │   ├── CertificationsView.tsx
│   │   │   ├── ContentManagementView.tsx
│   │   │   ├── AIContentReviewView.tsx
│   │   │   ├── AIHealthView.tsx
│   │   │   └── GlossaryView.tsx            # Regulatory terminology
│   │   └── AppLayout.tsx    # Main layout with sidebar navigation
│   ├── lib/
│   │   ├── ai/              # AI-related utilities (scaffolding)
│   │   │   ├── regwatch.ts  # Mock regulatory monitoring
│   │   │   ├── providers.ts # AI provider configurations (requires backend)
│   │   │   └── guardrails.ts # AI safety validation rules
│   │   ├── security/        # Security scaffolding (requires backend)
│   │   │   ├── rbac.ts      # Role-based access control types
│   │   │   ├── esign.ts     # E-signature API placeholders
│   │   │   └── sso.ts       # Single sign-on redirect logic
│   │   ├── types.ts         # TypeScript type definitions
│   │   ├── mockData.ts      # Sample learning modules and data
│   │   ├── audit.ts         # Client-side audit trail utilities
│   │   ├── certificates.ts  # Certificate code generation
│   │   └── helpers.ts       # Utility functions
│   ├── hooks/               # Custom React hooks
│   ├── styles/              # Global styles and themes
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Application entry point
├── server/                  # Backend API documentation (implementation required)
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── PRD.md                   # Product requirements document
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

## 🔐 Compliance Features

The platform is designed with regulatory compliance architecture:

- **GAMP 5 Alignment** - Audit trail structure follows Good Automated Manufacturing Practice guidelines (client-side implementation; requires backend for validation)
- **21 CFR Part 11 Ready** - E-signature scaffolding and audit trail design aligned with FDA electronic records requirements (requires backend implementation)
- **ICH E6(R2/R3) Structure** - Good Clinical Practice guidelines inform the training module organization
- **Data Integrity (ALCOA+)** - Audit trail captures Attributable, Legible, Contemporaneous, Original, Accurate metadata (frontend only; backend required for compliance)
- **Audit Readiness** - Complete activity logging to browser local storage (requires backend database for production audit requirements)

> **⚠️ Compliance Note:** Current implementation stores audit logs in browser local storage. For regulatory compliance, a backend system with immutable database storage, electronic signatures, and validated infrastructure is required.

## 🤖 AI Integration

The platform includes **frontend scaffolding and mock implementations** for AI features:

### Currently Implemented (Frontend Mock)
- **RegWatch Simulation** - Frontend code that simulates regulatory monitoring by randomly generating draft proposals from a predefined list of regulatory updates
- **Draft Content UI** - Complete UI workflow for reviewing, approving, rejecting, and requesting revisions on AI-generated content
- **Guardrails System** - Validation rules for checking regulatory source URLs, document types, effective dates, and content alignment
- **Provider Abstraction** - TypeScript interfaces ready for OpenAI, Anthropic, and Llama integration

### Requires Backend Implementation
- **Actual RegWatch Monitoring** - Web scraping or API integration to monitor regulatory authority websites (FDA, EMA, ICH, Health Canada, PMDA, MHRA, CDSCO)
- **Real AI Content Generation** - Backend service to generate actual module update drafts using LLM APIs
- **AI Chat Proxy** - Backend API endpoint (`/api/ai/chat`) to securely proxy requests to AI providers without exposing API keys
- **Approval Workflow Persistence** - Database to store draft content, review states, and approval history
- **Agentic AI Implementation** - Backend AI agent capable of autonomously implementing approved changes

> **Note:** All AI API calls in the current frontend will fail without a backend implementation. The RegWatch feature generates mock proposals using hardcoded regulatory updates and does not actually monitor regulatory websites.

## 🌐 Backend Integration

This repository contains **only the frontend application**. The following backend services must be implemented separately for production use:

### Required Backend Services
- **AI Chat Proxy** - Endpoint: `POST /api/ai/chat`
  - Securely proxy requests to OpenAI, Anthropic, or Llama APIs
  - Handle API key management and rate limiting
  - Current frontend calls will fail without this endpoint

- **User Authentication** - Endpoints: `GET /api/auth/login`, `GET /api/auth/callback`, `POST /api/auth/logout`, `GET /api/user`
  - Implement OIDC or SAML authentication
  - Session management and JWT token handling
  - User profile and role management

- **E-Signature Workflows** - Endpoints: `POST /api/esign/request`, `GET /api/esign/:signatureId`
  - 21 CFR Part 11 compliant electronic signatures
  - Signature verification and audit trail integration
  - Document binding and integrity checks

- **Persistent Data Storage**
  - Database for user progress, certifications, assessments, and audit logs
  - Currently all data is stored in browser local storage
  - Requires migration to PostgreSQL, MongoDB, or similar database

- **File Management**
  - Certificate PDF generation and storage
  - Video content hosting and streaming
  - Module content versioning and storage

See `server/README.md` for detailed API specifications.

### Integration Steps
1. Implement backend API endpoints per specification in `server/README.md`
2. Update frontend API base URL configuration
3. Replace mock data with real API calls
4. Configure authentication and session management
5. Set up production database and file storage
6. Deploy backend services (Azure, AWS, or other cloud provider)

## 📊 Current State

### What Works Now (No Backend Required)
The frontend application is fully functional as a **demonstration and prototype** with the following capabilities:
- Browse 6 mock learning modules across different regulatory domains
- View detailed module content with section navigation
- Complete assessments and receive immediate scoring
- Track learning progress and earn certifications (mock data)
- View analytics dashboards with learner and module metrics
- Access admin content management interface
- Review AI-generated draft proposals (mock/simulated)
- Search regulatory glossary (20 terms)

All data is stored in **browser local storage** using the Spark KV system, including:
- User progress and completion status
- Assessment results and scores
- Earned certifications with verification codes
- AI draft content and approval states
- Audit log entries

### Limitations
- **No video playback** - Video content types are referenced in modules but no video player is implemented
- **No real AI** - RegWatch generates mock proposals from hardcoded data; no actual regulatory monitoring
- **No authentication** - User role is hardcoded as 'admin'; no login system
- **No persistence** - Clearing browser data loses all progress
- **No collaboration** - Single-user experience; no multi-user or instructor features
- **No certificate PDFs** - Certificate "URLs" are mock paths; no actual PDF generation
- **No backend connectivity** - All API calls will fail without backend implementation

### Migration to Production
To connect to a production backend:
1. Implement the API endpoints documented in `server/README.md`
2. Configure API base URL in application settings
3. Replace mock data initialization with API fetch calls
4. Implement authentication and session management
5. Set up database migrations from local storage structure
6. Deploy backend services and database infrastructure
7. Add real AI provider credentials and proxy endpoint
8. Implement certificate PDF generation service
9. Add video content hosting and delivery
10. Configure RBAC and multi-user support

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
