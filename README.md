# 🎧 Sistema de Gestão de Suporte e Chamados

Sistema completo de abertura, acompanhamento e gerenciamento de chamados técnicos, desenvolvido com **React 19 + Vite** no frontend e **Node.js + Express + Supabase (PostgreSQL)** no backend.

---

## 🚀 Tecnologias Utilizadas

### Frontend
* **React 19** com Hooks (`useState`, `useEffect`, `useCallback`)
* **Vite** para build e desenvolvimento rápido
* **Oxlint** para análise estática e padronização de código
* CSS moderno e responsivo

### Backend
* **Node.js & Express** (API RESTful)
* **Supabase** (PostgreSQL em nuvem)
* **JWT (JSON Web Token)** para autenticação e proteção de rotas
* **Bcrypt.js** para hash seguro de senhas
* **CORS** e **Dotenv**

---

## 📁 Estrutura do Projeto

```text
SuporteChamados/
├── server-chamados/           # Backend (API Express)
│   ├── .env                   # Variáveis de ambiente locais
│   ├── .env.example           # Exemplo de configuração do backend
│   ├── server.js              # Servidor Express e rotas REST
│   ├── supabase.js            # Inicialização do cliente Supabase
│   ├── testes.http            # Requisições de teste prontas (REST Client)
│   └── package.json           # Dependências do backend
├── src/                       # Frontend (React)
│   ├── components/            # Componentes visuais
│   │   ├── ChamadoCard.jsx    # Card individual com alternância de status
│   │   ├── Contador.jsx       # Contador de chamados resolvidos
│   │   ├── FiltroChamados.jsx # Campo de busca por título e descrição
│   │   ├── FormularioChamado.jsx # Formulário de novo chamado
│   │   ├── Header.jsx         # Cabeçalho com identificação do usuário
│   │   ├── Login.jsx          # Tela de login e cadastro com JWT
│   │   └── ResumoMetricas.jsx # Painel com métricas dinâmicas em tempo real
│   ├── config/
│   │   └── api.js             # Configuração da URL da API (Local / Nuvem)
│   ├── App.jsx                # Componente principal e orquestrador
│   └── App.css                # Estilos visuais
├── supabase_setup.sql         # Script SQL DDL para criar tabelas no Supabase
├── .env                       # Variáveis de ambiente do Frontend
├── .env.example               # Exemplo de configuração do frontend
└── package.json               # Dependências do frontend
```

---

## 🗄️ Configuração do Banco de Dados (Supabase)

1. Acesse o painel do seu projeto no [Supabase](https://supabase.com).
2. Abra o menu **SQL Editor**.
3. Copie e cole todo o conteúdo do arquivo [`supabase_setup.sql`](file:///c:/Users/jjpvh/OneDrive/Desktop/aula/SuporteChamados/SuporteChamados-main/supabase_setup.sql) e clique em **Run**.
4. Esse script criará as tabelas `usuarios` e `chamados`, chaves primárias, relacionamentos e permissões RLS.

---

## ⚙️ Como Executar Localmente

### 1. Configurar e Iniciar o Backend
```bash
# Entre na pasta do backend
cd server-chamados

# Instale as dependências
npm install

# Copie o .env.example e configure suas credenciais do Supabase
cp .env.example .env
```

Edite o arquivo `server-chamados/.env`:
```env
PORT=3001
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua_chave_anonima_ou_service_role
JWT_SECRET=sua_chave_secreta_jwt
```

Inicie o servidor:
```bash
npm run dev
# ou: node server.js
```
O servidor estará rodando em `http://localhost:3001`.

---

### 2. Configurar e Iniciar o Frontend
Em outro terminal (na raiz do projeto):
```bash
# Instale as dependências
npm install

# Inicie o servidor Vite
npm run dev
```

Abra no navegador em `http://localhost:5173`.

> 💡 **Dica de Ambiente**: Por padrão, o frontend detecta o modo de desenvolvimento e se conecta a `http://localhost:3001`. Para apontar para a API do Render na nuvem, basta definir `VITE_API_URL=https://suportechamados-6eyi.onrender.com` no seu arquivo `.env`.

---

## 📡 Rotas da API REST

| Método | Rota | Protegida? | Descrição |
|---|---|---|---|
| `POST` | `/api/auth/cadastrar` | Não | Cadastra um novo usuário com senha criptografada |
| `POST` | `/api/auth/login` | Não | Realiza login e retorna token JWT |
| `GET` | `/api/chamados` | Não | Lista todos os chamados ordenados por ID decrescente |
| `POST` | `/api/chamados` | Sim (Token) | Cria um novo chamado associado ao usuário logado |
| `PUT` | `/api/chamados/:id` | Sim (Token) | Atualiza status (`Aberto` ➔ `Em Andamento` ➔ `Concluído`) |
| `DELETE` | `/api/chamados/:id` | Sim (Token) | Remove o chamado do banco |

---

## 🧪 Testes de API
Você pode testar todos os endpoints diretamente no VS Code ou Antigravity usando a extensão **REST Client** através do arquivo [`server-chamados/testes.http`](file:///c:/Users/jjpvh/OneDrive/Desktop/aula/SuporteChamados/SuporteChamados-main/server-chamados/testes.http).

---

## 📦 Verificação de Qualidade

Execute a verificação de linter e o build:
```bash
# Linter (oxlint)
npm run lint

# Build de produção
npm run build
```
Ambos executam com **0 erros e 0 warnings**.
