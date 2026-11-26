import { useState } from 'react';
import { Link } from 'react-router-dom';
import Alerta from '../components/Alerta';
import FichasHorario from '../components/FichasHorario';
import useAlerta from '../hooks/useAlerta';
import { disponibilidadeService } from '../services/disponibilidadeService';
import { reservasService } from '../services/reservasService';
import { dataBR, descreverReserva, hojeISO, somarDias } from '../utils/datas';
import { textoDoErro } from '../utils/erros';

export default function Reservar() {
  const [data, setData] = useState(somarDias(hojeISO(), 1));
  const [pessoas, setPessoas] = useState(2);
  const [horarios, setHorarios] = useState(null); // null: ainda não consultou
  const [hora, setHora] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [reserva, setReserva] = useState(null);
  const { alerta, mostrar, limpar } = useAlerta();

  async function buscar() {
    setHora(null);
    limpar();
    try {
      const resposta = await disponibilidadeService.buscar(data, pessoas);
      setHorarios(resposta.horarios);
      if (resposta.horarios.length === 0) {
        mostrar('Não há horários disponíveis para esta data. Tente outra data.', 'info');
      }
    } catch (erro) {
      setHorarios(null);
      mostrar(textoDoErro(erro));
    }
  }

  async function confirmar() {
    setEnviando(true);
    try {
      const criada = await reservasService.criar({ data, hora, pessoas: Number(pessoas) });
      setReserva(criada);
      limpar();
    } catch (erro) {
      // 409: o horário acabou de ser ocupado; atualiza as opções e avisa.
      if (erro.status === 409) await buscar();
      mostrar(textoDoErro(erro));
    } finally {
      setEnviando(false);
    }
  }

  function novaReserva() {
    setReserva(null);
    setHorarios(null);
    setHora(null);
  }

  return (
    <main>
      <h1>Nova reserva</h1>
      <Alerta alerta={alerta} />

      {reserva ? (
        <section className="cartao">
          <h2 className="sem-margem-topo">Reserva confirmada</h2>
          <p>Seu código de reserva:</p>
          <p className="codigo">{reserva.codigo}</p>
          <p>{descreverReserva(reserva)} · mesa {reserva.mesa}</p>
          <p className="muted">Você pode alterar ou cancelar em <Link to="/minhas-reservas">Minhas reservas</Link>.</p>
          <button className="botao" type="button" onClick={novaReserva}>Fazer outra reserva</button>
        </section>
      ) : (
        <section>
          <form className="cartao" noValidate onSubmit={(e) => { e.preventDefault(); buscar(); }}>
            <div className="linha">
              <div className="campo">
                <label htmlFor="data">Data</label>
                <input id="data" type="date" required min={hojeISO()} max={somarDias(hojeISO(), 30)} value={data} onChange={(e) => setData(e.target.value)} />
              </div>
              <div className="campo">
                <label htmlFor="pessoas">Pessoas</label>
                <input id="pessoas" className="campo-curto" type="number" min="1" max="50" required value={pessoas} onChange={(e) => setPessoas(e.target.value)} />
              </div>
              <button className="botao" type="submit">Ver horários</button>
            </div>
          </form>

          {horarios && (
            <section>
              <h2>Horários disponíveis</h2>
              <FichasHorario horarios={horarios} escolhido={hora} aoEscolher={setHora} />
              {hora && <p className="muted">Resumo: {dataBR(data)} às {hora}, {pessoas} pessoa(s).</p>}
              <button className="botao principal" type="button" disabled={!hora || enviando} onClick={confirmar}>
                Confirmar reserva
              </button>
            </section>
          )}
        </section>
      )}
    </main>
  );
}
