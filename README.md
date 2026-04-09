# 🗓️ Escala Certa - Gestor de Plantão

Um sistema moderno, responsivo e offline-first desenvolvido para trabalhadores que atuam no regime de escala **12x36**. O aplicativo permite gerenciar plantões, prever ganhos mensais, controlar banco de horas e registrar exceções manuais com facilidade.

---

## 🚀 Visão Geral

Trabalhar em escala 12x36 (12 horas de trabalho por 36 horas de descanso) traz desafios únicos de organização. Este projeto foi criado para simplificar o acompanhamento dessa jornada, oferecendo uma interface intuitiva onde o usuário pode visualizar seu cronograma teórico e ajustá-lo de acordo com a realidade do dia a dia.

## ✨ Principais Funcionalidades

- **Dashboard Inteligente**: Resumo do dia atual, contadores regressivos para o início/fim do plantão e visão semanal rápida.
- **Calendário Dinâmico**: Visualização mensal completa com marcação clara de dias de trabalho (diurno/noturno) e folgas.
- **Controle de Exceções (Overrides)**: Registro de plantões extras, folgas, férias, atestados ou trocas que sobrescrevem a escala automática.
- **Relatório de Fechamento**: Métricas detalhadas do mês, incluindo total de horas trabalhadas e dias de descanso.
- **Controle Financeiro**: Estimativa de ganhos baseada no valor do plantão ou valor da hora trabalhada.
- **Banco de Horas**: Cálculo automático da diferença entre a carga horária prevista e a realizada.
- **PWA (Progressive Web App)**: Instalável no celular para acesso rápido e funcionamento offline (via LocalStorage).

## 🛠️ Stack Utilizada

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/) (Tipagem forte em toda a lógica de escala)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/) (Design system responsivo e Dark Mode)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Manipulação de Datas**: [date-fns](https://date-fns.org/)
- **Testes**: [Vitest](https://vitest.dev/)
- **Persistência**: LocalStorage (Privacidade total dos dados)

---

## 🧠 Lógica do Sistema

### 1. Escala 12x36
A lógica base consiste na alternância rigorosa: **1 dia de trabalho seguido por 1 dia de descanso**. O sistema calcula isso matematicamente a partir de uma `data de início` e um `status inicial` (Trabalho ou Folga) configurados pelo usuário.

### 2. Turno Fixo vs. Alternado
- **Turno Fixo**: O usuário trabalha sempre no mesmo período (ex: sempre Diurno ou sempre Noturno).
- **Turno Alternado**: A cada semana completa (iniciando no domingo), o sistema inverte o turno de trabalho (ex: Semana 1 Diurna, Semana 2 Noturna), refletindo a prática comum em hospitais e segurança privada.

### 3. Planned vs. Actual (Previsto vs. Real)
Esta é a camada de inteligência do projeto:
- **Planned (Previsto)**: É a escala teórica gerada automaticamente pelo algoritmo 12x36.
- **Actual (Real)**: É o que realmente acontece. Se o usuário registra um evento de "Férias" em um dia que era previsto "Trabalho", o status real muda para "Folga", mas a escala matemática de fundo continua correndo corretamente para os dias futuros.

### 4. Banco de Horas
Calculado mensalmente:
`Saldo = Horas Reais Trabalhadas - Horas Previstas pela Escala`
Isso permite identificar rapidamente se o usuário está com horas positivas (plantões extras) ou negativas (faltas/atestados).

### 5. Cálculo Financeiro
Suporta dois modos configuráveis:
- **Por Plantão**: `Total = Dias de Trabalho Real * Valor do Plantão`
- **Por Hora**: `Total = Horas de Trabalho Real * Valor da Hora`

---

## 📦 Instalação e Uso

### Pré-requisitos
- Node.js (v18.0.0 ou superior)
- npm ou yarn

### Passo a Passo
1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/escala-certa.git
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse `http://localhost:3000` no seu navegador.

---

## 📜 Scripts Disponíveis

- `npm run dev`: Inicia o ambiente de desenvolvimento.
- `npm run build`: Gera a versão de produção otimizada.
- `npm run start`: Inicia o servidor de produção.
- `npm run lint`: Executa a verificação de erros de código.
- `npm run test`: Executa os testes unitários da lógica de escala.
- `npm run test:watch`: Executa os testes em modo de observação.

---

## 📂 Estrutura de Pastas

```text
src/
├── app/                 # Rotas e Páginas (Next.js App Router)
├── components/          # Componentes de UI modulares
│   ├── dashboard/       # Cards e métricas da tela inicial
│   ├── report/          # Tabelas e resumos do relatório mensal
│   └── shared/          # Elementos genéricos (botões, cards de métricas)
├── hooks/               # Hooks customizados (useScale, useLocalStorage)
├── lib/                 # Utilitários de terceiros e configurações (shadcn/ui)
├── types/               # Interfaces TypeScript (ScaleConfig, DayInfo, etc)
└── utils/               # Motor de cálculo (scale-logic.ts) e helpers
```

---

## 🗺️ Roadmap Futuro

- [ ] Sincronização em nuvem (Backend opcional).
- [ ] Exportação de relatórios em PDF.
- [ ] Módulo de múltiplos usuários/perfis.
- [ ] Notificações push para lembrete de início de plantão.
- [ ] Gráficos de produtividade e ganhos anuais.

---

Desenvolvido com ❤️ para facilitar a vida de quem cuida de nós.
