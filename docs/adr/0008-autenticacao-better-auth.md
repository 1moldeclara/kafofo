# ADR-0008: Autenticação sem e-mail pessoal e avaliação do Better Auth

- **Status:** Condicionada à POC
- **Data de registro:** 2026-11-03
- **Projeto:** Kafofo

## Contexto

O Kafofo deve permitir autenticação sem exigir e-mail pessoal e recuperação de acesso que não dependa de uma caixa postal.

## Decisão

Preservar login por nome de usuário e senha. Avaliar Better Auth com o plugin Username, usando identificador sintético com domínio .invalid quando necessário ao modelo da biblioteca, sem envio ou verificação de e-mail. A adoção definitiva da biblioteca depende da POC.

## Consequências e riscos

Evita exigir endereço pessoal. O identificador sintético é dado técnico interno e não pode ser tratado como canal de contato. Compatibilidade da biblioteca com o fluxo desejado ainda não está demonstrada.

## Alternativas de referência

Autenticação própria; solução que exige endereço de e-mail real.

## Validação e pontos em aberto

A POC deve demonstrar cadastro, login e redefinição temporária de senha sem e-mail pessoal. Deve verificar unicidade e normalização do username, integração com PostgreSQL/Drizzle e invalidação de sessões na recuperação. Os últimos itens são critérios técnicos derivados para validar a escolha. Registrar resultados antes de alterar o status para Aceita.

## Origem e limites do registro

Consolidação das definições do projeto recuperadas para este conjunto. A data acima é a data de documentação, não necessariamente a de aprovação. Justificativas, alternativas e orientações derivadas explicitam a análise desta consolidação e não afirmam que todas foram discutidas ou aprovadas anteriormente. Consulte o [índice](README.md) para os critérios de status.

