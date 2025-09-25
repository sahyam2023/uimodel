import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Settings, Database, Target, Map, Filter, Clock } from 'lucide-react';
import { ModelParameters } from '@/types';
import { Slider } from '@/components/ui/slider';

interface ParameterSelectionCardProps {
  parameters: ModelParameters;
  onParametersChange: (parameters: ModelParameters) => void;
}

export function ParameterSelectionCard({ parameters, onParametersChange }: ParameterSelectionCardProps) {
  const updateParameter = (key: keyof ModelParameters, value: any) => {
    onParametersChange({
      ...parameters,
      [key]: value,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5 text-indigo-600" />
          <span>Step 2: Configure Model Parameters</span>
        </CardTitle>
        <CardDescription>
          Fine-tune your model settings to optimize performance for your specific use case
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Analytics Type */}
        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <Database className="h-4 w-4 text-slate-600" />
            <span>Analytics Type</span>
          </Label>
          <Select
            value={parameters.analyticsType}
            onValueChange={(value) => updateParameter('analyticsType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select analytics type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Predictive Analytics">Predictive Analytics</SelectItem>
              <SelectItem value="Complex Event Processing">Complex Event Processing</SelectItem>
              <SelectItem value="Sentiment Analytics">Sentiment Analytics</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* City Domain */}
        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-slate-600" />
            <span>City Domain</span>
          </Label>
          <Select
            value={parameters.domain}
            onValueChange={(value) => updateParameter('domain', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select city domain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Oil and Gas">Oil and Gas</SelectItem>
              <SelectItem value="Airports">Airports</SelectItem>
              <SelectItem value="Traffic">Traffic</SelectItem>
              <SelectItem value="City">City</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Model Type */}
        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <Settings className="h-4 w-4 text-slate-600" />
            <span>Model Type</span>
          </Label>
          <Select
            value={parameters.modelType}
            onValueChange={(value) => updateParameter('modelType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select model type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Regression">Regression</SelectItem>
              <SelectItem value="Classification">Classification</SelectItem>
              <SelectItem value="Anomaly Detection">Anomaly Detection</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Training Time */}
        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-slate-600" />
            <span>Training Time (minutes)</span>
          </Label>
          <div className="flex items-center space-x-4 pt-2">
            <Slider
              value={[parameters.trainingTime]}
              onValueChange={(value) => updateParameter('trainingTime', value[0])}
              min={4}
              max={60}
              step={1}
              className="flex-1"
            />
            <span className="font-medium text-slate-400 w-16 text-center">
              {parameters.trainingTime} min
            </span>
          </div>
          <p className="text-xs text-slate-500 pl-1">
            The more time you train for, the better the accuracy.
          </p>
        </div>

        {/* AI Pre-Processing */}
        <div className="space-y-3">
          <Label className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-slate-600" />
            <span>AI Pre-Processing</span>
          </Label>
          <div className="space-y-4 pl-6">
            <div className="space-y-2">
              <Label htmlFor="handle-missing-data" className="text-sm font-normal">
                Handle Missing Data
              </Label>
              <Select
                value={parameters.handleMissingData}
                onValueChange={(value) => updateParameter('handleMissingData', value)}
              >
                <SelectTrigger id="handle-missing-data">
                  <SelectValue placeholder="Select method..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="impute_mean">Impute (Mean)</SelectItem>
                  <SelectItem value="impute_median">Impute (Median)</SelectItem>
                  <SelectItem value="drop_row">Drop Row</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="data-cleaning" className="text-sm font-normal">
                Data Cleaning
              </Label>
              <Select
                value={parameters.dataCleaning}
                onValueChange={(value) => updateParameter('dataCleaning', value)}
              >
                <SelectTrigger id="data-cleaning">
                  <SelectValue placeholder="Select method..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="remove_duplicates">Remove Duplicates</SelectItem>
                  <SelectItem value="trim_whitespace">Trim Whitespace</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="feature-scaling" className="text-sm font-normal">
                Feature Scaling
              </Label>
              <Select
                value={parameters.featureScaling}
                onValueChange={(value) => updateParameter('featureScaling', value)}
              >
                <SelectTrigger id="feature-scaling">
                  <SelectValue placeholder="Select method..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="standard_scaler">Standard Scaler</SelectItem>
                  <SelectItem value="min_max_scaler">Min-Max Scaler</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Geo-Spatial Analytics */}
        <div className="space-y-3">
          <Label className="flex items-center space-x-2">
            <Map className="h-4 w-4 text-slate-600" />
            <span>Geo-Spatial Analytics</span>
          </Label>
          <div className="space-y-3 pl-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="geo-fencing"
                checked={parameters.geoFencing}
                onCheckedChange={(checked) => updateParameter('geoFencing', checked)}
              />
              <Label htmlFor="geo-fencing" className="text-sm font-normal">
                Enable Geo-Fencing Alerts
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="calculate-distance"
                checked={parameters.calculateDistance}
                onCheckedChange={(checked) => updateParameter('calculateDistance', checked)}
              />
              <Label htmlFor="calculate-distance" className="text-sm font-normal">
                Calculate Distance Travelled
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}