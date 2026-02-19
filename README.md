# Plano Semanal — ProAtividades

Uma aplicação web para gerar planos de aula semanais alinhados à BNCC usando Inteligência Artificial.

## Tecnologias

- **Frontend**: Next.js, React, Tailwind CSS.
- **Backend**: Netlify Functions (Serverless), OpenAI API.
- **Ferramentas**: PDF Generation (jsPDF + html2canvas).

## Configuração para Deploy (Netlify)

Este projeto já está configurado para o Netlify.

### 1. Pré-requisitos
Você precisará de uma chave de API da OpenAI (`OPENAI_API_KEY`).

### 2. Deploy no Netlify
1. Conecte este repositório ao seu Netlify.
2. O arquivo `netlify.toml` detectará automaticamente as configurações de build (`npm run build`).
3. **IMPORTANTE**: Vá em "Site settings" > "Environment variables" e adicione:
   - Key: `OPENAI_API_KEY`
   - Value: `sk-...` (sua chave da OpenAI)

## Rodando Localmente

Para testar a Netlify Function localmente, você precisa do `netlify-cli`.

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Instale o Netlify CLI (se não tiver):
   ```bash
   npm install -g netlify-cli
   ```

3. Configure a variável de ambiente localmente (crie um arquivo `.env` ou use o CLI):
   ```bash
   export OPENAI_API_KEY="sua-chave-aqui"
   ```

4. Rode o servidor de desenvolvimento do Netlify:
   ```bash
   netlify dev
   ```
   Isso rodará o Next.js e as Functions juntos. Acesse `http://localhost:8888`.

> **Nota**: Se rodar apenas `npm run dev`, o endpoint `/.netlify/functions/generate` dará erro 404, pois as functions não são servidas pelo Next.js nativamente.

## Estrutura de Arquivos

- `app/`: Aplicação Next.js (Frontend).
- `netlify/functions/generate.ts`: Função Serverless que chama a OpenAI.
- `netlify.toml`: Configuração de deploy.
