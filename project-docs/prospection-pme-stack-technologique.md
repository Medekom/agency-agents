# Stack Technologique Recommandé

## 🏗️ Architecture Générale

```
Frontend (React/Next.js)
    ↓ REST API / GraphQL
Backend Services (Node.js/Python microservices)
    ↓ Message Queues / Event Streams
Data Layer (PostgreSQL, Redis, Elasticsearch)
    ↓ Cloud Storage (S3)
External Services (APIs, LLM, Email, SMS)
```

---

## 🎨 Frontend Stack

### Framework & Build Tools
| Component | Technology | Justification |
|-----------|-----------|--------------|
| **UI Framework** | React 18 + TypeScript | Modern, type-safe, large ecosystem |
| **Meta-Framework** | Next.js 14 (App Router) | SSR/SSG, excellent performance, built-in optimizations |
| **Build Tool** | Vite or Turbopack | Fast builds, HMR, excellent DX |
| **Styling** | Tailwind CSS 4.0 | Utility-first, rapid development, excellent accessibility |
| **Component Library** | Shadcn/ui | Headless, customizable, production-ready |
| **State Management** | TanStack Query (React Query) | API state, mutations, caching |
| **Forms** | React Hook Form + Zod | Lightweight, type-safe validation |
| **Routing** | Next.js App Router | Built-in, file-based routing |

### Development Tools
```json
{
  "package_manager": "pnpm (faster than npm)",
  "linter": "ESLint 9.0",
  "formatter": "Prettier",
  "testing": "Vitest + React Testing Library",
  "e2e_testing": "Playwright or Cypress",
  "dev_server": "Vite dev server (< 100ms HMR)",
  "error_tracking": "Sentry"
}
```

### Performance Optimization
- **Image Optimization**: Next.js Image component + Sharp
- **Code Splitting**: Automatic with Next.js
- **Bundle Analysis**: webpack-bundle-analyzer
- **Monitoring**: Web Vitals tracking, Sentry for errors
- **Target Metrics**: LCP < 2.5s, FID < 100ms, CLS < 0.1

---

## 🔧 Backend Stack

### Core Runtime & Framework
| Component | Technology | Justification |
|-----------|-----------|--------------|
| **Runtime** | Node.js 20 LTS | JavaScript ecosystem, good performance |
| **Framework** | Express.js or Fastify | Lightweight, flexible, excellent middleware |
| **Language** | TypeScript | Type safety, better developer experience |
| **API Design** | REST (with OpenAPI specs) | Simple, cacheable, well-understood |
| **Validation** | Zod or Joi | Type-safe, composable validators |
| **ORM** | Prisma | Type-safe, migrations, excellent DX |

### Alternative (Python)
```
If Python preferred:
- Runtime: Python 3.11+
- Framework: FastAPI (modern, fast, type hints)
- ORM: SQLAlchemy 2.0 (advanced, flexible)
- Validation: Pydantic v2 (type-safe)
- Package Manager: Poetry or uv
```

### Data Access Layer
```typescript
// Prisma schema structure
model Company {
  id            String    @id @default(cuid())
  name          String
  industry      String
  qualificationScore Decimal
  offers        Offer[]
  websites      GeneratedWebsite[]
  interactions  CampaignInteraction[]
}

model Offer {
  id            String    @id @default(cuid())
  companyId     String
  company       Company   @relation(fields: [companyId], references: [id])
  packageTier   String
  price         Decimal
  generatedWebsiteId String?
  website       GeneratedWebsite?
  createdAt     DateTime  @default(now())
}
```

