'use client';

import { useState } from 'react';
import { Bot, Users, Database, Sparkles, MessageSquare, Zap, ArrowRight, X } from 'lucide-react';

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
      bgColor: "bg-gradient-to-r from-purple-50 to-pink-50"
    },
    {
      icon: Database,
      title: "Дотоод Үйлчилгээ",
      description: "Дотоод компанийн өгөгдөл, бодлого, журам, зохион байгуулалтын мэдээллийг хандах.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-r from-blue-50 to-cyan-50"
    },
    {
      icon: Users,
      title: "Ажилчдын Мэдээлэл",
      description: "Ажилчдын мэдээлэл, холбоо барих мэдээлэл, зохион байгуулалтын бүтцийг олох.",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-r from-purple-50 to-pink-50"
    },
    {
      icon: MessageSquare,
      title: "Ухаалаг Харилцаа",
      description: "Асуултаа байгалийн байдлаар асуугаад манай AI-аас шуурхай, зөв хариулт авах.",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-gradient-to-r from-green-50 to-emerald-50"
    },
    {
      icon: Zap,
      title: "Эхлэхэд бэлэн!",
      description: "Үйлчилгээгээ сонгоод чат эхлүүлээрэй. Таны AI туслах туслахад бэлэн байна!",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-gradient-to-r from-orange-50 to-red-50"
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="relative">
          <div className={`${currentStepData.bgColor} p-6 text-center`}>
            <div className="relative inline-block mb-4">
              <div className={`p-4 rounded-2xl bg-gradient-to-r ${currentStepData.color} text-white shadow-lg`}>
                <Icon className="w-8 h-8" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl animate-pulse"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{currentStepData.title}</h2>
            <p className="text-gray-600">{currentStepData.description}</p>
          </div>
          
          {/* Skip button */}
          <button
            onClick={skipIntro}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="px-6 py-4">
          <div className="flex space-x-2 mb-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full flex-1 transition-all duration-300 ${
                  index <= currentStep 
                    ? `bg-gradient-to-r ${currentStepData.color}` 
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Step counter */}
          <div className="text-center text-sm text-gray-500 mb-4">
            Алхам {currentStep + 1} / {steps.length}
          </div>

          {/* Action buttons */}
          <div className="flex space-x-3">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1 py-3 px-4 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Өмнөх
              </button>
            )}
            <button
              onClick={nextStep}
              className={`flex-1 py-3 px-4 rounded-xl text-white font-medium transition-all duration-200 transform hover:scale-105 shadow-lg relative overflow-hidden ${
                currentStep === steps.length - 1
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                  : `bg-gradient-to-r ${currentStepData.color}`
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
              <div className="flex items-center justify-center space-x-2 relative z-10">
                <span>{currentStep === steps.length - 1 ? 'Эхлэх' : 'Дараах'}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>

        {/* Tips section */}
        <div className="px-6 py-4 bg-gray-50 border-t">
          <h3 className="text-sm font-medium text-gray-700 mb-2">💡 Зөвлөмж:</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Компанийн бодлого эсвэл ажилчдын мэдээлэл талаар асуухыг оролдоно уу</li>
            <li>• Толгой хэсэгт байгаа сонгогчийг ашиглан үйлчилгээг солино уу</li>
            <li>• Таны ярианы түүх автоматаар хадгалагдана</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 