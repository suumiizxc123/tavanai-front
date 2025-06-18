'use client';

import { useState } from 'react';
import { Database, Users, Sparkles, Zap } from 'lucide-react';

interface ServiceSelectorProps {
  onServiceChange: (service: string) => void;
  defaultService?: string;
}

export default function ServiceSelector({ onServiceChange, defaultService = 'work-internal' }: ServiceSelectorProps) {
  const [selectedService, setSelectedService] = useState(defaultService);
  const [isHovered, setIsHovered] = useState<string | null>(null);

  const handleServiceChange = (service: string) => {
    setSelectedService(service);
    onServiceChange(service);
  };

  const services = [
    {
      id: 'work-internal',
      name: 'Дотоод',
      icon: Database,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      hoverColor: 'hover:from-blue-600 hover:to-cyan-600',
      description: 'Дотоод компанийн мэдээлэл',
      features: ['Бодлого', 'Журам', 'Зохион байгуулалт']
    },
    {
      id: 'workers-info',
      name: 'Ажилчид',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
      hoverColor: 'hover:from-purple-600 hover:to-pink-600',
      description: 'Ажилчдын мэдээлэл',
      features: ['Холбоо барих', 'Зохион байгуулалт', 'Мэргэшил']
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
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-3 bg-gray-900/95 backdrop-blur-sm text-white text-sm rounded-xl opacity-95 z-20 shadow-2xl border border-gray-700 min-w-[200px]">
                    <div className="text-center mb-2">
                      <div className="text-xs font-medium text-gray-300 mb-1">{service.description}</div>
                      <div className="flex flex-wrap justify-center gap-1">
                        {service.features.map((feature, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-700/50 rounded-full text-xs">
                            {feature}
                          </span>
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