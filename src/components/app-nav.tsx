import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Authenticated, Unauthenticated } from "convex/react";
import { useAuth } from "@/hooks/use-auth.ts";
import {
  TrendingUpIcon,
  LayoutDashboardIcon,
  BrainCircuitIcon,
  LineChartIcon,
  ZapIcon,
  ScanSearchIcon,
  ActivityIcon,
  UsersIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils.ts";

const navItems = [
  { path: "/dashboard", icon: LayoutDashboardIcon, label: "Dashboard" },
  { path: "/analysis", icon: BrainCircuitIcon, label: "AI Analysis" },
  { path: "/portfolio", icon: ActivityIcon, label: "Portfolio" },
  { path: "/trade-ideas", icon: LineChartIcon, label: "Trade Ideas" },
  { path: "/signals", icon: ZapIcon, label: "Signals" },
  { path: "/screeners", icon: ScanSearchIcon, label: "Screeners" },
  { path: "/scalper", icon: ActivityIcon, label: "Scalper Mode" },
  { path: "/investors", icon: UsersIcon, label: "Top Investors" },
];

export function AppNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signoutRedirect } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b border-border bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <TrendingUpIcon className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold">InvestPlus</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "gap-2",
                    isActive && "bg-primary/10 text-primary"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            <Authenticated>
              <div className="hidden md:flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {user?.profile.name || user?.profile.email}
                </span>
                <Button variant="outline" size="sm" onClick={() => signoutRedirect()}>
                  Sign Out
                </Button>
              </div>
            </Authenticated>
            <Unauthenticated>
              <SignInButton />
            </Unauthenticated>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XIcon className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pt-4 pb-2 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    isActive && "bg-primary/10 text-primary"
                  )}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
            <Authenticated>
              <div className="md:hidden pt-2 border-t border-border space-y-2">
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  {user?.profile.name || user?.profile.email}
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => signoutRedirect()}
                >
                  Sign Out
                </Button>
              </div>
            </Authenticated>
          </div>
        )}
      </div>
    </nav>
  );
}
