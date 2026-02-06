export type BoardType = 'Mainboard' | 'SME';
export type IPOStatus = 'live' | 'upcoming' | 'closed' | 'listed';
export type AIVerdict = 'BUY' | 'HOLD' | 'NEUTRAL' | 'AVOID';

export interface IPO {
  id: string;
  companyName: string;
  sector: string;
  boardType: BoardType;
  status: IPOStatus;
  priceRange: { min: number; max: number };
  lotSize: number;
  issueSize: number;
  gmp: number;
  openDate: string;
  closeDate: string;
  listingDate?: string;
  listingPrice?: number;
  listingGain?: number;
  subscription: {
    retail: number;
    qib: number;
    nii: number;
    total: number;
  };
  aiVerdict: AIVerdict;
  aiAnalysis: string;
  gmpHistory: { date: string; gmp: number }[];
  description: string;
  registrarUrl: string;
}

export function getGMPPercentage(ipo: IPO): number {
  if (ipo.priceRange.max === 0) return 0;
  return Number(((ipo.gmp / ipo.priceRange.max) * 100).toFixed(1));
}

export function getIPOById(id: string): IPO | undefined {
  return mockIPOs.find(ipo => ipo.id === id);
}

export function getRelatedIPOs(ipo: IPO, limit = 3): IPO[] {
  return mockIPOs
    .filter(i => i.id !== ipo.id && (i.sector === ipo.sector || i.boardType === ipo.boardType))
    .slice(0, limit);
}

