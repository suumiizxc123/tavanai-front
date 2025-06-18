'use client';

import { useState } from 'react';
import { Sparkles, FileText, Users, TrendingUp, ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState('company-policies');

  const services = [
    {
      id: 'company-policies',
      name: 'Компанийн Бодлого',
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      description: 'Компанийн дотоод бодлого, журам, зохион байгуулалтын мэдээлэл',
      features: ['Бодлого', 'Журам', 'Зохион байгуулалт', 'Стандарт', 'Заавар'],
      examples: [
        'Компанийн бодлого юу вэ?',
        'Ажилчдын журам хэрхэн байна?',
        'Зохион байгуулалтын бүтэц ямар вэ?'
      ]
    },
    {
      id: 'employee-directory',
      name: 'Ажилчдын Хуудас',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      description: 'Ажилчдын мэдээлэл, холбоо барих мэдээлэл',
      features: ['Холбоо барих', 'Ажлын байр', 'Мэргэшил', 'Зохион байгуулалт', 'Удирдлага'],
      examples: [
        'Хэн хэн гэдэг нэртэй ажилтан вэ?',
        'Маркетингийн хэлтсийн ажилчид хэн хэн бэ?',
        'Удирдлагын мэдээлэл хэрхэн байна?'
      ]
    },
    {
      id: 'financial-analytics',
      name: 'Санхүүгийн Шинжилгээ',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      description: 'Санхүүгийн өгөгдөл дээр суурилсан шинжилгээ',
      features: ['Кредит', 'Орлого', 'Урьдчилсан мэдээ', 'Шинжилгээ', 'Санал'],
      examples: [
        'Кредит ямар хэмжээтэй байна?',
        'Орлогын хэмжээ хэрхэн өөрчлөгдөж байна?',
        'Урьдчилсан мэдээ хийе'
      ]
    }
  ];

  const activeService = services.find(s => s.id === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <img src="/logo.svg" alt="TavanAI" className="w-8 h-8" />
                <div className="absolute inset-0 bg-purple-400 rounded-full blur-sm animate-ping opacity-30"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                TavanAI
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/chat"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <div className="flex items-center space-x-2">
                  <Play className="w-4 h-4" />
                  <span>Чат эхлүүлэх</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              TavanAI
            </span>{' '}
            Үйлчилгээнүүд
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Манай AI-ийн хүчирхэг үйлчилгээнүүдийг туршиж үзээрэй. 
            Компанийн бодлого, ажилчдын мэдээлэл, санхүүгийн шинжилгээ - бүгд нэг дор.
          </p>
        </div>

        {/* Service Tabs */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            {services.map((service) => {
              const Icon = service.icon;
              const isActive = activeTab === service.id;
              
              return (
                <button
                  key={service.id}
                  onClick={() => setActiveTab(service.id)}
                  className={`
                    flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105
                    ${isActive 
                      ? `bg-gradient-to-r ${service.color} text-white shadow-xl ring-2 ring-offset-2 ring-purple-300` 
                      : 'bg-white/80 text-gray-600 hover:bg-white hover:shadow-lg border border-gray-200'
                    }
                  `}
                >
                  <Icon className={`w-6 h-6 ${isActive ? 'animate-bounce' : ''}`} />
                  <span className="font-semibold">{service.name}</span>
                  {isActive && <Sparkles className="w-5 h-5 animate-pulse" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Service Details */}
        {activeService && (
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Service Info */}
            <div className="space-y-8">
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/20">
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${activeService.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                    <activeService.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{activeService.name}</h2>
                    <p className="text-gray-600">{activeService.description}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Онцлогууд</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {activeService.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-700 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Жишээ асуултууд</h3>
                    <div className="space-y-3">
                      {activeService.examples.map((example, index) => (
                        <div key={index} className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
                          <ArrowRight className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          <span className="text-gray-700">{example}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Demo Chat Preview */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Чат дээр туршиж үзэх</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Боломжтой</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-gray-600">U</span>
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-3 max-w-xs">
                    <p className="text-gray-700">{activeService.examples[0]}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 justify-end">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl px-4 py-3 max-w-xs">
                    <p className="text-white">Таны асуултын хариулт энд харагдана...</p>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              <Link
                href="/chat"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-3"
              >
                <Play className="w-5 h-5" />
                <span className="font-semibold">Чат эхлүүлэх</span>
              </Link>

              <p className="text-center text-gray-500 mt-4 text-sm">
                {activeService.name} үйлчилгээг бүрэн туршиж үзэх боломжтой
              </p>
            </div>
          </div>
        )}

        {/* Additional Features */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Нэмэлт онцлогууд</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white mb-4 mx-auto">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Урьдчилсан мэдээ</h3>
              <p className="text-gray-600">Санхүүгийн өгөгдөл дээр суурилсан урьдчилсан мэдээ, шинжилгээ</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white mb-4 mx-auto">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ажилчдын мэдээлэл</h3>
              <p className="text-gray-600">Бүх ажилчдын мэдээлэл, холбоо барих мэдээлэл</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white mb-4 mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Бодлого, журам</h3>
              <p className="text-gray-600">Компанийн бүх бодлого, журам, стандартууд</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 