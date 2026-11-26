import { useState } from 'react';
import Alerta from '../Alerta';
import Modal from '../Modal';
import useAlerta from '../../hooks/useAlerta';
import { mesasService } from '../../services/mesasService';
import { textoDoErro } from '../../utils/erros';

/** Cria uma mesa (mesa === null) ou edita a mesa informada. */
export default function ModalMesa({ mesa, aoFechar, aoSalvar }) {
  const [identificacao, setIdentificacao] = useState(mesa ? mesa.identificacao : '');
  const [capacidade, setCapacidade] = useState(mesa ? mesa.capacidade : 4);
  const [ativa, setAtiva] = useState(mesa ? mesa.ativa : true);
  const { alerta, mostrar } = useAlerta();

  async function enviar(evento) {
    evento.preventDefault();
    const corpo = { identificacao, capacidade: Number(capacidade), ativa };
    try {
      if (mesa) await mesasService.atualizar(mesa.id, corpo);
      else await mesasService.criar(corpo);
      aoSalvar();
    } catch (erro) {
      mostrar(textoDoErro(erro));
    }
  }

  return (
    <Modal aoFechar={aoFechar}>
      <h2>{mesa ? 'Editar mesa' : 'Nova mesa'}</h2>
      <Alerta alerta={alerta} />
      <form noValidate onSubmit={enviar}>
        <div className="campo">
          <label htmlFor="identificacao">Identificação</label>
          <input id="identificacao" type="text" maxLength="30" required value={identificacao} onChange={(e) => setIdentificacao(e.target.value)} />
        </div>
        <div className="campo">
          <label htmlFor="capacidade">Lugares</label>
          <input id="capacidade" type="number" min="1" required value={capacidade} onChange={(e) => setCapacidade(e.target.value)} />
        </div>
        <div className="campo">
          <label><input type="checkbox" checked={ativa} onChange={(e) => setAtiva(e.target.checked)} /> Mesa ativa</label>
        </div>
        <div className="acoes">
          <button className="botao" type="button" onClick={aoFechar}>Cancelar</button>
          <button className="botao principal" type="submit">Salvar</button>
        </div>
      </form>
    </Modal>
  );
}
