export interface Concurso {
  id: number;
  concurso: string;
  vagas_total: number;
  salario_max: number;
  link: string;
  status: string;
  id_banca: number;
  banca?: Banca;
}

export interface Etapa {
  id: number;
  id_concurso: number;  // Changed from concurso_id to id_concurso
  secao: string;
  etapa: string;
  data_publicado: string;
  link: string;
}

export interface Banca {
  id: number;
  nome: string;
  sigla: string;
}

export type Theme = 'light' | 'dark';