### Business Logic Patterns
```typescript
// Service Layer Architecture
class ProspectionService {
  async collectAndEnrichCompanyData(company: Company): Promise<void>
  async qualifyLead(company: Company): Promise<QualificationScore>
  async generateLeadsList(filters: FilterCriteria): Promise<Lead[]>
}

class VisualGenerationService {
  async generateWebsite(company: Company, template: Template): Promise<Website>
  async renderToScreenshots(website: Website): Promise<Screenshots>
  async generatePDF(website: Website): Promise<Buffer>
}

class CommercialService {
  async calculatePrice(company: Company, packageTier: string): Promise<Price>
  async generateOffer(company: Company, offer: OfferData): Promise<Document>
  async createInvoice(deal: Deal): Promise<Invoice>
}

class OutreachService {
  async createCampaign(campaign: CampaignData): Promise<Campaign>
  async sendEmails(campaign: Campaign, recipients: Recipient[]): Promise<void>
  async trackInteraction(event: InteractionEvent): Promise<void>
}
```

---

## 📊 Data Layer Stack

### Primary Database (PostgreSQL)
```yaml
PostgreSQL 15+:
  Version: 15+ (latest stable)
  Connection Pool: PgBouncer (in transaction mode)
  Replication: Streaming replication for HA
  Backup: Daily automated backups to S3
  Monitoring: pg_stat_statements, pgAdmin
  
Key Extensions:
  - uuid-ossp (for UUID generation)
  - hstore (for key-value pairs)
  - json/jsonb (for flexible schemas)
```

**Performance Optimization**:
```sql
-- Connection pooling
max_connections = 100
shared_buffers = 25% of RAM
effective_cache_size = 50% of RAM
work_mem = (RAM - shared_buffers) / max_connections

-- Query optimization
max_parallel_workers_per_gather = 4
max_parallel_workers = CPU_cores
```

### Cache Layer (Redis)
```yaml
Redis 7.0+:
  Mode: Redis Sentinel for HA
  Persistence: RDB snapshots + AOF
  Memory Policy: allkeys-lru (evict oldest on memory full)
  
Use Cases:
  - Session storage (JWT tokens)
  - Rate limiting (Redis-based counters)
  - Database query caching (frequently accessed leads)
  - Campaign scheduling (sorted sets for time-based operations)
  - Temporary data (processing state)
  
TTLs:
  - Sessions: 24 hours
  - Cache: 1-6 hours depending on freshness needs
  - Rate limit: 1 hour
```

### Search & Analytics (Elasticsearch)
```yaml
Elasticsearch 8.0+:
  Cluster Size: 3+ nodes for production HA
  Shards: 3-5 per index (auto-managed by ILM)
  Replicas: 1-2
  
Indices:
  - companies: Full-text search on company data
  - interactions: Time-series event indexing
  - campaigns: Campaign metrics and reporting
  
ILM Policy:
  Hot → Warm → Cold → Delete (90 days)
```

### File Storage (AWS S3 or equivalent)
```yaml
S3 Bucket Structure:
  /screenshots/
    /{company_id}/{template_id}/{resolution}.jpg
  /pdfs/
    /{company_id}/{offer_id}.pdf
  /html-packages/
    /{company_id}/{website_id}/
  /backups/
    /database/
    /configs/
    
Configuration:
  - Versioning: Enabled for critical files
  - Lifecycle: Delete after 1 year (retention policy)
  - Encryption: AES-256 at rest
  - CDN: CloudFront for public assets
```

---

## 🔄 Message Queue & Event System

### Message Broker (RabbitMQ or AWS SQS)

**RabbitMQ Configuration**:
```yaml
RabbitMQ 3.13+:
  Cluster: 3+ nodes
  Persistence: All queues durable
  
Exchanges:
  - prospection-events (topic)
  - visual-generation-tasks (direct)
  - outreach-campaigns (fanout)
  - analytics-events (fanout)

Queues:
  - data-enrichment-queue (Priority, DLX for failures)
  - visual-generation-queue (Long messages, image processing)
  - email-send-queue (Reliable delivery)
  - sms-send-queue
  - interaction-tracking-queue
  - webhook-delivery-queue
```

**Message Format Example**:
```json
{
  "message_id": "msg_12345",
  "timestamp": "2024-01-15T10:30:00Z",
  "type": "visual_generation_requested",
  "data": {
    "company_id": "comp_123",
    "template_id": "template_ecommerce",
    "priority": "normal"
  },
  "retries": 0,
  "max_retries": 3
}
```

