'use client';

import { FileText, Users, TrendingUp, Lightbulb, HelpCircle, ArrowRight } from 'lucide-react';

interface ServiceDescriptionProps {
  serviceId: string;
  onClose?: () => void;
}

export default function ServiceDescription({ serviceId, onClose }: ServiceDescriptionProps) {
  const services = {
    'company-policies': {
      name: 'Компанийн Бодлого',
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      description: 'Компанийн дотоод бодлого, журам, зохион байгуулалтын бүтэц, ажлын заавар, стандартууд болон бусад дотоод мэдээллийг хайх, судлах боломжтой.',
      features: [
        'Компанийн бодлого, журам',
        'Зохион байгуулалтын бүтэц',
        'Ажлын заавар, стандартууд',
        'Дотоод мэдээлэл',
        'Хяналт, шалгалт'
      ],
      examples: [
        'Компанийн бодлого юу вэ?',
        'Ажилчдын журам хэрхэн байна?',
        'Зохион байгуулалтын бүтэц ямар вэ?',
        'Ажлын заавар хэрхэн байна?',
        'Стандартууд ямар вэ?'
      ],
      tips: [
        'Асуултаа тодорхой, дэлгэрэнгүй бичнэ үү',
        'Тодорхой хэлтэс, албан тушаалыг заана уу',
        'Огноо, хугацааг тодорхойлно уу'
      ]
    },
    'employee-directory': {
      name: 'Ажилчдын Хуудас',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      description: 'Компанийн бүх ажилчдын мэдээлэл, холбоо барих мэдээлэл, ажлын байр, мэргэшил, зохион байгуулалтын бүтэц, удирдлагын мэдээллийг олох боломжтой.',
      features: [
        'Ажилчдын мэдээлэл',
        'Холбоо барих мэдээлэл',
        'Ажлын байр, мэргэшил',
        'Зохион байгуулалтын бүтэц',
        'Удирдлагын мэдээлэл'
      ],
      examples: [
        'Хэн хэн гэдэг нэртэй ажилтан вэ?',
        'Маркетингийн хэлтсийн ажилчид хэн хэн бэ?',
        'Удирдлагын мэдээлэл хэрхэн байна?',
        'Холбоо барих мэдээлэл хэрхэн байна?',
        'Ажлын байр, мэргэшил ямар вэ?'
      ],
      tips: [
        'Ажилчдын нэрийг зөв бичнэ үү',
        'Хэлтсийн нэрийг тодорхойлно уу',
        'Албан тушаалыг заана уу'
      ]
    },
    'financial-analytics': {
      name: 'Санхүүгийн Шинжилгээ',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      description: 'Санхүүгийн өгөгдөл дээр суурилсан дэлгэрэнгүй шинжилгээ, урьдчилсан мэдээ, кредит, орлого, зардлын талаарх мэдээлэл, санал болгох зүйлсийг авах боломжтой.',
      features: [
        'Кредит, зээлийн шинжилгээ',
        'Орлого, зардлын шинжилгээ',
        'Урьдчилсан мэдээ',
        'Санхүүгийн тайлан',
        'Санал болгох зүйлс'
      ],
      examples: [
        'Кредит ямар хэмжээтэй байна?',
        'Орлогын хэмжээ хэрхэн өөрчлөгдөж байна?',
        'Урьдчилсан мэдээ хийе',
        'Санхүүгийн тайлан хэрхэн байна?',
        'Санал болгох зүйлс юу вэ?'
      ],
      tips: [
        'Урьдчилсан мэдээ хийхийн тулд "forecast" гэж бичнэ үү',
        'Санамсаргүй өгөгдөл үүсгэхийн тулд "random" гэж бичнэ үү',
        'Тодорхой хугацааг заана уу'
      ]
    }
  };

  const service = services[serviceId as keyof typeof services];
  if (!service) return null;

  const Icon = service.icon;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{service.name}</h2>
            <p className="text-gray-600">Үйлчилгээний дэлгэрэнгүй мэдээлэл</p>
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

      {/* Description */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <p className="text-gray-700 leading-relaxed">{service.description}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Features */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-blue-600" />
            <span>Онцлогууд</span>
          </h3>
          <div className="space-y-2">
            {service.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Examples */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-green-600" />
            <span>Жишээ асуултууд</span>
          </h3>
          <div className="space-y-2">
            {service.examples.map((example, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                <ArrowRight className="w-4 h-4 text-green-600" />
                <span className="text-gray-700 text-sm">{example}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">💡 Зөвлөмж:</h3>
        <ul className="space-y-2">
          {service.tips.map((tip, index) => (
            <li key={index} className="flex items-start space-x-2 text-yellow-700">
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-sm">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 