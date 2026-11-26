import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Alerta from '../components/Alerta';
import { destinoDoPerfil } from '../config/menus';
import useAlerta from '../hooks/useAlerta';
import useAuth from '../hooks/useAuth';
import { authService } from '../services/authService';
import { textoDoErro } from '../utils/erros';

const FORM_ENTRAR = { email: '', senha: '' };
const FORM_CADASTRAR = { nome: '', email: '', telefone: '', senha: '' };

export default function Login() {
  const { sessao, entrar } = useAuth();
  const navegar = useNavigate();
  const [entrando, setEntrando] = useState(true);
  const [formEntrar, setFormEntrar] = useState(FORM_ENTRAR);
  const [formCadastrar, setFormCadastrar] = useState(FORM_CADASTRAR);
  const { alerta, mostrar, limpar } = useAlerta();

  if (sessao && sessao.perfil) return <Navigate to={destinoDoPerfil(sessao.perfil)} replace />;

  function mudarAba(aba) {
    setEntrando(aba);
    limpar();
  }

  async function enviar(evento, chamada, corpo) {
    evento.preventDefault();
    try {
      const resposta = await chamada(corpo);
      entrar({ token: resposta.token, nome: resposta.nome, perfil: resposta.perfil, usuarioId: resposta.usuarioId });
      navegar(destinoDoPerfil(resposta.perfil), { replace: true });
    } catch (erro) {
      mostrar(textoDoErro(erro));
    }
  }

  const alterar = (setForm) => (e) => setForm((anterior) => ({ ...anterior, [e.target.name]: e.target.value }));

  return (
    <>
      <header className="topo"><span className="marca">Hora da Boia</span></header>
      <main>
        <h1>Reserve sua mesa</h1>
        <div className="abas" role="tablist">
          <button className="botao" type="button" role="tab" aria-selected={entrando} onClick={() => mudarAba(true)}>Entrar</button>
          <button className="botao" type="button" role="tab" aria-selected={!entrando} onClick={() => mudarAba(false)}>Cadastrar</button>
        </div>
        <Alerta alerta={alerta} />

        {entrando ? (
          <form className="cartao" noValidate onSubmit={(e) => enviar(e, authService.login, formEntrar)}>
            <div className="campo">
              <label htmlFor="entrar-email">E-mail</label>
              <input id="entrar-email" name="email" type="email" autoComplete="username" required value={formEntrar.email} onChange={alterar(setFormEntrar)} />
            </div>
            <div className="campo">
              <label htmlFor="entrar-senha">Senha</label>
              <input id="entrar-senha" name="senha" type="password" autoComplete="current-password" required value={formEntrar.senha} onChange={alterar(setFormEntrar)} />
            </div>
            <button className="botao principal" type="submit">Entrar</button>
          </form>
        ) : (
          <form className="cartao" noValidate onSubmit={(e) => enviar(e, authService.cadastrar, formCadastrar)}>
            <div className="campo">
              <label htmlFor="cad-nome">Nome</label>
              <input id="cad-nome" name="nome" type="text" maxLength="100" autoComplete="name" required value={formCadastrar.nome} onChange={alterar(setFormCadastrar)} />
            </div>
            <div className="campo">
              <label htmlFor="cad-email">E-mail</label>
              <input id="cad-email" name="email" type="email" autoComplete="email" required value={formCadastrar.email} onChange={alterar(setFormCadastrar)} />
            </div>
            <div className="campo">
              <label htmlFor="cad-telefone">Telefone</label>
              <input id="cad-telefone" name="telefone" type="tel" maxLength="20" autoComplete="tel" required value={formCadastrar.telefone} onChange={alterar(setFormCadastrar)} />
            </div>
            <div className="campo">
              <label htmlFor="cad-senha">Senha (mínimo de 8 caracteres)</label>
              <input id="cad-senha" name="senha" type="password" minLength="8" maxLength="72" autoComplete="new-password" required value={formCadastrar.senha} onChange={alterar(setFormCadastrar)} />
            </div>
            <button className="botao principal" type="submit">Criar conta</button>
          </form>
        )}
      </main>
    </>
  );
}
