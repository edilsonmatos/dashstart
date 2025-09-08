// Configuração do banco de dados PostgreSQL - EXEMPLO
// Copie este arquivo para database.js e preencha com suas credenciais

const databaseConfig = {
  // URL completa de conexão
  connectionString: 'postgresql://usuario:senha@host:porta/database',
  
  // Configurações individuais
  host: 'seu-host-postgresql',
  port: 5432,
  database: 'seu-database',
  user: 'seu-usuario',
  password: 'sua-senha',
  
  // Configurações de conexão
  ssl: {
    rejectUnauthorized: false // Necessário para Render
  },
  
  // Pool de conexões
  max: 20, // máximo de clientes no pool
  idleTimeoutMillis: 30000, // fecha clientes inativos após 30 segundos
  connectionTimeoutMillis: 2000, // retorna erro após 2 segundos se não conseguir conectar
};

export default databaseConfig;
