import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  status: string;
  createdAt: number;
}

const PERMISSIONS_CONFIG = {
  'Project Management': {
    'read:projects': 'View a list of projects and their details.',
    'write:projects': 'Create new projects and update existing ones.',
    'delete:projects': 'Delete projects.',
  },
  'Model Training & Workspace': {
    'read:training_jobs': 'View the status, logs, and results of training runs.',
    'execute:training_jobs': 'Start new model training runs in the workspace.',
  },
  'Model Registry & Deployment': {
    'read:models': 'List models and view versions in the registry.',
    'write:models': 'Register new models or versions to the registry.',
    'delete:models': 'Delete models or specific versions from the registry.',
    'deploy:models': 'Promote a model version to a deployment environment (e.g., Staging, Production).',
  },
  'Data Sources': {
    'read:datasources': 'View the list of configured data source connections.',
    'write:datasources': 'Add, update, and test data source connections.',
    'delete:datasources': 'Remove data source connections.',
  },
  'Prediction API': {
    'execute:predictions': '(Crucial for external services) Allows the key to make prediction calls to deployed models.',
  },
  'Platform Administration': {
    'read:users': 'View the list of users in the organization.',
    'write:users': 'Invite, suspend, or remove users from the organization.',
    'read:billing': 'View billing history, invoices, and current usage metrics.',
    'admin:webhooks': 'Create, update, and delete webhooks for platform integrations.',
  },
};

const allPermissions = Object.values(PERMISSIONS_CONFIG).reduce(
  (acc, group) => ({ ...acc, ...Object.keys(group).reduce((p, key) => ({ ...p, [key]: false }), {}) }),
  {}
);

const ApiKeys: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [permissions, setPermissions] = useState(allPermissions);
  const [newlyGeneratedKey, setNewlyGeneratedKey] = useState<string | null>(null);

  const fetchApiKeys = () => {
    fetch('http://localhost:5001/api/keys')
      .then((res) => res.json())
      .then((data) => setApiKeys(data));
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const handleGenerateKey = () => {
    fetch('http://localhost:5001/api/keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newKeyName, permissions }),
    })
      .then((res) => res.json())
      .then((newKey) => {
        fetchApiKeys(); // Refetch to get the updated list with censored key
        setNewlyGeneratedKey(newKey.key); // Show the full key in a modal
        setIsCreateDialogOpen(false);
        setIsViewDialogOpen(true);
        setNewKeyName('');
        setPermissions(allPermissions);
      });
  };

  const deleteApiKey = (id: string) => {
    fetch(`http://localhost:5001/api/keys/${id}`, { method: 'DELETE' }).then((res) => {
      if (res.ok) {
        fetchApiKeys();
      }
    });
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    fetch(`http://localhost:5001/api/keys/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => res.json())
      .then((updatedKey) => {
        setApiKeys((prevKeys) =>
          prevKeys.map((key) => (key.id === id ? { ...key, status: updatedKey.status } : key))
        );
      });
  };

  const handlePermissionChange = (key: string, checked: boolean) => {
    setPermissions((prev) => ({ ...prev, [key]: checked }));
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">API Key Management</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>+ Generate New Key</Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 text-white border-gray-700">
            <DialogHeader>
              <DialogTitle>Generate New API Key</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="keyName" className="text-right">
                  Key Name
                </Label>
                <Input
                  id="keyName"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="col-span-3 bg-gray-700 border-gray-600"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Permissions</Label>
                <ScrollArea className="col-span-3 h-72 rounded-md border border-gray-700 p-4">
                  <div className="space-y-4">
                    {Object.entries(PERMISSIONS_CONFIG).map(([group, perms]) => (
                      <div key={group}>
                        <h4 className="font-semibold text-md mb-2">{group}</h4>
                        {Object.entries(perms).map(([key, description]) => (
                          <div key={key} className="flex items-start space-x-3 mb-3">
                            <Checkbox
                              id={key}
                              checked={permissions[key as keyof typeof permissions]}
                              onCheckedChange={(checked) => handlePermissionChange(key, !!checked)}
                              className="mt-1"
                            />
                            <div className="grid gap-1.5 leading-none">
                              <label htmlFor={key} className="text-sm font-medium">
                                {key}
                              </label>
                              <p className="text-xs text-gray-400">{description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleGenerateKey} disabled={!newKeyName.trim()}>Generate</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>New API Key Generated</DialogTitle>
          </DialogHeader>
          <div className="p-4 my-2 rounded-lg bg-yellow-900 border border-yellow-700 text-yellow-300">
            Please copy this key now. You will not be able to see it again.
          </div>
          <div className="flex items-center space-x-2">
            <Input readOnly value={newlyGeneratedKey || ''} className="flex-1 bg-gray-700 border-gray-600 text-white font-mono" />
            <Button
              size="sm"
              onClick={() => {
                if (newlyGeneratedKey) navigator.clipboard.writeText(newlyGeneratedKey);
              }}
            >
              Copy
            </Button>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setNewlyGeneratedKey(null)}>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow className="border-gray-700">
            <TableHead className="text-white">Name</TableHead>
            <TableHead className="text-white">Key</TableHead>
            <TableHead className="text-white">Status</TableHead>
            <TableHead className="text-white">Created At</TableHead>
            <TableHead className="text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apiKeys.map((apiKey) => (
            <TableRow key={apiKey.id} className="border-gray-800">
              <TableCell>{apiKey.name}</TableCell>
              <TableCell className="font-mono">{apiKey.key}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`status-${apiKey.id}`}
                    checked={apiKey.status === 'Active'}
                    onCheckedChange={() => handleToggleStatus(apiKey.id, apiKey.status)}
                  />
                  <Badge className={apiKey.status === 'Active' ? 'bg-green-600' : 'bg-red-600'}>
                    {apiKey.status}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>{new Date(apiKey.createdAt * 1000).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button variant="destructive" size="sm" onClick={() => deleteApiKey(apiKey.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApiKeys;