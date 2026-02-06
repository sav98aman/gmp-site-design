
# LiveGMP — Complete Redesign Plan

## Overview
A fresh, modern redesign of LiveGMP — your real-time IPO tracker with GMP data, subscription status, AI verdicts, and allotment info. Built with realistic mock data, ready for API integration later. Includes light/dark mode toggle throughout.

---

## 🎨 Design System & Theme
- **Color palette**: A vibrant green accent (matching your brand) with deep navy/charcoal for dark mode and clean whites for light mode
- **Typography**: Clean, modern font hierarchy for financial data readability
- **Dark/Light mode toggle** in the header, persistent across pages
- **Consistent status colors**: Green for bullish/live, orange for upcoming, red for closed, purple for AI verdicts

---

## 📄 Pages

### 1. Homepage — IPO Dashboard
The main hub with everything at a glance:

- **Hero Section**: Clean branded header with "LiveGMP" logo, live update timestamp with green pulse indicator, and dark/light mode toggle
- **Quick Stats Bar**: Horizontal strip showing total live IPOs, average GMP, bullish count, and today's top performer
- **Filter & Search Bar**: Toggle tabs (Current / Upcoming / Closed / All), board type filter (Mainboard / SME), search by company name, and export button
- **IPO Listings — Hybrid Layout**: Responsive data table on desktop with sortable columns (Company, GMP/Gain, Open/Close dates, Countdown Timer, Subscription, Price Range, Lot Size, Issue Size, Status, AI Verdict). On mobile, switches to compact IPO cards with key info
- **Live Countdown Timers**: Animated countdown showing days/hours/minutes until IPO opens or closes
- **AI Verdict Badges**: Color-coded pills (BUY = green, HOLD = amber, NEUTRAL = gray, AVOID = red)
- **Today's GMP Trends Section**: Horizontal scrollable cards showing top-performing IPOs by GMP percentage with mini sparkline charts
- **Recent Closures Section**: Grid of recently closed IPOs with listing performance percentages
- **Floating Stats Widget**: Small floating badge in corner showing total bullish IPOs and average GMP

### 2. IPO Allotment Status Page
- **Breadcrumb navigation** back to dashboard
- **How-to Guide**: Collapsible info card with step-by-step instructions
- **Filter tabs**: All / SME / Mainboard
- **Search bar** for company name lookup
- **Allotment Table**: Company name with board badge, price range, subscription multiplier, listing date, GMP with percentage, and "Check Status" action button that links to external registrar
- **Mobile-friendly card layout** for each IPO entry

### 3. Individual IPO Detail Page
A dedicated deep-dive page for each IPO:
- **Company header** with logo, name, board type badge, and status
- **Key Metrics Grid**: GMP value & percentage, price range, lot size, issue size, subscription rates (Retail/QIB/NII), open/close dates with countdown
- **AI Analysis Card**: AI verdict badge with brief analysis summary
- **GMP History Chart**: Line chart showing GMP trend over time using Recharts
- **Subscription Progress**: Visual progress bars for each investor category
- **Company Info Section**: Brief description, sector, and key details
- **Related IPOs**: Suggested similar IPOs at the bottom

### 4. GMP Analytics Page
A new analytics/trends page:
- **Overall Market Sentiment**: Bullish vs bearish gauge
- **GMP Distribution Chart**: Bar chart showing GMP ranges across all IPOs
- **Top Performers Table**: Ranked list of highest GMP IPOs
- **Sector-wise Breakdown**: Pie/donut chart of IPOs by sector
- **Monthly Trends**: Line chart of average GMP over time

---

## 🧭 Navigation
- **Top header bar** with: LiveGMP logo, main nav links (Dashboard, Allotment Status, Analytics), live update indicator, and dark/light mode toggle
- **Mobile**: Hamburger menu with slide-out navigation
- Clean routing between all pages

---

## ✨ Key Interactions
- Smooth page transitions and hover effects
- Sortable table columns with visual indicators
- Animated countdown timers that tick in real-time
- Filter/search with instant results
- Responsive design that works beautifully on mobile, tablet, and desktop
- Toast notifications for data refresh events

---

## 📊 Mock Data
All pages will be populated with realistic Indian IPO data (company names, GMP values, subscription rates, dates) so the app looks production-ready from day one. Data structure will be organized for easy API replacement later.
