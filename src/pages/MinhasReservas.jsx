import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Alerta from '../components/Alerta';
import CartaoReserva from '../components/reservas/CartaoReserva';
import ModalAlterarReserva from '../components/reservas/ModalAlterarReserva';
import ModalCancelarReserva from '../components/reservas/ModalCancelarReserva';
import useAlerta from '../hooks/useAlerta';
import { reservasService } from '../services/reservasService';
import { agoraISO } from '../utils/datas';
import { textoDoErro } from '../utils/erros';

const ehFutura = (r) => r.status === 'CONFIRMADA' && r.inicio > agoraISO();

export default function MinhasReservas() {
  const [reservas, setReservas] = useState([]);
  const [mostrandoFuturas, setMostrandoFuturas] = useState(true);
  const [cancelando, setCancelando] = useState(null);
  const [alterando, setAlterando] = useState(null);
  const { alerta, mostrar, limpar } = useAlerta();

  const carregar = useCallback(async () => {
    try {
      setReservas(await reservasService.minhas());
      limpar();
    } catch (erro) {
      mostrar(textoDoErro(erro));
    }
  }, [limpar, mostrar]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function confirmarCancelamento() {
    try {
      await reservasService.cancelar(cancelando.id);
      setCancelando(null);
      mostrar('Reserva cancelada.', 'sucesso');
      setReservas(await reservasService.minhas());
    } catch (erro) {
      setCancelando(null);
      mostrar(textoDoErro(erro));
    }
  }

  async function aoAlterar() {
    setAlterando(null);
    mostrar('Reserva alterada. O código continua o mesmo.', 'sucesso');
    try {
      setReservas(await reservasService.minhas());
    } catch (erro) {
      mostrar(textoDoErro(erro));
    }
  }

  const itens = reservas.filter((r) => ehFutura(r) === mostrandoFuturas);
  if (mostrandoFuturas) itens.reverse();

  return (
    <main>
      <h1>Minhas reservas</h1>
      <div className="abas" role="tablist">
        <button className="botao" type="button" role="tab" aria-selected={mostrandoFuturas} onClick={() => setMostrandoFuturas(true)}>Futuras</button>
        <button className="botao" type="button" role="tab" aria-selected={!mostrandoFuturas} onClick={() => setMostrandoFuturas(false)}>Passadas</button>
      </div>
      <Alerta alerta={alerta} />

      <div>
        {itens.length === 0 ? (
          <>
            <p className="vazio">{mostrandoFuturas ? 'Você ainda não tem reservas futuras.' : 'Nenhuma reserva passada.'}</p>
            {mostrandoFuturas && <p className="vazio"><Link to="/reservar">Fazer uma reserva</Link></p>}
          </>
        ) : (
          itens.map((r) => (
            <CartaoReserva key={r.id} reserva={r} futura={ehFutura(r)} aoAlterar={setAlterando} aoCancelar={setCancelando} />
          ))
        )}
      </div>
      <p className="muted">Alterar e cancelar ficam disponíveis até o prazo definido pelo restaurante antes do horário da reserva.</p>

      {cancelando && (
        <ModalCancelarReserva reserva={cancelando} aoFechar={() => setCancelando(null)} aoConfirmar={confirmarCancelamento} />
      )}
      {alterando && (
        <ModalAlterarReserva key={alterando.id} reserva={alterando} aoFechar={() => setAlterando(null)} aoSalvar={aoAlterar} />
      )}
    </main>
  );
}
