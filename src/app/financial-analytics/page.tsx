'use client';

import { useState } from 'react';
import { Sparkles, TrendingUp, BarChart3, RefreshCw, Play, Download, Zap } from 'lucide-react';
import RandomDataGenerator from '@/components/RandomDataGenerator';
import ForecastAnalyzer from '@/components/ForecastAnalyzer';

export default function FinancialAnalyticsPage() {
  const [generatedData, setGeneratedData] = useState<number[]>([]);
  const [showForecastAnalyzer, setShowForecastAnalyzer] = useState(false);

  const handleDataGenerated = (data: number[]) => {
    setGeneratedData(data);
  };

  const handleUseDataForForecast = () => {
    setShowForecastAnalyzer(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-lg font-medium shadow-lg mb-4">
            <img 
              src="/logo.svg" 
              alt="TavanAI Logo" 
              className="w-8 h-8"
            />
            <span>Санхүүгийн Шинжилгээ</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Санхүүгийн Шинжилгээ & Урьдчилсан мэдээ</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Санхүүгийн өгөгдөл дээр суурилсан дэлгэрэнгүй шинжилгээ, урьдчилсан мэдээ, 
            кредит, орлого, зардлын талаарх мэдээлэл, санал болгох зүйлсийг авах боломжтой.
          </p>
        </div>

        {/* Quick Start */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-green-100">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Хурдан эхлэх</h2>
            <p className="text-gray-600">Санамсаргүй өгөгдөл үүсгэж, урьдчилсан мэдээ хийх</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-xl text-center">
              <RefreshCw className="w-12 h-12 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">1. Өгөгдөл үүсгэх</h3>
              <p className="text-sm opacity-90">Holt-Winters загварт тохирсон санамсаргүй өгөгдөл үүсгэнэ</p>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">2. Шинжилгээ хийх</h3>
              <p className="text-sm opacity-90">Үүсгэсэн өгөгдөл дээр урьдчилсан мэдээ шинжилгээ хийнэ</p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-xl text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">3. Үр дүнг харах</h3>
              <p className="text-sm opacity-90">Урьдчилсан мэдээ, график, тайлбарыг харна</p>
            </div>
          </div>
        </div>

        {/* Random Data Generator */}
        <RandomDataGenerator onDataGenerated={handleDataGenerated} />

        {/* Generated Data Actions */}
        {generatedData.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-green-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Үүсгэсэн өгөгдөл</h2>
                  <p className="text-sm text-gray-600">{generatedData.length} утга амжилттай үүсгэгдлээ</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleUseDataForForecast}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Урьдчилсан мэдээ хийх</span>
                </button>
                <button
                  onClick={() => {
                    const dataString = generatedData.join(', ');
                    navigator.clipboard.writeText(dataString);
                    alert('Өгөгдөл хуулагдлаа!');
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-200 flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Хуулах</span>
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Өгөгдлийн урьдчилан харах</h3>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <code className="text-xs text-gray-700">
                  {generatedData.slice(0, 20).map((value, index) => (
                    <span key={index}>
                      {value.toFixed(2)}{index < 19 ? ', ' : ''}
                    </span>
                  ))}
                  {generatedData.length > 20 && '...'}
                </code>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Эхний 20 утга харагдаж байна. Нийт {generatedData.length} утга байна.
              </div>
            </div>
          </div>
        )}

        {/* Forecast Analyzer Modal */}
        {showForecastAnalyzer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <ForecastAnalyzer 
                onClose={() => setShowForecastAnalyzer(false)}
              />
            </div>
          </div>
        )}

        {/* Features */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-green-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Санхүүгийн Шинжилгээний Онцлогууд</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
              <TrendingUp className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Кредит, зээлийн шинжилгээ</h3>
              <p className="text-gray-600">Кредит, зээлийн өгөгдөл дээр суурилсан дэлгэрэнгүй шинжилгээ</p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <BarChart3 className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Орлого, зардлын шинжилгээ</h3>
              <p className="text-gray-600">Орлого, зардлын өгөгдөл дээр суурилсан шинжилгээ</p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
              <RefreshCw className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Урьдчилсан мэдээ</h3>
              <p className="text-gray-600">ARIMA, Holt-Winters зэрэг загварууд ашиглан урьдчилсан мэдээ гаргана</p>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-xl border border-yellow-200">
              <Download className="w-12 h-12 text-yellow-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Санхүүгийн тайлан</h3>
              <p className="text-gray-600">CSV, JSON форматаар санхүүгийн тайлан экспортлох боломжтой</p>
            </div>
            
            <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border border-red-200">
              <Zap className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Санал болгох зүйлс</h3>
              <p className="text-gray-600">Санхүүгийн өгөгдөл дээр суурилсан санал болгох зүйлс</p>
            </div>
            
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
              <Play className="w-12 h-12 text-indigo-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Интерактив</h3>
              <p className="text-gray-600">Параметрүүдийг тохируулж, үр дүнг шууд харах боломжтой</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Хэрхэн ашиглах вэ?</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">1. Санамсаргүй өгөгдөл үүсгэх</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Preset загваруудаас сонгох эсвэл параметрүүдийг тохируулах</li>
                <li>• "Generate Data" товчийг дарж өгөгдөл үүсгэх</li>
                <li>• Үүсгэсэн өгөгдлийн статистик мэдээллийг харах</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">2. Урьдчилсан мэдээ хийх</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• "Урьдчилсан мэдээ хийх" товчийг дарж Forecast Analyzer нээх</li>
                <li>• Үүсгэсэн өгөгдлийг ашиглан урьдчилсан мэдээ хийх</li>
                <li>• График, тайлбар, санал болгох зүйлсийг харах</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 