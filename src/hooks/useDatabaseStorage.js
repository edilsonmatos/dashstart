import { useState, useEffect } from 'react';
import { metricsService, settingsService } from '@/services/databaseService';

// Hook híbrido que usa banco de dados como principal e localStorage como fallback
export const useDatabaseStorage = (key, defaultValue = null) => {
  const [value, setValue] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar valor do banco ou localStorage
  const loadValue = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Tentar carregar do banco primeiro
      if (key.startsWith('dashboard-metrics')) {
        const metrics = await metricsService.getAll();
        if (metrics.length > 0) {
          const metricsObj = {};
          metrics.forEach(metric => {
            metricsObj[metric.metric_key] = {
              amount: metric.amount,
              change: metric.change,
              variant: metric.variant
            };
          });
          setValue(metricsObj);
          return;
        }
      } else {
        const setting = await settingsService.getByKey(key);
        if (setting) {
          setValue(JSON.parse(setting.setting_value));
          return;
        }
      }

      // Fallback para localStorage
      const localValue = localStorage.getItem(key);
      if (localValue) {
        setValue(JSON.parse(localValue));
      } else {
        setValue(defaultValue);
      }
    } catch (err) {
      console.error('Erro ao carregar do banco, usando localStorage:', err);
      setError(err.message);
      
      // Fallback para localStorage em caso de erro
      const localValue = localStorage.getItem(key);
      if (localValue) {
        setValue(JSON.parse(localValue));
      } else {
        setValue(defaultValue);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Salvar valor no banco e localStorage
  const saveValue = async (newValue) => {
    try {
      setValue(newValue);
      
      // Salvar no localStorage primeiro (para resposta rápida)
      localStorage.setItem(key, JSON.stringify(newValue));

      // Salvar no banco de dados
      if (key.startsWith('dashboard-metrics')) {
        // Salvar métricas no banco
        for (const [metricKey, data] of Object.entries(newValue)) {
          await metricsService.update(metricKey, data);
        }
      } else {
        // Salvar configuração no banco
        await settingsService.set(key, JSON.stringify(newValue));
      }

      console.log(`Valor salvo com sucesso: ${key}`);
    } catch (err) {
      console.error('Erro ao salvar no banco:', err);
      setError(err.message);
      // Mesmo com erro no banco, o valor já foi salvo no localStorage
    }
  };

  useEffect(() => {
    loadValue();
  }, [key]);

  return {
    value,
    setValue: saveValue,
    isLoading,
    error,
    reload: loadValue
  };
};

export default useDatabaseStorage;
