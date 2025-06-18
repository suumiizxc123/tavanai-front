'use client';

import React, { useState } from 'react';
import { FinancialAnalyticsResponse } from '@/services/financialAnalyticsService';
import { FinancialChart } from './FinancialChart';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Lightbulb, FileText } from 'lucide-react';

interface FinancialAnalyticsDisplayProps {
  data: FinancialAnalyticsResponse;
  isLoading?: boolean;
}

export const FinancialAnalyticsDisplay: React.FC<FinancialAnalyticsDisplayProps> = ({ 
  data, 
  isLoading = false 
}) => {
  const [showScript, setShowScript] = useState(false);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-200 rounded-full"></div>
            <div className="h-6 bg-blue-200 rounded w-32"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-blue-200 rounded w-3/4"></div>
            <div className="h-4 bg-blue-200 rounded w-1/2"></div>
            <div className="h-4 bg-blue-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data.success) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-red-800 font-semibold text-lg">Алдаа гарлаа</h3>
        </div>
        <p className="text-red-600">{data.error || 'Үл мэдэгдэх алдаа гарлаа'}</p>
      </div>
    );
  }

  // Extract forecast data for chart
  const forecastValues = data.raw_data?.forecast_values || [];
  const historicalData = data.raw_data?.historical_totals || [1000, 1200, 1100, 1300, 1400, 1500]; // Mock data if not available

  return (
    <div className="space-y-6">
      {/* Main Answer Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-blue-800 font-semibold text-lg">Хариулт</h3>
        </div>
        <p className="text-blue-900 text-xl font-medium leading-relaxed">{data.answer}</p>
      </div>

      {/* Chart Section */}
      {forecastValues.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-gray-800 font-semibold text-lg">Урьдчилсан мэдээ</h3>
          </div>
          <FinancialChart
            historicalData={historicalData}
            forecastData={forecastValues}
            title="Санхүүгийн урьдчилсан мэдээ"
            currency="₮"
          />
        </div>
      )}

      {/* Explanation Card */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <FileText className="w-5 h-5 text-gray-600" />
          </div>
          <h3 className="text-gray-800 font-semibold text-lg">Шинжилгээний тайлбар</h3>
        </div>
        <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: data.explanation.replace(/\n/g, '<br/>') }} />
        </div>
      </div>

      {/* Recommendations Card */}
      {data.recommendations && data.recommendations.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-green-800 font-semibold text-lg">Санал болгох зүйлс</h3>
          </div>
          <div className="space-y-3">
            {data.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-green-100">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-sm font-medium">{index + 1}</span>
                </div>
                <div className="text-green-700 leading-relaxed">
                  <span dangerouslySetInnerHTML={{ __html: recommendation.replace(/\n/g, '<br/>') }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw Data Summary Card */}
      {data.raw_data && (
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-yellow-600" />
            </div>
            <h3 className="text-yellow-800 font-semibold text-lg">Тоон мэдээлэл</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded-lg border border-yellow-100">
              <span className="text-yellow-700 font-medium text-sm">Төрөл</span>
              <p className="text-yellow-800 font-semibold">{data.raw_data.type}</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-yellow-100">
              <span className="text-yellow-700 font-medium text-sm">Түүхэн тоо</span>
              <p className="text-yellow-800 font-semibold">{data.raw_data.historical_count}</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-yellow-100">
              <span className="text-yellow-700 font-medium text-sm">Урьдчилсан хугацаа</span>
              <p className="text-yellow-800 font-semibold">{data.raw_data.forecast_periods} сар</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-yellow-100">
              <span className="text-yellow-700 font-medium text-sm">Дундаж</span>
              <p className="text-yellow-800 font-semibold">
                {data.raw_data.summary?.average?.toLocaleString('mn-MN')} ₮
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Script Section (Collapsible) */}
      {data.script_used && (
        <div className="bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
          <button
            onClick={() => setShowScript(!showScript)}
            className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-100 rounded-xl transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-gray-600" />
              </div>
              <span className="font-medium text-gray-700">R скрипт харах</span>
            </div>
            <div className={`transform transition-transform ${showScript ? 'rotate-180' : ''}`}>
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          {showScript && (
            <div className="p-4 border-t border-gray-200">
              <pre className="text-xs bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                <code>{data.script_used}</code>
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Execution Time */}
      {data.execution_time && (
        <div className="text-center text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
          ⏱️ Гүйцэтгэлийн хугацаа: {data.execution_time}ms
        </div>
      )}
    </div>
  );
}; 