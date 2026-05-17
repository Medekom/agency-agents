# Plan de Projet Détaillé: Application Prospection & Vente PME

## 📅 Vue d'Ensemble Temporelle

```
├─ PHASE 0: SETUP INFRASTRUCTURE (Semaines 1-2)
│  ├─ Weeks 1: Kick-off, Infrastructure Design
│  └─ Week 2: Cloud Setup, CI/CD, Development Environment
│
├─ PHASE 1: FOUNDATION (Semaines 3-4)
│  ├─ Week 3: Core Architecture, Database Schema, API Design
│  └─ Week 4: Authentication, Authorization, Base Services
│
├─ PHASE 2: PROSPECTION ENGINE (Semaines 5-8)
│  ├─ Week 5: Data Collection (Scraping + APIs)
│  ├─ Week 6: Data Enrichment Pipeline
│  ├─ Week 7: Lead Qualification Engine
│  └─ Week 8: Database Population & Indexing
│
├─ PHASE 3: VISUAL GENERATION (Semaines 9-12)
│  ├─ Week 9: Design System & Templates
│  ├─ Week 10: Content Generation (LLM Integration)
│  ├─ Week 11: Rendering Engine (Layout + Asset Production)
│  └─ Week 12: Visual Optimization & QA
│
├─ PHASE 4: COMMERCIAL MODULE (Semaine 13)
│  ├─ Week 13a: Pricing Engine & Offer Generator
│  └─ Week 13b: Document Generation & Templates
│
├─ PHASE 5: OUTREACH PLATFORM (Semaine 14)
│  ├─ Week 14a: Campaign Orchestrator & Communication Services
│  └─ Week 14b: Tracking & Lead Management
│
├─ PHASE 6: INTEGRATION & TESTING (Semaine 15)
│  └─ Week 15: End-to-End Integration, Performance Testing
│
└─ PHASE 7: LAUNCH & OPTIMIZATION (Semaine 16)
   ├─ Week 16a: Production Deployment
   └─ Week 16b: Monitoring & Optimization
```

---

## PHASE 0: SETUP INFRASTRUCTURE (2 semaines)

### Week 1: Project Kick-off & Infrastructure Design

#### Task 0.1.1: Project Kick-off Meeting
- **Owner**: Product Manager
- **Duration**: 1 day
- **Deliverable**: Project Charter, Roles & Responsibilities, Communication Plan
- **Success Criteria**: Team alignment, clear vision understood

#### Task 0.1.2: Infrastructure Architecture Design
- **Owner**: DevOps Architect + Backend Lead
- **Duration**: 2 days
- **Deliverable**: Infrastructure diagram, cloud resource plan, disaster recovery plan
- **Success Criteria**: Design reviewed and approved by CTO

#### Task 0.1.3: Development Workflow Setup
- **Owner**: DevOps Architect
- **Duration**: 1.5 days
- **Deliverable**: Git workflow defined, branching strategy, code review process
- **Success Criteria**: Team can clone, branch, and submit PRs

#### Task 0.1.4: Security & Compliance Framework
- **Owner**: Security Engineer
- **Duration**: 1.5 days
- **Deliverable**: Security checklist, GDPR compliance roadmap, data handling policy
- **Success Criteria**: Framework documented and team trained

### Week 2: Cloud Setup & CI/CD Pipeline

#### Task 0.2.1: Cloud Infrastructure Provisioning
- **Owner**: DevOps Architect
- **Duration**: 2 days
- **Deliverable**: AWS/GCP/Azure resources created (VPC, RDS, S3, etc.)
- **Success Criteria**: All resources accessible and tested

#### Task 0.2.2: CI/CD Pipeline Implementation
- **Owner**: DevOps Architect + DevSecOps
- **Duration**: 2.5 days
- **Deliverable**: GitHub Actions/GitLab CI configured, automated testing, deployment scripts
- **Success Criteria**: Successful build → test → deploy cycle

#### Task 0.2.3: Development Environment Setup
- **Owner**: DevOps Architect
- **Duration**: 1 day
- **Deliverable**: Docker Compose files, local dev setup guide, seed data
- **Success Criteria**: All devs can run local environment with 1 command

**Phase 0 Dependencies**: None (kickoff phase)
**Phase 0 Go/No-Go Criteria**: Infrastructure accessible, CI/CD working, team ready

---

## PHASE 1: FOUNDATION (2 semaines)

### Week 3: Core Architecture & API Design

