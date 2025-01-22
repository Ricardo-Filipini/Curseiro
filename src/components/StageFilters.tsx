import React from 'react';
import { Search } from 'lucide-react';

interface StageFiltersProps {
  filters: {
    secao: string;
    etapa: string;
    dataInicio: string;
    dataFim: string;
  };
  secoes: string[];
  onFilterChange: (name: string, value: string) => void;
}

export function StageFilters({ filters, secoes, onFilterChange }: StageFiltersProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar etapas..."
            value={filters.etapa}
            onChange={(e) => onFilterChange('etapa', e.target.value)}
            className="pl-10 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        <select
          value={filters.secao}
          onChange={(e) => onFilterChange('secao', e.target.value)}
          className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        >
          <option value="">Todas as seções</option>
          {secoes.map(secao => (
            <option key={secao} value={secao}>{secao}</option>
          ))}
        </select>

        <input
          type="date"
          value={filters.dataInicio}
          onChange={(e) => onFilterChange('dataInicio', e.target.value)}
          className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          placeholder="Data inicial"
        />

        <input
          type="date"
          value={filters.dataFim}
          onChange={(e) => onFilterChange('dataFim', e.target.value)}
          className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          placeholder="Data final"
        />
      </div>
    </div>
  );
}