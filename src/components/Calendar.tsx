import React, { useState } from 'react';
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { Etapa } from '../types';

interface CalendarProps {
  etapas: Etapa[];
  onClose: () => void;
}

export function Calendar({ etapas, onClose }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEtapasForDate = (date: Date) => {
    return etapas.filter(etapa => {
      const etapaDate = new Date(etapa.data_publicado);
      return etapaDate.getDate() === date.getDate() &&
             etapaDate.getMonth() === date.getMonth() &&
             etapaDate.getFullYear() === date.getFullYear();
    });
  };

  const changeMonth = (increment: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
    setSelectedDay(null);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200 dark:border-gray-700"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEtapas = getEtapasForDate(date);
      const hasEtapas = dayEtapas.length > 0;
      const isSelected = selectedDay && 
        selectedDay.getDate() === date.getDate() &&
        selectedDay.getMonth() === date.getMonth() &&
        selectedDay.getFullYear() === date.getFullYear();

      days.push(
        <div
          key={day}
          onClick={() => hasEtapas && setSelectedDay(date)}
          className={`h-24 border border-gray-200 dark:border-gray-700 p-2 ${
            hasEtapas ? 'bg-blue-50 dark:bg-blue-900/20 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30' : ''
          } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        >
          <div className="flex justify-between items-start">
            <span className="font-medium">{day}</span>
            {hasEtapas && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const filteredEtapas = view === 'list' 
    ? etapas.filter(etapa => {
        const etapaDate = new Date(etapa.data_publicado);
        return etapaDate.getMonth() === currentDate.getMonth() &&
               etapaDate.getFullYear() === currentDate.getFullYear();
      })
    : selectedDay 
      ? getEtapasForDate(selectedDay)
      : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Calendário de Etapas</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setView('calendar');
                    setSelectedDay(null);
                  }}
                  className={`px-3 py-1 rounded-md ${
                    view === 'calendar'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Calendário
                </button>
                <button
                  onClick={() => {
                    setView('list');
                    setSelectedDay(null);
                  }}
                  className={`px-3 py-1 rounded-md ${
                    view === 'list'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Lista
                </button>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => changeMonth(-1)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronLeft size={20} />
              </button>
              <h3 className="text-lg font-medium">
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <button
                onClick={() => changeMonth(1)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <select
              value={`${currentDate.getMonth()},${currentDate.getFullYear()}`}
              onChange={(e) => {
                const [month, year] = e.target.value.split(',').map(Number);
                setCurrentDate(new Date(year, month, 1));
                setSelectedDay(null);
              }}
              className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
            >
              {Array.from({ length: 24 }, (_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() - 6 + i);
                return (
                  <option key={i} value={`${date.getMonth()},${date.getFullYear()}`}>
                    {months[date.getMonth()]} {date.getFullYear()}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        
        <div className="p-6">
          {view === 'calendar' ? (
            <>
              <div className="grid grid-cols-7 gap-px mb-px">
                {weekDays.map(day => (
                  <div key={day} className="text-center py-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
                {renderCalendarDays()}
              </div>
              {selectedDay && filteredEtapas.length > 0 && (
                <div className="mt-6 border-t dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-medium mb-4">
                    Etapas do dia {selectedDay.getDate()} de {months[selectedDay.getMonth()]}
                  </h3>
                  <div className="space-y-4">
                    {filteredEtapas.map(etapa => (
                      <div
                        key={etapa.id}
                        className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-800 dark:text-white">{etapa.etapa}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{etapa.secao}</p>
                          </div>
                          {etapa.link && (
                            <a
                              href={etapa.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                            >
                              <ExternalLink size={20} />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              {filteredEtapas
                .sort((a, b) => new Date(a.data_publicado).getTime() - new Date(b.data_publicado).getTime())
                .map(etapa => (
                  <div
                    key={etapa.id}
                    className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{etapa.etapa}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(etapa.data_publicado).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{etapa.secao}</p>
                      </div>
                      {etapa.link && (
                        <a
                          href={etapa.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                          <ExternalLink size={20} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}