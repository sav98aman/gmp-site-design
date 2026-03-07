export interface Chapter {
  id: number;
  title: string;
  duration: string;
  isFree: boolean;
}

export interface LearningModule {
  id: number;
  title: string;
  slug: string;
  chapters: number;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  hasVideos: boolean;
  hasHindi: boolean;
  chapterList: Chapter[];
}

const introChapters: Chapter[] = [
  { id: 1, title: "The Need to Invest", duration: "8 min", isFree: true },
  { id: 2, title: "Regulators and Participants", duration: "10 min", isFree: true },
  { id: 3, title: "Understanding Stock Exchanges", duration: "12 min", isFree: true },
  { id: 4, title: "What Influences Stock Prices", duration: "9 min", isFree: false },
  { id: 5, title: "How to Open a Demat Account", duration: "7 min", isFree: false },
  { id: 6, title: "IPO Process Explained", duration: "11 min", isFree: false },
  { id: 7, title: "Placing Your First Order", duration: "8 min", isFree: false },
  { id: 8, title: "Understanding Market Orders & Limit Orders", duration: "10 min", isFree: false },
  { id: 9, title: "Settlement Cycle (T+1)", duration: "7 min", isFree: false },
  { id: 10, title: "Understanding Indices — Nifty & Sensex", duration: "12 min", isFree: false },
  { id: 11, title: "Sectoral & Thematic Indices", duration: "9 min", isFree: false },
  { id: 12, title: "Clearing & Settlement Process", duration: "11 min", isFree: false },
  { id: 13, title: "Corporate Actions — Dividends & Splits", duration: "10 min", isFree: false },
  { id: 14, title: "Understanding Market Capitalization", duration: "8 min", isFree: false },
  { id: 15, title: "Getting Started Checklist", duration: "5 min", isFree: false },
];

const taChapters: Chapter[] = [
  { id: 1, title: "Introduction to Technical Analysis", duration: "10 min", isFree: true },
  { id: 2, title: "Types of Charts — Line, Bar, Candlestick", duration: "12 min", isFree: true },
  { id: 3, title: "Understanding Candlestick Anatomy", duration: "9 min", isFree: true },
  { id: 4, title: "Single Candlestick Patterns — Marubozu", duration: "11 min", isFree: false },
  { id: 5, title: "Single Candlestick Patterns — Hammer & Hanging Man", duration: "10 min", isFree: false },
  { id: 6, title: "Single Candlestick Patterns — Shooting Star", duration: "8 min", isFree: false },
  { id: 7, title: "Multi-Candlestick Patterns — Engulfing", duration: "12 min", isFree: false },
  { id: 8, title: "Multi-Candlestick Patterns — Harami", duration: "9 min", isFree: false },
  { id: 9, title: "Morning Star & Evening Star", duration: "11 min", isFree: false },
  { id: 10, title: "Support & Resistance Basics", duration: "14 min", isFree: false },
  { id: 11, title: "Trendlines & Channels", duration: "10 min", isFree: false },
  { id: 12, title: "Moving Averages — SMA & EMA", duration: "13 min", isFree: false },
  { id: 13, title: "Moving Average Crossovers", duration: "9 min", isFree: false },
  { id: 14, title: "Relative Strength Index (RSI)", duration: "12 min", isFree: false },
  { id: 15, title: "MACD — Moving Average Convergence Divergence", duration: "14 min", isFree: false },
  { id: 16, title: "Bollinger Bands", duration: "11 min", isFree: false },
  { id: 17, title: "Volume Analysis", duration: "10 min", isFree: false },
  { id: 18, title: "Fibonacci Retracements", duration: "13 min", isFree: false },
  { id: 19, title: "Dow Theory", duration: "12 min", isFree: false },
  { id: 20, title: "Chart Patterns — Head & Shoulders", duration: "11 min", isFree: false },
  { id: 21, title: "Chart Patterns — Triangles & Flags", duration: "10 min", isFree: false },
  { id: 22, title: "Putting It All Together — Checklist", duration: "8 min", isFree: false },
];

