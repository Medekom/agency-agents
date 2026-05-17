# Spécifications Techniques des Composants Majeurs

## 1. PROSPECTION ENGINE SERVICE

### 1.1 Data Collection Module

**Responsabilité**: Collecter automatiquement les données sur les PME auprès de sources publiques

#### 1.1.1 Web Scraping Service

**Technologie**: Puppeteer (Node.js) ou Scrapy (Python)

**Fonctionnalités**:
- Navigation automatisée sur pages web
- Extraction d'informations structurées (nom, adresse, téléphone, email, social media)
- Gestion des cookies et sessions
- Rate limiting et respectrespect des robots.txt
- Retry logic avec exponential backoff
- Proxy rotation pour éviter blocking
- User-Agent rotation

**API Endpoints**:
```
POST /api/scraping/jobs
  - Input: {url, selector_config, depth}
  - Output: {job_id, status}

GET /api/scraping/jobs/{job_id}
  - Output: {status, data, error_message}

POST /api/scraping/batch
  - Input: {urls[], selector_config}
  - Output: {batch_id, total_jobs}
```

**Performance Target**:
- 100+ pages par minute
- < 5s par page (moyenne)
- 99% success rate

**Error Handling**:
- Retry 3x avec exponential backoff
- Log failed URLs for manual review
- Alert if success rate < 95%

---

#### 1.1.2 Public API Integration

**APIs to Integrate**:

1. **Google Business API**
   - Récupère: Company info, ratings, photos, hours, reviews
   - Quota: 25,000 requêtes/jour
   - Auth: API Key avec billing account

2. **LinkedIn Company API**
   - Récupère: Employee count, industry, location, headquarters
   - Quota: Limité (partnership required)
   - Auth: OAuth 2.0

3. **SIRET/INSEE Database** (France)
   - Récupère: Legal entity info, headquarters, financial data
   - Format: REST API
   - Auth: API Key

4. **OpenData Providers**
   - Données publiques régionales/municipales
   - Various formats and APIs

**Architecture**:
```python
class DataSourceConnector:
    abstract_method fetch_data(company_identifier) -> CompanyData
    abstract_method validate_credentials()
    abstract_method get_quota_usage()

class GoogleBusinessConnector(DataSourceConnector):
    def fetch_data(self, place_id: str) -> CompanyData
    def search_companies(query: str, location: str) -> List[CompanyData]

class LinkedInConnector(DataSourceConnector):
    def fetch_company_profile(company_id: str) -> CompanyData
    def search_companies(keyword: str) -> List[CompanyData]

class SIRETConnector(DataSourceConnector):
    def fetch_company_profile(siret: str) -> CompanyData
```

**API Endpoints**:
```
GET /api/data-sources/google-business/search
  - Query: {query, location, radius}
  - Returns: List[CompanyData]

GET /api/data-sources/linkedin/company/{id}
  - Returns: CompanyData

GET /api/data-sources/siret/{siret}
  - Returns: CompanyData

GET /api/data-sources/quota
  - Returns: {source, quota_remaining, reset_time}
```

**Rate Limiting & Quota Management**:
- Track quota per API per day
- Implement token bucket algorithm
- Queue requests if quota approaching limit
- Alert when 80% quota reached

---

#### 1.1.3 Database Import Pipeline

**Workflow**:
```
Data Sources (Web, APIs)
    ↓
Data Validation & Normalization
    ↓
Duplicate Detection (Fuzzy matching)
    ↓
Conflict Resolution (Latest data wins)
    ↓
PostgreSQL Insertion
    ↓
Elasticsearch Indexing
```

**Features**:
- Bulk import (10,000+ records at once)
- Transaction rollback on errors
- Duplicate detection using:
  - Exact match on SIRET/VAT
  - Fuzzy matching on name+location
  - Email domain matching
- Conflict resolution:
  - Latest timestamp wins
  - More complete data preferred
  - User-defined resolution rules

**API Endpoints**:
```
POST /api/import/batch
  - Input: {file_url or data_json, duplicate_strategy, conflict_strategy}
  - Output: {import_id, status}

GET /api/import/{import_id}
  - Returns: {status, records_imported, duplicates_found, errors[]}

POST /api/import/{import_id}/validate
  - Returns: {valid_count, invalid_records[], warnings[]}
```

