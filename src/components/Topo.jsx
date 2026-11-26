import { Link, NavLink } from 'react-router-dom';
import { MENUS } from '../config/menus';
import useAuth from '../hooks/useAuth';

export default function Topo() {
  const { sessao, sair } = useAuth();
  return (
    <header className="topo">
      <Link className="marca" to="/">Hora da Boia</Link>
      <nav>
        {MENUS[sessao.perfil].map(([texto, destino]) => (
          <NavLink key={destino} to={destino}>{texto}</NavLink>
        ))}
      </nav>
      <span className="usuario">{sessao.nome}</span>
      <button className="botao discreto" type="button" onClick={sair}>Sair</button>
    </header>
  );
}