const faChapters: Chapter[] = [
  { id: 1, title: "Introduction to Fundamental Analysis", duration: "9 min", isFree: true },
  { id: 2, title: "How to Read an Annual Report", duration: "14 min", isFree: true },
  { id: 3, title: "Understanding the Balance Sheet", duration: "16 min", isFree: true },
  { id: 4, title: "Understanding the P&L Statement", duration: "13 min", isFree: false },
  { id: 5, title: "Cash Flow Statement Explained", duration: "12 min", isFree: false },
  { id: 6, title: "Financial Ratios — Profitability", duration: "11 min", isFree: false },
  { id: 7, title: "Financial Ratios — Leverage & Solvency", duration: "10 min", isFree: false },
  { id: 8, title: "Financial Ratios — Valuation (P/E, P/B)", duration: "13 min", isFree: false },
  { id: 9, title: "Return on Equity (ROE) Deep Dive", duration: "10 min", isFree: false },
  { id: 10, title: "Earnings Per Share & Dilution", duration: "9 min", isFree: false },
  { id: 11, title: "Evaluating Management Quality", duration: "11 min", isFree: false },
  { id: 12, title: "Industry & Competitive Analysis", duration: "12 min", isFree: false },
  { id: 13, title: "DCF Valuation — Part 1", duration: "15 min", isFree: false },
  { id: 14, title: "DCF Valuation — Part 2", duration: "14 min", isFree: false },
  { id: 15, title: "Relative Valuation & Peer Comparison", duration: "10 min", isFree: false },
  { id: 16, title: "Building a Stock Research Checklist", duration: "8 min", isFree: false },
];

const futuresChapters: Chapter[] = [
  { id: 1, title: "Introduction to Derivatives", duration: "10 min", isFree: true },
  { id: 2, title: "Forwards vs Futures", duration: "8 min", isFree: true },
  { id: 3, title: "How Futures Contracts Work", duration: "12 min", isFree: true },
  { id: 4, title: "Futures Pricing & Fair Value", duration: "11 min", isFree: false },
  { id: 5, title: "Understanding Margins — Initial & Maintenance", duration: "13 min", isFree: false },
  { id: 6, title: "Mark to Market Settlement", duration: "9 min", isFree: false },
  { id: 7, title: "Leverage & Its Risks", duration: "10 min", isFree: false },
  { id: 8, title: "Lot Sizes & Contract Specifications", duration: "7 min", isFree: false },
  { id: 9, title: "Open Interest & Its Significance", duration: "11 min", isFree: false },
  { id: 10, title: "Hedging with Futures", duration: "12 min", isFree: false },
  { id: 11, title: "Spread Trading Strategies", duration: "10 min", isFree: false },
  { id: 12, title: "Index Futures (Nifty & Bank Nifty)", duration: "9 min", isFree: false },
  { id: 13, title: "Practical Futures Trading Checklist", duration: "6 min", isFree: false },
];

const optionsChapters: Chapter[] = [
  { id: 1, title: "What Are Options?", duration: "9 min", isFree: true },
  { id: 2, title: "Call Options Explained", duration: "11 min", isFree: true },
  { id: 3, title: "Put Options Explained", duration: "10 min", isFree: true },
  { id: 4, title: "Buying vs Selling Options", duration: "12 min", isFree: false },
  { id: 5, title: "Strike Price & Moneyness (ITM, ATM, OTM)", duration: "10 min", isFree: false },
  { id: 6, title: "Intrinsic Value vs Time Value", duration: "9 min", isFree: false },
  { id: 7, title: "Option Premium — What Drives It?", duration: "11 min", isFree: false },
  { id: 8, title: "Call Option P&L Payoff", duration: "8 min", isFree: false },
  { id: 9, title: "Put Option P&L Payoff", duration: "8 min", isFree: false },
  { id: 10, title: "Introduction to Option Greeks", duration: "13 min", isFree: false },
  { id: 11, title: "Delta — Sensitivity to Price", duration: "12 min", isFree: false },
  { id: 12, title: "Gamma — Rate of Change of Delta", duration: "10 min", isFree: false },
  { id: 13, title: "Theta — Time Decay", duration: "11 min", isFree: false },
  { id: 14, title: "Vega — Volatility Sensitivity", duration: "10 min", isFree: false },
  { id: 15, title: "Rho — Interest Rate Sensitivity", duration: "7 min", isFree: false },
  { id: 16, title: "Black-Scholes Pricing Model", duration: "15 min", isFree: false },
  { id: 17, title: "Implied Volatility Explained", duration: "12 min", isFree: false },
  { id: 18, title: "Historical vs Implied Volatility", duration: "10 min", isFree: false },
  { id: 19, title: "Volatility Smile & Skew", duration: "9 min", isFree: false },
  { id: 20, title: "Option Chain Reading", duration: "11 min", isFree: false },
  { id: 21, title: "Open Interest Analysis for Options", duration: "10 min", isFree: false },
  { id: 22, title: "Max Pain Theory", duration: "8 min", isFree: false },
  { id: 23, title: "Weekly vs Monthly Options", duration: "9 min", isFree: false },
  { id: 24, title: "Exercising & Assignment", duration: "7 min", isFree: false },
  { id: 25, title: "Options Trading Checklist", duration: "6 min", isFree: false },
];

