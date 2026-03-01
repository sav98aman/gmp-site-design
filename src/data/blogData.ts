export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'ipo-analysis' | 'paper-trading' | 'education' | 'market-insights';
  tags: string[];
  author: string;
  publishedAt: string;
  readTime: number;
  coverGradient: string;
  featured?: boolean;
}

export const blogCategories = [
  { value: 'all', label: 'All Posts' },
  { value: 'ipo-analysis', label: 'IPO Analysis' },
  { value: 'paper-trading', label: 'Paper Trading' },
  { value: 'education', label: 'Education' },
  { value: 'market-insights', label: 'Market Insights' },
];

export const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Hexaware Technologies IPO: Deep Dive Analysis & Verdict",
    slug: "hexaware-technologies-ipo-analysis",
    excerpt: "A comprehensive breakdown of Hexaware's fundamentals, GMP trends, and whether retail investors should apply.",
    content: `## Company Overview

Hexaware Technologies is a leading global IT services company specializing in digital transformation, cloud, and automation solutions for enterprise clients. With a strong presence across North America and Europe, Hexaware has built a reputation for delivering innovative technology solutions.

## Financial Highlights

| Metric | FY2024 | FY2025 (Est.) |
|--------|--------|----------------|
| Revenue | ₹8,200 Cr | ₹9,800 Cr |
| PAT | ₹1,050 Cr | ₹1,280 Cr |
| PAT Margin | 12.8% | 13.1% |
| ROCE | 22.4% | 24.1% |

### Revenue Growth
The company has shown consistent revenue growth of 18-20% YoY, driven by cloud migration deals and digital transformation contracts. Their top 10 clients contribute ~55% of revenue, indicating moderate concentration risk.

## GMP Trend Analysis

The Grey Market Premium for Hexaware has shown a steady upward trajectory:
- **Week 1**: ₹38 (5.4% premium)
- **Week 2**: ₹50 (7.1% premium)  
- **Current**: ₹62 (8.8% premium)

This upward trend indicates growing investor confidence. The consistent rise without sharp spikes suggests organic demand rather than speculative activity.

## Subscription Analysis

| Category | Subscription |
|----------|-------------|
| Retail | 4.2x |
| QIB | 15.8x |
| NII | 8.3x |
| Total | 9.1x |

Strong QIB participation (15.8x) signals institutional confidence. Retail subscription at 4.2x is healthy but not overheated — a positive sign for listing day performance.

## Peer Comparison

Compared to peers like Mphasis (28x PE), Coforge (35x PE), and Persistent (40x PE), Hexaware at ~25x PE offers reasonable valuation with room for re-rating post-listing.

## Risk Factors

1. **Client Concentration**: Top 10 clients contribute 55% revenue
2. **Currency Risk**: ~70% revenue in USD exposes to forex volatility
3. **Competition**: Intense competition from larger IT players
4. **Margin Pressure**: Wage inflation could impact margins

## Our Verdict: BUY ✅

Hexaware offers a compelling risk-reward at current GMP levels. Strong fundamentals, reasonable valuation vs. peers, and healthy subscription numbers make this a **recommended apply** for long-term investors. Short-term traders can expect 8-12% listing gains based on current GMP trajectory.

### Key Takeaways
- Apply for long-term holding (12+ months)
- Expect listing gains of ₹55-70 per share
- Set stop-loss at ₹650 post-listing for risk management`,
    category: "ipo-analysis",
    tags: ["IPO", "IT Services", "Mainboard", "BUY"],
    author: "LiveGMP Research",
    publishedAt: "2026-02-05",
    readTime: 8,
    coverGradient: "from-emerald-500/20 to-cyan-500/20",
    featured: true,
  },
  {
    id: "2",
    title: "Paper Trading 101: Master the Markets Without Risking Real Money",
    slug: "paper-trading-101-guide",
    excerpt: "Learn how to use paper trading to build confidence, test strategies, and understand market mechanics before going live.",
    content: `## What is Paper Trading?

Paper trading is a simulated trading practice where you use virtual money to buy and sell securities. It mirrors real market conditions without any financial risk, making it the perfect training ground for beginners and a useful testing environment for experienced traders.

## Why Paper Trade?

### 1. Zero Financial Risk
With ₹10,00,000 in virtual funds on LiveGMP, you can experiment freely. Make mistakes, learn from them, and refine your strategy — all without losing a single rupee.

### 2. Learn Market Mechanics
Understand how orders work:
- **Market Orders**: Execute immediately at current price
- **Limit Orders**: Execute only at your specified price or better
- **Stop-Loss Orders**: Automatically sell when price drops to your threshold

### 3. Test Trading Strategies
Before deploying real capital, validate your strategies:
- Momentum trading
- Swing trading
- IPO listing day trading
- Options strategies (straddles, strangles)

## Getting Started on LiveGMP Paper Trading

### Step 1: Choose Your Segment
- **Equity (EQ)**: Intraday stock trading
- **CNC**: Delivery-based stock investing
- **Futures (FUT)**: Leveraged contract trading
- **Options (OPT)**: Derivatives with limited risk

### Step 2: Search & Select Stocks
Use the search bar to find any stock. The platform filters results based on your selected segment — equity stocks for EQ/CNC, F&O-enabled stocks for FUT/OPT.

### Step 3: Analyze the Chart
For equity segments, you get a full price chart with buy/sell buttons directly on the chart. Click them to open the order drawer instantly.

### Step 4: Place Your Order
Choose your order type (Market/Limit), set quantity, and execute. The system handles margin calculations automatically.

### Step 5: Monitor Positions
Track your open positions, P&L, and holdings in real-time. Set stop-losses and take-profit levels to practice risk management.

## Pro Tips for Paper Traders

1. **Treat it like real money** — Don't take reckless bets just because it's virtual
2. **Keep a trading journal** — Note every trade's rationale and outcome
3. **Start with one strategy** — Master it before moving to the next
4. **Set realistic position sizes** — Don't buy 1000 lots of Nifty futures
5. **Review weekly** — Analyze your win rate, average profit, and largest loss

## Common Mistakes to Avoid

- ❌ Ignoring stop-losses because "it's not real money"
- ❌ Over-trading (placing 50+ trades/day)
- ❌ Not accounting for slippage and brokerage
- ❌ Switching strategies after every losing trade
- ❌ Comparing paper trading results directly with live trading

## When to Go Live?

You're ready for real trading when:
- You've been consistently profitable for 3+ months
- Your win rate is above 55%
- Your risk-reward ratio is at least 1:2
- You can stick to your trading plan without emotional decisions

Start your paper trading journey today on LiveGMP! 🚀`,
    category: "paper-trading",
    tags: ["Paper Trading", "Beginner", "Strategy", "Guide"],
    author: "LiveGMP Education",
    publishedAt: "2026-02-03",
    readTime: 6,
    coverGradient: "from-violet-500/20 to-fuchsia-500/20",
    featured: true,
  },
  {
    id: "3",
    title: "Understanding GMP: What Grey Market Premium Tells You",
    slug: "understanding-gmp-grey-market-premium",
    excerpt: "Decode the grey market premium and learn how to use it as a signal for IPO investment decisions.",
    content: `## What is GMP?

Grey Market Premium (GMP) is the premium at which IPO shares trade in the unofficial grey market before their official listing on the stock exchange. It's essentially the market's expectation of listing gains.

## How GMP Works

When an IPO's price band is ₹100-110 and the GMP is ₹30, it means:
- **Expected Listing Price**: ₹110 + ₹30 = ₹140
- **Expected Listing Gain**: (₹30/₹110) × 100 = **27.3%**

## GMP as a Signal

### High GMP (>15% of issue price)
- Indicates strong demand and positive market sentiment
- Usually correlates with high subscription numbers
- But can also mean the stock is overhyped

### Moderate GMP (5-15%)
- Healthy demand without excessive speculation
- Often the sweet spot for sustainable listing gains
- Lower risk of post-listing correction

### Low/Negative GMP (<5% or negative)
- Weak demand or market-wide bearishness
- May indicate fundamental concerns
- Could be a buying opportunity if fundamentals are strong

## GMP Trend Patterns

### Rising GMP 📈
Increasingly bullish sentiment. Best scenario for applicants — momentum likely to carry into listing day.

### Falling GMP 📉
Deteriorating sentiment. Consider exiting grey market positions. Listing gains may be lower than expected.

### Volatile GMP 📊
Mixed signals. Wait for trend clarity before making decisions.

## Limitations of GMP

1. **Unofficial Market**: GMP is not regulated by SEBI
2. **Small Sample Size**: Based on limited grey market transactions
3. **Manipulation**: Can be artificially inflated or deflated
4. **Not Guaranteed**: GMP ≠ actual listing price
5. **Changes Rapidly**: Can swing 50%+ in a single day

## How LiveGMP Tracks GMP

We aggregate GMP data from multiple grey market sources, track historical trends, and combine it with fundamental analysis to give you a comprehensive AI verdict for every IPO.

## Best Practices

- Use GMP as **one of many signals**, not the sole decision factor
- Track the **trend** rather than absolute numbers
- Combine with subscription data and peer valuation
- Be cautious of GMP spikes close to listing date`,
    category: "education",
    tags: ["GMP", "IPO", "Education", "Beginner"],
    author: "LiveGMP Research",
    publishedAt: "2026-02-01",
    readTime: 5,
    coverGradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    id: "4",
    title: "Stallion India Fluorochemicals IPO: SME Gem or Risky Bet?",
    slug: "stallion-india-fluorochemicals-ipo-review",
    excerpt: "Analyzing the SME IPO with 12.5x retail subscription and 50% GMP premium. Is the hype justified?",
    content: `## The Buzz

Stallion India Fluorochemicals has taken the SME IPO market by storm with a staggering 12.5x retail subscription. But with a GMP indicating 50% premium, is there still upside left?

## Company Profile

Stallion India operates in the specialty fluorochemicals space, manufacturing products used in:
- Refrigeration gases
- Pharmaceutical intermediates
- Agrochemical compounds
- Industrial solvents

## Why the Excitement?

### 1. Sector Tailwinds
The global fluorochemicals market is expected to grow at 5.8% CAGR through 2030. India's phasedown of HFCs under the Kigali Amendment creates opportunities for next-gen refrigerant manufacturers.

### 2. Small Issue Size
At just ₹162 Cr, the small issue size means limited supply. When demand is high (12.5x retail), the supply-demand mismatch drives up grey market premiums.

### 3. No QIB Participation Yet
Zero QIB subscription (common in SME IPOs) means the stock hasn't attracted institutional attention yet. Post-listing institutional buying could provide additional upside.

## Financials Snapshot

| Metric | Value |
|--------|-------|
| Revenue (FY25) | ₹285 Cr |
| PAT | ₹32 Cr |
| PAT Margin | 11.2% |
| PE Ratio | ~18x |
| Lot Size | 1,600 shares |
| Min Investment | ₹1,36,000 |

## Risk Assessment

### High Risk Factors ⚠️
- **SME Board**: Lower regulatory oversight than Mainboard
- **High Lot Size**: ₹1.36L minimum investment
- **Sector Cyclicality**: Chemical prices are volatile
- **Single Product Risk**: Heavy dependence on refrigerant gases

### Mitigating Factors ✅
- Strong retail demand validates market interest
- Niche sector with limited competition
- Government support for domestic chemical manufacturing

## Our Verdict: BUY (with caution) ⚡

The fundamentals support the premium, but SME IPOs carry inherent risks. Apply with a clear exit strategy — book 50% profits on listing day and hold the rest for 6 months.

**Risk Rating**: 7/10
**Return Potential**: 40-60% listing gains`,
    category: "ipo-analysis",
    tags: ["IPO", "SME", "Chemicals", "BUY"],
    author: "LiveGMP Research",
    publishedAt: "2026-02-06",
    readTime: 7,
    coverGradient: "from-blue-500/20 to-indigo-500/20",
  },
  {
    id: "5",
    title: "Options Trading for Beginners: A Paper Trading Approach",
    slug: "options-trading-beginners-paper-trading",
    excerpt: "Demystify options trading with hands-on practice using our paper trading simulator. Learn calls, puts, and basic strategies.",
    content: `## Why Options?

Options give you the right (not obligation) to buy or sell an asset at a predetermined price. They offer:
- **Leverage**: Control large positions with small capital
- **Hedging**: Protect your portfolio from downside
- **Income**: Generate premium income from writing options

## Options Basics

### Call Options
- Right to **BUY** at strike price
- Profitable when stock goes **UP**
- Max loss = Premium paid

### Put Options
- Right to **SELL** at strike price
- Profitable when stock goes **DOWN**
- Max loss = Premium paid

## Key Terms

| Term | Meaning |
|------|---------|
| Strike Price | The price at which you can exercise |
| Premium | The cost of buying the option |
| Expiry | Date the option contract ends |
| ITM | In-The-Money (has intrinsic value) |
| OTM | Out-of-The-Money (no intrinsic value) |
| ATM | At-The-Money (strike ≈ current price) |

## Practice on LiveGMP

### Step 1: Select OPT Segment
Switch to the Options tab on Paper Trading to see the options chain.

### Step 2: Read the Chain
The options chain shows all available strikes with:
- Call prices on the left
- Put prices on the right
- Strike prices in the center

### Step 3: Start Simple
Begin with buying ATM calls on stocks you're bullish on. Set a mental stop-loss at 50% of premium.

## Beginner Strategies

### 1. Long Call (Bullish)
- Buy a call option
- Risk: Limited (premium)
- Reward: Unlimited

### 2. Long Put (Bearish)
- Buy a put option
- Risk: Limited (premium)
- Reward: Substantial

### 3. Covered Call (Income)
- Own the stock + sell OTM call
- Generates income from premium
- Caps upside potential

## Common Mistakes

- ❌ Buying deep OTM options (lottery tickets)
- ❌ Ignoring time decay (theta)
- ❌ Over-leveraging positions
- ❌ Not understanding Greeks
- ❌ Holding through expiry without a plan

Paper trade at least 100 options trades before using real money. Track your results and learn from every trade! 📊`,
    category: "paper-trading",
    tags: ["Options", "Paper Trading", "Beginner", "Strategy"],
    author: "LiveGMP Education",
    publishedAt: "2026-01-28",
    readTime: 7,
    coverGradient: "from-rose-500/20 to-pink-500/20",
  },
  {
    id: "6",
    title: "Market Outlook 2026: IPO Pipeline & Sector Trends",
    slug: "market-outlook-2026-ipo-pipeline",
    excerpt: "What sectors are dominating the IPO market? A data-driven look at upcoming listings and investment themes.",
    content: `## 2026 IPO Market Overview

The Indian IPO market continues its bull run into 2026, with over ₹50,000 Cr worth of IPOs expected in Q1 alone. Here's what's shaping the landscape.

## Hot Sectors

### 1. Aerospace & Defence 🚀
Government's push for indigenous manufacturing (Atmanirbhar Bharat) is creating a wave of defence IPOs. Companies like Unimech Aerospace are seeing massive premiums.

### 2. Fintech 💳
Post-MobiKwik's blockbuster listing (58% gains), more fintech companies are eyeing public markets. Digital lending and payments remain investor favorites.

### 3. IT Services 💻
Despite global slowdown fears, Indian IT companies continue to attract premium valuations. Cloud migration and AI integration deals are driving revenue growth.

### 4. Specialty Chemicals 🧪
India's position as a China+1 destination for chemical manufacturing is driving IPO activity in this space.

## IPO Pipeline Highlights

| Company | Sector | Expected Size |
|---------|--------|---------------|
| Unimech Aerospace | Defence | ₹500 Cr |
| Ventive Hospitality | Hotels | ₹3,600 Cr |
| Senores Pharma | Pharma | ₹420 Cr |

## Key Trends to Watch

1. **SME IPOs Outperforming**: Average listing gains for SME IPOs are 35% vs 22% for Mainboard
2. **QIB Dominance**: Institutional subscription is becoming the key indicator of listing performance
3. **GMP Accuracy**: GMP predictions have been within 5% of actual listing price for 78% of IPOs
4. **Sector Rotation**: Investors rotating from IT to defence and manufacturing themes

## Investment Strategy

### For Aggressive Investors
- Focus on SME IPOs with 10%+ GMP
- Apply in all defence sector IPOs
- Book partial profits on listing day

### For Conservative Investors
- Stick to Mainboard IPOs with BUY verdict
- Look for 5x+ QIB subscription
- Hold for minimum 3 months post-listing

## Risk Factors

- Global recession fears could dampen sentiment
- SEBI's increased scrutiny on SME IPOs
- Rising interest rates may impact valuations
- Geopolitical tensions affecting FII flows

Stay updated with LiveGMP for real-time analysis of every upcoming IPO! 📈`,
    category: "market-insights",
    tags: ["Market", "2026", "Trends", "Strategy"],
    author: "LiveGMP Research",
    publishedAt: "2026-01-25",
    readTime: 6,
    coverGradient: "from-teal-500/20 to-emerald-500/20",
  },
];

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return mockBlogPosts.find(post => post.slug === slug);
}

export function getBlogsByCategory(category: string): BlogPost[] {
  if (category === 'all') return mockBlogPosts;
  return mockBlogPosts.filter(post => post.category === category);
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  return mockBlogPosts
    .filter(p => p.id !== post.id && (p.category === post.category || p.tags.some(t => post.tags.includes(t))))
    .slice(0, limit);
}
