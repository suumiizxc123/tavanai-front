'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface FinancialChartProps {
  historicalData: number[];
  forecastData: number[];
  lowerBound?: number[];
  upperBound?: number[];
  title?: string;
  currency?: string;
}

export const FinancialChart: React.FC<FinancialChartProps> = ({
  historicalData,
  forecastData,
  lowerBound,
  upperBound,
  title = 'Санхүүгийн урьдчилсан мэдээ',
  currency = '₮'
}) => {
  // Generate labels for historical data
  const historicalLabels = historicalData.map((_, index) => `Сар ${index + 1}`);
  
  // Generate labels for forecast data
  const forecastLabels = forecastData.map((_, index) => `Урьдчилсан ${index + 1}`);
  
  // Combine labels
  const labels = [...historicalLabels, ...forecastLabels];
  
  // Combine data
  const combinedData = [...historicalData, ...forecastData];

  const data = {
    labels,
    datasets: [
      // Historical data
      {
        label: 'Түүхэн өгөгдөл',
        data: historicalData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
      },
      // Forecast data
      {
        label: 'Урьдчилсан мэдээ',
        data: [...Array(historicalData.length).fill(null), ...forecastData],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0.1,
      },
    ],
  };

  // Add confidence interval if available
  if (lowerBound && upperBound) {
    const confidenceData = [...Array(historicalData.length).fill(null), ...forecastData];
    const lowerData = [...Array(historicalData.length).fill(null), ...lowerBound];
    const upperData = [...Array(historicalData.length).fill(null), ...upperBound];

    data.datasets.push({
      label: 'Итгэлийн интервал',
      data: confidenceData,
      borderColor: 'rgba(34, 197, 94, 0.3)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      borderWidth: 1,
      fill: false,
      tension: 0.1,
    });

    // Add lower bound
    data.datasets.push({
      label: 'Доод хязгаар',
      data: lowerData,
      borderColor: 'rgba(239, 68, 68, 0.5)',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderWidth: 1,
      fill: false,
      tension: 0.1,
    });

    // Add upper bound
    data.datasets.push({
      label: 'Дээд хязгаар',
      data: upperData,
      borderColor: 'rgba(239, 68, 68, 0.5)',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderWidth: 1,
      fill: false,
      tension: 0.1,
    });
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.parsed.y;
            return `${context.dataset.label}: ${value.toLocaleString('mn-MN')} ${currency}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Хугацаа',
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        title: {
          display: true,
          text: `Хэмжээ (${currency})`,
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value: any) {
            return value.toLocaleString('mn-MN');
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  return (
    <div className="w-full h-96 bg-white rounded-lg shadow-lg p-4">
      <Line data={data} options={options} />
    </div>
  );
}; 