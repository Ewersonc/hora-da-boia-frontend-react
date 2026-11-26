import { useCallback, useEffect, useState } from 'react';
import Alerta from '../components/Alerta';
import ModalAtendente from '../components/atendentes/ModalAtendente';
import useAlerta from '../hooks/useAlerta';
import { atendentesService } from '../services/atendentesService';
import { textoDoErro } from '../utils/erros';

export default function Atendentes() {
  const [atendentes, setAtendentes] = useState([]);
  const [editando, setEditando] = useState(undefined); // undefined: modal fechado; null: novo atendente
  const { alerta, mostrar, limpar } = useAlerta();

  const carregar = useCallback(async () => {
    try {
      setAtendentes(await atendentesService.listar());
      limpar();
    } catch (erro) {
      mostrar(textoDoErro(erro));
    }
  }, [limpar, mostrar]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function desativar(atendente) {
    if (!window.confirm(`Desativar ${atendente.nome}? Ele não poderá mais entrar no sistema.`)) return;
    try {
      await atendentesService.desativar(atendente.id);
      await carregar();
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
        <h1>Atendentes</h1>
        <button className="botao principal" type="button" onClick={() => setEditando(null)}>+ Novo atendente</button>
      </div>
      <Alerta alerta={alerta} />
      <div className="tabela-rolagem">
        <table>
          <thead>
            <tr><th>Nome</th><th>E-mail</th><th>Situação</th><th>Ações</th></tr>
          </thead>
          <tbody>
            {atendentes.map((a) => (
              <tr key={a.id}>
                <td>{a.nome}</td>
                <td>{a.email}</td>
                <td>{a.ativo ? 'Ativo' : 'Inativo'}</td>
                <td>
                  <div className="acoes">
                    <button className="botao pequeno" type="button" onClick={() => setEditando(a)}>Editar</button>
                    {a.ativo && <button className="botao pequeno perigo" type="button" onClick={() => desativar(a)}>Desativar</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editando !== undefined && (
        <ModalAtendente key={editando ? editando.id : 'novo'} atendente={editando} aoFechar={() => setEditando(undefined)} aoSalvar={aoSalvar} />
      )}
    </main>
  );
}
