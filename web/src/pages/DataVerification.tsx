import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Upload, FileText, CheckCircle, Clock, XCircle, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DataVerification = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    hash: '',
    description: '',
  });

  const records = [
    {
      id: 'DR-2024-001',
      title: 'Sustainability Certificate Q1 2024',
      hash: '0x7d8a9f...',
      partner: 'GreenCert Labs',
      timestamp: '2024-04-15 14:30',
      status: 'verified',
      verifiers: 5,
    },
    {
      id: 'DR-2024-002',
      title: 'Supply Chain Audit Report',
      hash: '0x3b4c2d...',
      partner: 'EcoSupply Co.',
      timestamp: '2024-04-14 09:15',
      status: 'verified',
      verifiers: 4,
    },
    {
      id: 'DR-2024-003',
      title: 'Carbon Footprint Analysis',
      hash: '0x9e5f1a...',
      partner: 'GreenManufacturing',
      timestamp: '2024-04-13 16:45',
      status: 'pending',
      verifiers: 2,
    },
    {
      id: 'DR-2024-004',
      title: 'Quality Compliance Document',
      hash: '0x2a8c7b...',
      partner: 'QualityCheck Inc.',
      timestamp: '2024-04-12 11:20',
      status: 'rejected',
      verifiers: 3,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast({
      title: 'Data Submitted!',
      description: 'Your data has been submitted for verification.',
    });

    setFormData({ title: '', hash: '', description: '' });
    setIsSubmitting(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <Badge className="gap-1 bg-success text-success-foreground">
            <CheckCircle className="h-3 w-3" />
            Verified
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  const filteredRecords = records.filter((record) =>
    record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.partner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <ShieldCheck className="h-8 w-8" />
          Data Verification
        </h1>
        <p className="text-muted-foreground">
          Submit and verify data records across the network
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Submit Form */}
        <Card className="p-6 lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Submit for Verification
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Document Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter document title"
                required
              />
            </div>
            <div>
              <Label htmlFor="hash">File Hash (IPFS/Crust)</Label>
              <Input
                id="hash"
                value={formData.hash}
                onChange={(e) => setFormData({ ...formData, hash: e.target.value })}
                placeholder="0x..."
                className="font-mono text-sm"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide details about the data..."
                className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px]"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Data'}
            </Button>
          </form>

          <div className="mt-6 p-4 rounded-lg bg-muted/50">
            <h3 className="font-semibold text-sm mb-2">Verification Process</h3>
            <ol className="text-xs text-muted-foreground space-y-1">
              <li>1. Submit data with file hash</li>
              <li>2. Partners review and verify</li>
              <li>3. Consensus reached (3+ verifiers)</li>
              <li>4. Record becomes immutable</li>
            </ol>
          </div>
        </Card>

        {/* Records List */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Verification Records</h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredRecords.map((record, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-border hover:border-primary/50 transition-all hover:shadow-card"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold">{record.title}</h3>
                        {getStatusBadge(record.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        ID: {record.id}
                      </p>
                      <p className="text-xs font-mono text-muted-foreground mb-2">
                        Hash: {record.hash}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>By: {record.partner}</span>
                        <span>{record.timestamp}</span>
                        <span className="text-primary font-medium">
                          {record.verifiers} verifier{record.verifiers !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {record.status === 'pending' && (
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="default" className="flex-1">
                      Verify
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Review Details
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DataVerification;
