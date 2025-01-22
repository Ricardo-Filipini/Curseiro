import React from 'react';
import { ExternalLink, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Concurso } from '../types';
import { StatusBadge } from './StatusBadge';

interface ConcursoCardProps {
  concurso: Concurso;
}

export function ConcursoCard({ concurso }: ConcursoCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{concurso.concurso}</h2>
          {concurso.banca && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              {concurso.banca.banca}
            </span>
          )}
        </div>
        <StatusBadge status={concurso.status} />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Vagas</p>
          <p className="font-medium text-lg text-gray-900 dark:text-gray-100">
            {new Intl.NumberFormat('pt-BR', { 
              maximumFractionDigits: 0 
            }).format(concurso.vagas_total)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Salário até</p>
          <p className="font-medium text-lg text-gray-900 dark:text-gray-100">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              maximumFractionDigits: 0
            }).format(concurso.salario_max)}
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <a
          href={concurso.link}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-full transition-colors"
          title="Site Oficial do Concurso"
        >
          <ExternalLink size={24} />
        </a>
        <Link
          to={`/concurso/${concurso.id}`}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Info size={20} className="mr-2" />
          Mais informações
        </Link>
      </div>
    </div>
  );
}