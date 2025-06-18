'use client';

import { useState } from 'react';
import { RefreshCw, Download, BarChart3, TrendingUp } from 'lucide-react';

interface RandomDataGeneratorProps {
  onDataGenerated: (data: number[]) => void;
}

interface DataConfig {
  length: number;
  trend: number;
  seasonality: number;
  noise: number;
  baseValue: number;
  seasonalityStrength: number;
}

export default function RandomDataGenerator({ onDataGenerated }: RandomDataGeneratorProps) {
  const [config, setConfig] = useState<DataConfig>({
    length: 48,
    trend: 0.5,
    seasonality: 12,
    noise: 0.1,
    baseValue: 100,
    seasonalityStrength: 0.3
  });

  const [generatedData, setGeneratedData] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate random number with normal distribution
  const randomNormal = (mean: number, std: number): number => {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return mean + z * std;
  };

  // Generate seasonal pattern
  const generateSeasonalPattern = (length: number, seasonality: number, strength: number): number[] => {
    const pattern = [];
    for (let i = 0; i < length; i++) {
      const seasonalValue = Math.sin((2 * Math.PI * i) / seasonality) * strength;
      pattern.push(seasonalValue);
    }
    return pattern;
  };

  // Generate trend
  const generateTrend = (length: number, trendStrength: number): number[] => {
    const trend = [];
    for (let i = 0; i < length; i++) {
      trend.push(i * trendStrength);
    }
    return trend;
  };

  // Generate random time series data
  const generateData = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const { length, trend, seasonality, noise, baseValue, seasonalityStrength } = config;
      
      // Generate components
      const trendComponent = generateTrend(length, trend);
      const seasonalComponent = generateSeasonalPattern(length, seasonality, seasonalityStrength);
      
      // Combine components
      const data: number[] = [];
      for (let i = 0; i < length; i++) {
        const trendValue = trendComponent[i];
        const seasonalValue = seasonalComponent[i];
        const noiseValue = randomNormal(0, noise);
        
        const value = baseValue + trendValue + seasonalValue + noiseValue;
        data.push(Math.max(0, value)); // Ensure non-negative values
      }
      
      setGeneratedData(data);
      onDataGenerated(data);
      setIsGenerating(false);
    }, 500);
  };

  // Export data as CSV
  const exportData = () => {
    if (generatedData.length === 0) return;
    
    const csvContent = `Period,Value\n${generatedData.map((value, index) => `${index + 1},${value.toFixed(2)}`).join('\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `holt-winters-sample-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Preset configurations
  const presets = [
    {
      name: 'Monthly Sales',
      config: { length: 36, trend: 2.0, seasonality: 12, noise: 5.0, baseValue: 100, seasonalityStrength: 0.4 }
    },
    {
      name: 'Quarterly Revenue',
      config: { length: 24, trend: 1.5, seasonality: 4, noise: 3.0, baseValue: 200, seasonalityStrength: 0.3 }
    },
    {
      name: 'Weekly Traffic',
      config: { length: 104, trend: 0.8, seasonality: 52, noise: 2.0, baseValue: 50, seasonalityStrength: 0.5 }
    },
    {
      name: 'Daily Orders',
      config: { length: 365, trend: 0.3, seasonality: 7, noise: 1.0, baseValue: 25, seasonalityStrength: 0.6 }
    }
  ];

  const applyPreset = (preset: any) => {
    setConfig(preset.config);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl border border-blue-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <RefreshCw className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Holt-Winters Sample Data Generator</h2>
          <p className="text-sm text-gray-600">Generate random time series data with trend and seasonality</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <div className="space-y-4">
          {/* Presets */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>Preset Configurations</span>
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => applyPreset(preset)}
                  className="p-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Parameters */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="font-semibold text-blue-800 mb-3">Data Parameters</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Length: {config.length} periods
                </label>
                <input
                  type="range"
                  min="12"
                  max="120"
                  value={config.length}
                  onChange={(e) => setConfig({ ...config, length: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trend Strength: {config.trend.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={config.trend}
                  onChange={(e) => setConfig({ ...config, trend: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seasonality Period: {config.seasonality}
                </label>
                <select
                  value={config.seasonality}
                  onChange={(e) => setConfig({ ...config, seasonality: Number(e.target.value) })}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={4}>4 (Quarterly)</option>
                  <option value={7}>7 (Weekly)</option>
                  <option value={12}>12 (Monthly)</option>
                  <option value={52}>52 (Weekly)</option>
                  <option value={365}>365 (Daily)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seasonality Strength: {config.seasonalityStrength.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={config.seasonalityStrength}
                  onChange={(e) => setConfig({ ...config, seasonalityStrength: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Noise Level: {config.noise.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={config.noise}
                  onChange={(e) => setConfig({ ...config, noise: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Base Value: {config.baseValue}
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={config.baseValue}
                  onChange={(e) => setConfig({ ...config, baseValue: Number(e.target.value) })}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={generateData}
              disabled={isGenerating}
              className="flex-1 p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg flex items-center justify-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Generating...' : 'Generate Data'}</span>
            </button>
            {generatedData.length > 0 && (
              <button
                onClick={exportData}
                className="px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-200 flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>CSV</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-4">
          {generatedData.length > 0 ? (
            <div className="space-y-4">
              {/* Data Summary */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <h3 className="font-semibold text-green-800 mb-3">Generated Data Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data Points:</span>
                    <span className="font-medium">{generatedData.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min Value:</span>
                    <span className="font-medium">{Math.min(...generatedData).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Value:</span>
                    <span className="font-medium">{Math.max(...generatedData).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average:</span>
                    <span className="font-medium">{(generatedData.reduce((a, b) => a + b, 0) / generatedData.length).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Data Preview */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <h3 className="font-semibold text-yellow-800 mb-3">Data Preview (First 20 values)</h3>
                <div className="bg-white p-3 rounded-lg border border-yellow-100">
                  <code className="text-xs text-gray-700">
                    {generatedData.slice(0, 20).map((value, index) => (
                      <span key={index}>
                        {value.toFixed(2)}{index < 19 ? ', ' : ''}
                      </span>
                    ))}
                    {generatedData.length > 20 && '...'}
                  </code>
                </div>
              </div>

              {/* Simple Chart */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Data Visualization</h3>
                <div className="h-32 bg-gray-50 rounded-lg p-2 flex items-end space-x-1">
                  {generatedData.slice(0, 50).map((value, index) => {
                    const maxValue = Math.max(...generatedData);
                    const height = (value / maxValue) * 100;
                    return (
                      <div
                        key={index}
                        className="flex-1 bg-gradient-to-t from-blue-500 to-blue-300 rounded-sm"
                        style={{ height: `${height}%` }}
                        title={`Period ${index + 1}: ${value.toFixed(2)}`}
                      />
                    );
                  })}
                </div>
                <div className="text-xs text-gray-500 mt-2 text-center">
                  Bar chart showing first 50 data points
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Generate data to see preview and statistics</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 