'use client';

import { useState } from 'react';
import { Bot, Users, Database, Sparkles, MessageSquare, Zap, ArrowRight, X, Star, CheckCircle } from 'lucide-react';

interface ChatIntroProps {
  onComplete: () => void;
}

export default function ChatIntro({ onComplete }: ChatIntroProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: Sparkles,
      title: "TavanAI Chat-д тавтай морил!",
      description: "Компанийн мэдээлэл болон ажилчдын өгөгдлийн ухаалаг туслах.",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-r from-purple-50 to-pink-50",
      features: ["Ухаалаг AI", "Хурдан хариулт", "Найдвартай мэдээлэл"]
    },
    {
      icon: Database,
      title: "Дотоод Үйлчилгээ",
      description: "Дотоод компанийн өгөгдөл, бодлого, журам, зохион байгуулалтын мэдээллийг хандах.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-r from-blue-50 to-cyan-50",
      features: ["Бодлого", "Журам", "Зохион байгуулалт"]
    },
    {
      icon: Users,
      title: "Ажилчдын Мэдээлэл",
      description: "Ажилчдын мэдээлэл, холбоо барих мэдээлэл, зохион байгуулалтын бүтцийг олох.",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-r from-purple-50 to-pink-50",
      features: ["Холбоо барих", "Мэргэшил", "Зохион байгуулалт"]
    },
    {
      icon: MessageSquare,
      title: "Ухаалаг Харилцаа",
      description: "Асуултаа байгалийн байдлаар асуугаад манай AI-аас шуурхай, зөв хариулт авах.",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-gradient-to-r from-green-50 to-emerald-50",
      features: ["Байгалийн хэл", "Хурдан хариулт", "Найдвартай"]
    },
    {
      icon: Zap,
      title: "Эхлэхэд бэлэн!",
      description: "Үйлчилгээгээ сонгоод чат эхлүүлээрэй. Таны AI туслах туслахад бэлэн байна!",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-gradient-to-r from-orange-50 to-red-50",
      features: ["Бэлэн", "Хялбар", "Хурдан"]
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const skipIntro = () => {
    onComplete();
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden border border-white/20">
        {/* Header */}
        <div className="relative">
          <div className={`${currentStepData.bgColor} p-8 text-center relative overflow-hidden`}>
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-4 left-4 w-16 h-16 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute bottom-4 right-4 w-20 h-20 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
            </div>
            
            <div className="relative z-10">
              <div className="relative inline-block mb-6">
                <div className={`p-6 rounded-3xl bg-gradient-to-r ${currentStepData.color} text-white shadow-2xl transform hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-10 h-10" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent rounded-3xl animate-pulse"></div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                  <Star className="w-3 h-3 text-yellow-800" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">{currentStepData.title}</h2>
              <p className="text-gray-600 text-lg leading-relaxed">{currentStepData.description}</p>
              
              {/* Features */}
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {currentStepData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-1 px-3 py-1 bg-white/50 rounded-full text-sm font-medium text-gray-700">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Skip button */}
          <button
            onClick={skipIntro}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors bg-white/50 rounded-full hover:bg-white/80"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="px-8 py-6">
          <div className="flex space-x-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-3 rounded-full flex-1 transition-all duration-500 ${
                  index <= currentStep 
                    ? `bg-gradient-to-r ${currentStepData.color} shadow-lg` 
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Step counter */}
          <div className="text-center text-sm text-gray-500 mb-6">
            <span className="font-semibold text-purple-600">Алхам {currentStep + 1}</span> / {steps.length}
          </div>

          {/* Action buttons */}
          <div className="flex space-x-4">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1 py-4 px-6 border-2 border-gray-200 rounded-2xl text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
              >
                Өмнөх
              </button>
            )}
            <button
              onClick={nextStep}
              className={`flex-1 py-4 px-6 rounded-2xl text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl relative overflow-hidden ${
                currentStep === steps.length - 1
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                  : `bg-gradient-to-r ${currentStepData.color} hover:shadow-2xl`
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-center justify-center space-x-2 relative z-10">
                <span className="text-lg">{currentStep === steps.length - 1 ? 'Эхлэх' : 'Дараах'}</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </button>
          </div>
        </div>

        {/* Enhanced tips section */}
        <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>💡 Зөвлөмж:</span>
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Компанийн бодлого эсвэл ажилчдын мэдээлэл талаар асуухыг оролдоно уу</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Толгой хэсэгт байгаа сонгогчийг ашиглан үйлчилгээг солино уу</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Таны ярианы түүх автоматаар хадгалагдана</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 