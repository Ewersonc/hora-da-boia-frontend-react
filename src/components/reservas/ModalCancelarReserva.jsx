import Modal from '../Modal';
import { descreverReserva } from '../../utils/datas';

export default function ModalCancelarReserva({ reserva, aoFechar, aoConfirmar }) {
  return (
    <Modal aoFechar={aoFechar}>
      <h2>Cancelar reserva?</h2>
      <p>{descreverReserva(reserva)} · código {reserva.codigo}</p>
      <p className="muted">A mesa volta a ficar livre para outros clientes.</p>
      <div className="acoes">
        <button className="botao" type="button" onClick={aoFechar}>Voltar</button>
        <button className="botao perigo" type="button" onClick={aoConfirmar}>Cancelar reserva</button>
      </div>
    </Modal>
  );
}
