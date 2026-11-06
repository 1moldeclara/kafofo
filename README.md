# Kafofo

Plataforma modular de organização e administração da vida doméstica compartilhada, com proposta open-source e self-hosted.

O repositório reúne a documentação funcional e arquitetural e a fundação executável da Alpha 1. Comece pelo [índice da documentação](docs/README.md) ou pelo [guia de desenvolvimento local](docs/development/README.md).

## Navegação

- [Plataforma](docs/domain/platform/README.md): identidade, núcleos, residências, permissões e serviços comuns.
- [Kapanga](docs/domain/kapanga/README.md): despesas domésticas.
- [Kitanda](docs/domain/kitanda/README.md): listas de compras.
- [Mutyrão](docs/domain/mutyrao/README.md): tarefas domésticas.
- [Arakatu](docs/domain/arakatu/README.md): calendário e agenda.
- [Okape](docs/domain/okape/README.md): composição de painéis.
- [Urukum](docs/domain/urukum/README.md): notas digitais.
- [Kitute](docs/domain/kitute/README.md): cadernos de receitas.
- [Decisões de arquitetura](docs/adr/README.md).
- [Identidade de marca](docs/brand/README.md).

A documentação descreve o MVP pretendido. Critérios de aceitação não são testes executados. Better Auth permanece condicionado à POC; bibliotecas complementares do frontend, CD e licença continuam pendentes conforme as ADRs.

**Consolidação do conjunto:** 2026-11-04. As datas originais dos documentos foram preservadas.

## Desenvolvimento e contribuições

- [Alpha 1: escopo e decisões](https://github.com/vguerrax/kafofo/issues/1).
- [Backlog oficial](https://github.com/vguerrax/kafofo/issues).
- [Como contribuir](CONTRIBUTING.md).
- [Regras para agentes](AGENTS.md).

A fundação contém API Fastify, frontend React e contratos TypeBox compartilhados. Autenticação e funcionalidades domésticas ainda serão implementadas nas tarefas correspondentes. O [GitHub Project](https://github.com/users/vguerrax/projects/1) mantém as etapas de execução.
