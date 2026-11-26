import { useCallback, useEffect, useState } from 'react';
import Alerta from '../components/Alerta';
import useAlerta from '../hooks/useAlerta';
import { configuracoesService } from '../services/configuracoesService';
import { NOME_DIA, horaDe } from '../utils/datas';
import { textoDoErro } from '../utils/erros';

const PARAMETROS = [
  ['duracaoMinutos', 'Duração da reserva (minutos)', 1],
  ['antecedenciaMinMinutos', 'Antecedência mínima para reservar (minutos)', 0],
  ['antecedenciaMaxDias', 'Antecedência máxima para reservar (dias)', 1],
  ['prazoCancelamentoMinutos', 'Prazo para o cliente alterar ou cancelar (minutos antes)', 0],
  ['toleranciaAtrasoMinutos', 'Tolerância de atraso (minutos)', 0],
];

const prepararHorarios = (horarios) => horarios.map((h) => ({
  diaSemana: h.diaSemana,
  aberto: h.aberto,
  abertura: h.abertura ? horaDe(h.abertura) : '18:00',
  fechamento: h.fechamento ? horaDe(h.fechamento) : '23:00',
}));

export default function Configuracoes() {
  const [horarios, setHorarios] = useState([]);
  const [parametros, setParametros] = useState({});
  const { alerta, mostrar, limpar } = useAlerta();

  const carregar = useCallback(async () => {
    try {
      setHorarios(prepararHorarios(await configuracoesService.horarios()));
      setParametros(await configuracoesService.parametros());
      limpar();
    } catch (erro) {
      mostrar(textoDoErro(erro));
    }
  }, [limpar, mostrar]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  function alterarHorario(indice, campo, valor) {
    setHorarios((atual) => atual.map((h, i) => (i === indice ? { ...h, [campo]: valor } : h)));
  }

  async function salvarHorarios(evento) {
    evento.preventDefault();
    const corpo = horarios.map((h) => ({
      diaSemana: h.diaSemana,
      aberto: h.aberto,
      abertura: h.aberto ? h.abertura : null,
      fechamento: h.aberto ? h.fechamento : null,
    }));
    try {
      setHorarios(prepararHorarios(await configuracoesService.salvarHorarios(corpo)));
      mostrar('Horários salvos.', 'sucesso');
    } catch (erro) {
      mostrar(textoDoErro(erro));
    }
  }

  async function salvarParametros(evento) {
    evento.preventDefault();
    const corpo = {};
    PARAMETROS.forEach(([campo]) => { corpo[campo] = Number(parametros[campo]); });
    try {
      await configuracoesService.salvarParametros(corpo);
      mostrar('Parâmetros salvos.', 'sucesso');
    } catch (erro) {
      mostrar(textoDoErro(erro));
    }
  }

  return (
    <main>
      <h1>Configurações</h1>
      <Alerta alerta={alerta} />

      <form className="cartao" noValidate onSubmit={salvarHorarios}>
        <h2 className="sem-margem-topo">Horário de funcionamento</h2>
        <div className="tabela-rolagem">
          <table>
            <thead>
              <tr><th>Dia</th><th>Aberto</th><th>Abertura</th><th>Fechamento</th></tr>
            </thead>
            <tbody>
              {horarios.map((h, i) => (
                <tr key={h.diaSemana}>
                  <td>{NOME_DIA[h.diaSemana]}</td>
                  <td>
                    <input type="checkbox" aria-label={`${NOME_DIA[h.diaSemana]} aberto`} checked={h.aberto} onChange={(e) => alterarHorario(i, 'aberto', e.target.checked)} />
                  </td>
                  <td>
                    <input type="time" aria-label={`Abertura de ${NOME_DIA[h.diaSemana]}`} value={h.abertura} onChange={(e) => alterarHorario(i, 'abertura', e.target.value)} />
                  </td>
                  <td>
                    <input type="time" aria-label={`Fechamento de ${NOME_DIA[h.diaSemana]}`} value={h.fechamento} onChange={(e) => alterarHorario(i, 'fechamento', e.target.value)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p><button className="botao principal" type="submit">Salvar horários</button></p>
      </form>

      <form className="cartao" noValidate onSubmit={salvarParametros}>
        <h2 className="sem-margem-topo">Parâmetros de reserva</h2>
        {PARAMETROS.map(([campo, rotulo, minimo]) => (
          <div className="campo" key={campo}>
            <label htmlFor={campo}>{rotulo}</label>
            <input
              id={campo}
              type="number"
              min={minimo}
              required
              value={parametros[campo] ?? ''}
              onChange={(e) => setParametros((atual) => ({ ...atual, [campo]: e.target.value }))}
            />
          </div>
        ))}
        <button className="botao principal" type="submit">Salvar parâmetros</button>
        <p className="muted">As reservas já criadas mantêm o período original.</p>
      </form>
    </main>
  );
}