**Performance Requirements**:
- 10,000 records/minute
- 100% data integrity (no lost records)
- Atomic transactions

---

### 1.2 Data Enrichment Pipeline

**Responsabilité**: Ajouter de la valeur aux données brutes (classification, scoring, estimation)

#### 1.2.1 Company Profile Analysis Service

**Fonctionnalités**:
- Analyse du texte/contenu de l'entreprise (site web, descriptions LinkedIn, avis)
- Classification automatique par secteur/industrie
- Extraction de mots-clés
- Détection de taille approximative
- Identification de la localisation réelle

**Technology Stack**:
- NLP: spaCy, NLTK, ou Hugging Face Transformers
- LLM Integration: OpenAI API pour analyses complexes
- Entity Recognition: Custom models ou NER pré-trainés

**Data Enrichment Output**:
```json
{
  "company_id": "123",
  "enrichment": {
    "industry": "E-commerce",
    "sub_industry": "Fashion Retail",
    "keywords": ["retail", "online", "wholesale"],
    "business_model": "B2C",
    "company_size_estimated": 15,
    "locations": [
      {"main": true, "city": "Paris", "region": "Île-de-France"}
    ],
    "digital_footprint": {
      "has_website": true,
      "website_quality_score": 3,
      "social_media": ["instagram", "facebook"],
      "ecommerce_detected": true
    },
    "confidence_score": 0.85,
    "last_updated": "2024-01-15"
  }
}
```

**API Endpoints**:
```
POST /api/enrichment/analyze-company
  - Input: {company_id, data_sources[]}
  - Output: {enrichment_data, confidence}

POST /api/enrichment/batch
  - Input: {company_ids[], priority}
  - Output: {job_id}

GET /api/enrichment/jobs/{job_id}
  - Returns: {status, processed, pending, results[]}
```

---

#### 1.2.2 Market Position Scorer

**Scoring Dimensions**:
1. **Company Size Score** (0-100)
   - Based on: employee count, revenue estimate, annual growth
   - Formula: (normalized_employees * 0.4) + (revenue_percentile * 0.4) + (growth_rate * 0.2)

2. **Market Maturity Score** (0-100)
   - Based on: years in business, market position, reputation
   - Data sources: Founded year, review ratings, market share

3. **Digital Maturity Score** (0-100)
   - Based on: website quality, social media presence, online tools
   - Scoring:
     - No website: 10 points
     - Basic website: 30 points
     - Modern website: 60 points
     - E-commerce enabled: 80 points
     - Advanced digital tools: 100 points

4. **Growth Potential Score** (0-100)
   - Based on: market growth, company growth trend, industry tailwinds
   - Data: Historical growth, market trends

**Overall Market Position Score**:
```
Market Position = 
  (Size_Score * 0.3) +
  (Maturity_Score * 0.2) +
  (DigitalMaturity_Score * 0.2) +
  (GrowthPotential_Score * 0.3)
```

**Output Format**:
```json
{
  "company_id": "123",
  "market_position": {
    "overall_score": 72,
    "size_score": 65,
    "maturity_score": 78,
    "digital_maturity_score": 40,
    "growth_potential_score": 85,
    "percentile": 0.68,
    "tier": "mid-market_high_potential"
  }
}
```

---

#### 1.2.3 Digitalization Gap Detection

**Algorithm**:
1. Check for website presence (DNS + HTTP check)
2. Analyze website age (WHOIS data)
3. Check for SSL certificate (modern security)
4. Analyze website tech stack (modern vs outdated)
5. Check for mobile responsiveness
6. Analyze online business capabilities (payment, booking, etc.)

**Digitalization Status Classification**:
- `NO_DIGITAL_PRESENCE`: No website
- `OUTDATED_DIGITAL`: Website 5+ years old, basic design
- `BASIC_DIGITAL`: Simple website, limited functionality
- `MODERN_DIGITAL`: Current design, responsive, some features
- `ADVANCED_DIGITAL`: Full e-commerce, integrations, mobile app

