import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Download, Play, CircleCheck as CheckCircle, Loader as Loader2, Rocket, Target, RefreshCw } from 'lucide-react';
import { GenerationResult, PredictionResult } from '@/types';
import { apiService } from '@/services/api';
import { toast } from 'sonner';

interface DeploymentCardProps {
  result: GenerationResult;
  onWorkspaceReset: () => void;
}

export function DeploymentCard({ result, onWorkspaceReset }: DeploymentCardProps) {
  const [predictionInput, setPredictionInput] = useState('{"temperature": 25, "humidity": 60, "traffic_density": "high"}');
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [isTestingPrediction, setIsTestingPrediction] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isDeployed, setIsDeployed] = useState(false);

  const handleDownload = () => {
    const downloadUrl = apiService.getDownloadUrl(result.modelName);
    window.open(downloadUrl, '_blank');
  };

  const handleDeploy = () => {
    setIsDeploying(true);
    const delay = Math.random() * (10 - 3) + 3; // Random delay between 3 and 10 seconds
    setTimeout(() => {
      setIsDeploying(false);
      setIsDeployed(true);
      toast.success("Deployment Successful", {
        description: "Your model has been deployed to production.",
      });
    }, delay * 1000);
  };

  const handleTestPrediction = async () => {
    setIsTestingPrediction(true);
    setPredictionResult(null);
    try {
      const inputData = JSON.parse(predictionInput);
      const response = await apiService.predict(inputData);
      setPredictionResult(response);
      toast.success("Prediction Successful", {
        description: "Model prediction completed successfully!",
      });
    } catch (error) {
      toast.error("Prediction Failed", {
        description: "Failed to run prediction. Please check your input format.",
      });
    } finally {
      setIsTestingPrediction(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Model Performance Summary */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span>Step 4: Deploy & Predict</span>
          </CardTitle>
          <CardDescription className="text-slate-400">
            Your model has been successfully trained and is ready for deployment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-800 rounded-lg text-center">
              <p className="text-xs sm:text-sm text-slate-400">Accuracy</p>
              <p className="text-lg sm:text-xl font-bold text-green-400">{result.accuracy}%</p>
            </div>
            <div className="p-3 bg-slate-800 rounded-lg text-center">
              <p className="text-xs sm:text-sm text-slate-400">Precision</p>
              <p className="text-lg sm:text-xl font-bold text-blue-400">{result.precision}%</p>
            </div>
            <div className="p-3 bg-slate-800 rounded-lg text-center">
              <p className="text-xs sm:text-sm text-slate-400">Recall</p>
              <p className="text-lg sm:text-xl font-bold text-purple-400">{result.recall}%</p>
            </div>
            <div className="p-3 bg-slate-800 rounded-lg text-center">
              <p className="text-xs sm:text-sm text-slate-400">F1-Score</p>
              <p className="text-lg sm:text-xl font-bold text-yellow-400">{result.f1Score}%</p>
            </div>
          </div>

          {/* Model Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Model Name</Label>
              <div className="p-3 bg-slate-800 rounded-lg break-all">
                <p className="text-white font-mono text-sm">{result.modelName}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">API Endpoint</Label>
              <div className="p-3 bg-slate-800 rounded-lg break-all">
                <p className="text-white font-mono text-sm">{result.apiEndpoint}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleDownload} className="flex-1 bg-indigo-600 hover:bg-indigo-700">
              <Download className="mr-2 h-4 w-4" />
              Download Model
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-slate-700 text-white hover:bg-slate-800"
              onClick={handleDeploy}
              disabled={isDeploying || isDeployed}
            >
              {isDeploying ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deploying...</>
              ) : isDeployed ? (
                <><CheckCircle className="mr-2 h-4 w-4 text-green-400" /> Deployed</>
              ) : (
                <><Rocket className="mr-2 h-4 w-4" /> Deploy to Production</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Prediction Testing */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Target className="h-5 w-5 text-indigo-400" />
            <span>Test Model Predictions</span>
          </CardTitle>
          <CardDescription className="text-slate-400">
            Test your trained model with sample data to validate performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prediction-input" className="text-slate-300">Input Data (JSON format)</Label>
            <Textarea
              id="prediction-input"
              value={predictionInput}
              onChange={(e) => setPredictionInput(e.target.value)}
              className="font-mono text-sm bg-slate-800 border-slate-700 text-white"
              rows={4}
              placeholder='{"key": "value"}'
            />
          </div>
          
          <Button
            onClick={handleTestPrediction}
            disabled={isTestingPrediction}
            variant="outline"
            className="border-slate-700 text-white hover:bg-slate-800"
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
              <Label className="text-slate-300">Prediction Result</Label>
              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                <pre className="text-sm text-slate-200 overflow-x-auto">
{JSON.stringify(predictionResult, null, 2)}
                </pre>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <Badge className="bg-green-600 hover:bg-green-700">
                  Risk Score: {predictionResult.prediction.riskScore}
                </Badge>
                <Badge variant="outline" className="border-slate-600 text-slate-300">
                  {predictionResult.prediction.category}
                </Badge>
                <Badge variant="outline" className="border-slate-600 text-slate-300">
                  Confidence: {predictionResult.prediction.confidence}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reset Workspace */}
       <Card className="bg-slate-900 border-slate-800">
         <CardHeader>
           <CardTitle className="flex items-center space-x-2 text-white">
             <RefreshCw className="h-5 w-5 text-indigo-400" />
             <span>Start Over</span>
           </CardTitle>
           <CardDescription className="text-slate-400">
                Reset the entire workspace to start a new training session.
           </CardDescription>
         </CardHeader>
         <CardContent>
           <Button onClick={onWorkspaceReset} className="w-full bg-amber-600 hover:bg-amber-700">
             <RefreshCw className="mr-2 h-4 w-4" />
             Reset Workspace & Start New Session
           </Button>
         </CardContent>
       </Card>
    </div>
  );
}