#### Task 1.3.1: Database Schema Design
- **Owner**: Database Architect
- **Duration**: 2.5 days
- **Dependencies**: Infrastructure ready
- **Deliverable**: PostgreSQL schema (companies, prospects, offers, campaigns, interactions), migrations
- **Success Criteria**: Schema reviewed, normalized, indexed for performance

#### Task 1.3.2: API Design & Specification
- **Owner**: Backend Lead + API Designer
- **Duration**: 2 days
- **Dependencies**: Schema ready
- **Deliverable**: OpenAPI/Swagger specs for all endpoints, authentication flow
- **Success Criteria**: Specs approved by frontend & backend leads

#### Task 1.3.3: Core Data Models Implementation
- **Owner**: Backend Engineers (2)
- **Duration**: 2.5 days
- **Dependencies**: Schema + API specs
- **Deliverable**: TypeORM/SQLAlchemy entities, validation schemas, type definitions
- **Success Criteria**: Unit tests pass, models integrate with DB

### Week 4: Authentication & Base Services

#### Task 1.4.1: Authentication System (JWT)
- **Owner**: Backend Engineer
- **Duration**: 2 days
- **Dependencies**: API specs
- **Deliverable**: Login/register endpoints, JWT generation, refresh token logic
- **Success Criteria**: Auth flow tested, tokens validate correctly

#### Task 1.4.2: Authorization & RBAC
- **Owner**: Backend Engineer
- **Duration**: 1.5 days
- **Dependencies**: Auth system
- **Deliverable**: Middleware for RBAC, permission matrix, role definitions
- **Success Criteria**: Protected routes enforce permissions correctly

#### Task 1.4.3: Base Service Architecture
- **Owner**: Backend Lead
- **Duration**: 2 days
- **Dependencies**: Models ready
- **Deliverable**: Service layer abstraction, repository pattern, error handling
- **Success Criteria**: Services testable and maintainable

#### Task 1.4.4: Logging & Monitoring Setup
- **Owner**: DevOps Architect
- **Duration**: 1.5 days
- **Dependencies**: Infrastructure ready
- **Deliverable**: ELK stack deployed, logging in all services, dashboards
- **Success Criteria**: Logs appear in Kibana, dashboards show system health

**Phase 1 Dependencies**: Phase 0 complete
**Phase 1 Go/No-Go Criteria**: All foundational APIs working, auth system secure, monitoring active

---

## PHASE 2: PROSPECTION ENGINE (4 semaines)

### Week 5: Data Collection Layer

#### Task 2.5.1: Web Scraping Service
- **Owner**: Data Engineer
- **Duration**: 2.5 days
- **Dependencies**: Base services ready
- **Deliverable**: Puppeteer/Selenium service, page parser, error handling, rate limiting
- **Success Criteria**: Scrapes 100+ pages without blocking

#### Task 2.5.2: Public API Integration
- **Owner**: Data Engineer
- **Duration**: 2 days
- **Dependencies**: Base services
- **Deliverable**: Google Business API client, LinkedIn API client, SIRET API client
- **Success Criteria**: Successfully pulls data from all 3 APIs

#### Task 2.5.3: Database Import Pipeline
- **Owner**: Data Engineer
- **Duration**: 1.5 days
- **Dependencies**: Data collection services
- **Deliverable**: Bulk import system, duplicate detection, conflict resolution
- **Success Criteria**: 10,000+ records imported without duplicates

### Week 6: Data Enrichment Pipeline

#### Task 2.6.1: Company Profile Analysis
- **Owner**: Data Engineer + LLM Integration Specialist
- **Duration**: 2.5 days
- **Dependencies**: Data collection complete
- **Deliverable**: LLM service for profile analysis, sector classification
- **Success Criteria**: 95%+ accuracy on industry classification

#### Task 2.6.2: Market Position Scorer
- **Owner**: Backend Engineer + ML Engineer
- **Duration**: 2.5 days
- **Dependencies**: Enrichment framework
- **Deliverable**: Scoring algorithm (size, market share, digital maturity estimate)
- **Success Criteria**: Scoring produces consistent, meaningful results

#### Task 2.6.3: Digitalization Gap Detection
- **Owner**: Backend Engineer
- **Duration**: 1.5 days
- **Dependencies**: Enrichment services
- **Deliverable**: Algorithm to detect companies without/with outdated websites
- **Success Criteria**: Flags 85%+ of non-digital companies correctly

### Week 7: Lead Qualification Engine