### Task Queue (Bull or Celery)

**Using Bull (Node.js)**:
```typescript
import Queue from 'bull';

// Create queues
const dataEnrichmentQueue = new Queue('data-enrichment', {
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: true
  }
});

const visualGenerationQueue = new Queue('visual-generation', {
  defaultJobOptions: {
    attempts: 2,
    timeout: 300000 // 5 minutes
  }
});

// Process jobs
dataEnrichmentQueue.process(10, async (job) => {
  const { companyId } = job.data;
  return await prospectionService.enrichCompanyData(companyId);
});

visualGenerationQueue.process(5, async (job) => {
  const { companyId, templateId } = job.data;
  return await visualService.generateWebsite(companyId, templateId);
});
```

---

## 🤖 AI & LLM Integration

### OpenAI Integration

```typescript
import { OpenAI } from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class ContentGenerator {
  async generateCompanyDescription(company: Company): Promise<string> {
    const message = await client.messages.create({
      model: 'gpt-4',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: `Generate a professional company description for ${company.name} in the ${company.industry} industry. Style: ${company.style}`
        }
      ]
    });
    return message.content[0].type === 'text' ? message.content[0].text : '';
  }

  async generateCTA(product: string, industry: string): Promise<string[]> {
    // Generate multiple CTA variations
  }
}
```

### Cost Optimization
```
Model Selection:
  - GPT-4o: For complex analysis, content generation
  - GPT-4 Turbo: For detailed tasks
  - GPT-3.5 Turbo: For simple classifications (lower cost)
  
Caching Strategy:
  - Cache identical prompts for 24 hours
  - Use batch API for high-volume processing
  - Implement request deduplication

Estimated Monthly Cost (10,000 companies):
  - Content generation: ~$200-500
  - Classification: ~$50-100
  - Total: ~$300-600/month
```

### Alternative Models
```
If avoiding vendor lock-in:
  - Anthropic Claude 3: Similar capabilities
  - Open-source: Llama 2 (self-hosted)
  - Hugging Face models: For specific tasks
```

### Image Generation & Analysis
```typescript
// Logo detection and extraction
import Tesseract from 'tesseract.js';
import sharp from 'sharp';

class ImageProcessor {
  async extractColors(imageUrl: string): Promise<string[]> {
    // Use Python server or Cloudinary API
  }

  async removeBackground(image: Buffer): Promise<Buffer> {
    // Use Remove.bg API or self-hosted model
  }
}
```

---

## 📧 Email & Communication Services

### Email Service (SendGrid)

```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class EmailService {
  async sendOffer(prospect: Prospect, offer: Offer): Promise<void> {
    await sgMail.send({
      to: prospect.email,
      from: 'offers@prospection.fr',
      templateId: 'd-template123456',
      dynamicTemplateData: {
        company_name: prospect.companyName,
        offer_link: offer.previewUrl,
        offer_expires: offer.validUntil
      },
      trackingSettings: {
        clickTracking: { enable: true },
        openTracking: { enable: true }
      }
    });
  }

  async sendCampaign(campaign: Campaign): Promise<void> {
    // Batch send with personalization
  }
}
```

### SMS Service (Twilio)

```typescript
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

class SMSService {
  async sendProspectMessage(phone: string, message: string): Promise<void> {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
  }
}
```

---

## 🌐 External APIs & Integrations

### Data Collection APIs

| API | Purpose | Rate Limit | Cost |
|-----|---------|-----------|------|
| **Google Business API** | Company info, ratings, photos | 25,000/day | Free (with billing) |
| **LinkedIn Company API** | Employee count, industry | Limited | Premium tier |
| **SIRET/INSEE API** | French company registry | Unlimited | Free |
| **Bright Data** | Web scraping infrastructure | Custom | $0.50-2.00/GB |
| **ScrapingBee** | Headless browser scraping | 1,000/day free | $49-299/month |

### Integration Pattern

