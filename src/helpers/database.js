import { Pool } from 'pg';

// Configuração do banco usando variáveis de ambiente
const databaseConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Necessário para Render
  },
  max: 20, // máximo de clientes no pool
  idleTimeoutMillis: 30000, // fecha clientes inativos após 30 segundos
  connectionTimeoutMillis: 2000, // retorna erro após 2 segundos se não conseguir conectar
};

// Pool de conexões do PostgreSQL
const pool = new Pool(databaseConfig);

// Função para executar queries
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Query executada:', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Erro na query:', error);
    throw error;
  }
};

// Função para obter um cliente do pool
export const getClient = async () => {
  return await pool.connect();
};

// Função para fechar o pool de conexões
export const closePool = async () => {
  await pool.end();
};

// Função para testar a conexão
export const testConnection = async () => {
  try {
    const result = await query('SELECT NOW()');
    console.log('Conexão com banco de dados estabelecida:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('Erro ao conectar com banco de dados:', error);
    return false;
  }
};

// Função para criar tabelas básicas (se não existirem)
export const initializeDatabase = async () => {
  try {
    // Tabela de usuários
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        avatar TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de métricas do dashboard
    await query(`
      CREATE TABLE IF NOT EXISTS dashboard_metrics (
        id SERIAL PRIMARY KEY,
        metric_key VARCHAR(100) UNIQUE NOT NULL,
        amount VARCHAR(50) NOT NULL,
        change VARCHAR(10) NOT NULL,
        variant VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de configurações
    await query(`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        setting_key VARCHAR(100) NOT NULL,
        setting_value TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, setting_key)
      )
    `);

    // Tabela de cidades
    await query(`
      CREATE TABLE IF NOT EXISTS cities (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        valor_investido VARCHAR(50),
        conversas VARCHAR(50),
        custo_por_resultado VARCHAR(50),
        image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Banco de dados inicializado com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    return false;
  }
};

export default pool;
