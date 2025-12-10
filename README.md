# URGEN - Sistema de Gestão de Evolução de Carreira

Este é um sistema web front-end desenvolvido em React para a Universidade Regional de Gênios (URGEN), focado na gestão da evolução de carreira de professores e funcionários técnico-administrativos. O sistema simula as interações com um backend através de dados mocados em memória.

## Funcionalidades Implementadas

*   **Autenticação:** Tela de login funcional com controle de acesso baseado em perfis.
*   **Controle de Acesso:** Redirecionamento para dashboards específicos de acordo com o papel do usuário.
*   **Dashboards por Perfil:**
    *   **Professor:** Visualização de dados, titulações, produções científicas, formulários para registro de novos itens e histórico de evolução.
    *   **Funcionário:** Visualização de dados, funções exercidas, avaliações de desempenho e histórico de evolução.
    *   **RH:** Visão geral de servidores, validação de evoluções pendentes, cadastro de novos servidores e simulação de cálculo anual de salários.
    *   **Chefia:** Lista de subordinados e formulário para registro de avaliações de desempenho.
    *   **Reitor:** Relatórios de professores e funcionários com filtros e simulação de exportação.
*   **Dados Mocados:** Todos os dados são gerados e gerenciados em memória, sem a necessidade de um backend real.
*   **Cálculo de Salário:** Lógica simplificada para simular o cálculo de salários baseada em regras de titulação/produção (professores) e função/avaliação (funcionários).
*   **Estrutura de Projeto:** Organização clara de pastas e componentes, facilitando futuras manutenções e integração com um backend real.

## Como Rodar o Projeto

1.  **Navegue até a pasta `frontend`:**
    ```bash
    cd frontend
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    O aplicativo será aberto no seu navegador padrão (geralmente em `http://localhost:5173`).

## Credenciais de Acesso (Dados Mocados)

Utilize as seguintes credenciais para testar os diferentes perfis:

| Usuário        | Senha     | Perfil        |
| :------------- | :-------- | :------------ |
| `professor1`   | `123`     | PROFESSOR     |
| `professor2`   | `123`     | PROFESSOR     |
| `funcionario1` | `123`     | FUNCIONARIO   |
| `funcionario2` | `123`     | FUNCIONARIO   |
| `rh1`          | `123`     | RH            |
| `chefia1`      | `123`     | CHEFIA        |
| `reitor1`      | `123`     | REITOR        |

## Estrutura de Pastas

```
frontend/
├───public/
├───src/
│   ├───assets/
│   ├───components/         # Componentes reutilizáveis (e.g., ProtectedRoute)
│   ├───context/            # Context API (e.g., AuthContext)
│   ├───models/             # Interfaces e tipos de dados (TypeScript)
│   ├───pages/              # Páginas e Dashboards (e.g., LoginPage, ProfessorDashboard)
│   ├───services/           # Simulação de API (e.g., mockApi.ts)
│   ├───utils/              # Funções utilitárias (e.g., salaryCalculator.ts)
│   ├───App.css             # Estilos globais e básicos
│   ├───App.tsx             # Componente principal e roteamento
│   ├───index.css           # Estilos básicos do Vite
│   ├───main.tsx            # Ponto de entrada da aplicação (configuração do React)
│   └───vite-env.d.ts
├───index.html
├───package-lock.json
├───package.json
├───tsconfig.json
├───tsconfig.node.json
└───vite.config.ts
```
