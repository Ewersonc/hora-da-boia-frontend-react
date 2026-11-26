import { http } from './http';

export const mesasService = {
  listar: () => http('/api/mesas'),
  criar: (corpo) => http('/api/mesas', { metodo: 'POST', corpo }),
  atualizar: (id, corpo) => http(`/api/mesas/${id}`, { metodo: 'PUT', corpo }),
  desativar: (id) => http(`/api/mesas/${id}/desativacao`, { metodo: 'PATCH' }),
};