export const mockIPOs: IPO[] = [
  {
    id: "hexaware-tech",
    companyName: "Hexaware Technologies",
    sector: "IT Services",
    boardType: "Mainboard",
    status: "live",
    priceRange: { min: 674, max: 708 },
    lotSize: 21,
    issueSize: 8750,
    gmp: 62,
    openDate: "2026-02-04",
    closeDate: "2026-02-08T18:00:00",
    subscription: { retail: 4.2, qib: 15.8, nii: 8.3, total: 9.1 },
    aiVerdict: "BUY",
    aiAnalysis: "Strong fundamentals with consistent revenue growth in IT services. Reasonable valuation with healthy subscription numbers across all categories. Recommended for long-term investors.",
    gmpHistory: [
      { date: "Feb 01", gmp: 38 },
      { date: "Feb 02", gmp: 45 },
      { date: "Feb 03", gmp: 50 },
      { date: "Feb 04", gmp: 55 },
      { date: "Feb 05", gmp: 58 },
      { date: "Feb 06", gmp: 62 },
    ],
    description: "Hexaware Technologies is a leading global IT services company specializing in digital transformation, cloud, and automation solutions for enterprise clients.",
    registrarUrl: "https://linkintime.co.in",
  },
  {
    id: "stallion-india",
    companyName: "Stallion India Fluorochemicals",
    sector: "Chemicals",
    boardType: "SME",
    status: "live",
    priceRange: { min: 85, max: 90 },
    lotSize: 1600,
    issueSize: 162,
    gmp: 45,
    openDate: "2026-02-05",
    closeDate: "2026-02-08T18:00:00",
    subscription: { retail: 12.5, qib: 0, nii: 6.2, total: 8.7 },
    aiVerdict: "BUY",
    aiAnalysis: "Exceptional retail interest with 12.5x subscription. Fluorochemicals sector seeing strong demand. GMP indicates 50% premium. High-conviction pick for risk-tolerant investors.",
    gmpHistory: [
      { date: "Feb 02", gmp: 25 },
      { date: "Feb 03", gmp: 30 },
      { date: "Feb 04", gmp: 38 },
      { date: "Feb 05", gmp: 42 },
      { date: "Feb 06", gmp: 45 },
    ],
    description: "Stallion India Fluorochemicals manufactures and exports specialty fluorochemical products used in refrigeration, pharmaceuticals, and agrochemicals.",
    registrarUrl: "https://www.bigshare.co.in",
  },
  {
    id: "transrail-lighting",
    companyName: "Transrail Lighting",
    sector: "Infrastructure",
    boardType: "Mainboard",
    status: "live",
    priceRange: { min: 410, max: 432 },
    lotSize: 34,
    issueSize: 2780,
    gmp: 28,
    openDate: "2026-02-03",
    closeDate: "2026-02-07T18:00:00",
    subscription: { retail: 2.1, qib: 8.5, nii: 4.2, total: 4.8 },
    aiVerdict: "HOLD",
    aiAnalysis: "Decent infrastructure play but GMP has been declining. Moderate subscription numbers. Consider holding if allotted, but avoid applying at current premium levels.",
    gmpHistory: [
      { date: "Jan 31", gmp: 42 },
      { date: "Feb 01", gmp: 38 },
      { date: "Feb 02", gmp: 35 },
      { date: "Feb 03", gmp: 32 },
      { date: "Feb 04", gmp: 30 },
      { date: "Feb 05", gmp: 28 },
    ],
    description: "Transrail Lighting designs and manufactures power transmission infrastructure, including towers, poles, and conductors for major utility projects.",
    registrarUrl: "https://linkintime.co.in",
  },
  {
    id: "carraro-india",
    companyName: "Carraro India",
    sector: "Auto Components",
    boardType: "Mainboard",
    status: "live",
    priceRange: { min: 668, max: 704 },
    lotSize: 21,
    issueSize: 1250,
    gmp: 35,
    openDate: "2026-02-04",
    closeDate: "2026-02-07T18:00:00",
    subscription: { retail: 1.8, qib: 5.2, nii: 3.1, total: 3.3 },
    aiVerdict: "NEUTRAL",
    aiAnalysis: "Auto components sector facing headwinds. Moderate GMP with lukewarm subscription. Valued fairly compared to peers. Wait for listing day performance before taking positions.",
    gmpHistory: [
      { date: "Feb 01", gmp: 30 },
      { date: "Feb 02", gmp: 32 },
      { date: "Feb 03", gmp: 35 },
      { date: "Feb 04", gmp: 33 },
      { date: "Feb 05", gmp: 34 },
      { date: "Feb 06", gmp: 35 },
    ],
    description: "Carraro India is a subsidiary of Carraro Group, manufacturing axles, transmission systems, and driveline components for agricultural and construction equipment.",
    registrarUrl: "https://www.kfintech.com",
  },
  {
    id: "ventive-hospitality",
    companyName: "Ventive Hospitality",
    sector: "Hotels & Tourism",
    boardType: "Mainboard",
    status: "upcoming",
    priceRange: { min: 610, max: 643 },
    lotSize: 23,
    issueSize: 3600,
    gmp: 15,
    openDate: "2026-02-11",
    closeDate: "2026-02-14T18:00:00",
    subscription: { retail: 0, qib: 0, nii: 0, total: 0 },
    aiVerdict: "HOLD",
    aiAnalysis: "Hospitality sector recovery play but premium pricing limits upside. Wait for subscription data before deciding. GMP may improve closer to opening.",
    gmpHistory: [
      { date: "Feb 03", gmp: 8 },
      { date: "Feb 04", gmp: 10 },
      { date: "Feb 05", gmp: 12 },
      { date: "Feb 06", gmp: 15 },
    ],
    description: "Ventive Hospitality operates luxury hotels and resorts across India, partnering with global brands like Marriott and IHG for premium hospitality experiences.",
    registrarUrl: "https://linkintime.co.in",
  },
  {
    id: "unimech-aerospace",
    companyName: "Unimech Aerospace",
    sector: "Aerospace & Defence",
    boardType: "SME",
    status: "upcoming",
    priceRange: { min: 745, max: 785 },
    lotSize: 19,
    issueSize: 500,
    gmp: 78,
    openDate: "2026-02-12",
    closeDate: "2026-02-15T18:00:00",
    subscription: { retail: 0, qib: 0, nii: 0, total: 0 },
    aiVerdict: "BUY",
    aiAnalysis: "Defence sector darling with massive pre-listing premium. Expect strong listing gains given 10%+ GMP. Limited supply with high demand makes this a strong candidate.",
    gmpHistory: [
      { date: "Feb 02", gmp: 55 },
      { date: "Feb 03", gmp: 60 },
      { date: "Feb 04", gmp: 68 },
      { date: "Feb 05", gmp: 72 },
      { date: "Feb 06", gmp: 78 },
    ],
    description: "Unimech Aerospace manufactures precision-engineered components for the aerospace and defence industry, supplying to ISRO, HAL, and global OEMs.",
    registrarUrl: "https://www.bigshare.co.in",
  },
  {
    id: "senores-pharma",
    companyName: "Senores Pharmaceuticals",
    sector: "Pharmaceuticals",
    boardType: "SME",
    status: "upcoming",
    priceRange: { min: 372, max: 391 },
    lotSize: 38,
    issueSize: 420,
    gmp: 22,
    openDate: "2026-02-13",
    closeDate: "2026-02-17T18:00:00",
    subscription: { retail: 0, qib: 0, nii: 0, total: 0 },
    aiVerdict: "NEUTRAL",
    aiAnalysis: "Pharma sector IPO with moderate GMP. Company has stable revenue but limited growth catalysts. Fair valuation but no urgency to apply.",
    gmpHistory: [
      { date: "Feb 03", gmp: 15 },
      { date: "Feb 04", gmp: 18 },
      { date: "Feb 05", gmp: 20 },
      { date: "Feb 06", gmp: 22 },
    ],
    description: "Senores Pharmaceuticals develops and manufactures generic pharmaceutical formulations for the US and Indian markets with USFDA-approved facilities.",
    registrarUrl: "https://www.kfintech.com",
  },
  {
    id: "sanathan-textiles",
    companyName: "Sanathan Textiles",
    sector: "Textiles",
    boardType: "Mainboard",
    status: "closed",
    priceRange: { min: 305, max: 321 },
    lotSize: 46,
    issueSize: 1500,
    gmp: 18,
    openDate: "2026-01-28",
    closeDate: "2026-01-31T18:00:00",
    subscription: { retail: 3.5, qib: 9.2, nii: 5.8, total: 6.1 },
    aiVerdict: "HOLD",
    aiAnalysis: "Textile sector facing margin pressures. Decent subscription but GMP declining. Hold for listing, may see moderate listing gains of 5-8%.",
    gmpHistory: [
      { date: "Jan 26", gmp: 28 },
      { date: "Jan 27", gmp: 25 },
      { date: "Jan 28", gmp: 22 },
      { date: "Jan 29", gmp: 20 },
      { date: "Jan 30", gmp: 18 },
    ],
    description: "Sanathan Textiles is an integrated textile manufacturer producing yarn, fabric, and garments with exports to over 40 countries.",
    registrarUrl: "https://linkintime.co.in",
  },
  {
    id: "sai-life-sciences",
    companyName: "Sai Life Sciences",
    sector: "Pharmaceuticals",
    boardType: "Mainboard",
    status: "closed",
    priceRange: { min: 522, max: 549 },
    lotSize: 27,
    issueSize: 3200,
    gmp: 8,
    openDate: "2026-01-29",
    closeDate: "2026-02-02T18:00:00",
    subscription: { retail: 1.2, qib: 18.5, nii: 2.8, total: 7.2 },
    aiVerdict: "AVOID",
    aiAnalysis: "Low retail interest and declining GMP suggest weak listing. QIB-heavy subscription indicates institutional play. Retail investors should avoid at current levels.",
    gmpHistory: [
      { date: "Jan 27", gmp: 22 },
      { date: "Jan 28", gmp: 18 },
      { date: "Jan 29", gmp: 14 },
      { date: "Jan 30", gmp: 10 },
      { date: "Jan 31", gmp: 8 },
    ],
    description: "Sai Life Sciences is a contract research and manufacturing organization providing end-to-end drug discovery and development services to global pharmaceutical companies.",
    registrarUrl: "https://www.kfintech.com",
  },
  {
    id: "dam-capital",
    companyName: "DAM Capital Advisors",
    sector: "Financial Services",
    boardType: "Mainboard",
    status: "listed",
    priceRange: { min: 269, max: 283 },
    lotSize: 53,
    issueSize: 840,
    gmp: 0,
    openDate: "2026-01-15",
    closeDate: "2026-01-18T18:00:00",
    listingDate: "2026-01-22",
    listingPrice: 402,
    listingGain: 42,
    subscription: { retail: 8.5, qib: 22.1, nii: 12.4, total: 14.2 },
    aiVerdict: "BUY",
    aiAnalysis: "Stellar listing with 42% gains. Strong post-listing momentum. Investment banking sector tailwinds support further upside. Consider buying on dips.",
    gmpHistory: [
      { date: "Jan 12", gmp: 65 },
      { date: "Jan 14", gmp: 80 },
      { date: "Jan 16", gmp: 95 },
      { date: "Jan 18", gmp: 110 },
      { date: "Jan 22", gmp: 119 },
    ],
    description: "DAM Capital Advisors is an investment banking firm providing advisory services for M&A, capital markets, and restructuring to mid-market corporates.",
    registrarUrl: "https://linkintime.co.in",
  },
  {
    id: "mobikwik",
    companyName: "MobiKwik",
    sector: "Fintech",
    boardType: "Mainboard",
    status: "listed",
    priceRange: { min: 265, max: 279 },
    lotSize: 53,
    issueSize: 572,
    gmp: 0,
    openDate: "2026-01-18",
    closeDate: "2026-01-21T18:00:00",
    listingDate: "2026-01-25",
    listingPrice: 441,
    listingGain: 58,
    subscription: { retail: 15.2, qib: 25.3, nii: 18.7, total: 19.5 },
    aiVerdict: "BUY",
    aiAnalysis: "Blockbuster listing with 58% gains. Digital payments and fintech narrative driving demand. High retail enthusiasm justifies premium valuation post-listing.",
    gmpHistory: [
      { date: "Jan 15", gmp: 85 },
      { date: "Jan 17", gmp: 100 },
      { date: "Jan 19", gmp: 120 },
      { date: "Jan 21", gmp: 140 },
      { date: "Jan 25", gmp: 162 },
    ],
    description: "MobiKwik is a leading digital payments and fintech platform in India offering mobile wallets, UPI payments, and buy-now-pay-later services to millions of users.",
    registrarUrl: "https://www.bigshare.co.in",
  },
  {
    id: "intl-gemmological",
    companyName: "International Gemmological Institute",
    sector: "Education & Certification",
    boardType: "SME",
    status: "listed",
    priceRange: { min: 397, max: 417 },
    lotSize: 35,
    issueSize: 4225,
    gmp: 0,
    openDate: "2026-01-20",
    closeDate: "2026-01-23T18:00:00",
    listingDate: "2026-01-28",
    listingPrice: 549,
    listingGain: 31,
    subscription: { retail: 5.8, qib: 14.2, nii: 7.5, total: 9.1 },
    aiVerdict: "HOLD",
    aiAnalysis: "Decent listing at 31% premium. Niche market leader in gemstone certification. Limited growth runway but stable business model. Hold for steady returns.",
    gmpHistory: [
      { date: "Jan 18", gmp: 60 },
      { date: "Jan 19", gmp: 75 },
      { date: "Jan 20", gmp: 90 },
      { date: "Jan 22", gmp: 110 },
      { date: "Jan 28", gmp: 132 },
    ],
    description: "International Gemmological Institute is the world's largest independent gemstone and jewellery certification body, with laboratories across major diamond trading centres.",
    registrarUrl: "https://www.kfintech.com",
  },
];