const optionStrategiesChapters: Chapter[] = [
  { id: 1, title: "Why Use Options Strategies?", duration: "8 min", isFree: true },
  { id: 2, title: "Bull Call Spread", duration: "12 min", isFree: true },
  { id: 3, title: "Bear Put Spread", duration: "11 min", isFree: true },
  { id: 4, title: "Bull Put Spread (Credit Spread)", duration: "10 min", isFree: false },
  { id: 5, title: "Bear Call Spread (Credit Spread)", duration: "10 min", isFree: false },
  { id: 6, title: "Long Straddle", duration: "12 min", isFree: false },
  { id: 7, title: "Short Straddle", duration: "11 min", isFree: false },
  { id: 8, title: "Long Strangle", duration: "10 min", isFree: false },
  { id: 9, title: "Short Strangle", duration: "10 min", isFree: false },
  { id: 10, title: "Iron Condor", duration: "14 min", isFree: false },
  { id: 11, title: "Iron Butterfly", duration: "12 min", isFree: false },
  { id: 12, title: "Covered Call Strategy", duration: "9 min", isFree: false },
  { id: 13, title: "Protective Put Strategy", duration: "9 min", isFree: false },
  { id: 14, title: "Choosing the Right Strategy — Framework", duration: "11 min", isFree: false },
];

const taxChapters: Chapter[] = [
  { id: 1, title: "Taxation Basics for Traders", duration: "9 min", isFree: true },
  { id: 2, title: "Short-Term vs Long-Term Capital Gains", duration: "10 min", isFree: true },
  { id: 3, title: "STT, CTT & Other Charges", duration: "8 min", isFree: false },
  { id: 4, title: "Calculating Turnover for F&O", duration: "11 min", isFree: false },
  { id: 5, title: "Tax Audit Requirements", duration: "9 min", isFree: false },
  { id: 6, title: "Preparing P&L and Balance Sheet", duration: "12 min", isFree: false },
  { id: 7, title: "ITR Filing for Traders", duration: "10 min", isFree: false },
  { id: 8, title: "Advance Tax & Due Dates", duration: "7 min", isFree: false },
];

const currencyChapters: Chapter[] = [
  { id: 1, title: "Introduction to Currency Markets", duration: "10 min", isFree: true },
  { id: 2, title: "How Forex Pairs Work (USD/INR)", duration: "11 min", isFree: true },
  { id: 3, title: "Currency Futures in India", duration: "12 min", isFree: true },
  { id: 4, title: "Factors Affecting Exchange Rates", duration: "10 min", isFree: false },
  { id: 5, title: "RBI's Role in Currency Markets", duration: "9 min", isFree: false },
  { id: 6, title: "Introduction to Commodity Markets", duration: "11 min", isFree: false },
  { id: 7, title: "Trading Gold Futures", duration: "10 min", isFree: false },
  { id: 8, title: "Trading Crude Oil Futures", duration: "12 min", isFree: false },
  { id: 9, title: "Natural Gas & Base Metals", duration: "9 min", isFree: false },
  { id: 10, title: "Commodity Exchanges — MCX & NCDEX", duration: "8 min", isFree: false },
  { id: 11, title: "Agricultural Commodities", duration: "10 min", isFree: false },
  { id: 12, title: "Supply & Demand Fundamentals", duration: "11 min", isFree: false },
  { id: 13, title: "Seasonality in Commodities", duration: "9 min", isFree: false },
  { id: 14, title: "Government Securities (G-Sec) Basics", duration: "12 min", isFree: false },
  { id: 15, title: "Bond Pricing & Yield", duration: "13 min", isFree: false },
  { id: 16, title: "Yield Curve Explained", duration: "10 min", isFree: false },
  { id: 17, title: "RBI Bond Auctions", duration: "8 min", isFree: false },
  { id: 18, title: "Trading G-Secs on Exchanges", duration: "9 min", isFree: false },
  { id: 19, title: "Interest Rate Futures", duration: "11 min", isFree: false },
  { id: 20, title: "Macro View — Connecting All Markets", duration: "14 min", isFree: false },
];

