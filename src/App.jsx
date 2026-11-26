import { Navigate, Route, Routes } from 'react-router-dom';
import RotaProtegida from './routes/RotaProtegida';
import Agenda from './pages/Agenda';
import Atendentes from './pages/Atendentes';
import Balcao from './pages/Balcao';
import Configuracoes from './pages/Configuracoes';
import Historico from './pages/Historico';
import Login from './pages/Login';
import Mesas from './pages/Mesas';
import MinhasReservas from './pages/MinhasReservas';
import Reservar from './pages/Reservar';

const CLIENTE = ['CLIENTE'];
const EQUIPE = ['ATENDENTE', 'ADMINISTRADOR'];
const ADMIN = ['ADMINISTRADOR'];

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route element={<RotaProtegida perfis={CLIENTE} />}>
        <Route path="/reservar" element={<Reservar />} />
        <Route path="/minhas-reservas" element={<MinhasReservas />} />
      </Route>

      <Route element={<RotaProtegida perfis={EQUIPE} />}>
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/balcao" element={<Balcao />} />
      </Route>

      <Route element={<RotaProtegida perfis={ADMIN} />}>
        <Route path="/mesas" element={<Mesas />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/atendentes" element={<Atendentes />} />
        <Route path="/historico" element={<Historico />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
