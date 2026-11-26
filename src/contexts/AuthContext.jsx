import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { definirAoNaoAutorizado } from '../services/http';
import { lerSessao, limparSessao, salvarSessao } from '../services/sessaoStorage';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [sessao, setSessao] = useState(() => lerSessao());

  const entrar = useCallback((dados) => {
    salvarSessao(dados);
    setSessao(dados);
  }, []);

  const sair = useCallback(() => {
    limparSessao();
    setSessao(null);
  }, []);

  // Token expirado ou inválido (401): encerra a sessão e as rotas protegidas redirecionam ao login.
  useEffect(() => {
    definirAoNaoAutorizado(sair);
  }, [sair]);

  const valor = useMemo(() => ({ sessao, entrar, sair }), [sessao, entrar, sair]);
  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