```typescript
class DataSourceIntegrator {
  private google: GoogleBusinessConnector;
  private linkedin: LinkedInConnector;
  private siret: SIRETConnector;

  async enrichCompany(company: Company): Promise<EnrichedCompany> {
    const [googleData, linkedinData, siretData] = await Promise.all([
      this.google.fetch(company.businessId),
      this.linkedin.fetch(company.linkedinId),
      this.siret.fetch(company.siretNumber)
    ]);

    return this.mergeData(googleData, linkedinData, siretData);
  }
}
```

---

## 📊 Monitoring & Observability

### Logging (ELK Stack)

```yaml
Elasticsearch:
  Version: 8.0+
  Retention: 30 days hot, 90 days cold
  
Kibana:
  Dashboards:
    - Application Performance (latency, errors, throughput)
    - Business Metrics (leads generated, conversions, revenue)
    - Data Pipeline Status (ingestion rate, queue depth)
    - Security Events (failed logins, API abuse)

Log Shipper:
  - Filebeat for log collection
  - Logstash for enrichment
  - JSONencoded logs for better parsing
```

### Metrics & Alerts (Prometheus + Grafana)

```yaml
Prometheus:
  Scrape Interval: 15 seconds
  Retention: 30 days
  
Key Metrics:
  - http_requests_total (by endpoint, method, status)
  - http_request_duration_seconds
  - database_query_duration_seconds
  - message_queue_depth
  - cache_hit_ratio
  - api_calls_to_external_services

Grafana Dashboards:
  - System Health (CPU, Memory, Disk)
  - API Performance (response times, error rates)
  - Business KPIs (leads, offers, conversions)
  - Queue Health (depth, processing time)

Alert Rules:
  - Error rate > 5% → Critical
  - API latency p95 > 2s → Warning
  - Cache hit ratio < 60% → Warning
  - Queue depth > 10,000 → Critical
```

### Tracing (Jaeger or Datadog)

```typescript
import { initTracingSDK } from '@opentelemetry/auto-instrumentations-node';

initTracingSDK();

// Automatic instrumentation of:
// - HTTP requests/responses
// - Database queries
// - Middleware execution
// - External API calls

// Traces help identify bottlenecks across services
```

---

## 🔐 Security Stack

### Authentication & Authorization

| Component | Technology | Usage |
|-----------|-----------|-------|
| **Auth Protocol** | OAuth 2.0 + JWT | User login, API authentication |
| **Session Mgmt** | JWT + Redis | Stateless sessions, refresh tokens |
| **Password Hashing** | bcrypt or Argon2 | Secure password storage |
| **2FA** | TOTP (Google Authenticator) | Enhanced security |
| **Secrets Mgmt** | AWS Secrets Manager or HashiCorp Vault | API keys, database credentials |

### Data Security

```yaml
Encryption:
  At Rest: AES-256 for sensitive data
  In Transit: TLS 1.3 for all connections
  
PII Handling:
  - Encryption for personal data fields
  - Separate from business data where possible
  - Anonymization for analytics
  
GDPR Compliance:
  - Audit logs for all data access
  - Data retention policies (auto-delete after period)
  - Right to be forgotten implementation
  - Consent management system
```

### API Security

```typescript
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';

app.use(helmet()); // Security headers
app.use(cors({ origin: process.env.ALLOWED_ORIGINS }));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

// Input validation & sanitization
app.use(express.json({ limit: '10kb' })); // Limit payload size
```

---

## 🚀 DevOps & Deployment Stack

### Infrastructure as Code

```yaml
Terraform:
  - AWS VPC, subnets, security groups
  - RDS (PostgreSQL), ElastiCache (Redis)
  - S3 buckets, CloudFront CDN
  - ECS clusters for containerized services
  - ALB for load balancing
  - Auto-scaling groups

CloudFormation:
  - Alternative to Terraform (AWS-native)
  - Stack dependencies, outputs, parameters

Ansible:
  - Post-deployment configuration
  - Secrets management
  - System updates and patches
```

### Containerization & Orchestration

