import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Filters } from '../components/Filters';
import { ConcursoCard } from '../components/ConcursoCard';
import { ThemeToggle } from '../components/ThemeToggle';
import { Concurso, Theme, Banca } from '../types';

export function Home() {
  const [concursos, setConcursos] = useState<Concurso[]>([]);
  const [bancas, setBancas] = useState<Banca[]>([]);
  const [theme, setTheme] = useState<Theme>('dark');
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    salarioMin: '',
    salarioMax: '',
    sortBy: '',
    banca: '',
  });

  useEffect(() => {
    loadConcursos();
    loadBancas();
    
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
    }
    document.documentElement.classList.toggle('dark', true);
  }, []);

  async function loadConcursos() {
    const { data } = await supabase
      .from('dConcursos')
      .select('*, banca:dBancas(id, banca)');

    if (data) {
      setConcursos(data);
    }
  }

  async function loadBancas() {
    const { data: bancasData } = await supabase
      .from('dBancas')
      .select('*')
      .order('banca');

    if (bancasData) {
      setBancas(bancasData);
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
      const matchesSalarioMin = !filters.salarioMin || concurso.salario_max >= parseFloat(filters.salarioMin);
      const matchesSalarioMax = !filters.salarioMax || concurso.salario_max <= parseFloat(filters.salarioMax);
      const matchesBanca = !filters.banca || concurso.id_banca.toString() === filters.banca;

      return matchesSearch && matchesStatus && matchesSalarioMin && matchesSalarioMax && matchesBanca;
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Concursos</h1>
          <ThemeToggle theme={theme} onThemeChange={handleThemeChange} />
        </div>

        <Filters
          filters={filters}
          bancas={bancas}
          onFilterChange={handleFilterChange}
        />

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