import { Card } from '@/components/ui/card';
import { BarChart3, TrendingUp, Activity, Users } from 'lucide-react';

const Analytics = () => {
  const metrics = [
    {
      title: 'Total Verifications',
      value: '1,847',
      change: '+12.5%',
      trend: 'up',
      icon: Activity,
    },
    {
      title: 'Network Growth',
      value: '24',
      change: '+3 partners',
      trend: 'up',
      icon: Users,
    },
    {
      title: 'Avg. Verification Time',
      value: '2.3h',
      change: '-15%',
      trend: 'up',
      icon: TrendingUp,
    },
    {
      title: 'Success Rate',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      icon: BarChart3,
    },
  ];

  const recentTrends = [
    { month: 'Jan', verifications: 145, partners: 18 },
    { month: 'Feb', verifications: 189, partners: 20 },
    { month: 'Mar', verifications: 234, partners: 22 },
    { month: 'Apr', verifications: 289, partners: 24 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <BarChart3 className="h-8 w-8" />
          Analytics
        </h1>
        <p className="text-muted-foreground">
          Track network performance and trends over time
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <h3 className="text-2xl font-bold mb-1">{metric.value}</h3>
              <p className="text-sm text-muted-foreground mb-1">{metric.title}</p>
              <p className="text-xs text-success">{metric.change}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Monthly Verification Trends</h2>
          <div className="space-y-4">
            {recentTrends.map((trend, index) => (
              <div key={index}>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium">{trend.month}</span>
                  <span className="text-muted-foreground">{trend.verifications} verifications</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-gradient-primary"
                    style={{ width: `${(trend.verifications / 300) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Partner Growth</h2>
          <div className="space-y-4">
            {recentTrends.map((trend, index) => (
              <div key={index}>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium">{trend.month}</span>
                  <span className="text-muted-foreground">{trend.partners} partners</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-secondary"
                    style={{ width: `${(trend.partners / 24) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
