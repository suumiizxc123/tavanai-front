'use client';

import { useState } from 'react';

interface ServiceSelectorProps {
  onServiceChange: (service: string) => void;
  defaultService?: string;
}

export default function ServiceSelector({ onServiceChange, defaultService = 'work-internal' }: ServiceSelectorProps) {
  const [selectedService, setSelectedService] = useState(defaultService);

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const service = e.target.value;
    setSelectedService(service);
    onServiceChange(service);
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="service" className="text-sm text-gray-600">Service:</label>
      <select
        id="service"
        value={selectedService}
        onChange={handleServiceChange}
        className="p-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="work-internal">Work Internal</option>
        <option value="workers-info">Workers Info</option>
      </select>
    </div>
  );
} 