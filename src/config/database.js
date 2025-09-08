// Configuração do banco de dados PostgreSQL
const databaseConfig = {
  // URL completa de conexão
  connectionString: 'postgresql://banco_de_dados_zim5_user:TsMwHNrc0569RbSbiENou4N8yi3qBQqE@dpg-d2d2653uibrs73fof550-a.oregon-postgres.render.com/banco_de_dados_zim5',
  
  // Configurações individuais
  host: 'dpg-d2d2653uibrs73fof550-a.oregon-postgres.render.com',
  port: 5432,
  database: 'banco_de_dados_zim5',
  user: 'banco_de_dados_zim5_user',
  password: 'TsMwHNrc0569RbSbiENou4N8yi3qBQqE',
  
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
