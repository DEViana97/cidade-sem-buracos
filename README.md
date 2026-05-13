# BuracoMap — Mapeamento Público de Buracos Urbanos

Plataforma de fiscalização cidadã para registro e acompanhamento de buracos em vias públicas.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** + shadcn/ui (Base UI)
- **TanStack Query v5**
- **React Leaflet** + react-leaflet-cluster + leaflet.heat
- **PostgreSQL** + Prisma ORM v7
- **NextAuth v5** — autenticação JWT
- **Recharts** — gráficos
- **UploadThing** — upload de imagens

## Funcionalidades

- Mapa público interativo com pins coloridos por urgência
- Heatmap de concentração (toggle)
- Clusterização de pins em áreas densas
- Página pública de cada buraco com compartilhamento (WhatsApp, Twitter/X, link direto)
- Dashboard público com estatísticas em tempo real
- Registro com geolocalização automática e upload de foto
- Resolução com confirmação e histórico de datas
- Dashboard pessoal do usuário
- Painel admin com gestão de usuários
- Anti-spam: máx. 5 registros por usuário/dia
- Auth completo: cadastro, login, recuperação de senha

## Cores dos marcadores

| Cor | Significado |
|-----|-------------|
| 🟡 Amarelo | Aberto < 7 dias |
| 🟠 Laranja | Aberto 7–30 dias |
| 🔴 Vermelho | Aberto > 30 dias |
| 🟢 Verde | Resolvido |

## Setup local

### 1. Instalar dependências
```bash
npm install
```

### 2. Variáveis de ambiente
```bash
cp .env.example .env
```

Edite `.env`:
- `DATABASE_URL` — PostgreSQL connection string
- `AUTH_SECRET` — `openssl rand -base64 32`
- `UPLOADTHING_SECRET` / `UPLOADTHING_APP_ID` — [uploadthing.com](https://uploadthing.com)
- `SMTP_*` — credenciais SMTP

### 3. Banco de dados (dev local)
```bash
# Terminal 1: inicia servidor PostgreSQL local
npx prisma dev

# Terminal 2: aplica schema e gera client
npx prisma db push
npx prisma generate
```

### 4. Dev
```bash
npm run dev
```

Acesse: http://localhost:3000

### 5. Build
```bash
npm run build && npm start
```

## Deploy (Vercel)

1. Conecte o repositório ao Vercel
2. Configure envs no painel Vercel
3. Use PostgreSQL externo (Neon, Supabase, Railway) — atualize `DATABASE_URL`

## Criar primeiro admin

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'seu@email.com';
```

Ou via Prisma Studio:
```bash
npx prisma studio
```

## Estrutura

```
app/              # Pages e API routes
components/       # UI components (map, potholes, dashboard, auth)
hooks/            # TanStack Query hooks
lib/              # prisma, auth, utils, validations
types/            # TypeScript types
prisma/           # schema.prisma
```
