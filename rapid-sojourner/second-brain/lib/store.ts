import { create } from 'zustand';

// Types derived from schema
export interface User {
  id: string;
  email?: string;
}

export interface Item {
  id: string;
  user_id: string;
  url: string;
  title: string | null;
  description: string | null;
  topic: string | null;
  tags: string[] | null;
  source_type: string | null;
  domain: string | null;
  thumbnail_url: string | null;
  embedding: number[] | null;
  folder_id: string | null;
  user_note: string | null;
  is_read: boolean;
  enriched_at: string | null;
  created_at: string;
}

export interface Folder {
  id: string;
  user_id: string;
  name: string;
  emoji: string | null;
  created_at: string;
}

interface AppState {
  user: User | null;
  items: Item[];
  folders: Folder[];
  isLoading: boolean;
  
  // actions
  setUser: (user: User | null) => void;
  setItems: (items: Item[]) => void;
  addItem: (item: Item) => void;
  updateItem: (id: string, patch: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  setFolders: (folders: Folder[]) => void;
  addFolder: (folder: Folder) => void;
  updateFolder: (id: string, patch: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  items: [],
  folders: [],
  isLoading: false,

  setUser: (user) => set({ user }),
  setItems: (items) => set({ items }),
  addItem: (item) => set((state) => ({ items: [item, ...state.items] })),
  updateItem: (id, patch) => set((state) => ({
    items: state.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
  })),
  deleteItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
  setFolders: (folders) => set({ folders }),
  addFolder: (folder) => set((state) => ({ folders: [...state.folders, folder] })),
  updateFolder: (id, patch) => set((state) => ({
    folders: state.folders.map((f) => (f.id === id ? { ...f, ...patch } : f)),
  })),
  deleteFolder: (id) => set((state) => ({
    folders: state.folders.filter((f) => f.id !== id),
    items: state.items.map((item) => (item.folder_id === id ? { ...item, folder_id: null } : item)),
  })),
}));
