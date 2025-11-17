import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Building2, CheckCircle, Clock, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Partners = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    address: '',
  });

  const partners = [
    {
      name: 'GreenCert Labs',
      category: 'Certification',
      address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
      status: 'active',
      joinDate: '2024-01-15',
      verifications: 234,
    },
    {
      name: 'EcoSupply Co.',
      category: 'Supplier',
      address: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
      status: 'active',
      joinDate: '2024-02-20',
      verifications: 189,
    },
    {
      name: 'LogisticsPro',
      category: 'Logistics',
      address: '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy',
      status: 'active',
      joinDate: '2024-03-10',
      verifications: 156,
    },
    {
      name: 'TechCert Solutions',
      category: 'Certification',
      address: '5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw',
      status: 'pending',
      joinDate: '2024-04-01',
      verifications: 0,
    },
  ];

  const categories = ['Manufacturer', 'Supplier', 'Logistics', 'Certification', 'Regulator'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);

    // Simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast({
      title: 'Partner Registered!',
      description: `${formData.name} has been successfully registered on the network.`,
    });

    setFormData({ name: '', category: '', address: '' });
    setIsRegistering(false);
  };

  const filteredPartners = partners.filter((partner) =>
    partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Users className="h-8 w-8" />
          Partner Network
        </h1>
        <p className="text-muted-foreground">
          Manage and collaborate with trusted partners across the ecosystem
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Registration Form */}
        <Card className="p-6 lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Register New Partner
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter organization name"
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="address">Wallet Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="5..."
                className="font-mono text-sm"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isRegistering}>
              {isRegistering ? 'Registering...' : 'Register Partner'}
            </Button>
          </form>
        </Card>

        {/* Partners List */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Registered Partners</h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search partners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredPartners.map((partner, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-border hover:border-primary/50 transition-all hover:shadow-card"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{partner.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {partner.category}
                      </p>
                      <p className="text-xs font-mono text-muted-foreground">
                        {partner.address.slice(0, 8)}...{partner.address.slice(-6)}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={partner.status === 'active' ? 'default' : 'secondary'}
                    className="gap-1"
                  >
                    {partner.status === 'active' ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <Clock className="h-3 w-3" />
                    )}
                    {partner.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="text-muted-foreground">Joined: </span>
                    <span className="font-medium">{partner.joinDate}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Verifications: </span>
                    <span className="font-medium text-success">{partner.verifications}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Partners;
