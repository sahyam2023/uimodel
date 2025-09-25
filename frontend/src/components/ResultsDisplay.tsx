import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Download, Play, CircleCheck as CheckCircle, Loader as Loader2 } from 'lucide-react';
import { GenerationResult, PredictionResult } from '@/types';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface ResultsDisplayProps {
  result: GenerationResult;
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
  const [predictionInput, setPredictionInput] = useState('{"temperature": 25, "humidity": 60, "traffic_density": "high"}');
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [isTestingPrediction, setIsTestingPrediction] = useState(false);
  const { toast } = useToast();

  const handleDownload = () => {
    const downloadUrl = apiService.getDownloadUrl(result.modelName);
    window.open(downloadUrl, '_blank');
  };

  const handleTestPrediction = async () => {
    setIsTestingPrediction(true);
    try {
      const inputData = JSON.parse(predictionInput);
      const response = await apiService.predict(inputData);
      setPredictionResult(response);
      toast({
        title: "Prediction Successful",
        description: "Model prediction completed successfully!",
      });
    } catch (error) {
      toast({
        title: "Prediction Failed",
        description: "Failed to run prediction. Please check your input format.",
        variant: "destructive",
      });
    } finally {
      setIsTestingPrediction(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="w-full border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            <span>Model Generation Results</span>
          </CardTitle>
          <CardDescription className="text-green-700">
            Your machine learning model has been successfully generated and is ready for use.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-slate-700">Model Name</Label>
              <p className="text-sm text-slate-600 bg-white p-2 rounded border mt-1">
                {result.modelName}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700">API Endpoint</Label>
              <p className="text-sm text-slate-600 bg-white p-2 rounded border mt-1 font-mono">
                {result.apiEndpoint}
              </p>
            </div>
          </div>
          
          <Button onClick={handleDownload} className="w-full md:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Download Model
          </Button>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Test Model Predictions</CardTitle>
          <CardDescription>
            Test your generated model with sample data to see how it performs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prediction-input">Input Data (JSON format)</Label>
            <Textarea
              id="prediction-input"
              value={predictionInput}
              onChange={(e) => setPredictionInput(e.target.value)}
              className="font-mono text-sm"
              rows={4}
              placeholder='{"key": "value"}'
            />
          </div>
          
          <Button
            onClick={handleTestPrediction}
            disabled={isTestingPrediction}
            variant="outline"
          >
            {isTestingPrediction ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Prediction...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Run Prediction
              </>
            )}
          </Button>

          {predictionResult && (
            <div className="space-y-2">
              <Label>Prediction Result</Label>
              <pre className="bg-slate-50 p-4 rounded-md text-sm overflow-x-auto border">
{JSON.stringify(predictionResult, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}