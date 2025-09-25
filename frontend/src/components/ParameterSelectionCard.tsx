import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Settings, Database, Target, Map, Filter } from 'lucide-react';
import { ModelParameters } from '@/types';

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
              <SelectItem value="Transport">Transport</SelectItem>
              <SelectItem value="Solid Waste">Solid Waste</SelectItem>
              <SelectItem value="Water Management">Water Management</SelectItem>
              <SelectItem value="Public Safety">Public Safety</SelectItem>
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

        {/* AI Pre-Processing */}
        <div className="space-y-3">
          <Label className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-slate-600" />
            <span>AI Pre-Processing</span>
          </Label>
          <div className="space-y-3 pl-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="handle-missing-data"
                checked={parameters.handleMissingData}
                onCheckedChange={(checked) => updateParameter('handleMissingData', checked)}
              />
              <Label htmlFor="handle-missing-data" className="text-sm font-normal">
                Handle Missing Data
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="data-cleaning"
                checked={parameters.dataCleaning}
                onCheckedChange={(checked) => updateParameter('dataCleaning', checked)}
              />
              <Label htmlFor="data-cleaning" className="text-sm font-normal">
                Data Cleaning
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="feature-scaling"
                checked={parameters.featureScaling}
                onCheckedChange={(checked) => updateParameter('featureScaling', checked)}
              />
              <Label htmlFor="feature-scaling" className="text-sm font-normal">
                Feature Scaling
              </Label>
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