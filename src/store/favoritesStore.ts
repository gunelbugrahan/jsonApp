import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FavoritePhoto, FavoritePost } from '../types/api';

interface FavoritesState {
  photos: FavoritePhoto[];
  posts: FavoritePost[];
  addPhoto: (photo: FavoritePhoto) => void;
  removePhoto: (photoId: number) => void;
  isPhotoFavorite: (photoId: number) => boolean;
  addPost: (post: FavoritePost) => void;
  removePost: (postId: number) => void;
  isPostFavorite: (postId: number) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      photos: [],
      posts: [],
      addPhoto: (photo: FavoritePhoto) =>
        set((state) => ({
          photos: state.photos.some((p) => p.id === photo.id)
            ? state.photos
            : [...state.photos, photo],
        })),
      removePhoto: (photoId: number) =>
        set((state) => ({
          photos: state.photos.filter((photo) => photo.id !== photoId),
        })),
      isPhotoFavorite: (photoId: number) =>
        get().photos.some((photo) => photo.id === photoId),
      addPost: (post: FavoritePost) =>
        set((state) => ({
          posts: state.posts.some((p) => p.id === post.id)
            ? state.posts
            : [...state.posts, post],
        })),
      removePost: (postId: number) =>
        set((state) => ({
          posts: state.posts.filter((post) => post.id !== postId),
        })),
      isPostFavorite: (postId: number) =>
        get().posts.some((post) => post.id === postId),
    }),
    {
      name: 'favorites-storage',
    }
  )
);