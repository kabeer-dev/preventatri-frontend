export interface NoopStorage {
  getItem: () => Promise<string | null>;
  setItem: (_key: string, value: string) => Promise<string>;
  removeItem: () => Promise<void>;
}
