import { create } from "zustand";

export const usePostStore = create((set) => ({
  posts: [],

  setPosts: (posts) => set({ posts }),

  addPost: (post) =>
    set((state) => ({
      posts: [post, ...state.posts],
    })),

  updatePost: (updatedPost) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === updatedPost.id ? updatedPost : p
      ),
    })),

  removePost: (id) =>
    set((state) => ({
      posts: state.posts.filter((p) => p.id !== id),
    })),

  toggleLike: (postId) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              liked_by_me: !p.liked_by_me,
              likes_count: p.liked_by_me
                ? p.likes_count - 1
                : p.likes_count + 1,
            }
          : p
      ),
    })),
}));