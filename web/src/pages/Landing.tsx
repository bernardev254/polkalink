import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { usePolkadot } from '@/contexts/PolkadotContext';
import { Network, ShieldCheck, Users, Zap, ArrowRight, CheckCircle } from 'lucide-react';
import heroImage from '@/assets/hero-network.jpg';

const Landing = () => {
  const { connectWallet, isConnecting } = usePolkadot();

  const features = [
    {
      icon: Network,
      title: 'Decentralized Network',
      description: 'Built on Polkadot for seamless cross-chain interoperability and scalability',
    },
    {
      icon: ShieldCheck,
      title: 'Data Verification',
      description: 'Cryptographic proof and multi-party verification for complete data integrity',
    },
    {
      icon: Users,
      title: 'Partner Governance',
      description: 'Democratic on-chain voting system for network decisions and upgrades',
    },
    {
      icon: Zap,
      title: 'Real-Time Sync',
      description: 'Instant data synchronization across all network participants',
    },
  ];

  const benefits = [
    'Single source of truth for all partners',
    'Eliminate data silos and redundancy',
    'Automated compliance verification',
    'Transparent audit trails',
    'Reduced manual verification costs',
    'Trustless collaboration',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-95" />
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center text-primary-foreground">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/10 backdrop-blur-sm border border-card/20 mb-6">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-medium">Powered by Polkadot</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Decentralized Partner
              <br />
              <span className="bg-card/20 backdrop-blur-sm px-4 rounded-lg">Data Layer</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
              Empower your ecosystem to share verifiable data across trusted partners
              without central intermediaries
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={connectWallet}
                disabled={isConnecting}
                className="gap-2 text-lg px-8 py-6 shadow-glow"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 text-lg px-8 py-6 bg-card/10 backdrop-blur-sm border-card/20 hover:bg-card/20"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Built for Collaboration</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A blockchain-powered platform designed for transparency, trust, and efficiency
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-glow transition-all duration-300 border-border/50">
                  <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Why DataLink Network?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Replace fragmented databases with a unified, verifiable ledger that all partners trust
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Card className="p-8 shadow-card">
              <h3 className="text-2xl font-bold mb-6">Get Started Today</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Connect Your Wallet</h4>
                    <p className="text-sm text-muted-foreground">Use Polkadot.js extension or Talisman wallet</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Register as Partner</h4>
                    <p className="text-sm text-muted-foreground">Submit your organization details on-chain</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Start Collaborating</h4>
                    <p className="text-sm text-muted-foreground">Share and verify data with your network</p>
                  </div>
                </div>
              </div>
              <Button
                onClick={connectWallet}
                disabled={isConnecting}
                className="w-full mt-6 gap-2"
                size="lg"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="text-lg font-medium mb-2 bg-gradient-primary bg-clip-text text-transparent">
            DataLink Network
          </p>
          <p className="text-sm">Empowering ecosystems to share truth, not trust</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
