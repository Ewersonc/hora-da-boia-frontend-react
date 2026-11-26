// Menu de navegação de cada perfil e página inicial depois do login.
export const MENUS = {
  CLIENTE: [
    ['Nova reserva', '/reservar'],
    ['Minhas reservas', '/minhas-reservas'],
  ],
  ATENDENTE: [
    ['Agenda', '/agenda'],
    ['Reserva de balcão', '/balcao'],
  ],
  ADMINISTRADOR: [
    ['Agenda', '/agenda'],
    ['Reserva de balcão', '/balcao'],
    ['Mesas', '/mesas'],
    ['Configurações', '/configuracoes'],
    ['Atendentes', '/atendentes'],
    ['Histórico', '/historico'],
  ],
};

export function destinoDoPerfil(perfil) {
  return perfil === 'CLIENTE' ? '/reservar' : '/agenda';
}
