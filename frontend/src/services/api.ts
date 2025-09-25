import axios from 'axios';
import { ModelParameters, GenerationResult, PredictionResult, Project, DataSource, Model } from '@/types';

const API_BASE_URL = 'http://localhost:5001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Project Management
  getProjects: async (): Promise<Project[]> => {
    const response = await api.get('/api/projects');
    return response.data;
  },
  getProjectById: async (id: string): Promise<Project> => {
    const response = await api.get(`/api/projects/${id}`);
    return response.data;
  },
  createProject: async (projectData: Omit<Project, 'id' | 'createdAt'>): Promise<Project> => {
    const response = await api.post('/api/projects', projectData);
    return response.data;
  },

  // Data Sources
  testConnection: async (dataSource: DataSource): Promise<{ status: string; message: string }> => {
    const response = await api.post('/api/test_connection', dataSource);
    return response.data;
  },

  // Model Registry
  getModels: async (): Promise<Model[]> => {
    const response = await api.get('/api/models');
    return response.data;
  },

  // Workspace
  uploadFile: async (file: File): Promise<{ message: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  generateModel: async (parameters: ModelParameters): Promise<GenerationResult> => {
    const response = await api.post('/api/generate_model', parameters);
    return response.data;
  },
  predict: async (input: any): Promise<PredictionResult> => {
    const response = await api.post('/api/predict', { input });
    return response.data;
  },
  getDownloadUrl: (filename: string): string => {
    return `${API_BASE_URL}/api/download_model/${filename}`;
  },
  trainModel: (projectId: string, trainingTime: number): EventSource => {
    const url = `${API_BASE_URL}/api/train_model_stream?projectId=${encodeURIComponent(projectId)}&trainingTime=${encodeURIComponent(trainingTime)}`;
    return new EventSource(url);
  },
};