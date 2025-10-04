import type { LoaderFunctionArgs } from 'react-router-dom';
import { api } from '../services/api';

export const usersLoader = async () => {
  return await api.getUsers();
};

export const userLoader = async ({ params }: LoaderFunctionArgs) => {
  const userId = parseInt(params.userId!);
  
  // Kendi profilim için özel veri dön
  if (userId === 0) {
    return {
      id: 0,
      name: "Buğrahan Günel",
      username: "curse",
      email: "gunelbugrahann@gmail.com",
      phone: "(537) 377-4473",
      website: "https://github.com/gunelbugrahan",
      address: {
        street: "",
        suite: "",
        city: "Kocaeli",
        zipcode: "",
        geo: { lat: "", lng: "" }
      },
      company: {
        name: "OnlyJS",
        catchPhrase: "React Developer",
        bs: "Frontend Development"
      }
    };
  }
  
  return await api.getUser(userId);
};

export const postLoader = async ({ params }: LoaderFunctionArgs) => {
  const postId = parseInt(params.postId!);
  const userId = parseInt(params.userId!);
  
  const [post, comments, user] = await Promise.all([
    api.getPost(postId),
    api.getPostComments(postId),
    api.getUser(userId)
  ]);
  
  return { post, comments, user };
};

export const albumLoader = async ({ params }: LoaderFunctionArgs) => {
  const albumId = parseInt(params.albumId!);
  const userId = parseInt(params.userId!);
  
  const [album, photos, user] = await Promise.all([
    api.getAlbum(albumId),
    api.getAlbumPhotos(albumId),
    api.getUser(userId)
  ]);
  
  return { album, photos, user };
};