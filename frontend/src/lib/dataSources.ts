import { Database, Box, Snowflake, MessageSquare, Rabbit, Share2 } from 'lucide-react';
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
  type: 'database' | 'streaming';
  isConnecting?: boolean;
  isExternalConnected?: boolean;
}

export const initialDataSources: DataSource[] = [
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    description: 'Connect to PostgreSQL databases for structured data.',
    icon: Database,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    status: 'disconnected',
    connections: 0,
    type: 'database',
  },
  {
    id: 'aws-s3',
    name: 'AWS S3',
    description: 'Access data stored in Amazon S3 buckets.',
    icon: Box,
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    status: 'disconnected',
    connections: 0,
    type: 'database',
  },
  {
    id: 'snowflake',
    name: 'Snowflake',
    description: 'Connect to Snowflake data warehouse.',
    icon: Snowflake,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-400/10',
    status: 'disconnected',
    connections: 0,
    type: 'database',
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    description: 'Connect to MongoDB for NoSQL document storage.',
    icon: Database,
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    status: 'disconnected',
    connections: 0,
    type: 'database',
  },
  {
    id: 'kafka',
    name: 'Apache Kafka',
    description: 'Connect to Kafka for real-time event streaming.',
    icon: Share2,
    color: 'text-gray-300',
    bgColor: 'bg-gray-500/10',
    status: 'disconnected',
    connections: 0,
    type: 'streaming',
  },
  {
    id: 'mqtt',
    name: 'MQTT',
    description: 'Connect to MQTT brokers for IoT messaging.',
    icon: MessageSquare,
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    status: 'disconnected',
    connections: 0,
    type: 'streaming',
  },
  {
    id: 'rabbitmq',
    name: 'RabbitMQ',
    description: 'Use RabbitMQ for robust message queuing.',
    icon: Rabbit,
    color: 'text-red-400',
    bgColor: 'bg-red-400/10',
    status: 'disconnected',
    connections: 0,
    type: 'streaming',
  },
];