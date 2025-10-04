import type { User, Post, Comment, Album, Photo, Todo } from '../types/api';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const api = {
  // Users
  getUsers: async (): Promise<User[]> => {
    const response = await fetch(`${BASE_URL}/users`);
    return response.json();
  },

  getUser: async (id: number): Promise<User> => {
    const response = await fetch(`${BASE_URL}/users/${id}`);
    return response.json();
  },

  // Posts
  getPosts: async (): Promise<Post[]> => {
    const response = await fetch(`${BASE_URL}/posts`);
    return response.json();
  },

  getPost: async (id: number): Promise<Post> => {
    const response = await fetch(`${BASE_URL}/posts/${id}`);
    return response.json();
  },

  getUserPosts: async (userId: number): Promise<Post[]> => {
    const response = await fetch(`${BASE_URL}/users/${userId}/posts`);
    return response.json();
  },

  getPostComments: async (postId: number): Promise<Comment[]> => {
    const response = await fetch(`${BASE_URL}/posts/${postId}/comments`);
    return response.json();
  },

  // Albums
  getAlbums: async (): Promise<Album[]> => {
    const response = await fetch(`${BASE_URL}/albums`);
    return response.json();
  },

  getAlbum: async (id: number): Promise<Album> => {
    const response = await fetch(`${BASE_URL}/albums/${id}`);
    return response.json();
  },

  getUserAlbums: async (userId: number): Promise<Album[]> => {
    const response = await fetch(`${BASE_URL}/users/${userId}/albums`);
    return response.json();
  },

  getAlbumPhotos: async (albumId: number): Promise<Photo[]> => {
    const response = await fetch(`${BASE_URL}/albums/${albumId}/photos`);
    return response.json();
  },

  // Todos
  getTodos: async (): Promise<Todo[]> => {
    const response = await fetch(`${BASE_URL}/todos`);
    return response.json();
  },

  getUserTodos: async (userId: number): Promise<Todo[]> => {
    const response = await fetch(`${BASE_URL}/users/${userId}/todos`);
    return response.json();
  },
};