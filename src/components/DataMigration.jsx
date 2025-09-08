import { useState } from 'react';
import { Card, CardBody, CardHeader, CardTitle, Button, Alert, ProgressBar } from 'react-bootstrap';
import IconifyIcon from './wrappers/IconifyIcon';
import dataMigrationService from '@/services/dataMigrationService';
import { useDatabase } from '@/hooks/useDatabase';

const DataMigration = () => {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState(null);
  const [progress, setProgress] = useState(0);
  const { isConnected } = useDatabase();

  const handleMigration = async () => {
    if (!isConnected) {
      setMigrationStatus({
        type: 'danger',
        message: 'Não é possível migrar: banco de dados não conectado'
      });
      return;
    }

    setIsMigrating(true);
    setProgress(0);
    setMigrationStatus(null);

    try {
      // Simular progresso
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const success = await dataMigrationService.migrateAll();
      
      clearInterval(progressInterval);
      setProgress(100);

      if (success) {
        setMigrationStatus({
          type: 'success',
          message: 'Migração concluída com sucesso! Todos os dados foram transferidos para o banco de dados.'
        });
      } else {
        setMigrationStatus({
          type: 'warning',
          message: 'Migração parcialmente concluída. Alguns dados podem não ter sido migrados.'
        });
      }
    } catch (error) {
      setMigrationStatus({
        type: 'danger',
        message: `Erro na migração: ${error.message}`
      });
    } finally {
      setIsMigrating(false);
    }
  };

  const checkLocalStorageData = () => {
    const hasMetrics = localStorage.getItem('dashboard-metrics');
    const hasSettings = localStorage.getItem('dashboard-variation-config') || 
                       localStorage.getItem('profile-image') || 
                       localStorage.getItem('profile-name');
    const hasCities = localStorage.getItem('cities-data');
    
    return { hasMetrics, hasSettings, hasCities };
  };

  const { hasMetrics, hasSettings, hasCities } = checkLocalStorageData();
  const hasData = hasMetrics || hasSettings || hasCities;

  if (!hasData) {
    return (
      <Card>
        <CardBody className="text-center">
          <IconifyIcon icon="bx:check-circle" className="fs-48 text-success mb-3" />
          <h5>Nenhum dado para migrar</h5>
          <p className="text-muted">Todos os dados já estão no banco de dados ou não há dados salvos localmente.</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle as="h5" className="d-flex align-items-center">
          <IconifyIcon icon="bx:database" className="me-2" />
          Migração de Dados
        </CardTitle>
      </CardHeader>
      <CardBody>
        <div className="mb-4">
          <h6>Dados encontrados no localStorage:</h6>
          <ul className="list-unstyled">
            {hasMetrics && (
              <li className="d-flex align-items-center mb-2">
                <IconifyIcon icon="bx:chart" className="text-primary me-2" />
                Métricas do Dashboard
              </li>
            )}
            {hasSettings && (
              <li className="d-flex align-items-center mb-2">
                <IconifyIcon icon="bx:settings" className="text-primary me-2" />
                Configurações do Sistema
              </li>
            )}
            {hasCities && (
              <li className="d-flex align-items-center mb-2">
                <IconifyIcon icon="bx:map" className="text-primary me-2" />
                Dados de Cidades
              </li>
            )}
          </ul>
        </div>

        {migrationStatus && (
          <Alert variant={migrationStatus.type} className="mb-3">
            {migrationStatus.message}
          </Alert>
        )}

        {isMigrating && (
          <div className="mb-3">
            <div className="d-flex justify-content-between mb-1">
              <small>Migrando dados...</small>
              <small>{progress}%</small>
            </div>
            <ProgressBar now={progress} animated />
          </div>
        )}

        <div className="d-flex gap-2">
          <Button 
            variant="primary" 
            onClick={handleMigration}
            disabled={isMigrating || !isConnected}
          >
            <IconifyIcon icon="bx:upload" className="me-1" />
            {isMigrating ? 'Migrando...' : 'Migrar para Banco de Dados'}
          </Button>
          
          {!isConnected && (
            <Alert variant="warning" className="mb-0">
              <IconifyIcon icon="bx:error" className="me-1" />
              Banco de dados não conectado
            </Alert>
          )}
        </div>

        <div className="mt-3">
          <small className="text-muted">
            <IconifyIcon icon="bx:info-circle" className="me-1" />
            A migração transferirá todos os dados do localStorage para o banco de dados PostgreSQL.
            Os dados locais serão mantidos como backup.
          </small>
        </div>
      </CardBody>
    </Card>
  );
};

export default DataMigration;