const riskChapters: Chapter[] = [
  { id: 1, title: "What Is Risk in Trading?", duration: "8 min", isFree: true },
  { id: 2, title: "Types of Risk — Systematic vs Unsystematic", duration: "10 min", isFree: true },
  { id: 3, title: "Position Sizing Techniques", duration: "12 min", isFree: true },
  { id: 4, title: "Stop Loss — Types and Placement", duration: "11 min", isFree: false },
  { id: 5, title: "Risk-Reward Ratio", duration: "9 min", isFree: false },
  { id: 6, title: "Maximum Drawdown & Recovery", duration: "10 min", isFree: false },
  { id: 7, title: "Portfolio Risk & Diversification", duration: "12 min", isFree: false },
  { id: 8, title: "Value at Risk (VaR) Simplified", duration: "11 min", isFree: false },
  { id: 9, title: "Hedging Strategies Overview", duration: "10 min", isFree: false },
  { id: 10, title: "Psychology of Losses", duration: "9 min", isFree: false },
  { id: 11, title: "Overcoming Fear & Greed", duration: "10 min", isFree: false },
  { id: 12, title: "Building a Trading Journal", duration: "8 min", isFree: false },
  { id: 13, title: "Cognitive Biases in Trading", duration: "12 min", isFree: false },
  { id: 14, title: "Discipline & Routine", duration: "7 min", isFree: false },
  { id: 15, title: "Dealing with Losing Streaks", duration: "9 min", isFree: false },
  { id: 16, title: "Risk Management Checklist", duration: "6 min", isFree: false },
];

const tradingSystemsChapters: Chapter[] = [
  { id: 1, title: "What Is a Trading System?", duration: "9 min", isFree: true },
  { id: 2, title: "Discretionary vs Systematic Trading", duration: "10 min", isFree: true },
  { id: 3, title: "Components of a Trading System", duration: "12 min", isFree: true },
  { id: 4, title: "Entry & Exit Rules", duration: "10 min", isFree: false },
  { id: 5, title: "Backtesting Your Strategy", duration: "14 min", isFree: false },
  { id: 6, title: "Walk-Forward Analysis", duration: "11 min", isFree: false },
  { id: 7, title: "Key Performance Metrics (Sharpe, Sortino)", duration: "12 min", isFree: false },
  { id: 8, title: "Curve Fitting & Overfitting", duration: "10 min", isFree: false },
  { id: 9, title: "Trend Following Systems", duration: "11 min", isFree: false },
  { id: 10, title: "Mean Reversion Systems", duration: "10 min", isFree: false },
  { id: 11, title: "Momentum-Based Systems", duration: "9 min", isFree: false },
  { id: 12, title: "Breakout Trading Systems", duration: "10 min", isFree: false },
  { id: 13, title: "Introduction to Algo Trading", duration: "13 min", isFree: false },
  { id: 14, title: "APIs & Automation Basics", duration: "12 min", isFree: false },
  { id: 15, title: "Paper Trading Your System", duration: "8 min", isFree: false },
  { id: 16, title: "Going Live — Deployment Checklist", duration: "7 min", isFree: false },
];