**Detectable Indicators of Outdated Web**:
- Outdated design patterns (Flash, IE-only styling)
- Missing mobile optimization
- No HTTPS
- Outdated technology (PHP 5, ASP.NET 1.x)
- No social media integration
- Low PageSpeed score

**Output**:
```json
{
  "company_id": "123",
  "digitalization": {
    "status": "OUTDATED_DIGITAL",
    "website_exists": true,
    "website_url": "www.example.fr",
    "website_age_years": 8,
    "is_mobile_responsive": false,
    "has_ssl": true,
    "tech_stack": ["PHP 5.2", "jQuery 1.4"],
    "ecommerce_enabled": false,
    "last_updated": "2016-03-12",
    "digitalization_gap_score": 85,
    "opportunity_level": "HIGH"
  }
}
```

---

### 1.3 Lead Qualification Engine

**Responsabilité**: Scorer et qualifier les leads selon leur potentiel commercial

#### 1.3.1 Industry Classifier

**Approach**: Multi-class classification using:
- Rule-based: Keywords, SIRET classification
- ML-based: NLP model trained on 200+ industries

**Industries Supportées** (100+ classifications):
- Technology & Software
- Retail & E-commerce
- Manufacturing
- Construction
- Services (Legal, Consulting, Design, etc.)
- Healthcare
- Education
- Hospitality
- Real Estate
- Finance & Insurance
- Agriculture
- Transport & Logistics
- Etc.

**Sub-industry Classification**: 20+ sous-catégories par industrie

**Output**:
```json
{
  "company_id": "123",
  "industry_classification": {
    "primary_industry": "Retail & E-commerce",
    "sub_industry": "Fashion Retail",
    "confidence": 0.92,
    "alternative_industries": [
      {"industry": "Luxury Goods", "confidence": 0.05},
      {"industry": "General Retail", "confidence": 0.03}
    ]
  }
}
```

**API**:
```
POST /api/qualification/classify-industry
  - Input: {company_id}
  - Output: {industry, sub_industry, confidence}
```

---

#### 1.3.2 Size & Revenue Estimator

**Estimation Model** (using available signals):

1. **Employee Count Signal**:
   - Extract from LinkedIn
   - Cross-reference with social posts
   - Estimate from office space/online jobs

2. **Revenue Estimation**:
   - Base: Employee count * industry-average revenue-per-employee
   - Adjust: Market position, growth signals, funding indicators
   - Validate: Compare with public data (financial reports, D&B)

3. **Formula**:
```
Estimated Revenue =
  Employees * 
  Industry_Revenue_Per_Employee * 
  Growth_Factor *
  Market_Position_Factor
```

**Output**:
```json
{
  "company_id": "123",
  "size_estimation": {
    "employee_count": 12,
    "employee_count_confidence": 0.75,
    "estimated_annual_revenue_eur": 480000,
    "revenue_confidence": 0.60,
    "revenue_range": [350000, 650000],
    "size_category": "SME"
  }
}
```

---

#### 1.3.3 Qualification Scoring Algorithm

**Lead Quality Score** (0-100):
```
QUALIFICATION_SCORE = 
  (Industry_Fit * 0.20) +
  (Company_Size_Score * 0.25) +
  (Digital_Gap_Score * 0.35) +
  (Market_Position_Score * 0.10) +
  (Growth_Potential_Score * 0.10)

Where each component is 0-100
```

**Industry Fit Scoring** (by configured target industries):
```json
{
  "high_fit_industries": {
    "Retail": 1.0,
    "Services": 0.8,
    "Manufacturing": 0.6
  }
}
```

**Company Size Preferences**:
- Employees: Target range (e.g., 5-50)
- Revenue: Target range (e.g., €200k-€2M)
- Scoring: Higher score if within target, penalties if outside

**Digital Gap Preference**:
- Highest scoring: No digital presence (score * 1.2)
- Very high: Outdated digital (score * 1.0)
- Lower: Modern digital (score * 0.5)

**Qualification Tiers**:
- **Hot**: Score 80-100 (Immediate contact)
- **Warm**: Score 60-79 (Follow-up priority)
- **Cool**: Score 40-59 (Secondary list)
- **Unqualified**: Score 0-39 (Not contacted)

