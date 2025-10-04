import { Link } from 'react-router-dom';
import { Card, Row, Col, Tabs, Tab, ListGroup } from 'react-bootstrap';
import { useFavoritesStore } from '../store/favoritesStore';

export default function Favorites() {
  const { photos, posts, removePhoto, removePost } = useFavoritesStore();

  return (
    <div>
      <h1 className="mb-4">Favorites</h1>
      
      <Tabs defaultActiveKey="photos" className="mb-4">
        <Tab eventKey="photos" title={`Photos (${photos.length})`}>
          {photos.length === 0 ? (
            <p className="text-muted">No favorite photos yet.</p>
          ) : (
            <Row>
              {photos.map((photo) => (
                <Col key={photo.id} md={6} lg={4} xl={3} className="mb-4">
                  <Card className="h-100 shadow-sm">
                    <div className="position-relative overflow-hidden">
                      <Card.Img 
                        variant="top" 
                        src={photo.thumbnailUrl} 
                        alt={photo.title}
                        style={{ height: '200px', objectFit: 'cover', cursor: 'pointer' }}
                        className="hover-zoom"
                        onClick={() => window.open(photo.url, '_blank')}
                      />
                      <div className="position-absolute top-0 end-0 p-2">
                        <button
                          className="btn btn-danger btn-sm rounded-circle"
                          onClick={() => removePhoto(photo.id)}
                          style={{ width: '35px', height: '35px', border: 'none' }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="flex-grow-1" style={{ fontSize: '14px', height: '40px', overflow: 'hidden', lineHeight: '1.2' }}>
                        {photo.title}
                      </Card.Title>
                      <div className="mt-auto">
                        <Link
                          to={`/users/${photo.userId}/albums/${photo.albumId}`}
                          className="btn btn-outline-primary btn-sm w-100"
                        >
                          View Album
                        </Link>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Tab>
        
        <Tab eventKey="posts" title={`Posts (${posts.length})`}>
          {posts.length === 0 ? (
            <p className="text-muted">No favorite posts yet.</p>
          ) : (
            <ListGroup>
              {posts.map((post) => (
                <ListGroup.Item key={post.id} className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <Link 
                      to={`/users/${post.userId}/posts/${post.id}`}
                      className="text-decoration-none"
                    >
                      <h6 className="mb-1">{post.title}</h6>
                      <p className="mb-1 text-muted">{post.body.substring(0, 100)}...</p>
                    </Link>
                  </div>
                  <button
                    className="btn btn-danger btn-sm ms-2"
                    onClick={() => removePost(post.id)}
                  >
                    Remove
                  </button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Tab>
      </Tabs>
    </div>
  );
}