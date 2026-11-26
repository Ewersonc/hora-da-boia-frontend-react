import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Alerta from '../components/Alerta';
import SeloStatus from '../components/SeloStatus';
import useAlerta from '../hooks/useAlerta';
import { reservasService } from '../services/reservasService';
import { horaDe, hojeISO } from '../utils/datas';
import { textoDoErro } from '../utils/erros';

const ACOES = [
  ['COMPARECEU', 'Compareceu', ''],
  ['NAO_COMPARECEU', 'Não compareceu', ''],
  ['CANCELADA', 'Cancelar reserva', ' perigo'],
];

export default function Agenda() {
  const [data, setData] = useState(hojeISO());
  const [reservas, setReservas] = useState([]);
  const [selecionadaId, setSelecionadaId] = useState(null);
  const { alerta, mostrar, limpar } = useAlerta();

  const carregar = useCallback(async () => {
    try {
      setReservas(await reservasService.agenda(data));
      limpar();
    } catch (erro) {
      mostrar(textoDoErro(erro));
    }
  }, [data, limpar, mostrar]);

  // Carrega ao abrir e ao trocar a data, e atualiza a cada minuto.
  useEffect(() => {
    carregar();
    const intervalo = setInterval(carregar, 60000);
    return () => clearInterval(intervalo);
  }, [carregar]);

  const selecionada = reservas.find((r) => r.id === selecionadaId);
  const podeAgir = Boolean(selecionada) && selecionada.status === 'CONFIRMADA';

  async function mudarStatus(status) {
    if (status === 'CANCELADA' && !window.confirm('Cancelar esta reserva?')) return;
    try {
      await reservasService.mudarStatus(selecionadaId, status);
      await carregar();
    } catch (erro) {
      mostrar(textoDoErro(erro));
    }
  }

  return (
    <main className="largo">
      <h1>Agenda do dia</h1>
      <div className="linha cartao">
        <div className="campo">
          <label htmlFor="data">Data</label>
          <input id="data" type="date" value={data} onChange={(e) => setData(e.target.value)} />
        </div>
        <button className="botao" type="button" onClick={() => setData(hojeISO())}>Hoje</button>
        <Link className="botao principal" to="/balcao">Reserva de balcão</Link>
      </div>
      <Alerta alerta={alerta} />

      <div className="tabela-rolagem">
        <table>
          <thead>
            <tr><th>Hora</th><th>Mesa</th><th>Cliente</th><th>Telefone</th><th>Pessoas</th><th>Código</th><th>Status</th></tr>
          </thead>
          <tbody>
            {reservas.map((r) => (
              <tr key={r.id} className="clicavel" aria-selected={r.id === selecionadaId} onClick={() => setSelecionadaId(r.id)}>
                <td>{horaDe(r.inicio)}</td>
                <td>{r.mesa}</td>
                <td>{r.clienteNome}</td>
                <td>{r.clienteTelefone}</td>
                <td>{r.numeroPessoas}</td>
                <td>{r.codigo}</td>
                <td><SeloStatus status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {reservas.length === 0 && <p className="vazio">Não há reservas nesta data.</p>}

      <div className="cartao" style={{ marginTop: 16 }}>
        <p className="muted">
          {selecionada
            ? `Reserva selecionada: ${selecionada.clienteNome} · ${horaDe(selecionada.inicio)} · código ${selecionada.codigo}`
            : 'Selecione uma reserva para atualizar o status.'}
        </p>
        <div className="acoes">
          {ACOES.map(([status, texto, extra]) => (
            <button key={status} className={`botao${extra}`} type="button" disabled={!podeAgir} onClick={() => mudarStatus(status)}>
              {texto}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
