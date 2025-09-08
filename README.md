# Dash Start - Dashboard Administrativo

Um dashboard administrativo moderno e responsivo construído com React, Bootstrap e PostgreSQL.

## 🚀 Funcionalidades

### ✨ Principais Recursos
- **Dashboard Interativo** com métricas em tempo real
- **Sistema de Métricas** configurável e editável
- **Gerenciamento de Cidades** com dados personalizados
- **Upload de Imagens** para perfil do usuário
- **Edição de Perfil** com nome e foto
- **Configurações Avançadas** do sistema
- **Banco de Dados PostgreSQL** integrado
- **Sistema Híbrido** (Banco + localStorage)

### 🎨 Interface
- Design moderno e responsivo
- Tema claro/escuro
- Componentes Bootstrap
- Ícones Iconify
- Gráficos ApexCharts

### 🗄️ Banco de Dados
- **PostgreSQL** na Render
- **Pool de conexões** otimizado
- **Migração automática** de dados
- **Sistema de backup** com localStorage

## 🛠️ Tecnologias

- **Frontend:** React 18, Vite, Bootstrap 5
- **Backend:** Node.js, PostgreSQL
- **Gráficos:** ApexCharts
- **Ícones:** Iconify
- **Estilização:** SCSS, Bootstrap
- **Banco:** PostgreSQL (Render)

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta no Render (para banco de dados)

### Passos

1. **Clone o repositório**
```bash
git clone https://github.com/edilsonmatos/dashstart.git
cd dashstart
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o banco de dados**
- Crie um arquivo `src/config/database.js` com suas credenciais
- Ou use as credenciais fornecidas no projeto

4. **Execute o projeto**
```bash
npm run dev
```

5. **Acesse a aplicação**
- Abra http://localhost:5174 no navegador

## 🔧 Configuração

### Banco de Dados
O projeto está configurado para usar PostgreSQL na Render. Para configurar:

1. Acesse `/settings` na aplicação
2. Verifique o status da conexão
3. Execute a migração de dados se necessário

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
DATABASE_URL=postgresql://user:password@host:port/database
API_BASE_URL=http://localhost:3001
```

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Páginas da aplicação
│   ├── (admin)/           # Páginas administrativas
│   └── (other)/           # Páginas públicas
├── components/            # Componentes reutilizáveis
├── config/               # Configurações
├── context/              # Contextos React
├── helpers/              # Funções auxiliares
├── hooks/                # Hooks customizados
├── services/             # Serviços de API
└── assets/               # Recursos estáticos
```

## 🗄️ Estrutura do Banco

### Tabelas Principais
- **users** - Usuários do sistema
- **dashboard_metrics** - Métricas do dashboard
- **settings** - Configurações do sistema

## 🚀 Deploy

### Render (Recomendado)
1. Conecte seu repositório GitHub ao Render
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outras Plataformas
- Vercel
- Netlify
- Heroku

## 📝 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
npm run lint         # Linter
npm run format       # Formatação de código
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Edilson Matos**
- GitHub: [@edilsonmatos](https://github.com/edilsonmatos)

## 🙏 Agradecimentos

- Template base: Larkon React
- Ícones: Iconify
- Gráficos: ApexCharts
- Banco de dados: Render PostgreSQL

---

⭐ Se este projeto te ajudou, considere dar uma estrela!