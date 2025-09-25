import { ModelParameters, TrainingLog, ChartData } from '@/types';

const LOG_MESSAGES = [
  'Initializing data loaders...',
  'Applying data augmentation transformations...',
  'Checking for GPU availability...',
  'Optimizer state loaded.',
  'Learning rate scheduler updated.',
  'Performing a validation step...',
  'Calculating gradient norms...',
  'Memory cache cleared.',
  'Batch normalization layers frozen.',
  'Feature extraction layer un-frozen for fine-tuning.',
];

export function generateLog(
  type: 'start' | 'stop' | 'log' | 'epoch' | 'end',
  params?: ModelParameters,
  epoch?: number
): TrainingLog {
  const timestamp = new Date().toLocaleTimeString();
  let level: TrainingLog['level'] = 'info';
  let message = '';

  switch (type) {
    case 'start':
      level = 'system';
      message = `Training started with model '${params?.modelType}' on domain '${params?.domain}'.`;
      break;
    case 'stop':
      level = 'system';
      message = 'Training halted by user.';
      break;
    case 'log':
      level = 'info';
      message = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
      break;
    case 'epoch':
      level = 'epoch';
      const loss = (Math.random() * 0.5 + 0.1).toFixed(4);
      const accuracy = (70 + Math.random() * 25).toFixed(2);
      message = `Epoch ${epoch}/${params?.epochs} - Loss: ${loss}, Accuracy: ${accuracy}%`;
      break;
    case 'end':
      level = 'system';
      message = 'Training process finished. Finalizing model...';
      break;
  }

  return { timestamp, level, message };
}

export function generateChartData(
  elapsedTime: number, 
  totalDuration: number, 
  totalEpochs: number,
  type: 'accuracy' | 'loss' | 'utilization'
): ChartData {
    const progress = elapsedTime / totalDuration;
    let value = 0;

    switch(type) {
        case 'accuracy':
            // Accuracy starts low and increases, with some noise
            value = 65 + (progress * 30) + (Math.random() - 0.5) * 5;
            if(progress > 0.9) value += Math.random() * 5; // final boost
            break;
        case 'loss':
            // Loss starts high and decreases
            value = 0.8 - (progress * 0.7) + (Math.random() - 0.5) * 0.1;
            break;
        case 'utilization':
            // Simulates fluctuating resource usage
            value = 70 + Math.sin(elapsedTime / 10) * 15 + Math.random() * 5;
            break;
    }
    
    return {
        time: elapsedTime,
        value: Math.max(0, Math.min(100, parseFloat(value.toFixed(2)))), // Clamp between 0 and 100
    };
}