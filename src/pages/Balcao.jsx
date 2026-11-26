import { useState } from 'react';
import { Link } from 'react-router-dom';
import Alerta from '../components/Alerta';
import FichasHorario from '../components/FichasHorario';
import useAlerta from '../hooks/useAlerta';
import { disponibilidadeService } from '../services/disponibilidadeService';
import { reservasService } from '../services/reservasService';
import { descreverReserva, hojeISO, somarDias } from '../utils/datas';
import { textoDoErro } from '../utils/erros';

export default function Balcao() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [data, setData] = useState(hojeISO());
  const [pessoas, setPessoas] = useState(2);
  const [horarios, setHorarios] = useState(null);
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
      if (resposta.horarios.length === 0) mostrar('Não há horários disponíveis para esta data.', 'info');
    } catch (erro) {
      setHorarios(null);
      mostrar(textoDoErro(erro));
    }
  }

  async function registrar() {
    setEnviando(true);
    try {
      const criada = await reservasService.criarNoBalcao({ nome, telefone, data, hora, pessoas: Number(pessoas) });
      setReserva(criada);
      limpar();
    } catch (erro) {
      if (erro.status === 409) await buscar();
      mostrar(textoDoErro(erro));
    } finally {
      setEnviando(false);
    }
  }

  function novaReserva() {
    setNome('');
    setTelefone('');
    setPessoas(2);
    setData(hojeISO());
    setReserva(null);
    setHorarios(null);
    setHora(null);
  }

  return (
    <main>
      <h1>Reserva de balcão</h1>
      <Alerta alerta={alerta} />

      {reserva ? (
        <section className="cartao">
          <h2 className="sem-margem-topo">Reserva registrada</h2>
          <p>Informe o código ao cliente:</p>
          <p className="codigo">{reserva.codigo}</p>
          <p>{reserva.clienteNome} · {descreverReserva(reserva)} · mesa {reserva.mesa}</p>
          <div className="acoes">
            <button className="botao" type="button" onClick={novaReserva}>Registrar outra reserva</button>
            <Link className="botao" to="/agenda">Ver agenda</Link>
          </div>
        </section>
      ) : (
        <section>
          <form className="cartao" noValidate onSubmit={(e) => { e.preventDefault(); buscar(); }}>
            <div className="campo">
              <label htmlFor="nome">Nome do cliente</label>
              <input id="nome" type="text" maxLength="100" required value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
            <div className="linha">
              <div className="campo">
                <label htmlFor="telefone">Telefone</label>
                <input id="telefone" type="tel" maxLength="20" required value={telefone} onChange={(e) => setTelefone(e.target.value)} />
              </div>
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
              <button className="botao principal" type="button" disabled={!hora || enviando} onClick={registrar}>
                Registrar reserva
              </button>
            </section>
          )}
        </section>
      )}
    </main>
  );
}
