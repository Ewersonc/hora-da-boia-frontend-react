import SeloStatus from '../SeloStatus';
import { descreverReserva } from '../../utils/datas';

export default function CartaoReserva({ reserva, futura, aoAlterar, aoCancelar }) {
  return (
    <article className="cartao reserva">
      <div>
        <h3>{descreverReserva(reserva)}</h3>
        <p>
          Código {reserva.codigo} · mesa {reserva.mesa} <SeloStatus status={reserva.status} />
        </p>
      </div>
      {futura && (
        <div className="acoes">
          <button className="botao pequeno" type="button" disabled={!reserva.podeAlterar} onClick={() => aoAlterar(reserva)}>
            Alterar
          </button>
          <button className="botao pequeno perigo" type="button" disabled={!reserva.podeCancelar} onClick={() => aoCancelar(reserva)}>
            Cancelar
          </button>
        </div>
      )}
    </article>
  );
}