#### Task 2.7.1: Industry Classifier
- **Owner**: ML Engineer + Data Engineer
- **Duration**: 2 days
- **Dependencies**: Enrichment complete
- **Deliverable**: ML model for industry classification (NLP/rules-based)
- **Success Criteria**: 90%+ classification accuracy

#### Task 2.7.2: Size & Revenue Estimator
- **Owner**: Data Engineer
- **Duration**: 1.5 days
- **Dependencies**: Enrichment framework
- **Deliverable**: Estimation model based on employee count, public data
- **Success Criteria**: Estimates within ±20% of actual revenue

#### Task 2.7.3: Qualification Scoring Algorithm
- **Owner**: Backend Engineer + ML Engineer
- **Duration**: 2.5 days
- **Dependencies**: All previous enrichment tasks
- **Deliverable**: Combined scoring model, configurableweights, qualification thresholds
- **Success Criteria**: Top 20% of scored prospects convert 3x better than average

### Week 8: Database Population & Optimization

#### Task 2.8.1: Data Validation & Cleaning
- **Owner**: Data Engineer
- **Duration**: 2 days
- **Dependencies**: All enrichment complete
- **Deliverable**: Data quality checks, cleaning rules, anomaly detection
- **Success Criteria**: 99%+ data quality score

#### Task 2.8.2: Elasticsearch Indexing
- **Owner**: Backend Engineer
- **Duration**: 1.5 days
- **Dependencies**: Data clean
- **Deliverable**: Index schema, analyzers, search queries optimized
- **Success Criteria**: Full-text search works, < 100ms response time

#### Task 2.8.3: Performance Testing & Optimization
- **Owner**: Performance Engineer
- **Duration**: 1.5 days
- **Dependencies**: Data indexed
- **Deliverable**: Query optimization, caching strategy, benchmark report
- **Success Criteria**: Database queries < 200ms p95

**Phase 2 Dependencies**: Phase 1 complete
**Phase 2 Go/No-Go Criteria**: 1000+ qualified prospects in database, search performant, enrichment accurate

---

## PHASE 3: VISUAL GENERATION (4 semaines)

### Week 9: Design System & Templates

#### Task 3.9.1: Design System Architecture
- **Owner**: UI/UX Designer Lead
- **Duration**: 2 days
- **Dependencies**: Phase 1 complete
- **Deliverable**: Component library, design tokens, brand guidelines document
- **Success Criteria**: 20+ components designed, reusable across templates

#### Task 3.9.2: Website Template Design (5 variations)
- **Owner**: UI/UX Designer (2)
- **Duration**: 3 days
- **Dependencies**: Design system
- **Deliverable**: 5 responsive website templates (Business, E-commerce, Services, SaaS, Industrial)
- **Success Criteria**: Mockups reviewed, handoff to developers ready

#### Task 3.9.3: HTML/CSS Implementation
- **Owner**: Frontend Developer
- **Duration**: 2.5 days
- **Dependencies**: Design templates
- **Deliverable**: Responsive HTML/CSS components, Tailwind config, responsive testing
- **Success Criteria**: All templates render correctly on mobile/tablet/desktop

### Week 10: Content Generation with LLM

#### Task 3.10.1: LLM Integration Setup
- **Owner**: LLM Integration Specialist
- **Duration**: 1.5 days
- **Dependencies**: Base services
- **Deliverable**: OpenAI API integration, prompt engineering, response validation
- **Success Criteria**: LLM generates quality business copy

#### Task 3.10.2: Industry-Specific Copy Generation
- **Owner**: Content Strategist + LLM Engineer
- **Duration**: 2.5 days
- **Dependencies**: LLM setup
- **Deliverable**: Prompt templates per industry, tone guidelines, copy validation rules
- **Success Criteria**: Generated copy is professional-quality, industry-appropriate

#### Task 3.10.3: Value Proposition & CTA Generator
- **Owner**: Marketing Strategist + LLM Engineer
- **Duration**: 2 days
- **Dependencies**: Copy generation system
- **Deliverable**: Service/product description generators, call-to-action variants
- **Success Criteria**: Generated CTAs have good engagement intent

### Week 11: Rendering Engine & Asset Production

#### Task 3.11.1: Logo Detection & Integration
- **Owner**: ML Engineer + Backend Engineer
- **Duration**: 2 days
- **Dependencies**: Visual generation framework
- **Deliverable**: Image detection service, logo extraction, integration into templates
- **Success Criteria**: Detects and places logos in 90%+ of cases