**Output**:
```json
{
  "company_id": "123",
  "lead_qualification": {
    "overall_score": 78,
    "tier": "WARM",
    "qualification_metrics": {
      "industry_fit": 85,
      "company_size_fit": 75,
      "digital_gap_fit": 92,
      "market_position": 65,
      "growth_potential": 70
    },
    "recommendation": "Contact within 1 week",
    "next_action": "Send personalized offer"
  }
}
```

---

## 2. VISUAL GENERATION SERVICE

### 2.1 Design System Manager

**Components Library** (20+ components):
- Header/Navigation
- Hero Section
- Feature Cards
- Testimonials
- Pricing Tables
- Contact Forms
- Footer
- Call-to-Action Buttons
- Image Galleries
- Service Showcase
- Product Listings
- Blog Section
- etc.

**Design Tokens**:
```json
{
  "colors": {
    "primary": "#1A73E8",
    "secondary": "#F9AB00",
    "neutral": ["#F8F9FA", "#E8EAED", "#D2D3D4", "#5F6368", "#202124"]
  },
  "typography": {
    "heading_1": "32px, 500 weight, 1.2 line-height",
    "body": "16px, 400 weight, 1.5 line-height"
  },
  "spacing": [4, 8, 16, 24, 32, 48, 64],
  "breakpoints": {"mobile": 480, "tablet": 768, "desktop": 1024}
}
```

**Template Variations** (5 base templates):
1. **Business Services**: For consulting, agencies, professional services
2. **E-commerce**: Online retail shops
3. **SaaS/Software**: Tech product companies
4. **Manufacturing**: Industrial/B2B companies
5. **Hospitality**: Restaurants, hotels, services

---

### 2.2 Content Generation Pipeline

**LLM Prompts** (industry-specific):

**For E-commerce Fashion**:
```
Generate compelling product descriptions for [BRAND] online store
- Style: Professional, modern, persuasive
- Include benefits and unique selling points
- CTA: "Shop Now"
- Max 150 words each
```

**For Consulting Services**:
```
Create service descriptions for [COMPANY] consulting website
- Service: [SERVICE_NAME]
- Style: Authority-driven, results-oriented
- Include typical outcomes and deliverables
- Max 200 words
```

**Content Generation Workflow**:
1. Extract company info (industry, size, product/service)
2. Retrieve industry-specific prompt templates
3. Fill template with company data
4. Call OpenAI API with prompt
5. Validate response quality and tone
6. Return generated content

**Generated Content Types**:
- Homepage headline & tagline
- Service/product descriptions
- Company mission/values
- Team bios (if data available)
- Blog post introductions
- CTA copy variations

---

### 2.3 Layout & Branding Engine

#### 2.3.1 Logo Detection & Integration

**Workflow**:
1. Search for company logo URLs (from Google Business, website, LinkedIn)
2. Download and validate image
3. Analyze logo (size, colors, orientation)
4. Detect image backgrounds (remove/replace if needed)
5. Integrate into template at optimal positions

**Technical Implementation**:
```python
class LogoDetector:
    def find_logo_urls(company_id: str) -> List[str]
    def download_and_validate(url: str) -> Image
    def analyze_logo(image: Image) -> LogoMetadata
    def remove_background(image: Image) -> Image
    def integrate_into_template(image: Image, template: Template) -> Template

class LogoMetadata:
    width: int
    height: int
    aspect_ratio: float
    dominant_colors: List[str]
    has_transparency: bool
    orientation: str  # "landscape", "square", "portrait"
```

**Placement Rules**:
- Header: Logo + company name (left aligned)
- Footer: Logo (centered, smaller size)
- Hero: Logo (right side, if landscape orientation)

---

#### 2.3.2 Brand Color Extraction

**Color Extraction Algorithm**:
1. Analyze logo and website colors
2. Use dominant color detection (K-means clustering)
3. Extract 3-5 main colors
4. Verify contrast ratio (WCAG compliance)
5. Generate complementary color palette

