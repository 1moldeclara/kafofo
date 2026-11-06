import { pgSchema } from 'drizzle-orm/pg-core';

// Namespace do módulo, não um mecanismo de isolamento entre núcleos.
// Tabelas de identidade e domínio serão introduzidas nas respectivas tarefas.
export const platformSchema = pgSchema('platform');
