import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Vote, TrendingUp, Clock, CheckCircle } from 'lucide-react';

const Governance = () => {
  const proposals = [
    {
      id: 'PROP-14',
      title: 'Network Upgrade to Version 2.1',
      description: 'Implement enhanced verification algorithms and improved consensus mechanism',
      status: 'active',
      votesFor: 18,
      votesAgainst: 3,
      totalVoters: 24,
      endDate: '2024-04-20',
      category: 'Technical',
    },
    {
      id: 'PROP-13',
      title: 'Add New Partner Category: Recycling',
      description: 'Expand network to include recycling and waste management partners',
      status: 'active',
      votesFor: 15,
      votesAgainst: 6,
      totalVoters: 24,
      endDate: '2024-04-18',
      category: 'Governance',
    },
    {
      id: 'PROP-12',
      title: 'Reduce Verification Threshold',
      description: 'Lower minimum verifiers from 5 to 3 for faster processing',
      status: 'passed',
      votesFor: 20,
      votesAgainst: 4,
      totalVoters: 24,
      endDate: '2024-04-10',
      category: 'Protocol',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            Active
          </Badge>
        );
      case 'passed':
        return (
          <Badge className="gap-1 bg-success text-success-foreground">
            <CheckCircle className="h-3 w-3" />
            Passed
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Vote className="h-8 w-8" />
          Governance
        </h1>
        <p className="text-muted-foreground">
          Participate in network decisions through decentralized voting
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Active Proposals</span>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <p className="text-3xl font-bold">2</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Your Voting Power</span>
            <Vote className="h-4 w-4 text-primary" />
          </div>
          <p className="text-3xl font-bold">1</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Passed This Month</span>
            <CheckCircle className="h-4 w-4 text-success" />
          </div>
          <p className="text-3xl font-bold">5</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Participation Rate</span>
            <TrendingUp className="h-4 w-4 text-success" />
          </div>
          <p className="text-3xl font-bold">87%</p>
        </Card>
      </div>

      <div className="space-y-6">
        {proposals.map((proposal) => {
          const approvalRate = (proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100;
          
          return (
            <Card key={proposal.id} className="p-6 hover:shadow-glow transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{proposal.title}</h3>
                    {getStatusBadge(proposal.status)}
                    <Badge variant="outline">{proposal.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{proposal.description}</p>
                  <p className="text-xs text-muted-foreground">
                    Proposal ID: {proposal.id} • Ends: {proposal.endDate}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Approval</span>
                  <span className="font-semibold">{approvalRate.toFixed(1)}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-gradient-primary"
                    style={{ width: `${approvalRate}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                  <span>{proposal.votesFor} For</span>
                  <span>{proposal.votesAgainst} Against</span>
                </div>
              </div>

              {proposal.status === 'active' && (
                <div className="flex gap-3">
                  <Button className="flex-1">Vote For</Button>
                  <Button variant="outline" className="flex-1">Vote Against</Button>
                  <Button variant="ghost">Details</Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Governance;