#### Task 3.11.2: Brand Color Extraction & Application
- **Owner**: Backend Engineer + ML Engineer
- **Duration**: 1.5 days
- **Dependencies**: Logo detection
- **Deliverable**: Color extraction algorithm, theme generation, accessibility compliance
- **Success Criteria**: Extracted colors apply correctly, maintain accessibility

#### Task 3.11.3: Responsive Layout Generator
- **Owner**: Frontend Engineer
- **Duration**: 2 days
- **Dependencies**: Template implementation
- **Deliverable**: Dynamic layout engine based on content length, device type
- **Success Criteria**: All layouts render correctly, no overflow/layout issues

#### Task 3.11.4: Puppeteer Screenshot Pipeline
- **Owner**: Backend Engineer
- **Duration**: 2 days
- **Dependencies**: Layout generator
- **Deliverable**: Screenshot service, caching, optimization for web/mobile
- **Success Criteria**: Screenshots generated in < 5 seconds, high quality

#### Task 3.11.5: HTML Package & PDF Generation
- **Owner**: Backend Engineer
- **Duration**: 1.5 days
- **Dependencies**: Screenshot pipeline
- **Deliverable**: Package exporter (HTML + CSS), PDF generator with branding
- **Success Criteria**: Exportable packages are production-ready

### Week 12: Quality Assurance & Optimization

#### Task 3.12.1: Visual QA & A/B Testing
- **Owner**: QA Specialist + Designer
- **Duration**: 2 days
- **Dependencies**: All generation complete
- **Deliverable**: Visual regression tests, device compatibility tests, A/B test framework
- **Success Criteria**: All visuals pass QA, no regressions

#### Task 3.12.2: Performance Optimization
- **Owner**: Performance Engineer
- **Duration**: 1.5 days
- **Dependencies**: Asset generation complete
- **Deliverable**: Image compression, lazy loading, caching strategy
- **Success Criteria**: Generation time < 5 min, file sizes < 2MB

#### Task 3.12.3: Accessibility & Standards Compliance
- **Owner**: Frontend Developer
- **Duration**: 1.5 days
- **Dependencies**: Visual generation
- **Deliverable**: WCAG 2.1 AA compliance, semantic HTML, alt text
- **Success Criteria**: Accessibility audit passes 100%

**Phase 3 Dependencies**: Phase 1 complete
**Phase 3 Go/No-Go Criteria**: Can generate professional websites in < 5 minutes, visuals pass QA, generation engine reliable

---

## PHASE 4: COMMERCIAL MODULE (1 semaine)

### Week 13: Pricing & Offer Generation

#### Task 4.13.1: Dynamic Pricing Engine
- **Owner**: Backend Engineer + Finance
- **Duration**: 2 days
- **Dependencies**: Prospect data available
- **Deliverable**: Pricing calculator (base + dynamic adjustments), market segmentation
- **Success Criteria**: Pricing reflects market conditions, consistent across tiers

#### Task 4.13.2: Offer Package Configuration
- **Owner**: Product Manager + Backend Engineer
- **Duration**: 1.5 days
- **Dependencies**: Pricing engine
- **Deliverable**: 3 package tiers (Basic/Pro/Premium), feature matrix, add-on system
- **Success Criteria**: Packages clearly differentiated, good upgrade path

#### Task 4.13.3: Document Generation (PDF & HTML)
- **Owner**: Backend Engineer
- **Duration**: 2 days
- **Dependencies**: Pricing + packages
- **Deliverable**: PDF invoice generator, HTML interactive proposal, signature flow
- **Success Criteria**: Professional-looking documents, correct pricing, branding applied

#### Task 4.13.4: Offer Template Engine
- **Owner**: Marketing Strategist + Backend Engineer
- **Duration**: 1 day
- **Dependencies**: Document generation
- **Deliverable**: Customizable offer templates, variant management
- **Success Criteria**: Can quickly generate variations for different segments

**Phase 4 Dependencies**: Phase 2 & 3 complete
**Phase 4 Go/No-Go Criteria**: Offers generate in < 1 minute, pricing accurate, documents professional

---

## PHASE 5: OUTREACH PLATFORM (1 semaine)

### Week 14: Campaign & Communication Management

#### Task 5.14.1: Campaign Orchestrator
- **Owner**: Backend Engineer
- **Duration**: 1.5 days
- **Dependencies**: Phase 4 complete
- **Deliverable**: Campaign template manager, scheduling engine, batch coordinator
- **Success Criteria**: Can create and schedule campaigns easily

