import { useCallback, useState } from 'react';

/** Estado de uma mensagem de alerta (erro, sucesso ou informação). Sem texto, limpa o alerta. */
export default function useAlerta() {
  const [alerta, setAlerta] = useState(null);
  const mostrar = useCallback((texto, tipo = 'erro') => setAlerta(texto ? { texto, tipo } : null), []);
  const limpar = useCallback(() => setAlerta(null), []);
  return { alerta, mostrar, limpar };
}
