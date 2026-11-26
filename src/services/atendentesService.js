import { http } from './http';

export const atendentesService = {
  listar: () => http('/api/atendentes'),
  criar: (corpo) => http('/api/atendentes', { metodo: 'POST', corpo }),
  atualizar: (id, corpo) => http(`/api/atendentes/${id}`, { metodo: 'PUT', corpo }),
  desativar: (id) => http(`/api/atendentes/${id}/desativacao`, { metodo: 'PATCH' }),
};
