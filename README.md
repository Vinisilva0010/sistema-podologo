#  Podologia - Sistema de Agendamento e Gestão

## Visão Geral
Aplicação web full-stack desenvolvida para automação de agendamentos e gestão clínica de podologia. O sistema elimina a necessidade de marcações manuais, gerencia o fluxo de caixa e fornece um painel administrativo em tempo real para o profissional de saúde.

A interface de usuário (UI) foi construída utilizando a estética Brutalista: bordas espessas, alto contraste, blocos sólidos de cor e tipografia pesada. Essa decisão arquitetônica não é apenas visual, mas funcional: reduz a carga cognitiva do paciente, direciona o foco para as ações de conversão e cria uma navegação à prova de erros, essencial para um público de diversas faixas etárias.

## Stack Tecnológico
* **Frontend:** Next.js (App Router), React, TypeScript.
* **Estilização:** Tailwind CSS (com extensões customizadas para sombras brutalistas), Lucide Icons.
* **Backend as a Service (BaaS):** Firebase (Firestore, Authentication).
* **Infraestrutura e PWA:** Next Metadata API, Manifest JSON.

## Arquitetura e Soluções Técnicas (Hacks Implementados)

Este projeto contém diversas soluções cirúrgicas para problemas comuns em sistemas SaaS e aplicações de agendamento local:

### 1. UX de Conversão e Retenção
* **Geração de Arquivo ICS Nativo:** Em vez de depender de integrações complexas de API do Google Calendar, a tela de sucesso gera dinamicamente um arquivo `.ics` via Blob. O arquivo contém a tag `TRIGGER:-PT30M`, forçando o sistema operacional do celular (iOS ou Android) a criar um alarme exato 30 minutos antes da consulta.
* **Máscara de Input em Tempo Real:** O campo de telefone do paciente utiliza uma regex limpa (`value.replace(/\D/g, "")`) que autoformata o texto para o padrão `(XX) XXXXX-XXXX` enquanto o usuário digita, garantindo a integridade dos dados no banco para a função de busca posterior.
* **Integração Direta WhatsApp (API wa.me):** Links de suporte configurados com parâmetros de texto pré-preenchidos e atributos de segurança (`target="_blank" rel="noopener noreferrer"`) para evitar vulnerabilidades cross-origin e manter o paciente no funil.

### 2. Lógica de Tempo e Agenda
* **Filtro Temporal do Mundo Real:** O sistema não confia apenas na disponibilidade do banco de dados. Antes de renderizar os horários livres na tela do cliente, uma camada de validação em JavaScript cruza os `slots` com o relógio local do usuário. Horários passados são removidos automaticamente e uma margem de segurança de 15 minutos é aplicada para evitar agendamentos em cima da hora.

### 3. Segurança e Autorização (OpSec)
* **Prevenção de Condição de Corrida (Race Condition):** O painel administrativo aguarda explicitamente o callback do `onAuthStateChanged` do Firebase antes de executar consultas ao Firestore. Isso previne erros de permissões ausentes no milissegundo inicial da renderização.
* **Security by Obscurity (Porta dos Fundos):** Para evitar criar subdomínios de admin ou poluir a landing page com botões de login, o acesso da doutora é feito através de um link oculto no ano de copyright do rodapé. Um método discreto que limpa a UI e reduz tentativas de acesso de curiosos.
* **Regras Estritas do Firestore:** O banco de dados utiliza verificação de documentos singulares (`/user/$(request.auth.uid)`) para validar a role de `admin`. Apenas a doutora autenticada tem permissão de leitura global e escrita. Agendamentos via cliente público são feitos com Server Actions executando o Firebase Admin SDK no servidor.

### 4. Engenharia Financeira (Regra de Imutabilidade)
* **Histórico Financeiro Imutável:** O faturamento não cruza IDs com a tabela atual de serviços, pois uma alteração futura de preço corromperia o histórico. O preço exato do serviço é carimbado no documento de agendamento (`price`) no milissegundo da transação, operando sob os padrões básicos de sistemas financeiros (Fintechs).

### 5. Frontend e PWA
* **Controle de Enquadramento Dinâmico de Imagem:** Para lidar com imagens de diferentes proporções sem quebrar o layout grid brutalista do Tailwind, implementamos suporte a propriedades injetáveis (ex: `object-[50%_20%]`) no array de dados. Isso permite ajustes de eixo X e Y via código por serviço, dispensando recortes manuais em editores de imagem.
* **PWA (Progressive Web App):** Configuração de manifesto e `apple-touch-icon`. O sistema pode ser adicionado à tela inicial de dispositivos móveis como um aplicativo nativo, com carregamento em tela cheia (standalone) e cache de interface.

## Estrutura de Diretórios Principal

* `/src/app/(public)`: Rotas acessíveis aos pacientes (Landing page, agendamento, busca de reservas).
* `/src/app/(admin)`: Painel de controle da doutora (Dashboard, Agenda em tempo real, Fluxo de Caixa). Protegido por validação de sessão.
* `/src/actions`: Funções server-side seguras (Server Actions) para criação de dados no Firebase sem expor regras de gravação ao lado do cliente.
* `/src/lib`: Configurações de inicialização do Firebase e utilitários.

## Como Rodar o Projeto

1. Instale as dependências:
```bash
npm install
