import React from 'react';
import { Search, SortAsc } from 'lucide-react';
import { Banca } from '../types';

interface FiltersProps {
  filters: {
    search: string;
    status: string;
    salarioMin: string;
    salarioMax: string;
    sortBy: string;
    banca: string;
  };
  bancas: Banca[];
  onFilterChange: (name: string, value: string) => void;
}

export function Filters({ filters, bancas, onFilterChange }: FiltersProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
      <div className="flex flex-col gap-4">
        {/* Primeira linha */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar concursos..."
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="pl-10 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>

          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option value="">Todos os status</option>
            <option value="Novos">Novos</option>
            <option value="Em Andamento">Em Andamento</option>
            <option value="Inscrições Abertas">Inscrições Abertas</option>
          </select>

          <select
            value={filters.banca}
            onChange={(e) => onFilterChange('banca', e.target.value)}
            className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option value="">Todas as bancas</option>
            {bancas.map((banca) => (
              <option key={banca.id} value={banca.id.toString()}>
                {banca.banca}
              </option>
            ))}
          </select>
        </div>

        {/* Segunda linha */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="number"
            placeholder="Salário mínimo"
            value={filters.salarioMin}
            onChange={(e) => onFilterChange('salarioMin', e.target.value)}
            className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />

          <input
            type="number"
            placeholder="Salário máximo"
            value={filters.salarioMax}
            onChange={(e) => onFilterChange('salarioMax', e.target.value)}
            className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />

          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
            className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option value="">Ordenar por</option>
            <option value="nome">Nome</option>
            <option value="vagas">Vagas</option>
            <option value="salario">Salário</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>
    </div>
  );
}