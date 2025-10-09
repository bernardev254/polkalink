import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, ShieldCheck, Vote, BarChart3, Settings, LogOut } from 'lucide-react';
import { usePolkadot } from '@/contexts/PolkadotContext';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const location = useLocation();
  const { account, disconnectWallet } = usePolkadot();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/partners', icon: Users, label: 'Partners' },
    { path: '/data-verification', icon: ShieldCheck, label: 'Data Verification' },
    { path: '/governance', icon: Vote, label: 'Governance' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-card/95 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary" />
              <span className="text-xl font-semibold bg-gradient-primary bg-clip-text text-transparent">
                DataLink Network
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      size="sm"
                      className="gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {account && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-sm font-mono">
                {truncateAddress(account)}
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={disconnectWallet}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Disconnect</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
