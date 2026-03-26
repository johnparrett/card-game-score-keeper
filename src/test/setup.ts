import '@testing-library/jest-dom'

// Node 22+ ships a built-in localStorage that lacks .clear() and conflicts
// with jsdom/happy-dom. Replace it with a simple in-memory shim.
const store: Record<string, string> = {}
const storageMock: Storage = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => { store[key] = String(value) },
  removeItem: (key: string) => { delete store[key] },
  clear: () => { for (const k of Object.keys(store)) delete store[k] },
  get length() { return Object.keys(store).length },
  key: (i: number) => Object.keys(store)[i] ?? null,
}
Object.defineProperty(globalThis, 'localStorage', { value: storageMock, writable: true })
