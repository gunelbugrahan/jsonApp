import { Link } from 'react-router-dom';
import { Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Users, Heart, Settings, Sparkles } from 'lucide-react';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          {/* Hero Section */}
          <motion.div variants={itemVariants}>
            <Card className="text-center gradient-card mb-5">
              <Card.Body className="p-5">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <Sparkles size={64} className="mb-4 text-warning" />
                </motion.div>
                <motion.h1 
                  className="display-3 fw-bold text-white mb-4"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  JSON Placeholder App
                </motion.h1>
                <motion.p 
                  className="lead text-white-200 mb-4 home-text-muted"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  Discover amazing users, explore beautiful albums, and save your favorite content. 
                  Built with modern React, stunning animations, and intuitive design.
                </motion.p>
                <motion.div 
                  className="d-flex gap-3 justify-content-center flex-wrap"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link to="/users" className="btn btn-light btn-lg px-4 py-3 fw-bold">
                      <Users className="me-2" size={20} />
                      Explore Users
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link to="/favorites" className="btn btn-outline-light btn-lg px-4 py-3 fw-bold">
                      <Heart className="me-2" size={20} />
                      View Favorites
                    </Link>
                  </motion.div>
                </motion.div>
              </Card.Body>
            </Card>
          </motion.div>

          {/* Features Grid */}
          <Row className="g-4">
            <Col md={4}>
              <motion.div variants={itemVariants}>
                <Card className="h-100 animated-card text-center">
                  <Card.Body className="p-4">
                    <div className="mb-3">
                      <div 
                        className="rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3"
                        style={{ 
                          width: '80px', 
                          height: '80px',
                          background: 'var(--gradient-primary)',
                          color: 'white'
                        }}
                      >
                        <Users size={32} />
                      </div>
                    </div>
                    <Card.Title className="h5">Discover Users</Card.Title>
                    <Card.Text className="text-muted">
                      Browse through profiles, search by name or company, and connect with interesting people.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>

            <Col md={4}>
              <motion.div variants={itemVariants}>
                <Card className="h-100 animated-card text-center">
                  <Card.Body className="p-4">
                    <div className="mb-3">
                      <div 
                        className="rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3"
                        style={{ 
                          width: '80px', 
                          height: '80px',
                          background: 'var(--gradient-secondary)',
                          color: 'white'
                        }}
                      >
                        <Heart size={32} />
                      </div>
                    </div>
                    <Card.Title className="h5">Save Favorites</Card.Title>
                    <Card.Text className="text-muted">
                      Bookmark your favorite photos and posts. All your preferences are saved locally.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>

            <Col md={4}>
              <motion.div variants={itemVariants}>
                <Card className="h-100 animated-card text-center">
                  <Card.Body className="p-4">
                    <div className="mb-3">
                      <div 
                        className="rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3"
                        style={{ 
                          width: '80px', 
                          height: '80px',
                          background: 'var(--gradient-success)',
                          color: 'white'
                        }}
                      >
                        <Settings size={32} />
                      </div>
                    </div>
                    <Card.Title className="h5">Customize Experience</Card.Title>
                    <Card.Text className="text-muted">
                      Choose your theme, adjust settings, and personalize your browsing experience.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>

          {/* Stats Section */}
          <motion.div 
            variants={itemVariants}
            className="mt-5"
          >
            <Card className="glass-card">
              <Card.Body className="text-center p-4">
                <Row>
                  <Col md={4}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="p-3"
                    >
                      <h3 className="display-6 fw-bold text-primary mb-1">10+</h3>
                      <p className="text-muted mb-0">Active Users</p>
                    </motion.div>
                  </Col>
                  <Col md={4}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="p-3"
                    >
                      <h3 className="display-6 fw-bold text-primary mb-1">100+</h3>
                      <p className="text-muted mb-0">Beautiful Photos</p>
                    </motion.div>
                  </Col>
                  <Col md={4}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="p-3"
                    >
                      <h3 className="display-6 fw-bold text-primary mb-1">∞</h3>
                      <p className="text-muted mb-0">Possibilities</p>
                    </motion.div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </motion.div>
  );
}