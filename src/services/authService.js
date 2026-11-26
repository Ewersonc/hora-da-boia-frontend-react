import { http } from './http';

export const authService = {
  login: (corpo) => http('/api/auth/login', { metodo: 'POST', corpo }),
  cadastrar: (corpo) => http('/api/auth/cadastro', { metodo: 'POST', corpo }),
};