const personalFinanceChapters: Chapter[] = [
  { id: 1, title: "Why Personal Finance Matters", duration: "7 min", isFree: true },
  { id: 2, title: "Setting Financial Goals", duration: "9 min", isFree: true },
  { id: 3, title: "Budgeting Basics (50/30/20 Rule)", duration: "8 min", isFree: true },
  { id: 4, title: "Emergency Fund Planning", duration: "7 min", isFree: false },
  { id: 5, title: "Understanding Inflation's Impact", duration: "9 min", isFree: false },
  { id: 6, title: "Power of Compounding", duration: "8 min", isFree: false },
  { id: 7, title: "Introduction to Mutual Funds", duration: "10 min", isFree: false },
  { id: 8, title: "Types of Mutual Funds", duration: "12 min", isFree: false },
  { id: 9, title: "SIP — Systematic Investment Plan", duration: "9 min", isFree: false },
  { id: 10, title: "Lumpsum vs SIP Investing", duration: "8 min", isFree: false },
  { id: 11, title: "Direct vs Regular Plans", duration: "7 min", isFree: false },
  { id: 12, title: "Expense Ratio & Its Impact", duration: "8 min", isFree: false },
  { id: 13, title: "Large Cap Funds", duration: "9 min", isFree: false },
  { id: 14, title: "Mid Cap & Small Cap Funds", duration: "10 min", isFree: false },
  { id: 15, title: "Flexi Cap & Multi Cap Funds", duration: "8 min", isFree: false },
  { id: 16, title: "Index Funds & ETFs", duration: "11 min", isFree: false },
  { id: 17, title: "Sectoral & Thematic Funds", duration: "9 min", isFree: false },
  { id: 18, title: "Debt Mutual Funds", duration: "10 min", isFree: false },
  { id: 19, title: "Liquid Funds & Overnight Funds", duration: "7 min", isFree: false },
  { id: 20, title: "Hybrid Funds (Balanced Advantage)", duration: "9 min", isFree: false },
  { id: 21, title: "ELSS — Tax Saving Funds", duration: "8 min", isFree: false },
  { id: 22, title: "How to Select a Mutual Fund", duration: "12 min", isFree: false },
  { id: 23, title: "Fund Fact Sheet Analysis", duration: "10 min", isFree: false },
  { id: 24, title: "Bonds & Fixed Income Basics", duration: "11 min", isFree: false },
  { id: 25, title: "PPF, EPF & VPF", duration: "9 min", isFree: false },
  { id: 26, title: "Sovereign Gold Bonds (SGB)", duration: "8 min", isFree: false },
  { id: 27, title: "REITs & InvITs", duration: "10 min", isFree: false },
  { id: 28, title: "Retirement Planning Framework", duration: "12 min", isFree: false },
  { id: 29, title: "Asset Allocation Strategies", duration: "11 min", isFree: false },
  { id: 30, title: "Rebalancing Your Portfolio", duration: "8 min", isFree: false },
  { id: 31, title: "Tax Planning for Investments", duration: "10 min", isFree: false },
  { id: 32, title: "Building Your Financial Plan", duration: "9 min", isFree: false },
];

const tradingPsychChapters: Chapter[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  title: [
    "The Trader's Mindset", "Emotional Intelligence in Markets", "Understanding Cognitive Biases",
    "Confirmation Bias in Trading", "Overconfidence Effect", "Anchoring Bias & Price Targets",
    "Loss Aversion — Why Losses Hurt More", "Sunk Cost Fallacy in Positions", "Herd Mentality & FOMO",
    "Recency Bias & Market Memory", "Availability Heuristic", "Gambler's Fallacy",
    "Status Quo Bias & Holding Too Long", "Endowment Effect in Portfolios", "Hindsight Bias",
    "Self-Attribution Bias", "Disposition Effect — Selling Winners Too Early",
    "Mental Accounting in Trading", "Narrative Fallacy & Stock Stories", "Decision Fatigue",
    "Building Mental Resilience", "Meditation & Focus for Traders", "Developing Patience",
    "Process Over Outcome Thinking", "Accepting Uncertainty", "Managing Winning Streaks",
    "Recovering from Blowups", "Building Healthy Trading Habits", "The Role of Rest & Recovery",
    "Creating Your Psychological Trading Plan",
  ][i],
  duration: `${7 + (i % 6)} min`,
  isFree: i < 3,
}));

const financialModellingChapters: Chapter[] = [
  { id: 1, title: "What Is Financial Modelling?", duration: "9 min", isFree: true },
  { id: 2, title: "Structure of an Integrated Model", duration: "12 min", isFree: true },
  { id: 3, title: "Revenue Projection Techniques", duration: "14 min", isFree: true },
  { id: 4, title: "Cost Structure & Margin Analysis", duration: "11 min", isFree: false },
  { id: 5, title: "Building the Income Statement Model", duration: "15 min", isFree: false },
  { id: 6, title: "Working Capital Modelling", duration: "12 min", isFree: false },
  { id: 7, title: "Fixed Asset & Depreciation Schedule", duration: "10 min", isFree: false },
  { id: 8, title: "Debt Schedule & Interest Calculations", duration: "13 min", isFree: false },
  { id: 9, title: "Building the Balance Sheet Model", duration: "14 min", isFree: false },
  { id: 10, title: "Cash Flow Statement Modelling", duration: "12 min", isFree: false },
  { id: 11, title: "Linking the Three Statements", duration: "16 min", isFree: false },
  { id: 12, title: "DCF Valuation Model — Part 1", duration: "15 min", isFree: false },
  { id: 13, title: "DCF Valuation Model — Part 2", duration: "14 min", isFree: false },
  { id: 14, title: "WACC Calculation", duration: "12 min", isFree: false },
  { id: 15, title: "Sensitivity & Scenario Analysis", duration: "11 min", isFree: false },
  { id: 16, title: "Comparable Company Analysis", duration: "13 min", isFree: false },
  { id: 17, title: "Precedent Transaction Analysis", duration: "10 min", isFree: false },
  { id: 18, title: "Presenting Your Financial Model", duration: "8 min", isFree: false },
];

