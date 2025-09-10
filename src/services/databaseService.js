import { query } from '@/helpers/database';

// Serviço para operações de usuários
export const userService = {
  // Buscar usuário por email
  async findByEmail(email) {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  // Criar novo usuário
  async create(userData) {
    const { name, email, password, avatar } = userData;
    const result = await query(
      'INSERT INTO users (name, email, password, avatar) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, password, avatar]
    );
    return result.rows[0];
  },

  // Atualizar usuário
  async update(id, userData) {
    const { name, email, avatar } = userData;
    const result = await query(
      'UPDATE users SET name = $1, email = $2, avatar = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [name, email, avatar, id]
    );
    return result.rows[0];
  },

  // Buscar usuário por ID
  async findById(id) {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }
};

// Serviço para operações de métricas
export const metricsService = {
  // Buscar todas as métricas
  async getAll() {
    try {
      const result = await query('SELECT * FROM dashboard_metrics ORDER BY id');
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
      throw error;
    }
  },

  // Atualizar métrica
  async update(metricKey, metricData) {
    try {
      const { amount, change, variant } = metricData;
      console.log('Atualizando métrica:', { metricKey, amount, change, variant });
      
      // Primeiro, tentar atualizar
      const updateResult = await query(
        'UPDATE dashboard_metrics SET amount = $1, change = $2, variant = $3, updated_at = CURRENT_TIMESTAMP WHERE metric_key = $4 RETURNING *',
        [amount, change, variant, metricKey]
      );
      
      if (updateResult.rows.length > 0) {
        console.log('✅ Métrica atualizada com sucesso');
        return updateResult.rows[0];
      }
      
      // Se não encontrou para atualizar, inserir nova
      const insertResult = await query(
        'INSERT INTO dashboard_metrics (metric_key, amount, change, variant) VALUES ($1, $2, $3, $4) RETURNING *',
        [metricKey, amount, change, variant]
      );
      
      console.log('✅ Nova métrica criada com sucesso');
      return insertResult.rows[0];
    } catch (error) {
      console.error('❌ Erro ao atualizar métrica:', error);
      throw error;
    }
  },

  // Inserir nova métrica
  async create(metricData) {
    try {
      const { metric_key, amount, change, variant } = metricData;
      console.log('Criando nova métrica:', { metric_key, amount, change, variant });
      
      const result = await query(
        'INSERT INTO dashboard_metrics (metric_key, amount, change, variant) VALUES ($1, $2, $3, $4) RETURNING *',
        [metric_key, amount, change, variant]
      );
      
      console.log('✅ Nova métrica criada com sucesso');
      return result.rows[0];
    } catch (error) {
      console.error('❌ Erro ao criar métrica:', error);
      throw error;
    }
  }
};

// Serviço para operações de configurações
export const settingsService = {
  // Buscar configuração por chave
  async getByKey(key) {
    try {
      const result = await query('SELECT * FROM settings WHERE setting_key = $1', [key]);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao buscar configuração:', error);
      throw error;
    }
  },

  // Atualizar ou criar configuração
  async set(key, value) {
    try {
      console.log('Salvando configuração:', { key, value: typeof value === 'string' ? value.substring(0, 100) + '...' : value });
      
      // Primeiro, tentar atualizar
      const updateResult = await query(
        'UPDATE settings SET setting_value = $1, updated_at = CURRENT_TIMESTAMP WHERE setting_key = $2 RETURNING *',
        [value, key]
      );
      
      if (updateResult.rows.length > 0) {
        console.log('✅ Configuração atualizada com sucesso');
        return updateResult.rows[0];
      }
      
      // Se não encontrou para atualizar, inserir nova
      const insertResult = await query(
        'INSERT INTO settings (setting_key, setting_value) VALUES ($1, $2) RETURNING *',
        [key, value]
      );
      
      console.log('✅ Nova configuração criada com sucesso');
      return insertResult.rows[0];
    } catch (error) {
      console.error('❌ Erro ao salvar configuração:', error);
      throw error;
    }
  },

  // Buscar todas as configurações
  async getAll() {
    try {
      const result = await query('SELECT * FROM settings ORDER BY setting_key');
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      throw error;
    }
  }
};

export default {
  userService,
  metricsService,
  settingsService
};