**Color Harmony Rules**:
- Primary color (brand): 50% of design
- Secondary color (accent): 30% of design
- Neutral colors: 20% of design

**Color Accessibility**:
- Minimum contrast ratio: 4.5:1 for text
- Verify readability on light and dark backgrounds

**Generated Palette Output**:
```json
{
  "company_id": "123",
  "brand_colors": {
    "primary": "#E83E8C",
    "secondary": "#007BFF",
    "accent": "#FFC107",
    "neutral_light": "#F8F9FA",
    "neutral_dark": "#212529"
  },
  "contrast_ratios": {
    "primary_on_white": 5.2,
    "secondary_on_white": 8.1
  },
  "confidence": 0.88
}
```

---

#### 2.3.3 Responsive Layout Generator

**Breakpoints** (Mobile-First):
- Mobile: < 480px
- Tablet: 480px - 1024px
- Desktop: > 1024px

**Layout Adjustments by Device**:
- Single column (mobile) → 2-3 columns (desktop)
- Hamburger menu (mobile) → Full nav (desktop)
- Stacked cards (mobile) → Grid layout (desktop)

**Content Adaptation**:
- Truncate long text on mobile
- Adjust image sizes
- Stack or hide non-essential elements

---

### 2.4 Asset Production Manager

#### 2.4.1 Rendering & Screenshot Pipeline

**Technology**: Puppeteer (headless Chrome)

**Rendering Process**:
```
HTML/CSS Template +
Company Data +
Generated Content +
Brand Colors/Logo
    ↓
Inject into Template
    ↓
Render in Puppeteer (headless browser)
    ↓
Capture Screenshots (mobile, tablet, desktop)
    ↓
Generate PDF
    ↓
Optimize Images (compression, WebP conversion)
    ↓
Store in S3
```

**Screenshots Generated**:
- Full page screenshot (desktop): 1920x1080
- Mobile view: 375x667
- Tablet view: 768x1024
- 3-4 key sections: detailed views

**PDF Generation**:
- Full webpage as PDF
- A4 format optimized
- Includes branding and company details

**Performance Targets**:
- Website rendering: < 30 seconds
- Screenshot generation: < 5 minutes total
- File size: < 5MB for all assets

---

#### 2.4.2 Export Formats

**Deliverables**:
1. **HTML Package**
   - index.html (complete website structure)
   - styles.css (responsive CSS)
   - assets/ folder (images, fonts)
   - README with instructions

2. **Screenshot Suite**
   - desktop-full.jpg
   - desktop-section-hero.jpg
   - mobile-full.jpg
   - tablet-full.jpg

3. **PDF Presentation**
   - Full website as PDF
   - Printable format
   - Includes contact information overlay

4. **Interactive Preview**
   - Hosted preview URL
   - Temporary (30 days)
   - Can be shared with stakeholders

---

## 3. COMMERCIAL MODULE SERVICE

### 3.1 Pricing Engine

**Pricing Model** (Tiered SaaS-style):

```
Basic Package: €2,000
├─ 5-page website
├─ 2 custom sections
├─ Mobile responsive
├─ 1 year free hosting & domain
└─ Email support

Pro Package: €4,500
├─ 10-page website
├─ 5 custom sections
├─ E-commerce capability (10 products)
├─ 2 years free hosting & domain
├─ Contact forms + lead capture
├─ Monthly reports
└─ Priority email support

Premium Package: €8,000
├─ Unlimited pages
├─ Unlimited customization
├─ Full e-commerce (unlimited products)
├─ 3 years free hosting & domain
├─ CRM integration
├─ Monthly strategy calls
├─ Dedicated account manager
└─ Premium support (phone + chat)
```

**Pricing Adjustments**:
1. **Industry Adjustment** (±15%):
   - E-commerce & Retail: +15%
   - Services & Consulting: baseline
   - Hospitality: -10%

2. **Company Size Adjustment** (±20%):
   - 1-5 employees: -15%
   - 6-20 employees: baseline
   - 20+ employees: +20%

3. **Digital Gap Adjustment** (±10%):
   - No presence: +10% (higher complexity)
   - Outdated: baseline
   - Modern: -5% (less transformation needed)

