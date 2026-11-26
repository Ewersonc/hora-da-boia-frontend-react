import { useCallback, useEffect, useState } from 'react';
import Alerta from '../components/Alerta';
import ModalMesa from '../components/mesas/ModalMesa';
import useAlerta from '../hooks/useAlerta';
import { mesasService } from '../services/mesasService';
import { textoDoErro } from '../utils/erros';

export default function Mesas() {
  const [mesas, setMesas] = useState([]);
  const [editando, setEditando] = useState(undefined); // undefined: modal fechado; null: nova mesa
  const { alerta, mostrar, limpar } = useAlerta();

  const carregar = useCallback(async () => {
    try {
      setMesas(await mesasService.listar());
      limpar();
    } catch (erro) {
      mostrar(textoDoErro(erro));
    }
  }, [limpar, mostrar]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function desativar(mesa) {
    if (!window.confirm(`Desativar a mesa ${mesa.identificacao}?`)) return;
    try {
      await mesasService.desativar(mesa.id);
      await carregar();
      mostrar('Mesa desativada.', 'sucesso');
    } catch (erro) {
      mostrar(textoDoErro(erro));
    }
  }

  async function aoSalvar() {
    setEditando(undefined);
    await carregar();
  }

  return (
    <main>
      <div className="linha entre">
        <h1>Mesas</h1>
        <button className="botao principal" type="button" onClick={() => setEditando(null)}>+ Nova mesa</button>
      </div>
      <Alerta alerta={alerta} />
      <div className="tabela-rolagem">
        <table>
          <thead>
            <tr><th>Identificação</th><th>Lugares</th><th>Situação</th><th>Ações</th></tr>
          </thead>
          <tbody>
            {mesas.map((m) => (
              <tr key={m.id}>
                <td>{m.identificacao}</td>
                <td>{m.capacidade}</td>
                <td>{m.ativa ? 'Ativa' : 'Inativa'}</td>
                <td>
                  <div className="acoes">
                    <button className="botao pequeno" type="button" onClick={() => setEditando(m)}>Editar</button>
                    {m.ativa && <button className="botao pequeno perigo" type="button" onClick={() => desativar(m)}>Desativar</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="muted">Uma mesa com reservas futuras confirmadas não pode ser desativada.</p>

      {editando !== undefined && (
        <ModalMesa key={editando ? editando.id : 'nova'} mesa={editando} aoFechar={() => setEditando(undefined)} aoSalvar={aoSalvar} />
      )}
    </main>
  );
}
