import { useState, useEffect } from 'react';
import { testConnection, initializeDatabase } from '@/helpers/database';

export const useDatabase = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Testar conexão
        const connected = await testConnection();
        
        if (connected) {
          // Inicializar banco se necessário
          await initializeDatabase();
          setIsConnected(true);
        } else {
          setError('Não foi possível conectar ao banco de dados');
          setIsConnected(false);
        }
      } catch (err) {
        console.error('Erro ao verificar conexão:', err);
        setError(err.message);
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
  }, []);

  const reconnect = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const connected = await testConnection();
      setIsConnected(connected);
      
      if (!connected) {
        setError('Não foi possível reconectar ao banco de dados');
      }
    } catch (err) {
      setError(err.message);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isConnected,
    isLoading,
    error,
    reconnect
  };
};

export default useDatabase;