4. **Volume Discount**:
   - 2+ services: 10% discount
   - 3+ services: 15% discount

**Pricing Calculation API**:
```
POST /api/pricing/calculate
  Input: {
    company_id,
    package_tier: "basic|pro|premium",
    add_ons: [string],
    apply_discounts: boolean
  }
  Output: {
    base_price: 2000,
    industry_adjustment: 300,
    size_adjustment: -200,
    digital_gap_adjustment: 200,
    discount_applied: -150,
    total_price: 2150,
    breakdown: {...}
  }
```

---

### 3.2 Offer Generator

**Offer Document Components**:
1. Executive Summary
   - Company name & industry
   - Current digital status
   - Proposed solution

2. Proposed Website Showcase
   - Screenshots of generated website
   - Feature highlights
   - Technology stack

3. Pricing & Packages
   - Detailed feature comparison
   - Price breakdown
   - Payment terms

4. Timeline & Process
   - Implementation timeline (4-6 weeks)
   - Phase breakdown
   - Deliverables per phase

5. Company Background
   - About the agency
   - Portfolio highlights
   - Case studies

6. Call to Action
   - Next steps
   - Contact information
   - Booking meeting link

---

### 3.3 Document Generation

**PDF Generation** (using PDFKit/Puppeteer):
```python
class OfferGenerator:
    def generate_pdf_offer(offer_data: OfferData) -> bytes
    def generate_html_offer(offer_data: OfferData) -> str
    def generate_email_template(offer_data: OfferData) -> str

class OfferData:
    company_id: str
    prospect_name: str
    prospect_email: str
    package_tier: str
    pricing: Dict
    website_preview: WebsitePreview
    custom_message: str
```

**Customization Options**:
- Company branding (logo, colors)
- Salesperson signature
- Custom messaging per prospect
- Valid offer period (e.g., "Valid until Jan 31, 2025")

---

## 4. OUTREACH & ENGAGEMENT SERVICE

### 4.1 Campaign Orchestrator

**Campaign Workflow**:
```
Create Campaign (template selection)
    ↓
Select Recipients (targeting rules)
    ↓
Personalization (company name, offer link)
    ↓
Schedule Send (time optimization)
    ↓
Send (via SendGrid/Twilio)
    ↓
Track (opens, clicks, conversions)
    ↓
Auto-Follow-up (if no response in 3 days)
```

**Campaign Templates**:
1. **Initial Pitch**: "Check out your new website"
   - Personalized message
   - Website preview link
   - CTA: "View Your Website"

2. **Value-Add**: "How [Company] Increased Sales 40%"
   - Success story
   - Relevance to industry
   - CTA: "See Results"

3. **Follow-Up #1**: "Still interested in [Offer]?"
   - Gentle reminder
   - New angle/benefit
   - CTA: "Let's Talk"

4. **Follow-Up #2**: "Last Chance"
   - Urgency
   - Limited-time incentive
   - CTA: "Claim Offer"

---

### 4.2 Communication Services

**Email Service** (SendGrid integration):
```
POST /api/campaigns/send-email
  Input: {
    campaign_id,
    recipients: [{email, company_id, personalization}],
    template_id,
    scheduled_time
  }
  Output: {
    job_id,
    recipients_scheduled,
    estimated_delivery
  }
```

**SMS Service** (Twilio integration):
```
POST /api/campaigns/send-sms
  Input: {
    campaign_id,
    recipients: [{phone, personalization}],
    message_template,
    scheduled_time
  }
  Output: {
    job_id,
    recipients_scheduled
  }
```

**Personalization Tokens**:
- {{company_name}}: Company name
- {{prospect_name}}: Contact person name
- {{website_url}}: Preview URL
- {{offer_expires}}: Offer expiration date
- {{industry}}: Industry classification

---

### 4.3 Interaction Tracking

**Events Tracked**:
1. **Email Events**:
   - Delivered
   - Opened (timestamp)
   - Clicked (link, timestamp)
   - Bounced (hard/soft)
   - Unsubscribed

2. **Website Events**:
   - Preview visited
   - Duration on page
   - Sections viewed
   - Screenshots downloaded

