import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Settings, FileSliders as Sliders, Target } from 'lucide-react';
import { ModelParameters } from '@/types';

interface ConfigurationCardProps {
  parameters: ModelParameters;
  onParametersChange: (parameters: ModelParameters) => void;
}

export function ConfigurationCard({ parameters, onParametersChange }: ConfigurationCardProps) {
  const updateParameter = (key: keyof ModelParameters, value: any) => {
    onParametersChange({
      ...parameters,
      [key]: value,
    });
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Settings className="h-5 w-5 text-indigo-400" />
          <span>Step 2: Configure & Tune</span>
        </CardTitle>
        <CardDescription className="text-slate-400">
          Configure model parameters and hyperparameters for optimal performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800">
            <TabsTrigger value="general" className="data-[state=active]:bg-slate-700">General</TabsTrigger>
            <TabsTrigger value="hyperparameters" className="data-[state=active]:bg-slate-700">Hyperparameters</TabsTrigger>
            <TabsTrigger value="validation" className="data-[state=active]:bg-slate-700">Validation</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Analytics Type</Label>
                <Select
                  value={parameters.analyticsType}
                  onValueChange={(value) => updateParameter('analyticsType', value)}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="Predictive Analytics">Predictive Analytics</SelectItem>
                    <SelectItem value="Complex Event Processing">Complex Event Processing</SelectItem>
                    <SelectItem value="Sentiment Analytics">Sentiment Analytics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Domain</Label>
                <Select
                  value={parameters.domain}
                  onValueChange={(value) => updateParameter('domain', value)}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="Oil and Gas">Oil and Gas</SelectItem>
                    <SelectItem value="Airports">Airports</SelectItem>
                    <SelectItem value="Traffic">Traffic</SelectItem>
                    <SelectItem value="City">City</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="text-slate-300">Model Type</Label>
                <Select
                  value={parameters.modelType}
                  onValueChange={(value) => updateParameter('modelType', value)}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="Regression">Regression</SelectItem>
                    <SelectItem value="Classification">Classification</SelectItem>
                    <SelectItem value="Anomaly Detection">Anomaly Detection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-slate-300">AI Pre-Processing</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="handle-missing-data"
                    checked={!!parameters.handleMissingData}
                    onCheckedChange={(checked) => updateParameter('handleMissingData', checked === true)}
                  />
                  <Label htmlFor="handle-missing-data" className="text-sm text-slate-300">
                    Handle Missing Data
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="data-cleaning"
                    checked={!!parameters.dataCleaning}
                    onCheckedChange={(checked) => updateParameter('dataCleaning', checked === true)}
                  />
                  <Label htmlFor="data-cleaning" className="text-sm text-slate-300">
                    Data Cleaning
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="feature-scaling"
                    checked={!!parameters.featureScaling}
                    onCheckedChange={(checked) => updateParameter('featureScaling', checked === true)}
                  />
                  <Label htmlFor="feature-scaling" className="text-sm text-slate-300">
                    Feature Scaling
                  </Label>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hyperparameters" className="space-y-6 mt-6">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-slate-300">Learning Rate: {parameters.learningRate}</Label>
                <Slider
                  value={[parameters.learningRate]}
                  onValueChange={(value) => updateParameter('learningRate', value[0])}
                  max={1}
                  min={0.001}
                  step={0.001}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>0.001</span>
                  <span>1.0</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Epochs</Label>
                  <Input
                    type="number"
                    value={parameters.epochs}
                    onChange={(e) => updateParameter('epochs', parseInt(e.target.value) || 100)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Batch Size</Label>
                  <Select
                    value={parameters.batchSize.toString()}
                    onValueChange={(value) => updateParameter('batchSize', parseInt(value))}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="16">16</SelectItem>
                      <SelectItem value="32">32</SelectItem>
                      <SelectItem value="64">64</SelectItem>
                      <SelectItem value="128">128</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="validation" className="space-y-6 mt-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-slate-300">Validation Strategy</Label>
                <Select
                  value={parameters.validationType}
                  onValueChange={(value) => updateParameter('validationType', value)}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="train-test">Train-Test Split</SelectItem>
                    <SelectItem value="k-fold">K-Fold Cross-Validation</SelectItem>
                    <SelectItem value="leave-one-out">Leave-One-Out Cross-Validation</SelectItem>
                    <SelectItem value="stratified-k-fold">Stratified K-Fold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {parameters.validationType === 'train-test' && (
                <div className="space-y-3">
                  <Label className="text-slate-300">Train-Test Split: {parameters.trainTestSplit}% / {100 - parameters.trainTestSplit}%</Label>
                  <Slider
                    value={[parameters.trainTestSplit]}
                    onValueChange={(value) => updateParameter('trainTestSplit', value[0])}
                    max={90}
                    min={60}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>60% Train</span>
                    <span>90% Train</span>
                  </div>
                </div>
              )}

              {parameters.validationType === 'k-fold' && (
                <div className="space-y-2">
                  <Label className="text-slate-300">Number of Folds</Label>
                  <Select
                    value={parameters.kFolds.toString()}
                    onValueChange={(value) => updateParameter('kFolds', parseInt(value))}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="3">3 Folds</SelectItem>
                      <SelectItem value="5">5 Folds</SelectItem>
                      <SelectItem value="10">10 Folds</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}