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

## Resultado técnico da POC #5

O [laboratório isolado](../../pocs/auth/README.md), refinado na [issue #5](https://github.com/vguerrax/kafofo/issues/5), fixa Better Auth e adaptador Drizzle em **1.7.18**, sem alterar as rotas normais do produto. A especificação dos experimentos, comandos e relação entre contratos e testes está no README do laboratório; evidências de execução e revisão ficam na issue/PR.

**Recomendação para revisão:** aceitar a viabilidade dessa versão com o plugin Username e as adaptações demonstradas, preservando a aprovação final da ADR na revisão da POC. O status continua condicionado até essa revisão. Não adotar os defaults como implementação da Alpha 1.

A biblioteca cuida de hash/verificação, autenticação por username, cookies e operações de sessão/reset. O identificador de e-mail exigido internamente é UUID sob `.invalid`, gerado pelo servidor, sem SMTP ou função de contato. Username global tem 3–30 caracteres ASCII, letras/números/ponto/hífen/sublinhado, com unicidade SQL sobre minúsculas; nome de exibição é separado. São as regras aprovadas no refinamento da #5.

As políticas de senha, sessão absoluta sem renovação, limites de tentativas, autorização do emissor, reemissão e falhas de recuperação exigem configuração/adaptação local. Transações externas sobre uma única conexão Drizzle e locks por conta preservam atomicidade de senha, consumo e revogação. O laboratório também preserva o prazo original quando a troca autenticada rotaciona a sessão e recusa o instante exato do vencimento, que o comparador nativo aceita. A exclusão das verificações anteriores acopla a adaptação ao schema da versão fixada e precisa de regressão em upgrades.

Não montar indiscriminadamente o handler nativo: caminhos alternativos poderiam contornar essas políticas. Nas #7/#10, expor apenas operações autorizadas, manter validação no backend e configurar proxy/TLS para o ambiente real. As fixtures administrativas não comprovam autorização contextual. A recuperação local expõe o link somente na saída explícita do operador; o titular define a senha, sem passagem de senha por argumentos do processo. POC não é funcionalidade entregue, publicação ou homologação da Alpha 1.

## Origem e limites do registro

Consolidação das definições do projeto recuperadas para este conjunto. A data acima é a data de documentação, não necessariamente a de aprovação. Justificativas, alternativas e orientações derivadas explicitam a análise desta consolidação e não afirmam que todas foram discutidas ou aprovadas anteriormente. Consulte o [índice](README.md) para os critérios de status.

