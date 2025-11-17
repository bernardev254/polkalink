import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ShieldCheck, Package, Activity, TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { usePolkadot } from '@/contexts/PolkadotContext';

const Dashboard = () => {
  const { account } = usePolkadot();

  const stats = [
    {
      title: 'Active Partners',
      value: '24',
      change: '+3 this month',
      icon: Users,
      trend: 'up',
    },
    {
      title: 'Verified Records',
      value: '1,847',
      change: '+127 this week',
      icon: ShieldCheck,
      trend: 'up',
    },
    {
      title: 'Supply Chain Items',
      value: '3,492',
      change: '+89 today',
      icon: Package,
      trend: 'up',
    },
    {
      title: 'Network Health',
      value: '99.8%',
      change: 'All systems operational',
      icon: Activity,
      trend: 'stable',
    },
  ];

  const recentActivity = [
    {
      type: 'verification',
      partner: 'GreenCert Labs',
      action: 'Verified sustainability certificate',
      timestamp: '5 minutes ago',
      status: 'success',
    },
    {
      type: 'registration',
      partner: 'EcoSupply Co.',
      action: 'Registered as new partner',
      timestamp: '2 hours ago',
      status: 'success',
    },
    {
      type: 'pending',
      partner: 'QualityCheck Inc.',
      action: 'Awaiting verification approval',
      timestamp: '4 hours ago',
      status: 'pending',
    },
    {
      type: 'verification',
      partner: 'LogisticsPro',
      action: 'Updated shipment tracking data',
      timestamp: '1 day ago',
      status: 'success',
    },
  ];

  const pendingActions = [
    {
      title: 'Review data submission',
      description: 'New sustainability report from GreenManufacturing',
      priority: 'high',
    },
    {
      title: 'Approve partner application',
      description: 'TechCert Solutions requesting network access',
      priority: 'medium',
    },
    {
      title: 'Vote on governance proposal',
      description: 'Network upgrade proposal #14',
      priority: 'low',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-muted-foreground">
          Here's what's happening on your DataLink Network
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 hover:shadow-glow transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </div>
                {stat.trend === 'up' && (
                  <TrendingUp className="h-5 w-5 text-success" />
                )}
              </div>
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
              <p className="text-xs text-success">{stat.change}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex-shrink-0">
                  {activity.status === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : (
                    <Clock className="h-5 w-5 text-warning" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm mb-1">{activity.partner}</p>
                  <p className="text-sm text-muted-foreground mb-1">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Pending Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Pending Actions
          </h2>
          <div className="space-y-4">
            {pendingActions.map((action, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-sm">{action.title}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      action.priority === 'high'
                        ? 'bg-destructive/10 text-destructive'
                        : action.priority === 'medium'
                        ? 'bg-warning/10 text-warning'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {action.priority}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{action.description}</p>
                <Button size="sm" variant="outline" className="w-full">
                  Take Action
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <Button className="h-auto py-4 flex-col gap-2">
            <Users className="h-6 w-6" />
            Register Partner
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2">
            <ShieldCheck className="h-6 w-6" />
            Submit Data
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2">
            <Package className="h-6 w-6" />
            Track Shipment
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2">
            <Activity className="h-6 w-6" />
            View Analytics
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
