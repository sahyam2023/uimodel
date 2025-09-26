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
      // Make log values more realistic based on progress
      const progress = epoch && params?.epochs ? epoch / params.epochs : Math.random();
      const baseAccuracy = 60 + progress * 35;
      const accuracy = baseAccuracy + (Math.random() - 0.5) * 5;
      const loss = 0.8 * Math.exp(-progress * 3) + (Math.random() * 0.1);
      message = `Epoch ${epoch}/${params?.epochs} - Loss: ${loss.toFixed(4)}, Accuracy: ${accuracy.toFixed(2)}%`;
      break;
    case 'end':
      level = 'system';
      message = 'Training process finished. Finalizing model...';
      break;
  }

  return { timestamp, level, message };
}

// Sigmoid-like function for more realistic curves
const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

export function generateChartData(
  elapsedTime: number, 
  totalDuration: number, 
  totalEpochs: number,
  type: 'accuracy' | 'loss' | 'utilization'
): ChartData {
    const progress = totalDuration > 0 ? elapsedTime / totalDuration : 0;
    let value = 0;

    switch(type) {
        case 'accuracy':
            // S-curve: starts slow, accelerates, then plateaus
            const scaledProgress = (progress - 0.5) * 12; // Scale progress for sigmoid
            const baseAccuracy = 65 + sigmoid(scaledProgress) * 30;
            const noise = (Math.random() - 0.5) * (5 - progress * 4); // Noise decreases over time
            value = baseAccuracy + noise;
            if(progress > 0.95) value += Math.random() * 2; // Final small boost
            break;
        case 'loss':
            // Exponential decay: starts high, drops quickly, then levels off
            const baseLoss = 0.8 * Math.exp(-progress * 5);
            const lossNoise = (Math.random() - 0.3) * 0.1 * (1 - progress); // Noise decreases
            value = baseLoss + lossNoise;
            break;
        case 'utilization':
            // More erratic resource usage
            const baseUtilization = 75;
            const cyclicalVariation = Math.sin(elapsedTime / 15) * 15; // Slower, wider cycle
            const randomSpikes = (Math.random() > 0.95) ? Math.random() * 10 : 0; // Occasional spikes
            const randomDips = (Math.random() > 0.98) ? Math.random() * -15 : 0; // Occasional dips
            value = baseUtilization + cyclicalVariation + randomSpikes + randomDips + (Math.random() - 0.5) * 4;
            break;
    }
    
    return {
        time: elapsedTime,
        // Clamp values to a sensible range
        value: Math.max(0, Math.min(100, parseFloat(value.toFixed(2)))),
    };
}