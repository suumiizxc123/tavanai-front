'use client';

import { useState } from 'react';
import { RefreshCw, Download, BarChart3, TrendingUp, Zap, Sparkles, Activity, Target, FileText, Copy } from 'lucide-react';
import { Line } from 'react-chartjs-2';

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
  const [showSuccess, setShowSuccess] = useState(false);

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
    setShowSuccess(false);
    
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
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  const exportToCSV = () => {
    const csvContent = [
      'Period,Value',
      ...generatedData.map((value, index) => `${index + 1},${value}`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `holt-winters-data-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    try {
      const dataString = generatedData.join(', ');
      await navigator.clipboard.writeText(dataString);
      alert('Data copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy data:', error);
      alert('Failed to copy data to clipboard');
    }
  };

  const generateNewData = () => {
    generateData();
  };

  // Preset configurations
  const presets = [
    {
      name: 'Monthly Sales',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500',
      config: { length: 36, trend: 2.0, seasonality: 12, noise: 5.0, baseValue: 100, seasonalityStrength: 0.4 }
    },
    {
      name: 'Quarterly Revenue',
      icon: BarChart3,
      color: 'from-green-500 to-emerald-500',
      config: { length: 24, trend: 1.5, seasonality: 4, noise: 3.0, baseValue: 200, seasonalityStrength: 0.3 }
    },
    {
      name: 'Weekly Traffic',
      icon: Activity,
      color: 'from-purple-500 to-pink-500',
      config: { length: 104, trend: 0.8, seasonality: 52, noise: 2.0, baseValue: 50, seasonalityStrength: 0.5 }
    },
    {
      name: 'Daily Orders',
      icon: Target,
      color: 'from-orange-500 to-red-500',
      config: { length: 365, trend: 0.3, seasonality: 7, noise: 1.0, baseValue: 25, seasonalityStrength: 0.6 }
    }
  ];

  const applyPreset = (preset: any) => {
    setConfig(preset.config);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-green-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
      
      <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Хиймэл өгөгдөл үүсгэх</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Хиймэл өгөгдөл үүүсгэх тохируулга
          </p>
        </div>

        <div className="grid gap-8">
          {/* Configuration Panel */}
          <div className="space-y-6">
            {/* Presets */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 shadow-lg border border-gray-200/50">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span>Хялбар тохируулга</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {presets.map((preset, index) => {
                  const Icon = preset.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => applyPreset(preset)}
                      className={`p-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg border-2 border-transparent hover:border-white/50 bg-gradient-to-r ${preset.color} text-white shadow-md`}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{preset.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Parameters */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-blue-200/50">
              <h3 className="font-bold text-blue-800 mb-4 flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span>Data Parameters</span>
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Data Length: <span className="text-blue-600 font-bold">{config.length}</span> periods
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="120"
                    value={config.length}
                    onChange={(e) => setConfig({ ...config, length: Number(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Trend Strength: <span className="text-green-600 font-bold">{config.trend.toFixed(1)}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.1"
                    value={config.trend}
                    onChange={(e) => setConfig({ ...config, trend: Number(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Seasonality Period: <span className="text-purple-600 font-bold">{config.seasonality}</span>
                  </label>
                  <select
                    value={config.seasonality}
                    onChange={(e) => setConfig({ ...config, seasonality: Number(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  >
                    <option value={4}>4 (Quarterly)</option>
                    <option value={7}>7 (Weekly)</option>
                    <option value={12}>12 (Monthly)</option>
                    <option value={52}>52 (Weekly)</option>
                    <option value={365}>365 (Daily)</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Seasonality Strength: <span className="text-pink-600 font-bold">{config.seasonalityStrength.toFixed(1)}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={config.seasonalityStrength}
                    onChange={(e) => setConfig({ ...config, seasonalityStrength: Number(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Noise Level: <span className="text-orange-600 font-bold">{config.noise.toFixed(1)}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={config.noise}
                    onChange={(e) => setConfig({ ...config, noise: Number(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Base Value: <span className="text-indigo-600 font-bold">{config.baseValue}</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={config.baseValue}
                    onChange={(e) => setConfig({ ...config, baseValue: Number(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={generateData}
                disabled={isGenerating}
                className="flex-1 p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-xl flex items-center justify-center space-x-3 font-semibold"
              >
                <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'Generating...' : 'Generate Data'}</span>
                {!isGenerating && <Sparkles className="w-4 h-4 animate-pulse" />}
              </button>
              {generatedData.length > 0 && (
                <button
                  onClick={exportToCSV}
                  className="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center space-x-2 font-semibold"
                >
                  <Download className="w-5 h-5" />
                  <span>CSV</span>
                </button>
              )}
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-2xl shadow-lg animate-pulse">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-sm">✓</span>
                  </div>
                  <span className="font-semibold">Data generated successfully!</span>
                </div>
              </div>
            )}
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {generatedData.length > 0 && (
              <div className="space-y-6">
                {/* Data Summary */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg border border-green-200/50">
                  <h3 className="font-bold text-green-800 mb-4 flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    <span>Generated Data Summary</span>
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{generatedData.length}</div>
                      <div className="text-sm text-green-700">Data Points</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{Math.min(...generatedData).toFixed(2)}</div>
                      <div className="text-sm text-blue-700">Min Value</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{Math.max(...generatedData).toFixed(2)}</div>
                      <div className="text-sm text-purple-700">Max Value</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{(generatedData.reduce((a, b) => a + b, 0) / generatedData.length).toFixed(2)}</div>
                      <div className="text-sm text-orange-700">Average</div>
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span>Time Series Visualization</span>
                  </h3>
                  <div className="h-80">
                    <Line
                      data={{
                        labels: Array.from({ length: generatedData.length }, (_, i) => i + 1),
                        datasets: [{
                          label: 'Generated Data',
                          data: generatedData,
                          borderColor: 'rgb(59, 130, 246)',
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          borderWidth: 2,
                          fill: true,
                          tension: 0.4
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: false,
                            grid: {
                              color: 'rgba(0, 0, 0, 0.1)'
                            }
                          },
                          x: {
                            grid: {
                              color: 'rgba(0, 0, 0, 0.1)'
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Export Options */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg border border-purple-200/50">
                  <h3 className="font-bold text-purple-800 mb-4 flex items-center space-x-2">
                    <Download className="w-5 h-5 text-purple-600" />
                    <span>Export Data</span>
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={exportToCSV}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Export CSV</span>
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy Data</span>
                    </button>
                    <button
                      onClick={generateNewData}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors duration-200"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Generate New</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS for sliders */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
} 