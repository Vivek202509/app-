import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DefaultProviders } from "./components/providers/default.tsx";
import AuthCallback from "./pages/auth/Callback.tsx";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Dashboard from "./pages/dashboard/page.tsx";
import Analysis from "./pages/analysis/page.tsx";
import Portfolio from "./pages/portfolio/page.tsx";
import TradeIdeas from "./pages/trade-ideas/page.tsx";
import Signals from "./pages/signals/page.tsx";
import Screeners from "./pages/screeners/page.tsx";
import Scalper from "./pages/scalper/page.tsx";
import Investors from "./pages/investors/page.tsx";

export default function App() {
  return (
    <DefaultProviders>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/trade-ideas" element={<TradeIdeas />} />
          <Route path="/signals" element={<Signals />} />
          <Route path="/screeners" element={<Screeners />} />
          <Route path="/scalper" element={<Scalper />} />
          <Route path="/investors" element={<Investors />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </DefaultProviders>
  );
}