const insuranceChapters: Chapter[] = [
  { id: 1, title: "Why Insurance Is Essential", duration: "7 min", isFree: true },
  { id: 2, title: "Term Life Insurance Explained", duration: "10 min", isFree: true },
  { id: 3, title: "Health Insurance Basics", duration: "9 min", isFree: true },
  { id: 4, title: "Choosing the Right Sum Assured", duration: "8 min", isFree: false },
  { id: 5, title: "Riders & Add-Ons", duration: "7 min", isFree: false },
  { id: 6, title: "ULIPs — Are They Worth It?", duration: "10 min", isFree: false },
  { id: 7, title: "General Insurance (Motor, Travel, Home)", duration: "9 min", isFree: false },
  { id: 8, title: "Claim Settlement Process", duration: "8 min", isFree: false },
  { id: 9, title: "Insurance Planning Checklist", duration: "6 min", isFree: false },
];

const sectorChapters: Chapter[] = [
  { id: 1, title: "Why Sector Analysis Matters", duration: "8 min", isFree: true },
  { id: 2, title: "Banking Sector — Key Metrics (NIM, NPA)", duration: "14 min", isFree: true },
  { id: 3, title: "NBFC Sector Analysis", duration: "12 min", isFree: true },
  { id: 4, title: "IT Services Sector", duration: "11 min", isFree: false },
  { id: 5, title: "Pharmaceutical Sector", duration: "12 min", isFree: false },
  { id: 6, title: "FMCG Sector — Consumer Staples", duration: "10 min", isFree: false },
  { id: 7, title: "Automobile Sector", duration: "11 min", isFree: false },
  { id: 8, title: "Real Estate & Construction", duration: "10 min", isFree: false },
  { id: 9, title: "Metals & Mining", duration: "9 min", isFree: false },
  { id: 10, title: "Energy & Power Sector", duration: "11 min", isFree: false },
  { id: 11, title: "Telecom Sector", duration: "9 min", isFree: false },
  { id: 12, title: "Insurance Sector Analysis", duration: "10 min", isFree: false },
  { id: 13, title: "Cement Sector", duration: "8 min", isFree: false },
  { id: 14, title: "Chemical Sector", duration: "10 min", isFree: false },
  { id: 15, title: "New-Age Tech Companies", duration: "11 min", isFree: false },
  { id: 16, title: "Sector Rotation Strategy", duration: "12 min", isFree: false },
  { id: 17, title: "Building a Sector-Based Watchlist", duration: "7 min", isFree: false },
];

const ipoChapters: Chapter[] = [
  { id: 1, title: "What Is an IPO?", duration: "8 min", isFree: true },
  { id: 2, title: "Types of IPOs — Fresh Issue vs OFS", duration: "9 min", isFree: true },
  { id: 3, title: "The IPO Process — From Filing to Listing", duration: "12 min", isFree: true },
  { id: 4, title: "Reading the DRHP/RHP", duration: "14 min", isFree: false },
  { id: 5, title: "Understanding GMP (Grey Market Premium)", duration: "10 min", isFree: false },
  { id: 6, title: "How IPO Allotment Works", duration: "9 min", isFree: false },
  { id: 7, title: "Subscription Categories (RII, NII, QIB)", duration: "11 min", isFree: false },
  { id: 8, title: "Applying Through ASBA & UPI", duration: "8 min", isFree: false },
  { id: 9, title: "Listing Day Strategy", duration: "10 min", isFree: false },
  { id: 10, title: "Evaluating IPO Valuations", duration: "12 min", isFree: false },
  { id: 11, title: "SME IPOs — Opportunities & Risks", duration: "11 min", isFree: false },
  { id: 12, title: "IPO Investing Checklist", duration: "6 min", isFree: false },
];

const npsChapters: Chapter[] = [
  { id: 1, title: "What Is NPS?", duration: "8 min", isFree: true },
  { id: 2, title: "NPS Tier 1 vs Tier 2 Accounts", duration: "10 min", isFree: true },
  { id: 3, title: "Asset Classes in NPS (E, C, G, A)", duration: "9 min", isFree: true },
  { id: 4, title: "Choosing a Pension Fund Manager", duration: "8 min", isFree: false },
  { id: 5, title: "Active Choice vs Auto Choice", duration: "7 min", isFree: false },
  { id: 6, title: "Tax Benefits Under 80CCD(1) & 80CCD(1B)", duration: "10 min", isFree: false },
  { id: 7, title: "NPS vs PPF vs ELSS — Comparison", duration: "12 min", isFree: false },
  { id: 8, title: "Withdrawal & Exit Rules", duration: "9 min", isFree: false },
  { id: 9, title: "Is NPS Right for You?", duration: "7 min", isFree: false },
];

