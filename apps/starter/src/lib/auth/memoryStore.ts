/**
 * Store en mémoire pour oidc-client-ts (tokens jamais persistés).
 * En production, les tokens restent uniquement en mémoire.
 */
import type { StateStore } from 'oidc-client-ts';

const memory = new Map<string, string>();

export const memoryStateStore: StateStore = {
  get(key: string): Promise<string | null> {
    return Promise.resolve(memory.get(key) ?? null);
  },
  set(key: string, value: string): Promise<void> {
    memory.set(key, value);
    return Promise.resolve();
  },
  remove(key: string): Promise<string | null> {
    const v = memory.get(key) ?? null;
    memory.delete(key);
    return Promise.resolve(v);
  },
  getAllKeys(): Promise<string[]> {
    return Promise.resolve([...memory.keys()]);
  },
};
