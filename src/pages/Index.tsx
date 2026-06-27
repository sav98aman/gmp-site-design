import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { mockIPOs, getGMPPercentage, type IPO, type IPOStatus } from "@/data/mockData";
import { cn } from "@/lib/utils";

/* Mint Paper palette — locked to this page regardless of global theme */
const PAPER = "#f6f5f0";
const INK = "#1a1d1a";
const GREEN = "#0d8f5f";
const ORANGE = "#c2410c";
const BLUE = "#1e3a8a";

type SortKey = "gmp" | "subscription" | "closing";

const STATUS_OPTIONS: { key: IPOStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "live", label: "Live" },
  { key: "upcoming", label: "Upcoming" },
  { key: "closed", label: "Closed" },
  { key: "listed", label: "Listed" },
];

function timeUntil(dateStr: string): { text: string; urgent: boolean } {
  const target = new Date(dateStr).getTime();
  const diff = target - Date.now();
  if (diff <= 0) return { text: "Closed", urgent: false };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  if (days > 0) return { text: `${days}D : ${String(hours).padStart(2, "0")}H`, urgent: days <= 1 };
  return { text: `${String(hours).padStart(2, "0")}H : ${String(mins).padStart(2, "0")}M`, urgent: true };
}

function StatusDot({ active, color = GREEN }: { active: boolean; color?: string }) {
  return (
    <div
      className="w-4 h-4 border flex items-center justify-center bg-white shrink-0 transition-colors"
      style={{ borderColor: active ? color : `${INK}33` }}
    >
      {active && <div className="w-2 h-2" style={{ background: color }} />}
    </div>
  );
}

function IPORow({ ipo }: { ipo: IPO }) {
  const gmpPct = getGMPPercentage(ipo);
  const positive = gmpPct >= 0 && ipo.gmp > 0;
  const verdictColor =
    ipo.aiVerdict === "BUY" ? GREEN : ipo.aiVerdict === "AVOID" ? ORANGE : ipo.aiVerdict === "HOLD" ? BLUE : INK;
  const initials = ipo.companyName.split(" ").slice(0, 2).map(s => s[0]).join("").toUpperCase();
  const countdown = timeUntil(ipo.closeDate);

  return (
    <Link
      to={`/ipo/${ipo.id}`}
      className="grid grid-cols-[48px_minmax(200px,1.2fr)_repeat(4,minmax(0,1fr))_40px] gap-6 items-center py-5 border-b group hover:bg-white/60 transition-colors -mx-3 px-3"
      style={{ borderColor: `${INK}1A` }}
    >
      <div
        className="w-12 h-12 bg-white border flex items-center justify-center shrink-0 font-bold text-[11px] tracking-tighter"
        style={{ borderColor: `${INK}1A`, color: verdictColor }}
      >
        {initials}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[9px] font-bold uppercase" style={{ color: `${INK}66` }}>
            {ipo.boardType}
          </span>
          <span
            className="px-1.5 py-0.5 text-[8px] font-bold rounded uppercase tracking-wider"
            style={{ background: `${verdictColor}1A`, color: verdictColor }}
          >
            {ipo.aiVerdict}
          </span>
        </div>
        <h4 className="text-lg font-bold leading-tight truncate group-hover:translate-x-1 transition-transform">
          {ipo.companyName}
        </h4>
      </div>

      <Metric label="GMP Premium" value={ipo.gmp > 0 ? `₹${ipo.gmp} (${gmpPct}%)` : "—"} tone={positive ? GREEN : INK} />
      <Metric label="Subscription" value={`${ipo.subscription.total.toFixed(2)}x`} />
      <Metric label="Price Band" value={`₹${ipo.priceRange.min}–${ipo.priceRange.max}`} />
      <Metric
        label={ipo.status === "live" ? "Closes In" : ipo.status === "upcoming" ? "Opens" : "Listing"}
        value={
          ipo.status === "live"
            ? countdown.text
            : ipo.status === "upcoming"
            ? new Date(ipo.openDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }).toUpperCase()
            : ipo.listingDate
            ? new Date(ipo.listingDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }).toUpperCase()
            : "—"
        }
        tone={ipo.status === "live" && countdown.urgent ? ORANGE : ipo.status === "live" ? GREEN : INK}
      />

      <div
        className="w-10 h-10 border flex items-center justify-center transition-all group-hover:bg-[#1a1d1a] group-hover:text-white"
        style={{ borderColor: `${INK}1A` }}
      >
        <ArrowRight className="w-4 h-4" />
      </div>
    </Link>
  );
}

function Metric({ label, value, tone = INK }: { label: string; value: string; tone?: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[8px] font-bold uppercase mb-0.5" style={{ color: `${INK}4D` }}>
        {label}
      </p>
      <p className="font-bold font-mono text-sm truncate" style={{ color: tone }}>
        {value}
      </p>
    </div>
  );
}

