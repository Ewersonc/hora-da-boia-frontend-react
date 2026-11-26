import { useState } from 'react';
import Alerta from '../Alerta';
import Modal from '../Modal';
import useAlerta from '../../hooks/useAlerta';
import { atendentesService } from '../../services/atendentesService';
import { textoDoErro } from '../../utils/erros';

/** Cria um atendente (atendente === null) ou edita o atendente informado. */
export default function ModalAtendente({ atendente, aoFechar, aoSalvar }) {
  const [nome, setNome] = useState(atendente ? atendente.nome : '');
  const [email, setEmail] = useState(atendente ? atendente.email : '');
  const [telefone, setTelefone] = useState(atendente && atendente.telefone ? atendente.telefone : '');
  const [senha, setSenha] = useState('');
  const [ativo, setAtivo] = useState(atendente ? atendente.ativo : true);
  const { alerta, mostrar } = useAlerta();

  async function enviar(evento) {
    evento.preventDefault();
    const corpo = { nome, email, telefone: telefone || null, senha: senha || null, ativo };
    try {
      if (atendente) await atendentesService.atualizar(atendente.id, corpo);
      else await atendentesService.criar(corpo);
      aoSalvar();
    } catch (erro) {
      mostrar(textoDoErro(erro));
    }
  }

  return (
    <Modal aoFechar={aoFechar}>
      <h2>{atendente ? 'Editar atendente' : 'Novo atendente'}</h2>
      <Alerta alerta={alerta} />
      <form noValidate onSubmit={enviar}>
        <div className="campo">
          <label htmlFor="nome">Nome</label>
          <input id="nome" type="text" maxLength="100" required value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>
        <div className="campo">
          <label htmlFor="email">E-mail</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="campo">
          <label htmlFor="telefone">Telefone (opcional)</label>
          <input id="telefone" type="tel" maxLength="20" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
        </div>
        <div className="campo">
          <label htmlFor="senha">
            {atendente ? 'Nova senha (deixe em branco para manter)' : 'Senha inicial (mínimo de 8 caracteres)'}
          </label>
          <input id="senha" type="password" minLength="8" maxLength="72" autoComplete="new-password" value={senha} onChange={(e) => setSenha(e.target.value)} />
        </div>
        <div className="campo">
          <label><input type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} /> Atendente ativo</label>
        </div>
        <div className="acoes">
          <button className="botao" type="button" onClick={aoFechar}>Cancelar</button>
          <button className="botao principal" type="submit">Salvar</button>
        </div>
      </form>
    </Modal>
  );
}
