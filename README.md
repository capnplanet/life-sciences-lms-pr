# LifeSci Academy - Regulatory Compliance Learning Management System

A regulatory-compliant learning management system designed for life sciences professionals, featuring AI-powered content monitoring, adaptive learning paths, and comprehensive compliance tracking across pharmacovigilance, clinical operations, quality assurance, regulatory affairs, and Good Practice standards (GMP, GCP, GPVP, GMLP).

## 🎯 Overview

LifeSci Academy is a modern, web-based LMS platform that combines interactive learning modules with AI-assisted regulatory content management. The platform ensures training materials stay current with evolving global regulatory requirements while maintaining full audit trails for compliance purposes.

## ✨ Key Features

### Core Learning Experience
- **Interactive Learning Modules** - Multi-format content delivery (video, text, interactive scenarios) with progress tracking
- **Module Viewer** - Rich content player with bookmarks, transcripts, and adaptive navigation
- **Assessment System** - Multiple question types (MCQ, multi-select, scenario-based) with adaptive difficulty
- **Progress Dashboard** - Real-time tracking of learner progress, certifications, and recommendations
- **Analytics & Insights** - Comprehensive learner performance metrics and module effectiveness analysis
- **Certification Management** - Automated certificate issuance with verification codes and expiry tracking

### AI-Powered Features
- **RegWatch AI** - Automated monitoring of regulatory updates from FDA, EMA, ICH, Health Canada, PMDA, MHRA, and CDSCO
- **AI Content Review** - Intelligent draft generation for module updates with human-in-the-loop approval workflow
- **AI Health Dashboard** - Monitor AI system performance, guardrails, and operational metrics
- **Agentic Updates** - Authorized AI agents can propose and implement approved content changes

### Compliance & Security
- **Audit Trail** - Comprehensive logging of all user actions and system events (GAMP 5 / 21 CFR Part 11 aligned)
- **Role-Based Access Control (RBAC)** - Learner, instructor, and admin roles with appropriate permissions
- **E-Signature Support** - Scaffolding for electronic signatures on critical documents
- **SSO Integration** - Ready for OIDC/SAML authentication providers

### Content Management
- **Content Management System** - Admin interface for creating, editing, and managing learning modules
- **Regulatory Glossary** - Searchable database of life sciences terminology and regulatory concepts
- **Version Control** - Track content changes with full revision history
- **Draft Workflow** - Pending review, approved, published, and archived content states

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
- **shadcn/ui** - High-quality, customizable components
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
│   │   ├── ui/              # Reusable UI components (50+ components)
│   │   ├── views/           # Main application views
│   │   │   ├── DashboardView.tsx
│   │   │   ├── LearningView.tsx
│   │   │   ├── ModuleViewer.tsx
│   │   │   ├── AssessmentView.tsx
│   │   │   ├── AnalyticsView.tsx
│   │   │   ├── CertificationsView.tsx
│   │   │   ├── ContentManagementView.tsx
│   │   │   ├── AIContentReviewView.tsx
│   │   │   ├── AIHealthView.tsx
│   │   │   └── GlossaryView.tsx
│   │   └── AppLayout.tsx    # Main layout with sidebar navigation
│   ├── lib/
│   │   ├── ai/              # AI-related utilities
│   │   │   ├── regwatch.ts  # Regulatory monitoring
│   │   │   ├── providers.ts # AI provider configurations
│   │   │   └── guardrails.ts # AI safety controls
│   │   ├── security/        # Security features
│   │   │   ├── rbac.ts      # Role-based access control
│   │   │   ├── esign.ts     # E-signature workflows
│   │   │   └── sso.ts       # Single sign-on integration
│   │   ├── types.ts         # TypeScript type definitions
│   │   ├── mockData.ts      # Sample learning modules and data
│   │   ├── audit.ts         # Audit trail utilities
│   │   ├── certificates.ts  # Certificate generation
│   │   └── helpers.ts       # Utility functions
│   ├── hooks/               # Custom React hooks
│   ├── styles/              # Global styles and themes
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Application entry point
├── server/                  # Backend API documentation
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

The platform is designed with regulatory compliance in mind:

- **GAMP 5** - Good Automated Manufacturing Practice guidelines
- **21 CFR Part 11** - Electronic records and signatures
- **ICH E6(R2/R3)** - Good Clinical Practice guidelines
- **Data Integrity (ALCOA+)** - Attributable, Legible, Contemporaneous, Original, Accurate
- **Audit Readiness** - Complete activity logging and electronic documentation

## 🤖 AI Integration

The platform includes scaffolding for AI features:

- **RegWatch Monitoring** - Automated scanning of regulatory authority websites for updates
- **Content Drafting** - AI-generated module updates based on regulatory changes
- **Approval Workflows** - Human-in-the-loop review process for AI-generated content
- **Guardrails** - Safety controls and validation for AI outputs
- **Provider Support** - Ready for OpenAI, Anthropic, and Llama integration

> **Note:** AI features require backend API implementation. See `server/README.md` for details.

## 🌐 Backend Integration

This repository contains the frontend application. Backend API endpoints for the following features need to be implemented separately:

- AI chat proxy (OpenAI, Anthropic, Llama)
- User authentication and SSO
- E-signature workflows
- Persistent data storage
- File uploads and certificate generation

See `server/README.md` for API specifications and deployment guidance.

## 📊 Current State

The application currently operates with **mock data** for demonstration and development purposes. All user progress, certifications, draft content, and audit logs are stored in browser local storage via the Spark KV system.

To connect to a production backend:
1. Implement the API endpoints documented in `server/README.md`
2. Replace mock data calls with API integrations
3. Configure authentication and session management
4. Set up persistent database storage

## 🎨 Design System

The platform uses a carefully crafted design system optimized for life sciences:

- **Color Scheme** - Clinical Blue, Regulatory Green, Insight Orange with high contrast ratios
- **Typography** - Inter (UI/data) and Source Serif 4 (instructional content)
- **Components** - 50+ accessible, themeable UI components
- **Animations** - Purposeful, professional transitions (200-600ms)
- **Responsive** - Mobile-first design with touch-optimized controls

## 📄 License

Unless otherwise agreed in writing, this repository is licensed under the Broad Spectrum GXP LLC Proprietary License. All rights reserved. See the LICENSE file for full terms.

## 🔗 Additional Resources

- **PRD.md** - Complete product requirements and feature specifications
- **SECURITY.md** - Security policy and vulnerability reporting
- **server/README.md** - Backend API documentation and deployment guides