const Index = () => {
  const [statusFilter, setStatusFilter] = useState<IPOStatus | "all">("all");
  const [boardFilter, setBoardFilter] = useState<"all" | "Mainboard" | "SME">("all");
  const [minGmp, setMinGmp] = useState(0);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("gmp");

  const counts = useMemo(
    () => ({
      live: mockIPOs.filter(i => i.status === "live").length,
      upcoming: mockIPOs.filter(i => i.status === "upcoming").length,
      closed: mockIPOs.filter(i => i.status === "closed").length,
      listed: mockIPOs.filter(i => i.status === "listed").length,
      all: mockIPOs.length,
    }),
    []
  );

  const filtered = useMemo(() => {
    return mockIPOs
      .filter(ipo => {
        if (statusFilter !== "all" && ipo.status !== statusFilter) return false;
        if (boardFilter !== "all" && ipo.boardType !== boardFilter) return false;
        if (getGMPPercentage(ipo) < minGmp) return false;
        if (search && !ipo.companyName.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => {
        if (sort === "subscription") return b.subscription.total - a.subscription.total;
        if (sort === "closing") return new Date(a.closeDate).getTime() - new Date(b.closeDate).getTime();
        return getGMPPercentage(b) - getGMPPercentage(a);
      });
  }, [statusFilter, boardFilter, minGmp, search, sort]);

  const hero =
    mockIPOs
      .filter(i => i.status === "live" && i.aiVerdict === "BUY")
      .sort((a, b) => getGMPPercentage(b) - getGMPPercentage(a))[0] || mockIPOs[0];

  const heroGmp = getGMPPercentage(hero);
  const heroCountdown = timeUntil(hero.closeDate);

  return (
    <div className="min-h-screen" style={{ background: PAPER, color: INK }}>
      <Header />

      <div className="flex" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
        {/* Left sticky rail */}
        <aside
          className="hidden lg:flex w-[280px] sticky top-[56px] self-start h-[calc(100vh-56px)] border-r p-6 flex-col gap-10 overflow-y-auto"
          style={{ borderColor: `${INK}1A`, background: PAPER }}
        >
          {/* Status */}
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-4" style={{ color: `${INK}66` }}>
              Status
            </h2>
            <div className="space-y-3">
              {STATUS_OPTIONS.map(opt => {
                const active = statusFilter === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => setStatusFilter(opt.key)}
                    className="flex items-center gap-3 cursor-pointer w-full text-left"
                  >
                    <StatusDot active={active} />
                    <span
                      className={cn("text-xs font-bold uppercase tracking-wider", active ? "" : "opacity-60")}
                    >
                      {opt.label} ({counts[opt.key]})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Segment */}
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-4" style={{ color: `${INK}66` }}>
              Segment
            </h2>
            <div className="grid grid-cols-3 bg-white border" style={{ borderColor: `${INK}1A` }}>
              {(["all", "Mainboard", "SME"] as const).map(seg => (
                <button
                  key={seg}
                  onClick={() => setBoardFilter(seg)}
                  className="py-2 text-[10px] font-bold uppercase tracking-widest transition-colors"
                  style={{
                    background: boardFilter === seg ? INK : "transparent",
                    color: boardFilter === seg ? PAPER : INK,
                  }}
                >
                  {seg === "all" ? "All" : seg}
                </button>
              ))}
            </div>
          </div>

          {/* GMP slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: `${INK}66` }}>
                Min GMP %
              </h2>
              <span className="text-[10px] font-bold font-mono">{minGmp}%+</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={minGmp}
              onChange={e => setMinGmp(Number(e.target.value))}
              className="w-full h-1 appearance-none cursor-pointer rounded-full"
              style={{ accentColor: GREEN, background: `${INK}1A` }}
            />
          </div>

          {/* Search */}
          <div className="space-y-2">
            <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: `${INK}66` }}>
              Search
            </h2>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Company name…"
              className="w-full bg-white border px-3 py-2 text-xs outline-none focus:border-[color:var(--ink)]"
              style={{ borderColor: `${INK}1A` }}
            />
          </div>

          {/* Market open */}
          <div className="mt-auto pb-4 border-t pt-6" style={{ borderColor: `${INK}1A` }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: GREEN }} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Market Open</span>
            </div>
            <p className="text-[10px] leading-relaxed" style={{ color: `${INK}99` }}>
              Tracking {mockIPOs.length} active &amp; historical issues across Mainboard and SME clusters.
            </p>
          </div>
        </aside>

        {/* Right feed */}
        <main className="flex-1 min-w-0 px-6 py-10 md:px-12 md:py-14">
          <div className="max-w-4xl mx-auto">
            {/* Mobile filter pills */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-4 mb-6 -mx-2 px-2">
              {STATUS_OPTIONS.map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setStatusFilter(opt.key)}
                  className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border whitespace-nowrap"
                  style={{
                    borderColor: statusFilter === opt.key ? INK : `${INK}1A`,
                    background: statusFilter === opt.key ? INK : "transparent",
                    color: statusFilter === opt.key ? PAPER : INK,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Header */}
            <header className="mb-12 md:mb-16">
              <div className="flex flex-wrap justify-between items-baseline gap-4 mb-4">
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight">IPO Explorer</h1>
                <div className="flex gap-4">
                  {(["gmp", "subscription", "closing"] as SortKey[]).map(k => (
                    <button
                      key={k}
                      onClick={() => setSort(k)}
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-wider transition-opacity",
                        sort === k ? "border-b" : "opacity-40 hover:opacity-100"
                      )}
                      style={{ borderColor: INK }}
                    >
                      Sort: {k === "gmp" ? "GMP %" : k === "subscription" ? "Subscription" : "Closing"}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-lg font-medium max-w-xl" style={{ color: `${INK}B3` }}>
                Real-time intelligence on Mainboard and SME listings. Tracking {mockIPOs.length} active and historical
                offerings with deep analytics.
              </p>
            </header>

            {/* Hero feature */}
            {hero && (
              <section className="mb-16">
                <Link to={`/ipo/${hero.id}`}>
                  <article
                    className="group relative bg-white border transition-all hover:shadow-[8px_8px_0px_0px_rgba(26,29,26,0.08)]"
                    style={{ borderColor: INK }}
                  >
                    <div
                      className="absolute -top-3 left-6 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white"
                      style={{ background: GREEN }}
                    >
                      High Conviction
                    </div>
                    <div className="p-6 md:p-10 flex flex-col md:flex-row gap-6 md:gap-10">
                      <div
                        className="w-24 h-24 md:w-32 md:h-32 border flex items-center justify-center shrink-0"
                        style={{ background: PAPER, borderColor: `${INK}0D` }}
                      >
                        <div
                          className="w-14 h-14 md:w-16 md:h-16 rounded-lg flex items-center justify-center font-bold text-xl"
                          style={{ background: `${BLUE}1A`, color: BLUE }}
                        >
                          {hero.companyName.split(" ").slice(0, 2).map(s => s[0]).join("")}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <span className="text-[10px] font-bold uppercase" style={{ color: `${INK}80` }}>
                            {hero.boardType} Listing
                          </span>
                          <span className="w-1 h-1 rounded-full" style={{ background: `${INK}33` }} />
                          <span className="text-[10px] font-bold uppercase" style={{ color: GREEN }}>
                            {hero.status === "live" ? `Closes in ${heroCountdown.text}` : hero.status}
                          </span>
                        </div>
                        <h2
                          className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 transition-colors group-hover:text-[#0d8f5f]"
                        >
                          {hero.companyName} IPO
                        </h2>
                        <div
                          className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-12 border-t pt-6 md:pt-8"
                          style={{ borderColor: `${INK}1A` }}
                        >
                          <div>
                            <span
                              className="block text-[9px] uppercase font-bold mb-2 tracking-widest"
                              style={{ color: `${INK}66` }}
                            >
                              Expected GMP
                            </span>
                            <span className="text-2xl md:text-3xl font-bold font-mono" style={{ color: GREEN }}>
                              +{heroGmp}%
                            </span>
                          </div>
                          <div>
                            <span
                              className="block text-[9px] uppercase font-bold mb-2 tracking-widest"
                              style={{ color: `${INK}66` }}
                            >
                              Subscription
                            </span>
                            <span className="text-2xl md:text-3xl font-bold font-mono">
                              {hero.subscription.total.toFixed(2)}x
                            </span>
                          </div>
                          <div className="flex flex-col justify-center col-span-2 md:col-span-1">
                            <span
                              className="inline-flex items-center justify-center gap-2 py-3 px-6 text-xs font-bold uppercase tracking-widest text-white transition-colors group-hover:bg-[#0d8f5f]"
                              style={{ background: INK }}
                            >
                              View Full Analysis <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              </section>
            )}

            {/* Feed */}
            <div>
              <h3
                className="text-[10px] uppercase tracking-[0.3em] font-bold mb-6 flex items-center gap-4"
                style={{ color: `${INK}4D` }}
              >
                <span className="shrink-0">
                  {statusFilter === "all" ? "All Listings" : `${statusFilter} listings`} · {filtered.length}
                </span>
                <div className="h-px w-full" style={{ background: `${INK}1A` }} />
              </h3>

              {filtered.length === 0 ? (
                <div className="py-16 text-center text-sm" style={{ color: `${INK}99` }}>
                  No IPOs match the current filters.
                </div>
              ) : (
                <div>
                  {filtered.map(ipo => (
                    <IPORow key={ipo.id} ipo={ipo} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
