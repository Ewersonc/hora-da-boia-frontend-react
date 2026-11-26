import { http } from './http';

export const reservasService = {
  criar: (corpo) => http('/api/reservas', { metodo: 'POST', corpo }),
  minhas: () => http('/api/reservas/minhas'),
  cancelar: (id) => http(`/api/reservas/${id}/cancelamento`, { metodo: 'POST' }),
  alterar: (id, corpo) => http(`/api/reservas/${id}`, { metodo: 'PUT', corpo }),
  agenda: (data) => http(`/api/agenda?data=${data}`),
  mudarStatus: (id, status) => http(`/api/reservas/${id}/status`, { metodo: 'PATCH', corpo: { status } }),
  historico: ({ de, ate, status }) => http(`/api/reservas?de=${de}&ate=${ate}${status ? `&status=${status}` : ''}`),
  criarNoBalcao: (corpo) => http('/api/atendimento/reservas', { metodo: 'POST', corpo }),
};
