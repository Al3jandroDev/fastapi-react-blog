import { create } from "zustand";

export const usePostStore = create((set, get) => ({
  posts: [],

  // =========================
  // SET POSTS
  // =========================
  setPosts: (posts) => set({ posts }),

  // =========================
  // ADD POST
  // =========================
  addPost: (post) =>
    set((state) => ({
      posts: [post, ...state.posts],
    })),

  // =========================
  // UPDATE POST (EDIT)
  // =========================
  updatePost: (updatedPost) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === updatedPost.id ? updatedPost : p
      ),
    })),

  // =========================
  // REMOVE POST
  // =========================
  removePost: (id) =>
    set((state) => ({
      posts: state.posts.filter((p) => p.id !== id),
    })),

  // =========================
  // LIKE OPTIMISTIC (SAFE VERSION)
  // =========================
  toggleLike: (postId) =>
    set((state) => ({
      posts: state.posts.map((p) => {
        if (p.id !== postId) return p;

        const wasLiked = p.liked_by_me;

        return {
          ...p,
          liked_by_me: !wasLiked,
          likes_count: wasLiked
            ? Math.max(0, p.likes_count - 1)
            : p.likes_count + 1,
        };
      }),
    })),

  // =========================
  // SYNC FULL POST (FEED ↔ PROFILE)
  // =========================
  syncPost: (updatedPost) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === updatedPost.id
          ? {
              ...p,
              ...updatedPost,
            }
          : p
      ),
    })),


  // =========================
  // GET POST (UTIL)
  // =========================
  getPostById: (id) => {
    return get().posts.find((p) => p.id === id);
  },
}));