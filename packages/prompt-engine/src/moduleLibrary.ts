import { PromptModule } from "@core/types";

export const MODULE_LIBRARY: PromptModule[] = [
  // NICHO: TI
  {
    id: 'ti-01',
    label: 'Refatoração de Código (Clean Code)',
    category: 'Desenvolvimento',
    niche: 'TI',
    instruction: 'Analise o código fornecido buscando violações de princípios SOLID e Clean Code. Sugira uma versão refatorada que minimize a complexidade ciclomática e melhore a testabilidade. Justifique cada mudança realizada.',
    variables: ['linguagem', 'contexto'],
    version: '1.1.0',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ti-02',
    label: 'Geração de Testes Unitários',
    category: 'Qualidade',
    niche: 'TI',
    instruction: 'Escreva testes unitários abrangentes para o código acima usando o framework Jest/Vitest.',
    variables: ['framework'],
    version: '1.0.0',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ti-03',
    label: 'Documentação JSDoc',
    category: 'Documentação',
    niche: 'TI',
    instruction: 'Adicione comentários JSDoc detalhados para todas as funções e interfaces exportadas.',
    variables: [],
    version: '1.0.0',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ti-04',
    label: 'Otimização de Query SQL',
    category: 'Banco de Dados',
    niche: 'TI',
    instruction: 'Explique o plano de execução desta query e sugira índices ou reescrita para melhor performance.',
    variables: ['dialeto'],
    version: '1.0.0',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ti-05',
    label: 'Review de Segurança',
    category: 'Segurança',
    niche: 'TI',
    instruction: 'Identifique possíveis vulnerabilidades como SQL Injection, XSS ou Broken Auth no trecho de código.',
    variables: [],
    version: '1.0.0',
    createdAt: new Date().toISOString()
  },

  // NICHO: MARKETING
  {
    id: 'mk-01',
    label: 'Copy para Instagram',
    category: 'Social Media',
    niche: 'Marketing',
    instruction: 'Crie uma legenda engajadora para o Instagram usando a técnica AIDA (Atenção, Interesse, Desejo, Ação).',
    variables: ['tom_de_voz', 'objetivo'],
    version: '1.0.0',
    createdAt: new Date().toISOString()
  },
  {
    id: 'mk-02',
    label: 'Análise de Persona',
    category: 'Estratégia',
    niche: 'Marketing',
    instruction: 'Com base nos dados fornecidos, descreva a persona ideal: dores, desejos e hábitos de consumo.',
    variables: [],
    version: '1.0.0',
    createdAt: new Date().toISOString()
  },
  {
    id: 'mk-03',
    label: 'Email Marketing (Cold Mail)',
    category: 'Vendas',
    niche: 'Marketing',
    instruction: 'Escreva uma sequência de 3 emails para prospecção fria focada em gerar agendamento de reunião.',
    variables: ['produto', 'publico'],
    version: '1.0.0',
    createdAt: new Date().toISOString()
  },
  {
    id: 'mk-04',
    label: 'Sugestão de Headliners SEO',
    category: 'Conteúdo',
    niche: 'Marketing',
    instruction: 'Gere 10 títulos otimizados para SEO focados na palavra-chave principal fornecida.',
    variables: ['keyword'],
    version: '1.0.0',
    createdAt: new Date().toISOString()
  },
  {
    id: 'mk-05',
    label: 'Roteiro para Vídeo Curto',
    category: 'Vídeo',
    niche: 'Marketing',
    instruction: 'Crie um roteiro de 60 segundos para TikTok/Reels com um hook forte nos primeiros 3 segundos.',
    variables: [],
    version: '1.0.0',
    createdAt: new Date().toISOString()
  },

  // NICHO: JURÍDICO
  {
    id: 'jr-01',
    label: 'Resumo de Petição',
    category: 'Análise',
    niche: 'Jurídico',
    instruction: 'Sintetize os pontos principais desta petição, destacando pedidos e fundamentos legais.',
    variables: [],
    version: '1.0.0',
    createdAt: new Date().toISOString()
  },
  {
    id: 'jr-02',
    label: 'Cláusula de Confidencialidade',
    category: 'Contratos',
    niche: 'Jurídico',
    instruction: 'Redija uma cláusula de confidencialidade (NDA) robusta, incluindo penalidades por descumprimento.',
    variables: ['jurisdicao'],
    version: '1.0.0',
    createdAt: new Date().toISOString()
  },
  {
    id: 'jr-03',
    label: 'Análise de Riscos Contratuais',
    category: 'Contratos',
    niche: 'Jurídico',
    instruction: 'Analise o contrato em anexo e liste as 5 cláusulas mais arriscadas para o contratante.',
    variables: [],
    version: '1.0.0',
    createdAt: new Date().toISOString()
  },
  {
    id: 'jr-04',
    label: 'Parecer Jurídico Preliminar',
    category: 'Consultivo',
    niche: 'Jurídico',
    instruction: 'Elabore um parecer inicial sobre a viabilidade da tese jurídica apresentada nos fatos.',
    variables: ['tema'],
    version: '1.0.0',
    createdAt: new Date().toISOString()
  },
  {
    id: 'jr-05',
    label: 'Termos de Uso (SaaS)',
    category: 'Digital',
    niche: 'Jurídico',
    instruction: 'Gere uma estrutura básica de Termos de Uso para uma plataforma de software como serviço.',
    variables: ['nome_app'],
    version: '1.0.0',
    createdAt: new Date().toISOString()
  }
];