#### Task 5.14.2: Email Service Integration
- **Owner**: Backend Engineer
- **Duration**: 1.5 days
- **Dependencies**: Campaign orchestrator
- **Deliverable**: SendGrid integration, personalization, A/B test setup
- **Success Criteria**: Sends 10,000+ emails reliably

#### Task 5.14.3: SMS Service Integration
- **Owner**: Backend Engineer
- **Duration**: 1 day
- **Dependencies**: Campaign orchestrator
- **Deliverable**: Twilio integration, message templates, delivery tracking
- **Success Criteria**: SMS sent reliably, tracking works

#### Task 5.14.4: Interaction Tracking & Attribution
- **Owner**: Backend Engineer
- **Duration**: 1.5 days
- **Dependencies**: Email & SMS services
- **Deliverable**: Click/open tracking, conversion event logging, attribution model
- **Success Criteria**: Can track full customer journey

#### Task 5.14.5: Lead Status Pipeline & Handoff
- **Owner**: Backend Engineer
- **Duration**: 1 day
- **Dependencies**: Tracking complete
- **Deliverable**: Lead status workflow, sales handoff integration, CRM sync
- **Success Criteria**: Sales can see qualified leads in real-time

**Phase 5 Dependencies**: Phase 4 complete
**Phase 5 Go/No-Go Criteria**: Full outreach pipeline working, tracking reliable, lead quality high

---

## PHASE 6: INTEGRATION & TESTING (1 semaine)

### Week 15: End-to-End Integration & Performance

#### Task 6.15.1: Full System Integration Testing
- **Owner**: QA Lead + Backend Engineers
- **Duration**: 2 days
- **Dependencies**: All phases complete
- **Deliverable**: Integration test suite, end-to-end test scenarios
- **Success Criteria**: All critical paths tested and passing

#### Task 6.15.2: Performance Testing & Benchmarking
- **Owner**: Performance Engineer
- **Duration**: 2 days
- **Dependencies**: All services integrated
- **Deliverable**: Load testing results, bottleneck identification, optimization recommendations
- **Success Criteria**: System handles 100 concurrent users, p95 latency < 2s

#### Task 6.15.3: Security Penetration Testing
- **Owner**: Security Engineer
- **Duration**: 2 days
- **Dependencies**: Full system ready
- **Deliverable**: Security test report, vulnerability assessment, remediation plan
- **Success Criteria**: No critical vulnerabilities, OWASP top 10 addressed

#### Task 6.15.4: Compliance Audit
- **Owner**: Legal/Compliance Officer
- **Duration**: 1.5 days
- **Dependencies**: Full system
- **Deliverable**: GDPR compliance audit, legal review, data handling verification
- **Success Criteria**: 100% compliance confirmed

#### Task 6.15.5: UAT & Stakeholder Approval
- **Owner**: Product Manager + Stakeholders
- **Duration**: 2 days
- **Dependencies**: All tests complete
- **Deliverable**: User acceptance test results, stakeholder sign-off
- **Success Criteria**: Business requirements met, stakeholders approve go-live

**Phase 6 Dependencies**: All previous phases
**Phase 6 Go/No-Go Criteria**: All testing passed, no critical issues, compliance verified, stakeholder approval

---

## PHASE 7: LAUNCH & OPTIMIZATION (1 semaine)

### Week 16: Production Deployment & Monitoring

#### Task 7.16.1: Production Deployment
- **Owner**: DevOps Architect
- **Duration**: 1 day
- **Dependencies**: All testing complete
- **Deliverable**: Production deployment executed, health checks passing
- **Success Criteria**: System live and stable, no errors

#### Task 7.16.2: Post-Launch Monitoring & Optimization
- **Owner**: DevOps + Backend Lead
- **Duration**: 2 days
- **Dependencies**: System deployed
- **Deliverable**: Monitoring dashboards active, alerts configured, optimization adjustments
- **Success Criteria**: System stable 24+ hours, no critical issues

#### Task 7.16.3: Performance Tuning
- **Owner**: Performance Engineer
- **Duration**: 1.5 days
- **Dependencies**: System in production
- **Deliverable**: Query optimization, cache tuning, resource scaling adjustments
- **Success Criteria**: Performance meets SLA targets

#### Task 7.16.4: Team Handoff & Documentation
- **Owner**: Technical Writer + DevOps
- **Duration**: 1.5 days
- **Dependencies**: System stable
- **Deliverable**: Operations manual, runbooks, team training completed
- **Success Criteria**: Support team can handle incidents

