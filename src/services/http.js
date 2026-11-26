// Cliente HTTP único: anexa o token JWT e converte erros da API em ErroApi.
import { API_URL } from '../config/env';
import { lerSessao, limparSessao } from './sessaoStorage';

export class ErroApi extends Error {
  constructor(status, mensagem, campos) {
    super(mensagem);
    this.status = status;
    this.campos = campos || {};
  }
}

let aoNaoAutorizado = () => {};

/** O AuthContext registra aqui o que fazer quando o token deixa de valer (resposta 401). */
export function definirAoNaoAutorizado(funcao) {
  aoNaoAutorizado = funcao;
}

export async function http(caminho, { metodo = 'GET', corpo } = {}) {
  const cabecalhos = { Accept: 'application/json' };
  const atual = lerSessao();
  if (atual && atual.token) cabecalhos.Authorization = `Bearer ${atual.token}`;
  if (corpo !== undefined) cabecalhos['Content-Type'] = 'application/json';

  let resposta;
  try {
    resposta = await fetch(API_URL + caminho, {
      method: metodo,
      headers: cabecalhos,
      body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
    });
  } catch {
    throw new ErroApi(0, 'Não foi possível conectar ao servidor. Tente novamente.');
  }

  const texto = await resposta.text();
  let dados = null;
  if (texto) {
    try {
      dados = JSON.parse(texto);
    } catch {
      dados = null;
    }
  }

  if (!resposta.ok) {
    if (resposta.status === 401 && atual && atual.token) {
      limparSessao();
      aoNaoAutorizado();
    }
    throw new ErroApi(resposta.status, (dados && dados.mensagem) || 'Ocorreu um erro inesperado.', dados && dados.campos);
  }
  return dados;
}
