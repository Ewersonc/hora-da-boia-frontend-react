import { useCallback, useEffect, useState } from 'react';
import Alerta from '../components/Alerta';
import SeloStatus from '../components/SeloStatus';
import useAlerta from '../hooks/useAlerta';
import { reservasService } from '../services/reservasService';
import { dataBR, horaDe, hojeISO, somarDias } from '../utils/datas';
import { textoDoErro } from '../utils/erros';
import { ROTULO_STATUS } from '../utils/status';

export default function Historico() {
  const [de, setDe] = useState(somarDias(hojeISO(), -7));
  const [ate, setAte] = useState(hojeISO());
  const [status, setStatus] = useState('');
  const [reservas, setReservas] = useState([]);
  const { alerta, mostrar, limpar } = useAlerta();

  const consultar = useCallback(async () => {
    try {
      setReservas(await reservasService.historico({ de, ate, status }));
      limpar();
    } catch (erro) {
      mostrar(textoDoErro(erro));
    }
  }, [de, ate, status, limpar, mostrar]);

  // Consulta uma vez ao abrir; depois, só quando o formulário é enviado.
  useEffect(() => {
    consultar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="largo">
      <h1>Histórico de reservas</h1>
      <form className="cartao linha" noValidate onSubmit={(e) => { e.preventDefault(); consultar(); }}>
        <div className="campo">
          <label htmlFor="de">De</label>
          <input id="de" type="date" required value={de} onChange={(e) => setDe(e.target.value)} />
        </div>
        <div className="campo">
          <label htmlFor="ate">Até</label>
          <input id="ate" type="date" required value={ate} onChange={(e) => setAte(e.target.value)} />
        </div>
        <div className="campo">
          <label htmlFor="status">Status</label>
          <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Todos</option>
            {Object.entries(ROTULO_STATUS).map(([valor, rotulo]) => (
              <option key={valor} value={valor}>{rotulo}</option>
            ))}
          </select>
        </div>
        <button className="botao principal" type="submit">Consultar</button>
      </form>
      <Alerta alerta={alerta} />

      <div className="tabela-rolagem">
        <table>
          <thead>
            <tr><th>Data</th><th>Hora</th><th>Mesa</th><th>Cliente</th><th>Telefone</th><th>Pessoas</th><th>Código</th><th>Status</th></tr>
          </thead>
          <tbody>
            {reservas.map((r) => (
              <tr key={r.id}>
                <td>{dataBR(r.inicio)}</td>
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
      {reservas.length === 0 && <p className="vazio">Nenhuma reserva encontrada para os filtros.</p>}
    </main>
  );
}
