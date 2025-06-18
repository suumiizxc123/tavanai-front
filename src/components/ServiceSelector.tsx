'use client';

import { useState } from 'react';
import { Database, Users, Sparkles } from 'lucide-react';

interface ServiceSelectorProps {
  onServiceChange: (service: string) => void;
  defaultService?: string;
}

export default function ServiceSelector({ onServiceChange, defaultService = 'work-internal' }: ServiceSelectorProps) {
  const [selectedService, setSelectedService] = useState(defaultService);
  const [isHovered, setIsHovered] = useState(false);

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
      description: 'Дотоод компанийн мэдээлэл'
    },
    {
      id: 'workers-info',
      name: 'Ажилчид',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
      description: 'Ажилчдын мэдээлэл'
    }
  ];

  return (
    <div className="relative">
      <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-gray-200">
        <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
        <span className="text-sm font-medium text-gray-700">Үйлчилгээ:</span>
        
        <div className="flex space-x-1">
          {services.map((service) => {
            const Icon = service.icon;
            const isSelected = selectedService === service.id;
            
            return (
              <button
                key={service.id}
                onClick={() => handleServiceChange(service.id)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`
                  relative px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105
                  ${isSelected 
                    ? `${service.bgColor} text-white shadow-lg` 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                  ${isSelected ? 'ring-2 ring-offset-2 ring-purple-300' : ''}
                `}
              >
                <div className="flex items-center space-x-2">
                  <Icon className={`w-4 h-4 ${isSelected ? 'animate-bounce' : ''}`} />
                  <span className="text-sm font-medium">{service.name}</span>
                </div>
                
                {/* Hover tooltip */}
                {isHovered && !isSelected && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-90 z-10">
                    {service.description}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                  </div>
                )}
                
                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Cool background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-xl blur-xl -z-10 animate-pulse"></div>
    </div>
  );
} 