```dockerfile
# Dockerfile example
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s \
  CMD node healthcheck.js

CMD ["node", "dist/index.js"]
```

```yaml
# Kubernetes deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prospection-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: prospection-api
  template:
    metadata:
      labels:
        app: prospection-api
    spec:
      containers:
      - name: api
        image: prospection:v1.0.0
        ports:
        - containerPort: 3000
        resources:
          requests:
            cpu: 500m
            memory: 512Mi
          limits:
            cpu: 1000m
            memory: 1Gi
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
```

### CI/CD Pipeline

```yaml
GitHub Actions Workflow:
  
  Trigger: Push to main/staging

  Jobs:
    1. Test:
       - npm install
       - npm run lint
       - npm run test (coverage > 80%)
    
    2. Build:
       - docker build -t prospection:${SHA}
       - docker push to registry
    
    3. Deploy to Staging:
       - kubectl apply -f k8s/staging/
       - Run integration tests
       - Run smoke tests
    
    4. Manual Approval:
       - Requires human review
    
    5. Deploy to Production:
       - kubectl apply -f k8s/production/
       - Blue-green deployment (0 downtime)
       - Monitor for errors (rollback if needed)
```

---

## 📋 Summary Tableau de Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | React 18 + Next.js 14 | Modern, performant, great DX |
| **Styling** | Tailwind CSS | Rapid development, customizable |
| **Backend** | Node.js + Express/Fastify | Lightweight, JavaScript/TypeScript ecosystem |
| **Database** | PostgreSQL + Redis + Elasticsearch | Proven reliability, strong consistency, search capability |
| **ORM** | Prisma | Type-safe, migrations, excellent DX |
| **Message Queue** | RabbitMQ or AWS SQS | Reliable async processing |
| **Task Queue** | Bull (Node.js) or Celery (Python) | Job scheduling, retries |
| **LLM** | OpenAI GPT-4 | Best quality content generation |
| **Email** | SendGrid | High deliverability, tracking |
| **SMS** | Twilio | Reliable SMS delivery |
| **File Storage** | AWS S3 | Scalable, reliable, cost-effective |
| **Monitoring** | Prometheus + Grafana + ELK | Comprehensive observability |
| **Container** | Docker + Kubernetes | Scalability, reliability |
| **IaC** | Terraform | Cloud-agnostic, version-controlled |
| **CI/CD** | GitHub Actions | Built-in, no additional tools |

---

## 💰 Infrastructure Cost Estimate (Monthly)

```
Development:
  - 3x t3.small RDS (PostgreSQL): $90
  - Redis ElastiCache (cache.t3.micro): $30
  - Elasticsearch (m5.large.elasticsearch): $150
  - EC2 instances (3x t3.medium for services): $180
  - Load Balancer: $20
  - S3 storage (100 GB): $5
  - Data transfer: $50
  - Monitoring tools: $100

Production:
  - 3x r5.large RDS (PostgreSQL HA): $600
  - Redis ElastiCache (cache.r5.large): $200
  - Elasticsearch (3x m5.xlarge): $800
  - ECS/Fargate (capacity for 100 concurrent): $500
  - Load Balancer: $30
  - S3 storage (1 TB): $25
  - Data transfer: $200
  - CDN (CloudFront): $100
  - Monitoring & logs: $300

Total Development: ~$625/month
Total Production: ~$3,155/month
```

---

## 🔄 Development Environment Setup

```bash
# Clone repository
git clone https://github.com/org/prospection-pme.git

# Backend setup
cd backend
cp .env.example .env.local
npm install
npm run db:setup
npm run dev

# Frontend setup
cd ../frontend
npm install
npm run dev

# Services (in separate terminals)
docker-compose up # Redis, PostgreSQL, Elasticsearch, RabbitMQ

# Makefile commands
make setup        # Full setup
make dev          # Start all services
make test         # Run tests
make lint         # Lint code
make build        # Production build
```

---

**Next Phase**: Ready for implementation team handoff with complete technical specifications and stack rationale.
