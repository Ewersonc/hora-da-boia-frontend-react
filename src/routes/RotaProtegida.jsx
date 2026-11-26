import { Navigate, Outlet } from 'react-router-dom';
import Topo from '../components/Topo';
import useAuth from '../hooks/useAuth';

/** Exige sessão e perfil permitido; mostra o topo com o menu do perfil e a página filha. */
export default function RotaProtegida({ perfis }) {
  const { sessao } = useAuth();
  if (!sessao || !perfis.includes(sessao.perfil)) return <Navigate to="/" replace />;
  return (
    <>
      <Topo />
      <Outlet />
    </>
  );
}
