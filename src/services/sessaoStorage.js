// Guarda a sessão (token JWT, nome, perfil) no localStorage.
const CHAVE = 'hora-da-boia.sessao';

export function lerSessao() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE));
  } catch {
    return null;
  }
}

export function salvarSessao(dados) {
  localStorage.setItem(CHAVE, JSON.stringify(dados));
}

export function limparSessao() {
  localStorage.removeItem(CHAVE);
}
