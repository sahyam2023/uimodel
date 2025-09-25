export interface ModelParameters {
  analyticsType: string;
  domain: string;
  modelType: string;
  handleMissingData: boolean;
  dataCleaning: boolean;
  featureScaling: boolean;
  geoFencing: boolean;
  calculateDistance: boolean;
  learningRate: number;
  epochs: number;
  batchSize: number;
  validationType: 'train-test' | 'k-fold';
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
  id: string;
  name: string;
  description: string;
  owner: string;
  createdAt: number;
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
  monthlyCost: number;
  apiPredictions: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}