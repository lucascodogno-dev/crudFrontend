# 💻 Task Manager Frontend

Interface moderna para gerenciamento de projetos e tarefas, construída com **Next.js 15**, **React**, **Zustand** e **Tailwind CSS**. Este projeto consome uma API backend construída com Node.js + Express + Prisma.

---

## 🚀 Tecnologias Utilizadas

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand) (Gerenciamento de estado)
- [Axios](https://axios-http.com/) (Requisições HTTP)
- [next-themes](https://github.com/pacocoursey/next-themes) (Modo escuro/claro)

---

## 📁 Estrutura de Pastas

app/
├─ **dashboard** / # Layout e páginas protegidas
├─ **login/** # Página de login
├─ **register/** # Página de registro
├─ **layout.tsx** # Layout global
├─ **page.tsx** # Redireciona login/dashboard
   **components/** # Componentes reutilizáveis (Sidebar, UserModal etc)
   **lib/axios.ts** # Configuração do Axios com interceptor JWT
   **middleware/** # Middleware de rota protegida
   **store/ # Zustand** (auth e project)
   **globals.css** # Estilos globais


## 🧑‍💻 Como Rodar o Projeto

### 1. Clone o repositório

```bash
git clone https://github.com/lucascodogno-dev/crudFrontend.git

Instalar dependências
npm install ou yarn

Iniciar app
npm run dev

npm run dev     # Inicia Next.js localmente
npm run build   # Compila para produção
npm run start   # Roda o servidor Next.js de produção
npm run test    # Roda testes (quando houver)

** Endpoints Utilizados **
| Método | Rota                  | Descrição                       |
| ------ | --------------------- | ------------------------------- |
| POST   | /api/auth/register    | Registro de novo usuário        |
| POST   | /api/auth/login       | Login e retorno de token        |
| GET    | /api/auth/me          | Retorna usuário autenticado     |
| GET    | /api/projects         | Lista todos os projetos do user |
| POST   | /api/projects         | Cria um novo projeto            |
| PUT    | /api/projects/\:id    | Edita um projeto                |
| DELETE | /api/projects/\:id    | Exclui um projeto               |
| GET    | /api/tasks?projectId= | Lista tarefas de um projeto     |
| POST   | /api/tasks            | Cria uma nova tarefa            |
| PUT    | /api/tasks/\:id       | Atualiza uma tarefa             |
| DELETE | /api/tasks/\:id       | Exclui uma tarefa               |
```

**API Base:** NEXT_PUBLIC_API_URL=http://localhost:4000/api
**Autenticação:** JWT armazenado no localStorage

**Funcionalidades**
 Registro/Login com persistência de sessão

 Listagem e criação de projetos e tarefas

 Interface moderna com Tailwind 

 Dashboard protegida com roteamento dinâmico


Futuras melhorias
Gráficos de progresso dos projetos

Upload de arquivos para tarefas

Compartilhamento de projetos entre usuários