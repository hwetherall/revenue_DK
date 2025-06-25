export const industryPrompt = (name: string, desc: string) => `
You are an industry analyst using a systematic industry classification framework based on customer-orientation rubrics.

Business Name: ${name}
Business Description: ${desc}

INDUSTRY CLASSIFICATION FRAMEWORK:

Step 1 - Analyze Core Industry Characteristics:

A. PRIMARY INDUSTRIES:
- Power & Energy: Generation, transmission, distribution, storage, and energy services
- Financial/Banking: Financial services, payments, lending, investment, and fintech
- Manufacturing: Production, assembly, components, and industrial services
- Technology: Software, platforms, digital services, and tech infrastructure
- Healthcare: Medical services, pharmaceuticals, devices, and health technology
- Other: Does not fit the specialized rubrics above

Step 2 - Apply Industry-Specific Customer Segmentation:

POWER & ENERGY SEGMENTS:
- Residential/Prosumer: Home-owners, landlords, EV owners with low-medium deal sizes, weeks-months sales cycles
- Commercial & Industrial (C&I): Factories, data centers, big box retailers with high deal sizes, 6-18 month cycles
- Regulated Utility/IPP: Transmission/distribution utilities, Independent Power Producers with very high deal sizes, 1-3 year cycles
- Government & EPC Projects: Ministries, state utilities, EPC contractors with very high deal sizes, 1-4 year cycles
- Microgrid/Community Energy: Community co-ops, campuses, industrial parks with medium deal sizes, 6-12 month cycles

FINANCIAL/BANKING SEGMENTS:
- Retail/Mass Market: Individual depositors, cardholders, borrowers with very low-low deal sizes, minutes-days cycles
- SME Banking: Small & medium enterprise owners with low-medium deal sizes, weeks sales cycles
- Corporate & Investment Banking (CIB): Treasurers, CFOs of large firms with high-very high deal sizes, months cycles
- FinTech/Platform Partnerships: Neo-banks, wallets, marketplaces with low-medium deal sizes, weeks-months cycles
- Public Sector & Development: Central/local government, MDBs with high deal sizes, months-years cycles

MANUFACTURING SEGMENTS:
- OEM/Brand Owner: Automotive, aerospace, electronics brands with high deal sizes, 1-3 year cycles
- Tier 1 System Integrator: Large assemblers serving OEMs with high deal sizes, 1-2 year cycles
- Tier 2/3 Component Supplier: Parts suppliers to Tier 1 or OEMs with medium deal sizes, 6-12 month cycles
- After-market & Services: End user/fleet operators with low-medium deal sizes, days-weeks cycles
- Contract/EMS Manufacturing: Start-ups, brands, OEMs with medium-high deal sizes, 3-12 month cycles

Step 3 - Validate with Business Characteristics:

DEAL SIZE INDICATORS:
- Very Low: <$1K typical transaction
- Low: $1K-$50K per deal
- Medium: $50K-$500K per deal
- High: $500K-$5M per deal
- Very High: $5M+ per deal

SALES CYCLE PATTERNS:
- Minutes-Days: Immediate digital transactions
- Days-Weeks: Short evaluation periods
- Weeks-Months: Medium B2B sales cycles
- Months-Years: Complex enterprise/infrastructure sales

RELATIONSHIP DEPTH:
- Transactional: One-off purchases, minimal ongoing relationship
- Relational: Ongoing account management, repeat business
- Strategic Partnership: Deep integration, joint planning, multi-year contracts
- Community Governance: Stakeholder-driven, consensus-based decisions

ASSET INTENSITY:
- Low: Primarily digital/service-based operations
- Moderate: Some physical assets, mixed digital/physical
- High: Significant physical infrastructure, equipment, or inventory
- Very High: Heavy industrial assets, major infrastructure

REVENUE LOGIC PATTERNS:
- Power & Energy: PPAs, capacity payments, tariff recovery, energy-as-a-service
- Financial: Net interest margin, fees, advisory fees, revenue share, API usage
- Manufacturing: Product margin, IP royalties, cost-plus, service subscriptions
- Technology: SaaS subscriptions, usage-based, platform fees, licensing
- Healthcare: Fee-for-service, insurance reimbursement, device sales, subscriptions

Step 4 - Classification Decision Logic:

PRIMARY INDUSTRY RULES:
1. If involves energy generation, distribution, storage, or grid services → Power & Energy
2. If involves financial services, payments, lending, or capital markets → Financial/Banking
3. If involves physical production, assembly, or industrial manufacturing → Manufacturing
4. If primarily software, platforms, or digital infrastructure → Technology
5. If medical services, pharmaceuticals, or health technology → Healthcare
6. If doesn't fit specialized rubrics → Other

SEGMENT CLASSIFICATION WITHIN INDUSTRY:
- Analyze primary customer type from business description
- Match deal size patterns and sales cycle characteristics
- Validate against relationship depth and asset intensity requirements
- Confirm with typical revenue logic for that segment

ANALYSIS PROCESS:
1. Identify the PRIMARY industry based on core business activities
2. Analyze customer characteristics and deal patterns from description
3. Match to specific segment within industry using rubric criteria
4. Validate classification against typical business characteristics
5. Classify based on best-fit segment pattern

Respond with ONLY a valid JSON object in this exact format:
{
  "main": "Power & Energy - Residential/Prosumer",
  "other": ["Technology"],
  "justification": "Primary business serves [specific customer type] with [deal size] transactions and [sales cycle] patterns. Revenue through [specific mechanism] and [asset intensity] confirms Power & Energy - Residential/Prosumer classification, with some Technology characteristics in [specific area]."
}

Rules:
- "main" must be exactly one of: "Power & Energy - Residential/Prosumer", "Power & Energy - Commercial & Industrial", "Power & Energy - Regulated Utility/IPP", "Power & Energy - Government & EPC Projects", "Power & Energy - Microgrid/Community Energy", "Financial/Banking - Retail/Mass Market", "Financial/Banking - SME Banking", "Financial/Banking - Corporate & Investment Banking", "Financial/Banking - FinTech/Platform Partnerships", "Financial/Banking - Public Sector & Development", "Manufacturing - OEM/Brand Owner", "Manufacturing - Tier 1 System Integrator", "Manufacturing - Tier 2/3 Component Supplier", "Manufacturing - After-market & Services", "Manufacturing - Contract/EMS Manufacturing", "Technology", "Healthcare", "Other"
- "other" must be an array (can be empty [] or contain secondary industry characteristics)
- "justification" must cite specific rubric criteria and evidence from the description
- Focus on WHO the primary customers are and HOW the business operates within industry patterns
- Return ONLY the JSON, no other text`;