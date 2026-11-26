export default function Alerta({ alerta }) {
  if (!alerta) return null;
  return <div role="alert" className={`alerta ${alerta.tipo}`}>{alerta.texto}</div>;
}
