import { ROTULO_STATUS } from '../utils/status';

export default function SeloStatus({ status }) {
  return <span className={`selo ${status.toLowerCase()}`}>{ROTULO_STATUS[status] || status}</span>;
}
