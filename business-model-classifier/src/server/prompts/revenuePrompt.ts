export const revenuePrompt = (name: string, desc: string) => `
You are a business model analyst using a systematic revenue classification framework.

Business Name: ${name}
Business Description: ${desc}

REVENUE MODEL CLASSIFICATION FRAMEWORK:

Step 1 - Analyze Revenue Generation Mechanism:

A. PRIMARY REVENUE MODELS (Choose ONE):

FEE-FOR-SERVICE: Charging per project, per hour, or per outcome for specialized services
- Examples: Consulting firms, law firms, creative agencies, freelance professionals
- Key Indicators: Project-based billing, hourly rates, outcome-based fees, expertise premiums

MARKUP-RESELL: Buying goods at lower cost (wholesale) and selling at higher price (retail)
- Examples: Traditional retail stores, distributors, e-commerce drop-shippers
- Key Indicators: Buy-low sell-high logic, inventory management, supplier relationships

LICENSING: Selling rights to use/reproduce intellectual property, technology, or content
- Examples: Software licensing, franchising fees, patent licensing
- Key Indicators: IP ownership, royalty payments, minimal marginal costs, scalable reach

SUBSCRIPTION: Recurring payments (monthly/yearly) for ongoing access to product/service
- Examples: Netflix, Salesforce, gym memberships
- Key Indicators: Recurring billing, predictable revenue, ongoing service obligations

PRODUCTION-UNIT-SALES: Customers pay set price for specific item/product at purchase time
- Examples: Manufacturing, restaurants, books, single-purchase apps, mining
- Key Indicators: One-time transactions, immediate cash flow, production/inventory costs

COMMISSION: Earning fee/percentage for facilitating transactions between parties
- Examples: Real estate agents, stock brokerages, marketplace platforms (eBay, Etsy)
- Key Indicators: Transaction facilitation, percentage-based fees, partner dependency

ADVERTISING: Monetizing user attention/traffic by selling ad placements and sponsorships
- Examples: Ad-based apps, online media/news sites, social media platforms
- Key Indicators: Free user access, advertiser payments, audience monetization

RENTAL: Granting temporary access to assets/property for fee (not ownership transfer)
- Examples: Equipment rentals, real estate leases, vehicle rentals
- Key Indicators: Temporary access, asset retention, usage-based fees

Step 2 - Apply Revenue Model Decision Logic:

TIMING ANALYSIS:
- One-time payment → Production-Unit-Sales, Fee-for-Service, or Markup-Resell
- Recurring payment → Subscription or Rental
- Transaction-based → Commission or Advertising
- Rights-based → Licensing

VALUE EXCHANGE ANALYSIS:
- Direct product/service delivery → Production-Unit-Sales, Markup-Resell, Fee-for-Service
- Access/usage rights → Subscription, Rental, Licensing
- Facilitation/intermediation → Commission, Advertising

ASSET RELATIONSHIP:
- Own and sell → Production-Unit-Sales, Markup-Resell
- License IP/rights → Licensing
- Facilitate others' transactions → Commission
- Rent/lease assets → Rental
- Provide ongoing access → Subscription
- Monetize attention → Advertising
- Deliver custom work → Fee-for-Service

Step 3 - Validate with Business Characteristics:

REVENUE PREDICTABILITY:
- High: Subscription, Rental, Licensing (recurring)
- Medium: Fee-for-Service (repeat clients), Commission (steady volume)
- Low: Production-Unit-Sales, Markup-Resell, Advertising (market dependent)

SCALABILITY PATTERNS:
- High scalability: Licensing, Subscription, Advertising (low marginal costs)
- Medium scalability: Commission, Rental
- Lower scalability: Fee-for-Service, Production-Unit-Sales, Markup-Resell

CASH FLOW TIMING:
- Immediate: Production-Unit-Sales, Markup-Resell, Fee-for-Service
- Recurring: Subscription, Rental, Licensing
- Variable: Commission, Advertising (tied to performance/market)

Step 4 - Check for Mixed Models:

HYBRID REVENUE COMBINATIONS:
- Freemium + Subscription: Free tier with paid upgrades
- Product + Service: Unit sales with ongoing support/maintenance
- Commission + Advertising: Marketplaces with both transaction fees and ad revenue
- Licensing + Fee-for-Service: IP licensing with implementation consulting

If multiple models apply significantly, identify the PRIMARY revenue source and note others.

ANALYSIS PROCESS:
1. Identify the CORE method of generating revenue
2. Analyze timing (one-time vs recurring vs transaction-based)
3. Determine value exchange mechanism
4. Validate with scalability and cash flow patterns
5. Check for secondary revenue streams
6. Classify based on dominant revenue pattern

Respond with ONLY a valid JSON object in this exact format:
{
  "main": "Subscription",
  "other": ["Advertising"],
  "justification": "Primary revenue through [specific mechanism] with [payment timing] and [value delivery]. Business model shows [scalability characteristics] and [cash flow pattern] which confirms [classification]. Secondary revenue from [other mechanism] represents [percentage/significance]."
}

Rules:
- "main" must be exactly "Fee-for-Service", "Markup-Resell", "Licensing", "Subscription", "Production-Unit-Sales", "Commission", "Advertising", or "Rental"
- "other" must be an array (can be empty [] or contain secondary revenue models)
- "justification" must cite specific revenue mechanism, timing, and validation criteria
- Focus on the PRIMARY source of revenue generation
- Return ONLY the JSON, no other text`;