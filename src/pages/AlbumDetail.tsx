import { useLoaderData, Link } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';
import { useFavoritesStore } from '../store/favoritesStore';
import { RecentViewsService } from '../services/localStorage';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ExternalLink, Image as ImageIcon } from 'lucide-react';
import type { Album, Photo, User as UserType, FavoritePhoto } from '../types/api';

interface AlbumLoaderData {
  album: Album;
  photos: Photo[];
  user: UserType;
}

export default function AlbumDetail() {
  const { album, photos, user } = useLoaderData() as AlbumLoaderData;
  const { addPhoto, removePhoto, isPhotoFavorite } = useFavoritesStore();

  // Recent view'a ekle
  useEffect(() => {
    RecentViewsService.addRecentView({
      id: album.id,
      type: 'album',
      title: album.title,
      url: `/users/${album.userId}/albums/${album.id}`,
    });
  }, [album]);

  const handlePhotoFavorite = (photo: Photo) => {
    if (isPhotoFavorite(photo.id)) {
      removePhoto(photo.id);
    } else {
      const favoritePhoto: FavoritePhoto = {
        ...photo,
        userId: user.id,
        // Random resim URL'lerini de kaydet
        url: getFullImageUrl(photo.id),
        thumbnailUrl: getRandomImageUrl(photo.id, 300, 200),
      };
      addPhoto(favoritePhoto);
    }
  };

  // Her fotoğraf için benzersiz random resim URL'i oluştur
  const getRandomImageUrl = (photoId: number, width: number = 300, height: number = 200) => {
    return `https://picsum.photos/${width}/${height}?random=${photoId}`;
  };

  const getFullImageUrl = (photoId: number) => {
    return `https://picsum.photos/800/600?random=${photoId}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Album Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <Card className="animated-card gradient-card mb-4">
          <Card.Body className="text-center text-white">
            <div className="mb-3">
              <ImageIcon size={48} className="mb-2" />
            </div>
            <Card.Title className="display-6 fw-bold">{album.title}</Card.Title>
            <Card.Subtitle className="mb-3 text-white-50">
              By{' '}
              <Link to={`/users/${user.id}`} className="text-white text-decoration-none">
                <strong>{user.name} (@{user.username})</strong>
              </Link>
            </Card.Subtitle>
            <Card.Text className="lead">
              This album contains {photos.length} amazing photos.
            </Card.Text>
          </Card.Body>
        </Card>
      </motion.div>

      <motion.h4 
        className="mb-4 d-flex align-items-center text-white"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <ImageIcon className="me-2" />
        Photos ({photos.length})
      </motion.h4>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <AnimatePresence>
          <Row className="g-4">
            {photos.map((photo, index) => (
              <Col key={photo.id} md={6} lg={4} xl={3}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.8 + (index * 0.1), 
                    duration: 0.6,
                    type: "spring",
                    stiffness: 100 
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                >
                  <Card className="h-100 animated-card">
                    <div className="position-relative overflow-hidden image-hover">
                      <Card.Img 
                        variant="top" 
                        src={getRandomImageUrl(photo.id, 300, 200)} 
                        alt={photo.title}
                        style={{ height: '200px', objectFit: 'cover', cursor: 'pointer' }}
                        onClick={() => window.open(getFullImageUrl(photo.id), '_blank')}
                      />
                      <motion.div 
                        className="position-absolute top-0 end-0 p-2"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {isPhotoFavorite(photo.id) ? (
                          <button
                            onClick={() => handlePhotoFavorite(photo)}
                            className="btn btn-danger btn-sm rounded-circle border-0 shadow"
                            style={{ width: '40px', height: '40px' }}
                          >
                            <Heart 
                              size={16} 
                              fill="currentColor"
                            />
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePhotoFavorite(photo)}
                            className="btn btn-light btn-sm rounded-circle border-0 shadow"
                            style={{ width: '40px', height: '40px' }}
                          >
                            <Heart 
                              size={16} 
                              fill="none"
                            />
                          </button>
                        )}
                      </motion.div>
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <Card.Title 
                        className="flex-grow-1" 
                        style={{ 
                          fontSize: '14px', 
                          height: '40px', 
                          overflow: 'hidden', 
                          lineHeight: '1.2',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {photo.title}
                      </Card.Title>
                      <div className="mt-auto">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <button
                            onClick={() => window.open(getFullImageUrl(photo.id), '_blank')}
                            className="btn btn-outline-primary btn-sm w-100 d-flex align-items-center justify-content-center"
                          >
                            <ExternalLink size={14} className="me-2" />
                            View Full Size
                          </button>
                        </motion.div>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}