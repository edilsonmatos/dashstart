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
    const result = await query('SELECT * FROM dashboard_metrics ORDER BY id');
    return result.rows;
  },

  // Atualizar métrica
  async update(metricKey, metricData) {
    const { amount, change, variant } = metricData;
    const result = await query(
      'UPDATE dashboard_metrics SET amount = $1, change = $2, variant = $3, updated_at = CURRENT_TIMESTAMP WHERE metric_key = $4 RETURNING *',
      [amount, change, variant, metricKey]
    );
    return result.rows[0];
  },

  // Inserir nova métrica
  async create(metricData) {
    const { metric_key, amount, change, variant } = metricData;
    const result = await query(
      'INSERT INTO dashboard_metrics (metric_key, amount, change, variant) VALUES ($1, $2, $3, $4) RETURNING *',
      [metric_key, amount, change, variant]
    );
    return result.rows[0];
  }
};

// Serviço para operações de configurações
export const settingsService = {
  // Buscar configuração por chave
  async getByKey(key) {
    const result = await query('SELECT * FROM settings WHERE setting_key = $1', [key]);
    return result.rows[0];
  },

  // Atualizar ou criar configuração
  async set(key, value) {
    const result = await query(
      'INSERT INTO settings (setting_key, setting_value) VALUES ($1, $2) ON CONFLICT (setting_key) DO UPDATE SET setting_value = $2, updated_at = CURRENT_TIMESTAMP RETURNING *',
      [key, value]
    );
    return result.rows[0];
  },

  // Buscar todas as configurações
  async getAll() {
    const result = await query('SELECT * FROM settings ORDER BY setting_key');
    return result.rows;
  }
};

export default {
  userService,
  metricsService,
  settingsService
};
