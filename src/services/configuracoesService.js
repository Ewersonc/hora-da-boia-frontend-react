import { http } from './http';

export const configuracoesService = {
  horarios: () => http('/api/configuracoes/horarios'),
  salvarHorarios: (corpo) => http('/api/configuracoes/horarios', { metodo: 'PUT', corpo }),
  parametros: () => http('/api/configuracoes/reservas'),
  salvarParametros: (corpo) => http('/api/configuracoes/reservas', { metodo: 'PUT', corpo }),
};
