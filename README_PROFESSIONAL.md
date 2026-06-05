# PromptForge Pro - Guia de Engenharia de Prompts

## 🚀 Visão Geral
O **PromptForge Pro** é uma plataforma de nível enterprise para engenharia de prompts modulares. Ele utiliza uma arquitetura de monorepo moderna e um backend em Rust de alta performance para processar documentos complexos e gerar prompts otimizados.

## 🛠️ Arquitetura Técnica
- **Frontend**: React 18 + Vite + Tailwind CSS (com Design System customizado).
- **Backend**: Tauri (Rust) para acesso seguro ao sistema de arquivos e chamadas de API.
- **Engine**: Motor de composição de prompts com suporte a versionamento e injeção de variáveis.
- **Data Extraction**: Suporte nativo para PDF, TXT, DOCX e XLSX com limpeza automática de dados via Regex.

## 📋 Funcionalidades Principais
1. **Importação Inteligente**: Extraia dados de múltiplos formatos de arquivo para servir de contexto para a IA.
2. **Biblioteca Modular**: Use módulos pré-definidos para nichos de TI, Marketing e Jurídico.
3. **Versionamento Automático**: Cada execução de prompt gera uma nova versão para comparação de resultados.
4. **Aliases de Importação**: Código limpo usando `@core` e `@prompt-engine`.

## ⚙️ Como Executar
1. Certifique-se de ter o **Rust** e o **Node.js (pnpm)** instalados.
2. Na raiz do projeto, execute:
   ```bash
   pnpm install
   ```
3. Para iniciar o ambiente de desenvolvimento:
   ```bash
   pnpm dev
   ```
4. Para gerar o executável final:
   ```bash
   pnpm build
   ```

## 🔒 Segurança
As chaves de API são processadas no lado do Rust e nunca são expostas diretamente no console do navegador, garantindo segurança para usuários corporativos.