export const learningModules: LearningModule[] = [
  {
    id: 1, title: "Introduction to Stock Markets", slug: "intro-stock-markets", chapters: 15,
    description: "Begin your investing journey by understanding how stock markets work, the role of exchanges like NSE and BSE, how shares are listed and traded, and the key participants that keep the market running smoothly.",
    icon: "📈", color: "text-emerald-500", gradient: "from-emerald-500/20 to-emerald-600/5",
    difficulty: "Beginner", hasVideos: true, hasHindi: true, chapterList: introChapters,
  },
  {
    id: 2, title: "Technical Analysis", slug: "technical-analysis", chapters: 22,
    description: "Learn to read price charts, identify candlestick patterns, use moving averages, RSI, MACD, and other indicators to time your trades better and spot potential entry and exit points.",
    icon: "📊", color: "text-blue-500", gradient: "from-blue-500/20 to-blue-600/5",
    difficulty: "Intermediate", hasVideos: true, hasHindi: true, chapterList: taChapters,
  },
  {
    id: 3, title: "Fundamental Analysis", slug: "fundamental-analysis", chapters: 16,
    description: "Dive deep into financial statements, balance sheets, and income reports. Learn to calculate key ratios like P/E, ROE, and debt-to-equity to evaluate a company's true worth for long-term investments.",
    icon: "🔍", color: "text-violet-500", gradient: "from-violet-500/20 to-violet-600/5",
    difficulty: "Intermediate", hasVideos: true, hasHindi: true, chapterList: faChapters,
  },
  {
    id: 4, title: "Futures Trading", slug: "futures-trading", chapters: 13,
    description: "Understand how futures contracts work in derivatives markets. Learn about margin requirements, leverage, lot sizes, contract expiry, and how to use futures for speculation and hedging.",
    icon: "⚡", color: "text-amber-500", gradient: "from-amber-500/20 to-amber-600/5",
    difficulty: "Intermediate", hasVideos: true, hasHindi: true, chapterList: futuresChapters,
  },
  {
    id: 5, title: "Options Trading Essentials", slug: "options-trading", chapters: 25,
    description: "Master options contracts — calls, puts, strike prices, premiums, and expiry. Understand intrinsic vs time value, options pricing models, and how to construct basic options trades.",
    icon: "🎯", color: "text-rose-500", gradient: "from-rose-500/20 to-rose-600/5",
    difficulty: "Advanced", hasVideos: true, hasHindi: true, chapterList: optionsChapters,
  },
  {
    id: 6, title: "Options Strategies", slug: "options-strategies", chapters: 14,
    description: "Explore multi-leg strategies like straddles, strangles, iron condors, and spreads. Learn when to deploy each strategy based on market outlook, volatility, and risk tolerance.",
    icon: "♟️", color: "text-cyan-500", gradient: "from-cyan-500/20 to-cyan-600/5",
    difficulty: "Advanced", hasVideos: false, hasHindi: true, chapterList: optionStrategiesChapters,
  },
  {
    id: 7, title: "Markets & Taxation", slug: "markets-taxation", chapters: 8,
    description: "Navigate the tax implications of your trades and investments in India. Understand short-term and long-term capital gains, STT, turnover calculations, and how to file ITR as a trader.",
    icon: "🧾", color: "text-orange-500", gradient: "from-orange-500/20 to-orange-600/5",
    difficulty: "Beginner", hasVideos: false, hasHindi: true, chapterList: taxChapters,
  },
  {
    id: 8, title: "Currency & Commodity Markets", slug: "currency-commodity", chapters: 20,
    description: "Learn about trading in currency pairs (USD/INR), commodity futures (gold, crude oil, natural gas), and government securities. Understand how global macro factors drive these markets.",
    icon: "🌍", color: "text-teal-500", gradient: "from-teal-500/20 to-teal-600/5",
    difficulty: "Intermediate", hasVideos: false, hasHindi: true, chapterList: currencyChapters,
  },
  {
    id: 9, title: "Risk Management & Trading Psychology", slug: "risk-management", chapters: 16,
    description: "Develop the mental framework for disciplined trading. Learn position sizing, stop-loss placement, risk-reward ratios, and how to manage emotions like fear and greed in volatile markets.",
    icon: "🧠", color: "text-pink-500", gradient: "from-pink-500/20 to-pink-600/5",
    difficulty: "Beginner", hasVideos: false, hasHindi: true, chapterList: riskChapters,
  },
  {
    id: 10, title: "Building Trading Systems", slug: "trading-systems", chapters: 16,
    description: "Design and backtest your own trading systems. Learn about rule-based strategies, algorithmic trading basics, performance metrics, and how to optimize a trading system for consistency.",
    icon: "⚙️", color: "text-indigo-500", gradient: "from-indigo-500/20 to-indigo-600/5",
    difficulty: "Advanced", hasVideos: false, hasHindi: true, chapterList: tradingSystemsChapters,
  },
  {
    id: 11, title: "Personal Finance & Mutual Funds", slug: "personal-finance", chapters: 32,
    description: "Plan your financial future with goal-based investing. Covers SIPs, mutual fund categories, ETFs, debt instruments, retirement planning, and building a diversified long-term portfolio.",
    icon: "💰", color: "text-green-500", gradient: "from-green-500/20 to-green-600/5",
    difficulty: "Beginner", hasVideos: false, hasHindi: true, chapterList: personalFinanceChapters,
  },
  {
    id: 12, title: "Trading Psychology Deep Dive", slug: "trading-psychology", chapters: 30,
    description: "Explore the behavioral biases that affect traders — overconfidence, loss aversion, herd mentality, and more. Learn frameworks to stay rational and consistent in your trading decisions.",
    icon: "🧘", color: "text-purple-500", gradient: "from-purple-500/20 to-purple-600/5",
    difficulty: "Intermediate", hasVideos: false, hasHindi: false, chapterList: tradingPsychChapters,
  },
  {
    id: 13, title: "Financial Modelling", slug: "financial-modelling", chapters: 18,
    description: "Build integrated financial models from scratch. Learn to project revenues, model debt schedules, create cash flow statements, and perform DCF valuations to estimate a company's fair value.",
    icon: "📐", color: "text-sky-500", gradient: "from-sky-500/20 to-sky-600/5",
    difficulty: "Advanced", hasVideos: false, hasHindi: false, chapterList: financialModellingChapters,
  },
  {
    id: 14, title: "Insurance & Protection Planning", slug: "insurance-planning", chapters: 9,
    description: "Understand why insurance is a critical pillar of financial planning. Compare term life, health, and general insurance products, and learn how to choose adequate coverage for your family.",
    icon: "🛡️", color: "text-lime-500", gradient: "from-lime-500/20 to-lime-600/5",
    difficulty: "Beginner", hasVideos: false, hasHindi: false, chapterList: insuranceChapters,
  },
  {
    id: 15, title: "Sector Analysis", slug: "sector-analysis", chapters: 17,
    description: "Each industry sector has unique drivers. Learn what metrics matter for banking, IT, pharma, FMCG, auto, and other sectors to make informed sector rotation and stock-picking decisions.",
    icon: "🏭", color: "text-yellow-500", gradient: "from-yellow-500/20 to-yellow-600/5",
    difficulty: "Advanced", hasVideos: false, hasHindi: false, chapterList: sectorChapters,
  },
  {
    id: 16, title: "IPO Investing Guide", slug: "ipo-investing", chapters: 12,
    description: "Everything about IPO investing — reading a DRHP, analysing GMP, understanding allotment process, listing day strategies, and evaluating whether an IPO is worth subscribing to.",
    icon: "🚀", color: "text-red-500", gradient: "from-red-500/20 to-red-600/5",
    difficulty: "Beginner", hasVideos: false, hasHindi: true, chapterList: ipoChapters,
  },
  {
    id: 17, title: "National Pension System (NPS)", slug: "nps-guide", chapters: 9,
    description: "A complete guide to investing in NPS — understand tier 1 and tier 2 accounts, fund manager selection, tax benefits under 80CCD, and how NPS compares to other retirement products.",
    icon: "🏦", color: "text-slate-500", gradient: "from-slate-500/20 to-slate-600/5",
    difficulty: "Beginner", hasVideos: false, hasHindi: false, chapterList: npsChapters,
  },
];

export function getModuleBySlug(slug: string): LearningModule | undefined {
  return learningModules.find(m => m.slug === slug);
}
