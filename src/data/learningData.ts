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
}

export const learningModules: LearningModule[] = [
  {
    id: 1,
    title: "Introduction to Stock Markets",
    slug: "intro-stock-markets",
    chapters: 15,
    description:
      "Begin your investing journey by understanding how stock markets work, the role of exchanges like NSE and BSE, how shares are listed and traded, and the key participants that keep the market running smoothly.",
    icon: "📈",
    color: "text-emerald-500",
    gradient: "from-emerald-500/20 to-emerald-600/5",
    difficulty: "Beginner",
    hasVideos: true,
    hasHindi: true,
  },
  {
    id: 2,
    title: "Technical Analysis",
    slug: "technical-analysis",
    chapters: 22,
    description:
      "Learn to read price charts, identify candlestick patterns, use moving averages, RSI, MACD, and other indicators to time your trades better and spot potential entry and exit points.",
    icon: "📊",
    color: "text-blue-500",
    gradient: "from-blue-500/20 to-blue-600/5",
    difficulty: "Intermediate",
    hasVideos: true,
    hasHindi: true,
  },
  {
    id: 3,
    title: "Fundamental Analysis",
    slug: "fundamental-analysis",
    chapters: 16,
    description:
      "Dive deep into financial statements, balance sheets, and income reports. Learn to calculate key ratios like P/E, ROE, and debt-to-equity to evaluate a company's true worth for long-term investments.",
    icon: "🔍",
    color: "text-violet-500",
    gradient: "from-violet-500/20 to-violet-600/5",
    difficulty: "Intermediate",
    hasVideos: true,
    hasHindi: true,
  },
  {
    id: 4,
    title: "Futures Trading",
    slug: "futures-trading",
    chapters: 13,
    description:
      "Understand how futures contracts work in derivatives markets. Learn about margin requirements, leverage, lot sizes, contract expiry, and how to use futures for speculation and hedging.",
    icon: "⚡",
    color: "text-amber-500",
    gradient: "from-amber-500/20 to-amber-600/5",
    difficulty: "Intermediate",
    hasVideos: true,
    hasHindi: true,
  },
  {
    id: 5,
    title: "Options Trading Essentials",
    slug: "options-trading",
    chapters: 25,
    description:
      "Master options contracts — calls, puts, strike prices, premiums, and expiry. Understand intrinsic vs time value, options pricing models, and how to construct basic options trades.",
    icon: "🎯",
    color: "text-rose-500",
    gradient: "from-rose-500/20 to-rose-600/5",
    difficulty: "Advanced",
    hasVideos: true,
    hasHindi: true,
  },
  {
    id: 6,
    title: "Options Strategies",
    slug: "options-strategies",
    chapters: 14,
    description:
      "Explore multi-leg strategies like straddles, strangles, iron condors, and spreads. Learn when to deploy each strategy based on market outlook, volatility, and risk tolerance.",
    icon: "♟️",
    color: "text-cyan-500",
    gradient: "from-cyan-500/20 to-cyan-600/5",
    difficulty: "Advanced",
    hasVideos: false,
    hasHindi: true,
  },
  {
    id: 7,
    title: "Markets & Taxation",
    slug: "markets-taxation",
    chapters: 8,
    description:
      "Navigate the tax implications of your trades and investments in India. Understand short-term and long-term capital gains, STT, turnover calculations, and how to file ITR as a trader.",
    icon: "🧾",
    color: "text-orange-500",
    gradient: "from-orange-500/20 to-orange-600/5",
    difficulty: "Beginner",
    hasVideos: false,
    hasHindi: true,
  },
  {
    id: 8,
    title: "Currency & Commodity Markets",
    slug: "currency-commodity",
    chapters: 20,
    description:
      "Learn about trading in currency pairs (USD/INR), commodity futures (gold, crude oil, natural gas), and government securities. Understand how global macro factors drive these markets.",
    icon: "🌍",
    color: "text-teal-500",
    gradient: "from-teal-500/20 to-teal-600/5",
    difficulty: "Intermediate",
    hasVideos: false,
    hasHindi: true,
  },
  {
    id: 9,
    title: "Risk Management & Trading Psychology",
    slug: "risk-management",
    chapters: 16,
    description:
      "Develop the mental framework for disciplined trading. Learn position sizing, stop-loss placement, risk-reward ratios, and how to manage emotions like fear and greed in volatile markets.",
    icon: "🧠",
    color: "text-pink-500",
    gradient: "from-pink-500/20 to-pink-600/5",
    difficulty: "Beginner",
    hasVideos: false,
    hasHindi: true,
  },
  {
    id: 10,
    title: "Building Trading Systems",
    slug: "trading-systems",
    chapters: 16,
    description:
      "Design and backtest your own trading systems. Learn about rule-based strategies, algorithmic trading basics, performance metrics, and how to optimize a trading system for consistency.",
    icon: "⚙️",
    color: "text-indigo-500",
    gradient: "from-indigo-500/20 to-indigo-600/5",
    difficulty: "Advanced",
    hasVideos: false,
    hasHindi: true,
  },
  {
    id: 11,
    title: "Personal Finance & Mutual Funds",
    slug: "personal-finance",
    chapters: 32,
    description:
      "Plan your financial future with goal-based investing. Covers SIPs, mutual fund categories, ETFs, debt instruments, retirement planning, and building a diversified long-term portfolio.",
    icon: "💰",
    color: "text-green-500",
    gradient: "from-green-500/20 to-green-600/5",
    difficulty: "Beginner",
    hasVideos: false,
    hasHindi: true,
  },
  {
    id: 12,
    title: "Trading Psychology Deep Dive",
    slug: "trading-psychology",
    chapters: 30,
    description:
      "Explore the behavioral biases that affect traders — overconfidence, loss aversion, herd mentality, and more. Learn frameworks to stay rational and consistent in your trading decisions.",
    icon: "🧘",
    color: "text-purple-500",
    gradient: "from-purple-500/20 to-purple-600/5",
    difficulty: "Intermediate",
    hasVideos: false,
    hasHindi: false,
  },
  {
    id: 13,
    title: "Financial Modelling",
    slug: "financial-modelling",
    chapters: 18,
    description:
      "Build integrated financial models from scratch. Learn to project revenues, model debt schedules, create cash flow statements, and perform DCF valuations to estimate a company's fair value.",
    icon: "📐",
    color: "text-sky-500",
    gradient: "from-sky-500/20 to-sky-600/5",
    difficulty: "Advanced",
    hasVideos: false,
    hasHindi: false,
  },
  {
    id: 14,
    title: "Insurance & Protection Planning",
    slug: "insurance-planning",
    chapters: 9,
    description:
      "Understand why insurance is a critical pillar of financial planning. Compare term life, health, and general insurance products, and learn how to choose adequate coverage for your family.",
    icon: "🛡️",
    color: "text-lime-500",
    gradient: "from-lime-500/20 to-lime-600/5",
    difficulty: "Beginner",
    hasVideos: false,
    hasHindi: false,
  },
  {
    id: 15,
    title: "Sector Analysis",
    slug: "sector-analysis",
    chapters: 17,
    description:
      "Each industry sector has unique drivers. Learn what metrics matter for banking, IT, pharma, FMCG, auto, and other sectors to make informed sector rotation and stock-picking decisions.",
    icon: "🏭",
    color: "text-yellow-500",
    gradient: "from-yellow-500/20 to-yellow-600/5",
    difficulty: "Advanced",
    hasVideos: false,
    hasHindi: false,
  },
  {
    id: 16,
    title: "IPO Investing Guide",
    slug: "ipo-investing",
    chapters: 12,
    description:
      "Everything about IPO investing — reading a DRHP, analysing GMP, understanding allotment process, listing day strategies, and evaluating whether an IPO is worth subscribing to.",
    icon: "🚀",
    color: "text-red-500",
    gradient: "from-red-500/20 to-red-600/5",
    difficulty: "Beginner",
    hasVideos: false,
    hasHindi: true,
  },
  {
    id: 17,
    title: "National Pension System (NPS)",
    slug: "nps-guide",
    chapters: 9,
    description:
      "A complete guide to investing in NPS — understand tier 1 and tier 2 accounts, fund manager selection, tax benefits under 80CCD, and how NPS compares to other retirement products.",
    icon: "🏦",
    color: "text-slate-500",
    gradient: "from-slate-500/20 to-slate-600/5",
    difficulty: "Beginner",
    hasVideos: false,
    hasHindi: false,
  },
];
