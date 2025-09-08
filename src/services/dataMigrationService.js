import { metricsService, settingsService } from './databaseService';

// Serviço para migrar dados do localStorage para o banco
export const dataMigrationService = {
  // Migrar métricas do dashboard
  async migrateMetrics() {
    try {
      const savedMetrics = localStorage.getItem('dashboard-metrics');
      if (savedMetrics) {
        const metrics = JSON.parse(savedMetrics);
        
        // Migrar cada métrica para o banco
        for (const [key, data] of Object.entries(metrics)) {
          await metricsService.create({
            metric_key: key,
            amount: data.amount,
            change: data.change,
            variant: data.variant
          });
        }
        
        console.log('Métricas migradas com sucesso');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao migrar métricas:', error);
      return false;
    }
  },

  // Migrar configurações
  async migrateSettings() {
    try {
      const settings = [
        { key: 'dashboard-variation-config', value: localStorage.getItem('dashboard-variation-config') },
        { key: 'profile-image', value: localStorage.getItem('profile-image') },
        { key: 'profile-name', value: localStorage.getItem('profile-name') }
      ];

      for (const setting of settings) {
        if (setting.value) {
          await settingsService.set(setting.key, setting.value);
        }
      }

      console.log('Configurações migradas com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao migrar configurações:', error);
      return false;
    }
  },

  // Migrar dados de cidades
  async migrateCities() {
    try {
      const citiesData = localStorage.getItem('cities-data');
      if (citiesData) {
        await settingsService.set('cities-data', citiesData);
        console.log('Dados de cidades migrados com sucesso');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao migrar dados de cidades:', error);
      return false;
    }
  },

  // Executar migração completa
  async migrateAll() {
    try {
      console.log('Iniciando migração de dados...');
      
      const results = await Promise.all([
        this.migrateMetrics(),
        this.migrateSettings(),
        this.migrateCities()
      ]);

      const successCount = results.filter(Boolean).length;
      console.log(`Migração concluída: ${successCount}/3 itens migrados`);
      
      return successCount === 3;
    } catch (error) {
      console.error('Erro na migração completa:', error);
      return false;
    }
  }
};

export default dataMigrationService;