---

## 👥 Allocation Humaine Estimée

| Role | Semaines | FTE | Notes |
|------|----------|-----|-------|
| Product Manager | 16 | 1.0 | Full project |
| Backend Lead | 16 | 1.0 | Architecture & oversight |
| Backend Engineers | 16 | 3.0 | Core service development |
| Frontend Developer | 16 | 1.5 | UI & templates |
| Database Architect | 4 | 1.0 | Schema design + optimization |
| UI/UX Designer | 8 | 1.5 | Design system & templates |
| Data Engineer | 8 | 1.0 | Prospection engine |
| ML Engineer | 6 | 0.75 | Qualification scoring, logo detection |
| LLM Engineer | 4 | 0.5 | Content generation |
| DevOps Architect | 16 | 1.0 | Infrastructure & CI/CD |
| Performance Engineer | 4 | 0.5 | Performance optimization |
| Security Engineer | 3 | 0.5 | Security & compliance |
| QA Lead | 6 | 1.0 | Testing strategy & execution |
| Technical Writer | 2 | 0.25 | Documentation |
| **Total** | - | **13.2** | **Parallel execution** |

---

## 📊 Dépendances Critiques Entre Phases

```
PHASE 0: Infrastructure Setup
    ↓
PHASE 1: Foundation APIs
    ├→ PHASE 2: Prospection (Data collection)
    ├→ PHASE 3: Visual Generation (Design + rendering)
    └→ PHASE 4: Commercial (Pricing + offers)
         ├→ PHASE 5: Outreach (Campaigns)
         └→ PHASE 6: Integration & Testing
              ↓
         PHASE 7: Production Launch

Critical Path: 
Phase 0 → Phase 1 → Phase 2 → Phase 5 → Phase 6 → Phase 7
```

## 🚨 Risques Majeurs & Mitigation

| Risque | Probabilité | Impact | Mitigation |
|--------|------------|--------|-----------|
| LLM quality insufficient | Medium | High | Early PoC with real data, fallback templates |
| Scraping rate limiting/blocking | Medium | High | Proxy rotation, rate limiting, API-first approach |
| Visual rendering bugs on edge cases | Medium | Medium | Extensive browser testing, manual QA |
| API quota limits from third parties | Low | High | Use multiple API providers, implement caching |
| Data quality issues | Medium | Medium | Rigorous validation pipeline, manual sampling |
| Performance bottlenecks at scale | Low | High | Early load testing, caching strategy |
| Compliance/legal issues | Low | High | Legal review early, privacy by design |

---

## ✅ Critères d'Acceptation Phase

### Phase 0: GO/NO-GO
- [ ] All team members can run locally
- [ ] CI/CD pipeline builds and deploys successfully
- [ ] Monitoring dashboards active
- [ ] Infrastructure costs within budget

### Phase 1: GO/NO-GO
- [ ] Auth system secure (code review passed)
- [ ] API contracts documented and approved
- [ ] Database normalized and performant
- [ ] All foundational services unit tested (>80% coverage)

### Phase 2: GO/NO-GO
- [ ] 1000+ prospects in database
- [ ] Lead qualification score correlates with conversion
- [ ] Search < 100ms response time
- [ ] Data quality > 95%

### Phase 3: GO/NO-GO
- [ ] Can generate website visuals in < 5 minutes
- [ ] Generated websites look professional (designer review)
- [ ] All templates responsive and accessible
- [ ] No visual regressions

### Phase 4: GO/NO-GO
- [ ] Pricing engine reflects market conditions
- [ ] Generated offers approved by finance
- [ ] PDF/HTML documents professional-quality
- [ ] No calculation errors

### Phase 5: GO/NO-GO
- [ ] Email/SMS sending reliable
- [ ] Tracking accurate (verified with manual samples)
- [ ] Lead attribution working
- [ ] Outreach at scale tested (10k+ recipients)

### Phase 6: GO/NO-GO
- [ ] All integration tests passing
- [ ] Load testing meets targets (p95 < 2s)
- [ ] No critical security vulnerabilities
- [ ] GDPR compliance verified
- [ ] Stakeholder UAT sign-off

### Phase 7: GO/NO-GO
- [ ] System stable 24+ hours in production
- [ ] Performance metrics meet SLA
- [ ] Support team trained
- [ ] Incident response procedures in place
