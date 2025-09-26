export interface ModelParameters {
  analyticsType: string;
  domain: string;
  modelType: string;
  trainingTime: number;
  handleMissingData: string;
  dataCleaning: string;
  featureScaling: string;
  geoFencing: boolean;
  calculateDistance: boolean;
  learningRate: number;
  epochs: number;
  batchSize: number;
  validationType: 'train-test' | 'k-fold' | 'leave-one-out' | 'stratified-k-fold';
  trainTestSplit: number;
  kFolds: number;
}

export interface GenerationResult {
  message: string;
  modelName: string;
  downloadUrl: string;
  apiEndpoint: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
}

export interface PredictionResult {
  message: string;
  prediction: {
    riskScore: number;
    category: string;
    confidence: string;
  };
}

export interface Project {
  id:string;
  name: string;
  description: string;
  owner: string;
  createdAt: number;
  domainType?: string;
}

export interface DataSource {
  id: string;
  host?: string;
  port?: string;
  database?: string;
  username?: string;
  password?: string;
}

export interface Model {
  fileName: string;
  fileSize: number;
  createdAt: number;
}

export interface KPIData {
  activeModels: number;
  totalDatasets: number;
  serverLoad: number;
  serversOnline: number;
  serversTotal: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface TrainingLog {
  timestamp: string;
  level: 'info' | 'epoch' | 'warning' | 'error' | 'system';
  message: string;
}

export interface ChartData {
  time: number;
  value: number;
}

export interface Server {
  id: number;
  ip: string;
  status: 'online' | 'offline';
  cpuTemp: number;
  gpuTemp: number;
  memoryUsage: number;
  diskUsage: number;
  cpuHistory: { value: number }[];
  gpuHistory: { value: number }[];
  processes: string[];
}

export interface MetricChartProps {
  data: { value: number }[];
  color: string;
}

export interface TemperatureDisplayProps {
  label: string;
  temp: number;
}