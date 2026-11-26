import { horaDe } from '../utils/datas';

/** Horários livres como fichas selecionáveis. */
export default function FichasHorario({ horarios, escolhido, aoEscolher }) {
  return (
    <div className="fichas">
      {horarios.map((horario) => {
        const texto = horaDe(horario);
        return (
          <button
            key={texto}
            className="ficha"
            type="button"
            aria-pressed={escolhido === texto}
            onClick={() => aoEscolher(texto)}
          >
            {texto}
          </button>
        );
      })}
    </div>
  );
}
