import { Pool } from 'pg';
import databaseConfig from '@/config/database';

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
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value TEXT NOT NULL,
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
