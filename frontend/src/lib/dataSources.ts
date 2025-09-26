import { Database, Box, Snowflake } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface DataSource {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  status: 'connected' | 'disconnected';
  connections: number;
  isConnecting?: boolean;
  isExternalConnected?: boolean;
}

export const initialDataSources: DataSource[] = [
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    description: 'Connect to PostgreSQL databases for structured data',
    icon: Database,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    status: 'disconnected',
    connections: 0,
  },
  {
    id: 'aws-s3',
    name: 'AWS S3',
    description: 'Access data stored in Amazon S3 buckets',
    icon: Box,
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    status: 'disconnected',
    connections: 0,
  },
  {
    id: 'snowflake',
    name: 'Snowflake',
    description: 'Connect to Snowflake data warehouse',
    icon: Snowflake,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-400/10',
    status: 'disconnected',
    connections: 0,
  },
];