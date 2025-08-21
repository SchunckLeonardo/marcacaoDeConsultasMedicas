# Marcação de Consultas Médicas (FIAP)

Projeto mobile (Expo + React Native) para marcação de consultas médicas.

## Metodologia de comentários

- Cada bloco de execução possui um comentário explicativo imediato acima do bloco.
- Comentários aparecem em serviços, contexto, componentes, telas, navegação e arquivos raiz.

## Fluxo principal

- Autenticação com perfis: admin, médico e paciente (mock/AsyncStorage)
- CRUD básico de consultas em memória/AsyncStorage
- Navegação com rotas públicas e protegidas por perfil

## Commits incrementais

- Commits pequenos e frequentes, com prefixo e escopo claros
- Exemplo de mensagens usadas:
  - `docs(services): adicionar comentários explicativos e esqueleto do serviço de consultas`
  - `docs(components,context): comentar AppointmentCard, AppointmentForm e AuthContext`
  - `docs(screens): comentários em telas principais`
  - `docs(navigation, routes): comentar AppNavigator e rotas`
  - `docs(root): comentar App.tsx e index.ts`

## Trabalho em grupo

- Discutir tarefas no board (Issues/Projects) e documentar decisões no PR
- Utilizar branches por feature: `feat/`, `docs/`, `fix/`, `chore/`
- Abrir PRs para revisão entre colegas antes de mergear em `main`

## Como rodar

```bash
pnpm install
pnpm expo start
```

## Estrutura

- `src/services`: autenticação e consultas
- `src/contexts`: contexto de autenticação
- `src/components`: componentes reutilizáveis
- `src/screens`: telas por perfil
- `src/navigation` e `src/routes`: navegação
- `App.tsx` e `index.ts`: bootstrap e providers

## Publicação no GitHub

- Realize push frequente para o repositório remoto até o prazo da disciplina
- Validação oficial será feita pelo link do repositório (branch principal)