// Sector data for analytics
export const sectorDistribution = [
  { name: "IT Services", value: 1, color: "hsl(var(--chart-1))" },
  { name: "Chemicals", value: 1, color: "hsl(var(--chart-2))" },
  { name: "Infrastructure", value: 1, color: "hsl(var(--chart-3))" },
  { name: "Auto Components", value: 1, color: "hsl(var(--chart-4))" },
  { name: "Hotels & Tourism", value: 1, color: "hsl(var(--chart-5))" },
  { name: "Aerospace & Defence", value: 1, color: "hsl(var(--chart-1))" },
  { name: "Pharmaceuticals", value: 2, color: "hsl(var(--chart-2))" },
  { name: "Textiles", value: 1, color: "hsl(var(--chart-3))" },
  { name: "Financial Services", value: 1, color: "hsl(var(--chart-4))" },
  { name: "Fintech", value: 1, color: "hsl(var(--chart-5))" },
  { name: "Education", value: 1, color: "hsl(var(--chart-1))" },
];

export const monthlyGMPTrends = [
  { month: "Sep 25", avgGMP: 28 },
  { month: "Oct 25", avgGMP: 35 },
  { month: "Nov 25", avgGMP: 42 },
  { month: "Dec 25", avgGMP: 38 },
  { month: "Jan 26", avgGMP: 52 },
  { month: "Feb 26", avgGMP: 45 },
];

export const gmpDistribution = [
  { range: "₹0-10", count: 2 },
  { range: "₹11-25", count: 3 },
  { range: "₹26-45", count: 3 },
  { range: "₹46-65", count: 2 },
  { range: "₹66+", count: 2 },
];
