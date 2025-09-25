import axios from 'axios';
import { ModelParameters, GenerationResult, PredictionResult } from '@/types';

const API_BASE_URL = 'http://localhost:5001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  uploadFile: async (file: File): Promise<{ message: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
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
};