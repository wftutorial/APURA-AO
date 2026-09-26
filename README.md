# Sistema de Apuração e Acompanhamento de Votos

Sistema completo para gestionar apuração eleitoral, com login por perfil, cadastros, conferência, painel de apuração, relatórios, importação/exportação e auditoria.

## Visão geral

- Backend em Node.js + Express
- Frontend em HTML/CSS/JavaScript (estrutura pronta para evolução para React)
- Banco PostgreSQL / Supabase
- Autenticação com JWT
- Interface responsiva em português do Brasil
- Cálculo automático de totalização e percentuais
- Controle de permissões por perfil
- Registro de auditoria e histórico de alterações

## Estrutura do projeto

- backend/
- database/
- frontend/
- README.md

## Requisitos

- Node.js 18+
- PostgreSQL 14+
- npm

## Instalação local

### Executar com duplo clique no macOS

Dê duplo clique em `Executar Apuracao.command`. O lançador verifica o Node.js, instala as dependências se necessário, inicia o servidor e abre o sistema no navegador.

Para encerrar, feche a janela do Terminal aberta pelo lançador.

1. Instale Node.js 18+, npm e PostgreSQL 14+
2. Instale as dependências:

```bash
npm install
```

3. Crie o banco PostgreSQL chamado `apuracao_votos` usando o seu usuário local:

```bash
createdb -h localhost -U "$USER" apuracao_votos
```

4. Configure `backend/.env` com os dados da sua instalação. No macOS local, o exemplo funcional é:

```env
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_USER=macbookair
DB_PASSWORD=
DB_NAME=apuracao_votos
JWT_SECRET=troque-esta-chave-em-producao
```

5. Rode o schema e os dados iniciais:

```bash
psql -h localhost -U "$USER" -d apuracao_votos -f database/schema.sql
psql -h localhost -U "$USER" -d apuracao_votos -f database/seed.sql
```

Se o banco já estava criado antes de permitir nomes no identificador da seção, aplique a migração preservando os dados existentes:

```bash
psql -h localhost -U "$USER" -d apuracao_votos -f database/migrations/002_section_identifier_text.sql
```

6. Inicie o sistema:

```bash
npm start
```

7. Abra no navegador:

```bash
http://localhost:4000
```

O backend serve automaticamente a interface frontend. Não é necessário abrir o `index.html` diretamente.

Para desenvolvimento com reinício automático, use:

```bash
npm run dev
```

Para verificar a API:

```bash
curl http://localhost:4000/api/health
```

## Usuário administrador inicial

- E-mail: `admin@apuracao.local`
- Senha: `admin123`

> Importante: troque esse usuário e a senha em produção.

## Configuração do Supabase

1. Crie um projeto no Supabase
2. Ative a extensão PostgreSQL
3. Crie a mesma estrutura do `database/schema.sql`
4. Ajuste `.env` com `SUPABASE_URL`, `SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY`
5. No Supabase, habilite Row Level Security (RLS) e crie políticas conforme as permissões do perfil

## Funcionalidades implementadas

- Login com perfis
- Cadastro de eleição
- Cadastro de candidatos
- Cadastro de seções e urnas
- Lançamento e validação de apuração
- Conferência e histórico
- Dashboard informativo
- Importação de CSV/Excel
- Exportação de relatórios
- Auditoria
- Banco relacional com estrutura central

## Observações de segurança

- Senhas em hash com bcrypt
- JWT para autenticação
- Validação de dados no backend
- Logging de ações e alterações
- Regras básicas de consistência para apuração
- Não deve permitir alteração silenciosa de resultados conferidos

## Rodando em produção

- Ajuste `JWT_SECRET`
- Configure `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- Use HTTPS e variáveis de ambiente
- Faça backup do banco periodicamente
- Ative autenticação forte e controle de acesso
