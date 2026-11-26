import { useEffect, useRef } from 'react';

/**
 * Janela modal baseada em <dialog>. Abre ao ser montada: quem a usa a renderiza só enquanto
 * ela deve aparecer, e fecha desmontando (o Esc também chama aoFechar).
 */
export default function Modal({ aoFechar, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialogo = ref.current;
    if (dialogo && !dialogo.open) dialogo.showModal();
  }, []);

  return <dialog ref={ref} onClose={aoFechar}>{children}</dialog>;
}
