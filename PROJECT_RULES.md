# PROJECT_RULES.md — UniSlim Frontend

## Identidade do Produto

O UniSlim NÃO é:
- app fitness genérico
- dashboard
- app de academia
- sistema enterprise
- painel administrativo

O UniSlim DEVE parecer:
- app premium do Vale do Silício
- mistura entre Cal AI, Rise Science e Apple Health
- clean
- emocional
- inteligente
- minimalista

---

## Regras de UX — OBRIGATÓRIAS

- Mobile-first SEMPRE
- Nunca criar telas poluídas
- Nunca usar cards demais
- Nunca usar dashboards gigantes
- Nunca usar excesso de texto
- Nunca usar gradients exagerados
- Nunca usar cores fortes saturadas
- Nunca criar visual "gamificado infantil"

### Foco por Tela
- máximo 1 ação principal por tela
- spacing premium e generoso
- animações suaves e funcionais
- sensação calma e sofisticada

---

## Regras de Estilo — OBRIGATÓRIAS

- Apple-like: whitespace pesado
- bordas suaves e consistentes
- sombras extremamente leves (quase imperceptíveis)
- aparência de aplicativo nativo iOS
- Se existir dúvida entre bonito VS simples → escolha simples
- Se existir dúvida entre mais funções VS mais clareza → escolha clareza

---

## Regras de Funcionalidade

- tudo deve parecer útil e ter propósito claro
- remover qualquer elemento sem função real
- cada tela deve ter um objetivo único e claro
- nunca duplicar informação entre telas

---

## Estrutura de Telas Permitida

| Aba | Objetivo único |
|---|---|
| Hoje (Home) | Ver progresso do dia + 1 ação sugerida |
| Rotina | Executar os hábitos do dia |
| Scanner (FAB) | Escanear refeição com IA |
| Ajustar | Calibrar rotina com 3 perguntas |
| Progresso | Ver histórico e consistência |

O Plano Alimentar é acessado **da Home** como sub-tela, sem aba própria.

---

## Checklist antes de criar ou modificar qualquer componente

- [ ] A tela tem 1 objetivo claro?
- [ ] Há menos de 4 blocos de conteúdo visíveis sem scroll?
- [ ] Cada elemento tem propósito?
- [ ] O visual parece iOS nativo?
- [ ] Não há texto em excesso?
- [ ] Os espaçamentos estão generosos?
- [ ] As sombras são quase imperceptíveis?
- [ ] Não há duplicação com outra tela?
