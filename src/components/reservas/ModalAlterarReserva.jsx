import { useState } from 'react';
import Alerta from '../Alerta';
import FichasHorario from '../FichasHorario';
import Modal from '../Modal';
import useAlerta from '../../hooks/useAlerta';
import { disponibilidadeService } from '../../services/disponibilidadeService';
import { reservasService } from '../../services/reservasService';
import { descreverReserva, hojeISO, somarDias } from '../../utils/datas';
import { textoDoErro } from '../../utils/erros';

export default function ModalAlterarReserva({ reserva, aoFechar, aoSalvar }) {
  const [data, setData] = useState(reserva.inicio.slice(0, 10));
  const [pessoas, setPessoas] = useState(reserva.numeroPessoas);
  const [horarios, setHorarios] = useState([]);
  const [hora, setHora] = useState(null);
  const { alerta, mostrar, limpar } = useAlerta();

  async function buscar() {
    setHora(null);
    limpar();
    try {
      const resposta = await disponibilidadeService.buscar(data, pessoas);
      setHorarios(resposta.horarios);
      if (resposta.horarios.length === 0) mostrar('Não há horários disponíveis para esta data.', 'info');
    } catch (erro) {
      mostrar(textoDoErro(erro));
    }
  }

  async function salvar() {
    try {
      await reservasService.alterar(reserva.id, { data, hora, pessoas: Number(pessoas) });
      aoSalvar();
    } catch (erro) {
      mostrar(textoDoErro(erro));
    }
  }

  return (
    <Modal aoFechar={aoFechar}>
      <h2>Alterar reserva</h2>
      <p className="muted">Reserva atual: {descreverReserva(reserva)} · código {reserva.codigo}</p>
      <Alerta alerta={alerta} />
      <div className="linha">
        <div className="campo">
          <label htmlFor="alterar-data">Data</label>
          <input id="alterar-data" type="date" min={hojeISO()} max={somarDias(hojeISO(), 30)} value={data} onChange={(e) => setData(e.target.value)} />
        </div>
        <div className="campo">
          <label htmlFor="alterar-pessoas">Pessoas</label>
          <input id="alterar-pessoas" className="campo-curto" type="number" min="1" max="50" value={pessoas} onChange={(e) => setPessoas(e.target.value)} />
        </div>
        <button className="botao" type="button" onClick={buscar}>Ver horários</button>
      </div>
      <FichasHorario horarios={horarios} escolhido={hora} aoEscolher={setHora} />
      <div className="acoes">
        <button className="botao" type="button" onClick={aoFechar}>Voltar</button>
        <button className="botao principal" type="button" disabled={!hora} onClick={salvar}>Salvar alterações</button>
      </div>
    </Modal>
  );
}
