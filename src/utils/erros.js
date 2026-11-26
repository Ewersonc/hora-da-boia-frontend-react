import { ErroApi } from '../services/http';

/** Texto amigável para mostrar ao usuário a partir de um erro da API. */
export function textoDoErro(erro) {
  if (!(erro instanceof ErroApi)) return 'Ocorreu um erro inesperado.';
  const campos = Object.values(erro.campos || {});
  return campos.length > 0 ? campos.join(' ') : erro.message;
}
