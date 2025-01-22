import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Filters } from '../components/Filters';
import { ConcursoCard } from '../components/ConcursoCard';
import { ThemeToggle } from '../components/ThemeToggle';
import { Concurso, Theme } from '../types';

export function Home() {
  const [concursos, setConcursos] = useState<Concurso[]>([]);
  const [theme, setTheme] = useState<Theme>('light');
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    salarioMin: '',
    salarioMax: '',
    sortBy: '',
  });

  useEffect(() => {
    loadConcursos();
    
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  async function loadConcursos() {
    const { data } = await supabase
      .from('dConcursos')
      .select('*');

    if (data) {
      setConcursos(data);
    }
  }

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const filteredConcursos = concursos
    .filter((concurso) => {
      const matchesSearch = concurso.concurso.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus = !filters.status || concurso.status === filters.status;
      const matchesSalarioMin = !filters.salarioMin || concurso.salario_max >= Number(filters.salarioMin);
      const matchesSalarioMax = !filters.salarioMax || concurso.salario_max <= Number(filters.salarioMax);

      return matchesSearch && matchesStatus && matchesSalarioMin && matchesSalarioMax;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'nome':
          return a.concurso.localeCompare(b.concurso);
        case 'vagas':
          return b.vagas_total - a.vagas_total;
        case 'salario':
          return b.salario_max - a.salario_max;
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <ThemeToggle theme={theme} onThemeChange={handleThemeChange} />
      
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Concursos Públicos</h1>
        
        <Filters filters={filters} onFilterChange={handleFilterChange} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConcursos.map((concurso) => (
            <ConcursoCard key={concurso.id} concurso={concurso} />
          ))}
        </div>

        {filteredConcursos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Nenhum concurso encontrado com os filtros selecionados.</p>
          </div>
        )}
      </div>
    </div>
  );
}