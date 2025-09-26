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

interface ApiKey {
  id: string;
  name: string;
  key: string;
  status: string;
  createdAt: number;
}

const ApiKeys: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);

  useEffect(() => {
    fetch('http://localhost:5001/api/keys')
      .then((res) => res.json())
      .then((data) => setApiKeys(data));
  }, []);

  const generateNewKey = () => {
    fetch('http://localhost:5001/api/keys', { method: 'POST' })
      .then((res) => res.json())
      .then((newKey) => {
        setApiKeys((prevKeys) => [...prevKeys, newKey]);
      });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">API Key Management</h1>
        <Button onClick={generateNewKey}>+ Generate New Key</Button>
      </div>
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
                <Badge variant={apiKey.status === 'Active' ? 'default' : 'destructive'}>
                  {apiKey.status}
                </Badge>
              </TableCell>
              <TableCell>{new Date(apiKey.createdAt * 1000).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button variant="destructive" size="sm">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApiKeys;