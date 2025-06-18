'use client';

import { useState } from 'react';
import { Database, Users, Sparkles, Zap, TrendingUp, FileText, Calculator, Building } from 'lucide-react';

interface ServiceSelectorProps {
  onServiceChange: (service: string) => void;
  onClearChat?: () => void;
  defaultService?: string;
}

export default function ServiceSelector({ onServiceChange, onClearChat, defaultService = 'company-policies' }: ServiceSelectorProps) {
  const [selectedService, setSelectedService] = useState(defaultService);
  const [isHovered, setIsHovered] = useState<string | null>(null);

  const handleServiceChange = (service: string) => {
    if (service !== selectedService) {
      // Clear chat when switching services
      if (onClearChat) {
        onClearChat();
      }
      setSelectedService(service);
      onServiceChange(service);
    }
  };

  const services = [
    {
      id: 'company-policies',
      name: 'Компанийн Бодлого',
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      hoverColor: 'hover:from-blue-600 hover:to-cyan-600',
      description: 'Компанийн бодлого, журам, зохион байгуулалтын мэдээлэл',
      longDescription: 'Компанийн дотоод бодлого, журам, зохион байгуулалтын бүтэц, ажлын заавар, стандартууд болон бусад дотоод мэдээллийг хайх, судлах боломжтой.',
      features: ['Бодлого', 'Журам', 'Зохион байгуулалт', 'Стандарт', 'Заавар'],
      examples: ['Компанийн бодлого юу вэ?', 'Ажилчдын журам хэрхэн байна?', 'Зохион байгуулалтын бүтэц ямар вэ?']
    },
    {
      id: 'employee-directory',
      name: 'Ажилчдын Хуудас',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
      hoverColor: 'hover:from-purple-600 hover:to-pink-600',
      description: 'Ажилчдын мэдээлэл, холбоо барих мэдээлэл',
      longDescription: 'Компанийн бүх ажилчдын мэдээлэл, холбоо барих мэдээлэл, ажлын байр, мэргэшил, зохион байгуулалтын бүтэц, удирдлагын мэдээллийг олох боломжтой.',
      features: ['Холбоо барих', 'Ажлын байр', 'Мэргэшил', 'Зохион байгуулалт', 'Удирдлага'],
      examples: ['Хэн хэн гэдэг нэртэй ажилтан вэ?', 'Маркетингийн хэлтсийн ажилчид хэн хэн бэ?', 'Удирдлагын мэдээлэл хэрхэн байна?']
    },
    {
      id: 'financial-analytics',
      name: 'Санхүүгийн Шинжилгээ',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-gradient-to-r from-green-500 to-emerald-500',
      hoverColor: 'hover:from-green-600 hover:to-emerald-600',
      description: 'Санхүүгийн өгөгдөл дээр суурилсан шинжилгээ',
      longDescription: 'Санхүүгийн өгөгдөл дээр суурилсан дэлгэрэнгүй шинжилгээ, урьдчилсан мэдээ, кредит, орлого, зардлын талаарх мэдээлэл, санал болгох зүйлсийг авах боломжтой.',
      features: ['Кредит', 'Орлого', 'Урьдчилсан мэдээ', 'Шинжилгээ', 'Санал'],
      examples: ['Кредит ямар хэмжээтэй байна?', 'Орлогын хэмжээ хэрхэн өөрчлөгдөж байна?', 'Урьдчилсан мэдээ хийе']
    }
  ];

  return (
    <div className="relative">
      <div className="flex items-center space-x-3 bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-white/20">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
            <div className="absolute inset-0 bg-purple-400 rounded-full blur-sm animate-ping opacity-30"></div>
          </div>
          <span className="text-sm font-semibold text-gray-700">Үйлчилгээ:</span>
        </div>
        
        <div className="flex space-x-2">
          {services.map((service) => {
            const Icon = service.icon;
            const isSelected = selectedService === service.id;
            
            return (
              <div key={service.id} className="relative">
                <button
                  onClick={() => handleServiceChange(service.id)}
                  onMouseEnter={() => setIsHovered(service.id)}
                  onMouseLeave={() => setIsHovered(null)}
                  className={`
                    relative px-4 py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105
                    ${isSelected 
                      ? `${service.bgColor} text-white shadow-lg ring-2 ring-offset-2 ring-purple-300` 
                      : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/80 hover:shadow-md'
                    }
                    ${isSelected ? 'animate-pulse' : ''}
                  `}
                >
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Icon className={`w-4 h-4 ${isSelected ? 'animate-bounce' : ''}`} />
                      {isSelected && (
                        <div className="absolute inset-0 bg-white/20 rounded-full blur-sm animate-ping"></div>
                      )}
                    </div>
                    <span className="text-sm font-medium">{service.name}</span>
                    {isSelected && (
                      <Zap className="w-3 h-3 animate-pulse" />
                    )}
                  </div>
                  
                  {/* Selected indicator */}
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                  )}
                </button>
                
                {/* Enhanced hover tooltip */}
                {isHovered === service.id && !isSelected && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-3 bg-gray-900/95 backdrop-blur-sm text-white text-sm rounded-xl opacity-95 z-20 shadow-2xl border border-gray-700 min-w-[280px]">
                    <div className="text-center mb-3">
                      <div className="text-xs font-medium text-gray-300 mb-2">{service.longDescription}</div>
                      <div className="flex flex-wrap justify-center gap-1 mb-3">
                        {service.features.map((feature, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-700/50 rounded-full text-xs">
                            {feature}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs text-gray-400">
                        <div className="font-medium mb-1">Жишээ асуултууд:</div>
                        {service.examples.map((example, index) => (
                          <div key={index} className="text-left mb-1">• {example}</div>
                        ))}
                      </div>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900/95"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-2xl blur-xl -z-10 animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-pink-400/5 rounded-2xl blur-2xl -z-20 animate-pulse delay-1000"></div>
    </div>
  );
} 