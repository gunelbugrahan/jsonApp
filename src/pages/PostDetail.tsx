import { useLoaderData, Link } from 'react-router-dom';
import { Card, ListGroup } from 'react-bootstrap';
import { useFavoritesStore } from '../store/favoritesStore';
import { RecentViewsService } from '../services/localStorage';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, User, MessageCircle } from 'lucide-react';
import type { Post, Comment, User as UserType } from '../types/api';

interface PostLoaderData {
  post: Post;
  comments: Comment[];
  user: UserType;
}

export default function PostDetail() {
  const { post, comments, user } = useLoaderData() as PostLoaderData;
  const { addPost, removePost, isPostFavorite } = useFavoritesStore();

  // Recent view'a ekle
  useEffect(() => {
    RecentViewsService.addRecentView({
      id: post.id,
      type: 'post',
      title: post.title,
      url: `/users/${post.userId}/posts/${post.id}`,
    });
  }, [post]);

  const handlePostFavorite = () => {
    if (isPostFavorite(post.id)) {
      removePost(post.id);
    } else {
      addPost(post);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Post Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <Card className="animated-card gradient-card mb-4">
          <Card.Body className="text-white">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="flex-grow-1">
                <Card.Title className="display-6 fw-bold text-white">
                  {post.title}
                </Card.Title>
                <Card.Subtitle className="mb-3 text-white-50">
                  <User className="me-2" size={16} />
                  By{' '}
                  <Link to={`/users/${user.id}`} className="text-white text-decoration-none">
                    <strong>{user.name} (@{user.username})</strong>
                  </Link>
                </Card.Subtitle>
              </div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isPostFavorite(post.id) ? (
                  <button
                    onClick={handlePostFavorite}
                    className="btn btn-danger rounded-circle"
                    style={{ width: '50px', height: '50px', border: 'none' }}
                  >
                    <Heart 
                      size={20} 
                      fill="white"
                      color="white"
                    />
                  </button>
                ) : (
                  <button
                    onClick={handlePostFavorite}
                    className="btn btn-outline-danger rounded-circle"
                    style={{ width: '50px', height: '50px' }}
                  >
                    <Heart 
                      size={20} 
                      fill="none"
                      color="white"
                    />
                  </button>
                )}
              </motion.div>
            </div>
            <Card.Text className="lead text-white-50">
              {post.body}
            </Card.Text>
          </Card.Body>
        </Card>
      </motion.div>

      {/* Comments Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <Card className="animated-card">
          <Card.Header className="bg-transparent">
            <h4 className="mb-0 d-flex align-items-center">
              <MessageCircle className="me-2" />
              Comments ({comments.length})
            </h4>
          </Card.Header>
          <Card.Body className="p-0">
            <ListGroup variant="flush">
              {comments.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + (index * 0.1), duration: 0.4 }}
                >
                  <ListGroup.Item className="border-0 py-3">
                    <div className="d-flex">
                      <div 
                        className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                        style={{ 
                          width: '40px', 
                          height: '40px',
                          background: 'var(--gradient-primary)',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}
                      >
                        {comment.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1 fw-bold">{comment.name}</h6>
                        <small className="text-muted d-block mb-2">{comment.email}</small>
                        <p className="mb-0">{comment.body}</p>
                      </div>
                    </div>
                  </ListGroup.Item>
                </motion.div>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      </motion.div>
    </motion.div>
  );
}