'use client';

import { useState } from 'react';
import { FinancialChart } from './FinancialChart';
import { financialAnalyticsService } from '@/services/financialAnalyticsService';
import RandomDataGenerator from './RandomDataGenerator';
import { TrendingUp, BarChart3, Play, Upload, Download, Trash2, RefreshCw } from 'lucide-react';

interface ForecastAnalyzerProps {
  onClose?: () => void;
}

export default function ForecastAnalyzer({ onClose }: ForecastAnalyzerProps) {
  const [timeSeriesData, setTimeSeriesData] = useState<string>('');
  const [forecastData, setForecastData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<'arima' | 'ets' | 'naive'>('arima');
  const [frequency, setFrequency] = useState(12);
  const [forecastPeriods, setForecastPeriods] = useState(6);
  const [confidenceLevel, setConfidenceLevel] = useState(0.9);
  const [showDataGenerator, setShowDataGenerator] = useState(false);

  const sampleData = [112, 118, 132, 129, 121, 135, 148, 148, 136, 119, 104, 118, 115, 126, 141, 135, 125, 149, 170, 170, 158, 133, 114, 140];

  const loadSampleData = () => {
    setTimeSeriesData(sampleData.join(', '));
  };

  const clearData = () => {
    setTimeSeriesData('');
    setForecastData(null);
    setError(null);
  };

  const parseTimeSeriesData = (dataString: string): number[] => {
    return dataString
      .split(/[,\s]+/)
      .map(item => item.trim())
      .filter(item => item.length > 0)
      .map(item => parseFloat(item))
      .filter(num => !isNaN(num));
  };

  const runForecast = async () => {
    if (!timeSeriesData.trim()) {
      setError('Урсгал өгөгдөл оруулна уу');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const ts = parseTimeSeriesData(timeSeriesData);
      
      if (ts.length < 2) {
        throw new Error('Хамгийн багадаа 2 утга шаардлагатай');
      }

      const result = await financialAnalyticsService.getForecast({
        ts,
        model,
        frequency,
        h: forecastPeriods,
        level: confidenceLevel
      });

      setForecastData(result);
    } catch (err: any) {
      setError(err.message || 'Урьдчилсан мэдээ гаргахад алдаа гарлаа');
      console.error('Forecast error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const exportResults = () => {
    if (!forecastData) return;
    
    const data = {
      input: {
        timeSeries: parseTimeSeriesData(timeSeriesData),
        model,
        frequency,
        forecastPeriods,
        confidenceLevel
      },
      output: forecastData,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forecast-analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDataGenerated = (data: number[]) => {
    setTimeSeriesData(data.map(num => num.toString()).join(', '));
    setShowDataGenerator(false);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl border border-green-100 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Урьдчилсан мэдээ шинжилгээ</h2>
            <p className="text-sm text-gray-600">Цагийн цуваа өгөгдөл дээр суурилсан урьдчилсан мэдээ</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          {/* Time Series Data Input */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span>Цагийн цуваа өгөгдөл</span>
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowDataGenerator(!showDataGenerator)}
                  className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center space-x-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Санамсаргүй</span>
                </button>
                <button
                  onClick={loadSampleData}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  Жишээ
                </button>
                <button
                  onClick={clearData}
                  className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
            
            {showDataGenerator && (
              <div className="mb-4">
                <RandomDataGenerator onDataGenerated={handleDataGenerated} />
              </div>
            )}
            
            <div className="text-sm text-gray-600 mb-3">
              Тоонуудыг таслал эсвэл зайгаар тусгаарлан оруулна уу
            </div>
            <textarea
              value={timeSeriesData}
              onChange={(e) => setTimeSeriesData(e.target.value)}
              placeholder="Жишээ: 112, 118, 132, 129, 121, 135..."
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              rows={6}
            />
            <div className="text-xs text-gray-500 mt-2">
              Оруулсан утгын тоо: {timeSeriesData ? parseTimeSeriesData(timeSeriesData).length : 0}
            </div>
          </div>

          {/* Forecast Parameters */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="font-semibold text-blue-800 mb-3">Урьдчилсан мэдээний параметрүүд</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Модель</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value as any)}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="arima">ARIMA</option>
                  <option value="holtwinters">Holt-Winters</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Давтамж</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(Number(e.target.value))}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>1 (жил)</option>
                  <option value={4}>4 (улирлын)</option>
                  <option value={12}>12 (сарын)</option>
                  <option value={52}>52 (долоо хоног)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Урьдчилсан хугацаа</label>
                <input
                  type="number"
                  value={forecastPeriods}
                  onChange={(e) => setForecastPeriods(Number(e.target.value))}
                  min="1"
                  max="24"
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Итгэлийн түвшин</label>
                <select
                  value={confidenceLevel}
                  onChange={(e) => setConfidenceLevel(Number(e.target.value))}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0.8}>80%</option>
                  <option value={0.9}>90%</option>
                  <option value={0.95}>95%</option>
                  <option value={0.99}>99%</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={runForecast}
              disabled={isLoading || !timeSeriesData.trim()}
              className="flex-1 p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg flex items-center justify-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>{isLoading ? 'Шинжилж байна...' : 'Урьдчилсан мэдээ гаргах'}</span>
            </button>
            {forecastData && (
              <button
                onClick={exportResults}
                className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Экспорт</span>
              </button>
            )}
          </div>
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
              {/* Forecast Summary */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <h3 className="font-semibold text-green-800 mb-3">Урьдчилсан мэдээний дүн</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Модель:</span>
                    <span className="font-medium">{forecastData.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Итгэлийн түвшин:</span>
                    <span className="font-medium">{(forecastData.level * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Урьдчилсан утгууд:</span>
                    <span className="font-medium">{forecastData.forecast.length} хугацаа</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Статус:</span>
                    <span className="font-medium text-green-600">Амжилттай</span>
                  </div>
                </div>
              </div>

              {/* Forecast Values */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <h3 className="font-semibold text-yellow-800 mb-3">Урьдчилсан утгууд</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {forecastData.forecast.map((value: number, index: number) => (
                    <div key={index} className="flex justify-between bg-white p-2 rounded border border-yellow-100">
                      <span className="text-gray-600">Хугацаа {index + 1}:</span>
                      <span className="font-medium">{value.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Урьдчилсан мэдээний график</h3>
                <FinancialChart
                  historicalData={parseTimeSeriesData(timeSeriesData)}
                  forecastData={forecastData.forecast}
                  lowerBound={forecastData.lower}
                  upperBound={forecastData.upper}
                  title="Цагийн цуваа урьдчилсан мэдээ"
                  currency=""
                />
              </div>
            </div>
          )}

          {!forecastData && !isLoading && !error && (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Өгөгдөл оруулаад урьдчилсан мэдээ гаргаж эхлээрэй</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 