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
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  status: string;
  createdAt: number;
}

const ApiKeys: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [permissions, setPermissions] = useState({
    readAccess: true,
    writeAccess: false,
    deleteAccess: false,
    adminAccess: false,
  });
  const [newlyGeneratedKey, setNewlyGeneratedKey] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:5001/api/keys')
      .then((res) => res.json())
      .then((data) => setApiKeys(data));
  }, []);

  const handleGenerateKey = () => {
    fetch('http://localhost:5001/api/keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newKeyName, permissions }),
    })
      .then((res) => res.json())
      .then((newKey) => {
        setApiKeys((prevKeys) => [...prevKeys, newKey]);
        setNewlyGeneratedKey(newKey.key);
        setIsDialogOpen(false);
        setNewKeyName('');
      });
  };

  const deleteApiKey = (id: string) => {
    fetch(`http://localhost:5001/api/keys/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (res.ok) {
          setApiKeys((prevKeys) => prevKeys.filter((key) => key.id !== id));
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
          prevKeys.map((key) => (key.id === id ? updatedKey : key))
        );
      });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">API Key Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>+ Generate New Key</Button>
          </DialogTrigger>
          <DialogContent>
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
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Permissions</Label>
                <div className="col-span-3 space-y-2">
                  {Object.keys(permissions).map((key) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={permissions[key as keyof typeof permissions]}
                        onCheckedChange={(checked) =>
                          setPermissions((prev) => ({ ...prev, [key]: checked }))
                        }
                      />
                      <label htmlFor={key} className="text-sm font-medium leading-none">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleGenerateKey}>Generate</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {newlyGeneratedKey && (
        <div className="p-4 mb-4 border rounded-lg bg-green-50 border-green-200">
          <h3 className="font-bold text-lg text-green-800">New API Key Generated</h3>
          <p className="text-sm text-yellow-600 my-2 p-2 rounded-lg bg-yellow-50 border border-yellow-200">
            Please copy this key now. You will not be able to see it again.
          </p>
          <div className="flex items-center space-x-2">
            <Input readOnly value={newlyGeneratedKey} className="flex-1" />
            <Button
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(newlyGeneratedKey);
              }}
            >
              Copy
            </Button>
            <Button size="sm" variant="outline" onClick={() => setNewlyGeneratedKey(null)}>
              Hide
            </Button>
          </div>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apiKeys.map((apiKey) => (
            <TableRow key={apiKey.id}>
              <TableCell>{apiKey.name}</TableCell>
              <TableCell>{apiKey.key}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`status-${apiKey.id}`}
                    checked={apiKey.status === 'Active'}
                    onCheckedChange={() => handleToggleStatus(apiKey.id, apiKey.status)}
                  />
                  <Badge variant={apiKey.status === 'Active' ? 'default' : 'destructive'}>
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