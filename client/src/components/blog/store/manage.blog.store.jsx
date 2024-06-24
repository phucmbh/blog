import { create } from 'zustand';

export const useManageBlogStore = create((set) => ({
  pageBlog: 1,
  pageDraft: 1,
  search: '',
  actions: {
    increasePageBlog: () => set((state) => ({ pageBlog: state.pageBlog + 1 })),
    increasePageDraft: () =>
      set((state) => ({ pageDraft: state.pageDraft + 1 })),
    setSearch: (value) => set({ search: value }),
  },
}));

export const useManageBlogAction = () =>
  useManageBlogStore((state) => state.actions);
export const usePageBlog = () => useManageBlogStore((state) => state.pageBlog);
export const usePageDraft = () =>
  useManageBlogStore((state) => state.pageDraft);
export const useSearch = () => useManageBlogStore((state) => state.search);
