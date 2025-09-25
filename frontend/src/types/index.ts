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
  status: 'Active' | 'Completed' | 'Draft';
  owner: string;
  created: string;
  accuracy?: number;
}

export interface Model {
  id: string;
  name: string;
  version: string;
  status: 'Production' | 'Staging' | 'Development';
  accuracy: number;
  created: string;
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