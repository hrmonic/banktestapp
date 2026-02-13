/// <reference types="node" />
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { describe, it, expect } from 'vitest';
import { clientConfigSchema } from '../../src/lib/configSchema';

// Chemin vers les fixtures depuis la racine du projet (vitest est lancé depuis banktestapp-main).
const FIXTURES_DIR = join(
  process.cwd(),
  'apps',
  'starter',
  'tests',
  'fixtures',
  'config'
);

describe('client.config.json fuzzing fixtures', () => {
  const files = readdirSync(FIXTURES_DIR).filter((f: string) =>
    f.endsWith('.json')
  );

  it('fixtures existent pour les tests de robustesse config', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const file of files) {
    it(`ne doit jamais crasher sur le parsing de ${file}`, () => {
      const raw = readFileSync(join(FIXTURES_DIR, file), 'utf-8');
      const json = JSON.parse(raw);
      const result = clientConfigSchema.safeParse(json);

      // On ne fait qu'asserter que le parseur ne jette pas d'exception non gérée.
      // La distinction success/erreur est utilisée par l'UI (InvalidConfigPage).
      expect(result.success === true || result.success === false).toBe(true);
    });
  }
});
