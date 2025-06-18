'use client';

import { useState } from 'react';
import { FinancialChart } from './FinancialChart';
import { financialAnalyticsService } from '@/services/financialAnalyticsService';
import { TrendingUp, BarChart3, Play } from 'lucide-react';

export default function ForecastTest() {
  const [forecastData, setForecastData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sample time series data (monthly values)
  const sampleData = [112, 118, 132, 129, 121, 135, 148, 148, 136, 119, 104, 118, 115, 126, 141, 135, 125, 149, 170, 170, 158, 133, 114, 140];

  const runForecast = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await financialAnalyticsService.getForecast({
        ts: sampleData,
        model: 'arima',
        frequency: 12,
        h: 6,
        level: 0.9
      });

      setForecastData(result);
    } catch (err) {
      setError('Forecast error occurred');
      console.error('Forecast error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl border border-green-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Forecast Test</h2>
          <p className="text-sm text-gray-600">Test the forecast functionality with sample data</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>Sample Data (24 months)</span>
            </h3>
            <div className="text-sm text-gray-600 mb-3">
              Historical time series data for forecasting
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <code className="text-xs text-gray-700">
                {sampleData.join(', ')}
              </code>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="font-semibold text-blue-800 mb-3">Forecast Parameters</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Model:</span>
                <span className="font-medium">ARIMA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Frequency:</span>
                <span className="font-medium">12 (monthly)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Forecast Periods:</span>
                <span className="font-medium">6 months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Confidence Level:</span>
                <span className="font-medium">90%</span>
              </div>
            </div>
          </div>

          <button
            onClick={runForecast}
            disabled={isLoading}
            className="w-full p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg flex items-center justify-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>{isLoading ? 'Running Forecast...' : 'Run Forecast'}</span>
          </button>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {isLoading && (
            <div className="animate-pulse space-y-4">
              <div className="bg-gray-200 h-4 rounded w-3/4"></div>
              <div className="bg-gray-200 h-4 rounded w-1/2"></div>
              <div className="bg-gray-200 h-4 rounded w-5/6"></div>
            </div>
          )}

          {forecastData && !isLoading && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <h3 className="font-semibold text-green-800 mb-3">Forecast Results</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method:</span>
                    <span className="font-medium">{forecastData.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Confidence Level:</span>
                    <span className="font-medium">{(forecastData.level * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Forecast Values:</span>
                    <span className="font-medium">{forecastData.forecast.length} periods</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <h3 className="font-semibold text-yellow-800 mb-3">Forecast Values</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {forecastData.forecast.map((value: number, index: number) => (
                    <div key={index} className="flex justify-between bg-white p-2 rounded border border-yellow-100">
                      <span className="text-gray-600">Period {index + 1}:</span>
                      <span className="font-medium">{value.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Forecast Chart</h3>
                <FinancialChart
                  historicalData={sampleData}
                  forecastData={forecastData.forecast}
                  lowerBound={forecastData.lower}
                  upperBound={forecastData.upper}
                  title="Time Series Forecast"
                  currency=""
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 