3. **Conversion Events**:
   - Contact form submitted
   - Call scheduled
   - Offer accepted
   - Contract signed

**Tracking Implementation**:
- Unique tracking pixel per email
- URL parameters for link tracking
- Server-side event logging
- Google Analytics integration

**Output (Analytics Dashboard)**:
```json
{
  "campaign_id": "camp_123",
  "statistics": {
    "sent": 500,
    "delivered": 485,
    "opened": 156,
    "open_rate": 0.32,
    "clicked": 42,
    "click_rate": 0.084,
    "conversions": 7,
    "conversion_rate": 0.014,
    "revenue_generated": 14000
  }
}
```

---

## 5. DATA MANAGEMENT SERVICE

### 5.1 Database Schema (PostgreSQL)

**Core Tables**:
```sql
-- Companies (prospects)
companies (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  industry VARCHAR,
  size_category VARCHAR,
  employee_count INT,
  estimated_revenue DECIMAL,
  locations JSONB,
  contact_info JSONB,
  digital_presence JSONB,
  qualification_score DECIMAL,
  qualification_tier VARCHAR,
  last_updated TIMESTAMP,
  created_at TIMESTAMP
)

-- Generated Offers
offers (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies,
  package_tier VARCHAR,
  price DECIMAL,
  generated_website_id UUID,
  document_pdf_path VARCHAR,
  preview_url VARCHAR,
  sent_date TIMESTAMP,
  valid_until TIMESTAMP,
  status VARCHAR,
  created_at TIMESTAMP
)

-- Generated Websites/Visuals
generated_websites (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies,
  template_id VARCHAR,
  content JSONB,
  screenshot_mobile_path VARCHAR,
  screenshot_desktop_path VARCHAR,
  html_package_path VARCHAR,
  pdf_path VARCHAR,
  generated_at TIMESTAMP,
  created_at TIMESTAMP
)

-- Campaigns
campaigns (
  id UUID PRIMARY KEY,
  name VARCHAR,
  template_id VARCHAR,
  recipients_count INT,
  sent_at TIMESTAMP,
  scheduled_for TIMESTAMP,
  status VARCHAR,
  created_at TIMESTAMP
)

-- Campaign Interactions
campaign_interactions (
  id UUID PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns,
  company_id UUID REFERENCES companies,
  email VARCHAR,
  event_type VARCHAR, -- 'opened', 'clicked', 'converted'
  event_data JSONB,
  timestamp TIMESTAMP
)

-- Audit Log (compliance)
audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID,
  action VARCHAR,
  resource_type VARCHAR,
  resource_id UUID,
  changes JSONB,
  timestamp TIMESTAMP
)
```

---

**Indexing Strategy**:
```sql
CREATE INDEX idx_companies_industry ON companies(industry);
CREATE INDEX idx_companies_qualification_score ON companies(qualification_score);
CREATE INDEX idx_companies_qualification_tier ON companies(qualification_tier);
CREATE INDEX idx_companies_created_at ON companies(created_at);

CREATE INDEX idx_offers_company_id ON offers(company_id);
CREATE INDEX idx_offers_status ON offers(status);

CREATE INDEX idx_campaigns_created_at ON campaigns(created_at);
CREATE INDEX idx_interactions_campaign_id ON campaign_interactions(campaign_id);
CREATE INDEX idx_interactions_timestamp ON campaign_interactions(timestamp);
```

---

**Elasticsearch Mapping** (for search):
```json
{
  "mappings": {
    "properties": {
      "company_id": {"type": "keyword"},
      "name": {"type": "text", "analyzer": "french"},
      "industry": {"type": "keyword"},
      "location": {"type": "geo_point"},
      "website": {"type": "keyword"},
      "description": {"type": "text", "analyzer": "french"},
      "qualification_score": {"type": "float"},
      "created_at": {"type": "date"}
    }
  }
}
```

---

End of Specifications (Component 1-5)

**Next Steps for Implementation**:
1. Set up development environment based on specifications
2. Implement core services in order of dependency
3. Create integration tests for each service
4. Set up monitoring and logging early
5. Plan API rate limiting and caching strategy
