import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings as SettingsIcon, User, Bell, Shield, Database } from 'lucide-react';
import { usePolkadot } from '@/contexts/PolkadotContext';

const Settings = () => {
  const { account } = usePolkadot();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <SettingsIcon className="h-8 w-8" />
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account and network preferences
        </p>
      </div>

      <div className="max-w-4xl space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Information
          </h2>
          <div className="space-y-4">
            <div>
              <Label>Wallet Address</Label>
              <div className="flex gap-2">
                <Input value={account || ''} readOnly className="font-mono" />
                <Button variant="outline">Copy</Button>
              </div>
            </div>
            <div>
              <Label>Organization Name</Label>
              <Input placeholder="Your organization" />
            </div>
            <div>
              <Label>Contact Email</Label>
              <Input type="email" placeholder="contact@example.com" />
            </div>
            <Button>Save Changes</Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New Verification Requests</p>
                <p className="text-sm text-muted-foreground">Get notified when data needs verification</p>
              </div>
              <input type="checkbox" defaultChecked className="h-5 w-5" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Governance Proposals</p>
                <p className="text-sm text-muted-foreground">Alerts for new voting opportunities</p>
              </div>
              <input type="checkbox" defaultChecked className="h-5 w-5" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Network Updates</p>
                <p className="text-sm text-muted-foreground">Important network announcements</p>
              </div>
              <input type="checkbox" className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
          </h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-2">
                Your account is secured by your Polkadot wallet. All transactions require wallet signature.
              </p>
              <div className="flex items-center gap-2 text-sm text-success">
                <Shield className="h-4 w-4" />
                <span>Wallet connected and verified</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Database className="h-5 w-5" />
            Network Preferences
          </h2>
          <div className="space-y-4">
            <div>
              <Label>Preferred RPC Endpoint</Label>
              <Input defaultValue="wss://rpc.polkadot.io" className="font-mono text-sm" />
            </div>
            <div>
              <Label>Auto-verify from trusted partners</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Automatically verify data from partners you trust
              </p>
              <input type="checkbox" className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
