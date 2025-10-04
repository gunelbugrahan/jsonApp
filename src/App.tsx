import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Users from './pages/Users';
import UserDetail from './pages/UserDetail';
import PostDetail from './pages/PostDetail';
import AlbumDetail from './pages/AlbumDetail';
import Favorites from './pages/Favorites';
import Settings from './pages/Settings';
import { usersLoader, userLoader, postLoader, albumLoader } from './loaders';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'users',
        element: <Users />,
        loader: usersLoader,
      },
      {
        path: 'users/:userId',
        element: <UserDetail />,
        loader: userLoader,
      },
      {
        path: 'users/:userId/posts/:postId',
        element: <PostDetail />,
        loader: postLoader,
      },
      {
        path: 'users/:userId/albums/:albumId',
        element: <AlbumDetail />,
        loader: albumLoader,
      },
      {
        path: 'favorites',
        element: <Favorites />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
