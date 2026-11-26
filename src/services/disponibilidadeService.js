import { http } from './http';

export const disponibilidadeService = {
  buscar: (data, pessoas) => http(`/api/disponibilidade?data=${data}&pessoas=${pessoas}`),
};
