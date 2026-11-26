export const NOME_DIA = ['', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
const ABREVIACAO_DIA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const dois = (n) => String(n).padStart(2, '0');

export function hojeISO() {
  const d = new Date();
  return `${d.getFullYear()}-${dois(d.getMonth() + 1)}-${dois(d.getDate())}`;
}

export function agoraISO() {
  const d = new Date();
  return `${hojeISO()}T${dois(d.getHours())}:${dois(d.getMinutes())}:${dois(d.getSeconds())}`;
}

export function somarDias(iso, dias) {
  const [a, m, d] = iso.slice(0, 10).split('-').map(Number);
  const data = new Date(a, m - 1, d + dias);
  return `${data.getFullYear()}-${dois(data.getMonth() + 1)}-${dois(data.getDate())}`;
}

export function dataBR(iso) {
  const [a, m, d] = iso.slice(0, 10).split('-');
  return `${d}/${m}/${a}`;
}

export function diaCurto(iso) {
  const [a, m, d] = iso.slice(0, 10).split('-').map(Number);
  return ABREVIACAO_DIA[new Date(a, m - 1, d).getDay()];
}

export function horaDe(isoOuHora) {
  const texto = String(isoOuHora);
  return texto.includes('T') ? texto.slice(11, 16) : texto.slice(0, 5);
}

export function descreverReserva(r) {
  const pessoas = r.numeroPessoas === 1 ? '1 pessoa' : `${r.numeroPessoas} pessoas`;
  return `${diaCurto(r.inicio)}, ${dataBR(r.inicio).slice(0, 5)} · ${horaDe(r.inicio)} · ${pessoas}`;
}
