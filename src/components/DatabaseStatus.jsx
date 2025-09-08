import { useDatabase } from '@/hooks/useDatabase';
import { Alert, Button, Spinner } from 'react-bootstrap';
import IconifyIcon from './wrappers/IconifyIcon';

const DatabaseStatus = () => {
  const { isConnected, isLoading, error, reconnect } = useDatabase();

  if (isLoading) {
    return (
      <Alert variant="info" className="d-flex align-items-center">
        <Spinner animation="border" size="sm" className="me-2" />
        Conectando ao banco de dados...
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <IconifyIcon icon="bx:error-circle" className="me-2" />
          <div>
            <strong>Erro de conexão:</strong> {error}
          </div>
        </div>
        <Button variant="outline-danger" size="sm" onClick={reconnect}>
          <IconifyIcon icon="bx:refresh" className="me-1" />
          Reconectar
        </Button>
      </Alert>
    );
  }

  if (isConnected) {
    return (
      <Alert variant="success" className="d-flex align-items-center">
        <IconifyIcon icon="bx:check-circle" className="me-2" />
        Conectado ao banco de dados PostgreSQL
      </Alert>
    );
  }

  return null;
};

export default DatabaseStatus;
