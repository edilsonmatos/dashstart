# Configuração do Banco de Dados PostgreSQL

Este projeto está configurado para usar o banco de dados PostgreSQL da Render.

## 📋 Informações da Conexão

- **Host:** dpg-d2d2653uibrs73fof550-a.oregon-postgres.render.com
- **Porta:** 5432
- **Database:** banco_de_dados_zim5
- **Usuário:** banco_de_dados_zim5_user
- **URL Completa:** postgresql://banco_de_dados_zim5_user:TsMwHNrc0569RbSbiENou4N8yi3qBQqE@dpg-d2d2653uibrs73fof550-a.oregon-postgres.render.com/banco_de_dados_zim5

## 🗂️ Estrutura do Banco

### Tabelas Criadas Automaticamente:

1. **users** - Usuários do sistema
   - id (SERIAL PRIMARY KEY)
   - name (VARCHAR)
   - email (VARCHAR UNIQUE)
   - password (VARCHAR)
   - avatar (TEXT)
   - created_at, updated_at (TIMESTAMP)

2. **dashboard_metrics** - Métricas do dashboard
   - id (SERIAL PRIMARY KEY)
   - metric_key (VARCHAR UNIQUE)
   - amount (VARCHAR)
   - change (VARCHAR)
   - variant (VARCHAR)
   - created_at, updated_at (TIMESTAMP)

3. **settings** - Configurações do sistema
   - id (SERIAL PRIMARY KEY)
   - setting_key (VARCHAR UNIQUE)
   - setting_value (TEXT)
   - created_at, updated_at (TIMESTAMP)

## 🔧 Arquivos de Configuração

- `src/config/database.js` - Configuração da conexão
- `src/helpers/database.js` - Funções de conexão e queries
- `src/services/databaseService.js` - Serviços para operações CRUD
- `src/hooks/useDatabase.js` - Hook para gerenciar conexão
- `src/components/DatabaseStatus.jsx` - Componente de status da conexão

## 🚀 Como Usar

### 1. Verificar Conexão
```javascript
import { testConnection } from '@/helpers/database';

const isConnected = await testConnection();
console.log('Conectado:', isConnected);
```

### 2. Executar Queries
```javascript
import { query } from '@/helpers/database';

const result = await query('SELECT * FROM users WHERE email = $1', ['user@example.com']);
console.log(result.rows);
```

### 3. Usar Serviços
```javascript
import { userService } from '@/services/databaseService';

// Buscar usuário
const user = await userService.findByEmail('user@example.com');

// Criar usuário
const newUser = await userService.create({
  name: 'João Silva',
  email: 'joao@example.com',
  password: 'senha123'
});
```

### 4. Usar Hook de Conexão
```javascript
import { useDatabase } from '@/hooks/useDatabase';

const MyComponent = () => {
  const { isConnected, isLoading, error, reconnect } = useDatabase();
  
  if (isLoading) return <div>Conectando...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!isConnected) return <div>Desconectado</div>;
  
  return <div>Conectado ao banco!</div>;
};
```

## 🔒 Segurança

- A conexão usa SSL com `rejectUnauthorized: false` (necessário para Render)
- Pool de conexões configurado com limite de 20 conexões
- Timeout de conexão de 2 segundos
- Timeout de inatividade de 30 segundos

## 📝 Próximos Passos

1. **Criar API Backend** - Implementar endpoints REST para o frontend
2. **Autenticação** - Implementar JWT e middleware de autenticação
3. **Validação** - Adicionar validação de dados
4. **Logs** - Implementar sistema de logs
5. **Backup** - Configurar backup automático

## 🐛 Troubleshooting

### Erro de Conexão
- Verificar se a URL de conexão está correta
- Verificar se o banco está ativo na Render
- Verificar firewall e permissões

### Erro de SSL
- Certificar que `rejectUnauthorized: false` está configurado
- Verificar se o certificado SSL está válido

### Timeout
- Aumentar o `connectionTimeoutMillis` se necessário
- Verificar latência da rede
