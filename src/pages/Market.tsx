import { useState } from "react";
import { Header } from "@/components/Header";
import { StockSearchBar } from "@/components/market/StockSearchBar";
import { StockHeader } from "@/components/market/StockHeader";
import { StockPriceChart } from "@/components/market/StockPriceChart";
import { TopMovers } from "@/components/market/TopMovers";
import { FundamentalAnalysis } from "@/components/market/FundamentalAnalysis";
import { TechnicalAnalysis } from "@/components/market/TechnicalAnalysis";
import { CombinedAnalysis } from "@/components/market/CombinedAnalysis";
import { MarketOverview } from "@/components/market/MarketOverview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Activity, Brain, Search } from "lucide-react";
import { type Stock, mockStocks } from "@/data/mockStockData";

const Market = () => {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  const handleSelectStock = (stock: Stock) => {
    setSelectedStock(stock);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 space-y-6">
        {/* Page Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Market</h1>
          <p className="text-sm text-muted-foreground">
            Search stocks, track prices & get AI-powered analysis
          </p>
        </div>

        {/* Market Overview Stats */}
        <MarketOverview />

        {/* Search + Top Movers Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Search + Stock Detail */}
          <div className="lg:col-span-2 space-y-4">
            <StockSearchBar onSelectStock={handleSelectStock} selectedSymbol={selectedStock?.symbol} />

            {selectedStock ? (
              <div className="space-y-4">
                <StockHeader stock={selectedStock} />
                <StockPriceChart stock={selectedStock} />

                {/* Analysis Tabs */}
                <Tabs defaultValue="combined" className="w-full">
                  <TabsList className="w-full h-10 sm:w-auto">
                    <TabsTrigger value="combined" className="gap-1.5 text-xs sm:text-sm">
                      <Brain className="h-3.5 w-3.5" />
                      Combined
                    </TabsTrigger>
                    <TabsTrigger value="fundamental" className="gap-1.5 text-xs sm:text-sm">
                      <Building2 className="h-3.5 w-3.5" />
                      Fundamental
                    </TabsTrigger>
                    <TabsTrigger value="technical" className="gap-1.5 text-xs sm:text-sm">
                      <Activity className="h-3.5 w-3.5" />
                      Technical
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="combined">
                    <CombinedAnalysis stock={selectedStock} />
                  </TabsContent>
                  <TabsContent value="fundamental">
                    <FundamentalAnalysis stock={selectedStock} />
                  </TabsContent>
                  <TabsContent value="technical">
                    <TechnicalAnalysis stock={selectedStock} />
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border/50 rounded-xl bg-card/30">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-1">Search for a Stock</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Search by name or symbol above to view live prices, charts, and comprehensive analysis
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {mockStocks.slice(0, 5).map((s) => (
                    <button
                      key={s.symbol}
                      onClick={() => handleSelectStock(s)}
                      className="px-3 py-1.5 text-xs font-mono font-medium bg-muted hover:bg-primary/10 hover:text-primary rounded-full transition-colors"
                    >
                      {s.symbol}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Top Movers */}
          <div className="space-y-4">
            <TopMovers onSelectStock={handleSelectStock} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Market;
