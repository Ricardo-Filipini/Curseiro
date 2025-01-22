import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar as CalendarIcon, ExternalLink, ArrowUpDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Concurso, Etapa, Theme, Banca } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { Calendar } from '../components/Calendar';
import { StageFilters } from '../components/StageFilters';
import { ThemeToggle } from '../components/ThemeToggle';

export function ConcursoDetails() {
  const { id } = useParams();
  const [concurso, setConcurso] = useState<Concurso | null>(null);
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');
  const [isAscending, setIsAscending] = useState(false);
  const [filters, setFilters] = useState({
    secao: '',
    etapa: '',
    dataInicio: '',
    dataFim: '',
  });

  useEffect(() => {
    loadConcurso();
    
    // Define dark theme as default if no theme is set
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
    }
    document.documentElement.classList.toggle('dark', true);
  }, []);

  async function loadConcurso() {
    const { data: concursoData } = await supabase
      .from('dConcursos')
      .select('*, banca:dBancas(id, banca)')
      .eq('id', id)
      .single();

    if (concursoData) {
      setConcurso({
        ...concursoData,
        banca: concursoData.banca
      });
    }

    const { data: etapasData } = await supabase
      .from('fEtapas')
      .select('*')
      .eq('id_concurso', id)
      .order('data_publicado', { ascending: true });

    if (etapasData) {
      setEtapas(etapasData);
    }
  }

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const filteredEtapas = etapas.filter(etapa => {
    const matchesSecao = !filters.secao || etapa.secao === filters.secao;
    const matchesEtapa = !filters.etapa || etapa.etapa.toLowerCase().includes(filters.etapa.toLowerCase());
    const matchesDataInicio = !filters.dataInicio || new Date(etapa.data_publicado) >= new Date(filters.dataInicio);
    const matchesDataFim = !filters.dataFim || new Date(etapa.data_publicado) <= new Date(filters.dataFim);

    return matchesSecao && matchesEtapa && matchesDataInicio && matchesDataFim;
  });

  const sortedEtapas = [...filteredEtapas].sort((a, b) => {
    const dateA = new Date(a.data_publicado).getTime();
    const dateB = new Date(b.data_publicado).getTime();
    return isAscending ? dateA - dateB : dateB - dateA;
  });

  const etapasPorSecao = sortedEtapas.reduce((acc, etapa) => {
    if (!acc[etapa.secao]) {
      acc[etapa.secao] = [];
    }
    acc[etapa.secao].push(etapa);
    return acc;
  }, {} as Record<string, Etapa[]>);

  const uniqueSecoes = Array.from(new Set(etapas.map(etapa => etapa.secao))).sort();

  if (!concurso) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      
      <div className="max-w-4xl mx-auto px-4 relative">
        <div className="absolute right-4 top-0 z-10">
          <ThemeToggle theme={theme} onThemeChange={handleThemeChange} />
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
              <ArrowLeft size={20} className="mr-2" />
              Voltar para lista
            </Link>
            <button
              onClick={() => setShowCalendar(true)}
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              <CalendarIcon size={20} className="mr-2" />
              Cronograma
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{concurso.concurso}</h1>
              {concurso.banca && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  {concurso.banca.banca}
                </span>
              )}
            </div>
            <StatusBadge status={concurso.status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Vagas</p>
              <p className="font-medium text-lg text-gray-900 dark:text-white">
                {new Intl.NumberFormat('pt-BR', { 
                  maximumFractionDigits: 0 
                }).format(concurso.vagas_total)}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Salário até</p>
              <p className="font-medium text-lg text-gray-900 dark:text-white">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  maximumFractionDigits: 0
                }).format(concurso.salario_max)}
              </p>
            </div>
            <div>
              <a
                href={concurso.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                <ExternalLink size={20} className="mr-2" />
                Site Oficial
              </a>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Buscar etapas..."
                    value={filters.etapa}
                    onChange={(e) => handleFilterChange('etapa', e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
                <select
                  value={filters.secao}
                  onChange={(e) => handleFilterChange('secao', e.target.value)}
                  className="w-48 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Todas as seções</option>
                  {uniqueSecoes.map((secao) => (
                    <option key={secao} value={secao}>
                      {secao}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">De:</span>
                  <input
                    type="date"
                    value={filters.dataInicio}
                    onChange={(e) => handleFilterChange('dataInicio', e.target.value)}
                    className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Até:</span>
                  <input
                    type="date"
                    value={filters.dataFim}
                    onChange={(e) => handleFilterChange('dataFim', e.target.value)}
                    className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <button
                  onClick={() => setIsAscending(!isAscending)}
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                  title={isAscending ? "Ordenar do mais recente" : "Ordenar do mais antigo"}
                >
                  <ArrowUpDown size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              EDITAIS, COMUNICADOS E INFORMAÇÕES
            </h2>
            <div className="space-y-8">
              {Object.entries(etapasPorSecao).map(([secao, etapasSecao]) => (
                <div key={secao} className="border-t dark:border-gray-700 pt-6">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">{secao}</h2>
                  <div className="space-y-4">
                    {etapasSecao.map((etapa) => (
                      <div key={etapa.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{etapa.etapa}</h3>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <CalendarIcon size={16} className="mr-1" />
                            {new Date(etapa.data_publicado).toLocaleDateString('pt-BR')}
                          </div>
                          {etapa.link && (
                            <a
                              href={etapa.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                            >
                              <ExternalLink size={16} className="mr-1" />
                              Acessar
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showCalendar && (
          <Calendar etapas={etapas} onClose={() => setShowCalendar(false)} />
        )}
      </div>
    </div>
  );
}