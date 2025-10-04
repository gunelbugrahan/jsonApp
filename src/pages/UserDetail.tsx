import { useState, useEffect } from "react";
import { useLoaderData, useParams, Link } from "react-router-dom";
import {
  Card,
  Tabs,
  Tab,
  Badge,
  Spinner,
  Row,
  Col,
  Form,
  InputGroup,
} from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Globe,
  Building,
  MapPin,
  Heart,
  Plus,
  Filter,
  Check,
  X,
  Trash2,
} from "lucide-react";
import { api } from "../services/api";
import { useFavoritesStore } from "../store/favoritesStore";
import { RecentViewsService } from "../services/localStorage";
import type { User as UserType, Post, Album, Todo, Photo } from "../types/api";

// Tech assets imports
import reactLogo from "../assets/tech/react.svg";
import typescriptLogo from "../assets/tech/typescript.svg";
import bootstrapLogo from "../assets/tech/bootstrap.svg";
import viteLogo from "../assets/tech/vite.svg";
import jsLogo from "../assets/tech/js.svg";
import htmlLogo from "../assets/tech/html-5.svg";
import cssLogo from "../assets/tech/css-3.svg";
import sassLogo from "../assets/tech/sass.svg";
import gitLogo from "../assets/tech/git.svg";

export default function UserDetail() {
  const user = useLoaderData() as UserType;
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState("posts");

  const [posts, setPosts] = useState<Post[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);

  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingAlbums, setLoadingAlbums] = useState(false);
  const [loadingTodos, setLoadingTodos] = useState(false);

  // Todo filtreleme ve yeni todo ekleme state'leri
  const [todoFilter, setTodoFilter] = useState<"all" | "pending" | "completed">(
    "all"
  );
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [isAddingTodo, setIsAddingTodo] = useState(false);

  const { isPostFavorite, addPost, removePost } = useFavoritesStore();

  // Kendi profilim için özel veriler
  const getMyPosts = () => [
    { id: 101, title: "BG Learning JS", body: "Interactive JavaScript learning platform with hands-on exercises and real-time code execution.", userId: 0, url: "https://bglearningjs.netlify.app/" },
    { id: 102, title: "Hadiyap", body: "Modern gift recommendation platform with personalized suggestions and seamless shopping experience.", userId: 0, url: "https://hadiyap.netlify.app/" },
    { id: 103, title: "First Figma Design", body: "My first professional UI/UX design project showcasing modern design principles and user experience.", userId: 0, url: "https://first-figmabk.netlify.app/" },
    { id: 104, title: "PUBG BG", body: "Gaming statistics and player analysis platform for PUBG with detailed performance metrics.", userId: 0, url: "https://pubgbg.netlify.app/" },
    { id: 105, title: "COD BG", body: "Call of Duty community platform with player stats, tournaments, and gaming news.", userId: 0, url: "https://codbg.netlify.app/" },
    { id: 106, title: "BG Mobile", body: "Mobile-first responsive web application showcasing modern mobile development techniques.", userId: 0, url: "https://bgmobil.netlify.app/" }
  ];

  const getMyAlbums = () => [
    { id: 101, title: "Tech Stack", userId: 0, photos: [
      { id: 1002, title: "React", url: reactLogo, thumbnailUrl: reactLogo, albumId: 101 },
      { id: 1003, title: "TypeScript", url: typescriptLogo, thumbnailUrl: typescriptLogo, albumId: 101 },
      { id: 1004, title: "Bootstrap", url: bootstrapLogo, thumbnailUrl: bootstrapLogo, albumId: 101 },
      { id: 1005, title: "Vite", url: viteLogo, thumbnailUrl: viteLogo, albumId: 101 },
      { id: 1006, title: "JavaScript", url: jsLogo, thumbnailUrl: jsLogo, albumId: 101 },
      { id: 1007, title: "HTML5", url: htmlLogo, thumbnailUrl: htmlLogo, albumId: 101 },
      { id: 1008, title: "CSS3", url: cssLogo, thumbnailUrl: cssLogo, albumId: 101 },
      { id: 1009, title: "Sass", url: sassLogo, thumbnailUrl: sassLogo, albumId: 101 },
      { id: 1010, title: "Git", url: gitLogo, thumbnailUrl: gitLogo, albumId: 101 }
    ]}
  ];

  const getMyTodos = () => [
    { id: 201, title: "OnlyJS'e kayıt olundu", completed: true, userId: 0 },
    { id: 202, title: "HTML öğrenildi", completed: true, userId: 0 },
    { id: 203, title: "CSS öğrenildi", completed: true, userId: 0 },
    { id: 204, title: "SASS öğrenildi", completed: true, userId: 0 },
    { id: 205, title: "JavaScript temelleriyle öğrenildi", completed: true, userId: 0 },
    { id: 206, title: "React'a giriş yapıldı", completed: true, userId: 0 },
    { id: 207, title: "React öğrenilmeye devam ediyor", completed: false, userId: 0 }
  ];

  const handleTabSelect = async (tab: string | null) => {
    if (!tab || !userId) return;

    setActiveTab(tab);
    const userIdNum = parseInt(userId);

    // Kendi profilim için özel veri yükle
    if (userIdNum === 0) {
      if (tab === "posts" && posts.length === 0) {
        setPosts(getMyPosts());
      } else if (tab === "albums" && albums.length === 0) {
        setAlbums(getMyAlbums());
      } else if (tab === "todos" && todos.length === 0) {
        setTodos(getMyTodos());
      }
      return;
    }

    // Diğer kullanıcılar için normal API çağrıları
    if (tab === "albums" && albums.length === 0) {
      setLoadingAlbums(true);
      try {
        const userAlbums = await api.getUserAlbums(userIdNum);
        setAlbums(userAlbums);
      } finally {
        setLoadingAlbums(false);
      }
    } else if (tab === "todos" && todos.length === 0) {
      setLoadingTodos(true);
      try {
        const userTodos = await api.getUserTodos(userIdNum);
        setTodos(userTodos);
      } finally {
        setLoadingTodos(false);
      }
    }
  };

  // İlk yüklemede posts'u yükle ve recent view'a ekle
  useEffect(() => {
    if (activeTab === "posts" && posts.length === 0 && userId) {
      const userIdNum = parseInt(userId);
      
      // Kendi profilim için özel posts
      if (userIdNum === 0) {
        setPosts(getMyPosts());
        return;
      }
      
      // Diğer kullanıcılar için normal API çağrısı
      setLoadingPosts(true);
      api.getUserPosts(userIdNum).then((userPosts) => {
        setPosts(userPosts);
        setLoadingPosts(false);
      });
    }

    // Recent view'a ekle
    if (user && userId) {
      RecentViewsService.addRecentView({
        id: user.id,
        type: "user",
        title: user.name,
        url: `/users/${userId}`,
      });
    }
  }, [userId, activeTab, posts.length, user]);

  const handlePostFavorite = (post: Post) => {
    if (isPostFavorite(post.id)) {
      removePost(post.id);
    } else {
      addPost(post);
    }
  };

  // Todo işlemleri
  const filteredTodos = todos.filter((todo) => {
    if (todoFilter === "pending") return !todo.completed;
    if (todoFilter === "completed") return todo.completed;
    return true;
  });

  const addNewTodo = () => {
    if (!newTodoTitle.trim()) return;

    const newTodo: Todo = {
      userId: parseInt(userId || "0"),
      id: Math.max(...todos.map((t) => t.id), 0) + 1,
      title: newTodoTitle.trim(),
      completed: false,
    };

    setTodos([newTodo, ...todos]);
    setNewTodoTitle("");
    setIsAddingTodo(false);
  };

  const toggleTodo = (todoId: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (todoId: number) => {
    setTodos(todos.filter((todo) => todo.id !== todoId));
  };

  const todoStats = {
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
    pending: todos.filter((t) => !t.completed).length,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* User Header Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <Card className={`animated-card mb-4 ${user.id === 0 ? '' : 'gradient-card'}`} 
              style={user.id === 0 ? {
                backgroundImage: 'url(/src/assets/myCard/tokyo.gif)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                overflow: 'hidden'
              } : {}}>
          {user.id === 0 && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.4)',
              zIndex: 1
            }} />
          )}
          <Card.Body className="text-white" style={{ position: 'relative', zIndex: 2 }}>
            <div className="text-center mb-4">
              <div
                className="rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3"
                style={user.id === 0 ? {
                  width: "120px",
                  height: "120px",
                  backgroundImage: 'url(/src/assets/myCard/198758288.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '4px solid #ffd700',
                  boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)'
                } : {
                  width: "80px",
                  height: "80px",
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                }}
              >
                {user.id !== 0 && <User size={40} />}
              </div>
              <Card.Title className={`display-6 fw-bold ${user.id === 0 ? 'my-profile-name' : 'text-white'}`}>
                {user.name}
              </Card.Title>
              <Card.Subtitle className={`mb-3 ${user.id === 0 ? 'my-profile-username' : 'text-white-50'}`}>
                @{user.username}
              </Card.Subtitle>
            </div>

            <Row className="g-3">
              <Col md={6}>
                <div className={`d-flex align-items-center mb-2 ${user.id === 0 ? 'my-profile-info' : 'text-white-50'}`}>
                  <Mail size={16} className="me-2" />
                  <span>{user.email}</span>
                </div>
                <div className={`d-flex align-items-center mb-2 ${user.id === 0 ? 'my-profile-info' : 'text-white-50'}`}>
                  <Phone size={16} className="me-2" />
                  <span>{user.phone}</span>
                </div>
                <div className={`d-flex align-items-center ${user.id === 0 ? 'my-profile-info' : 'text-white-50'}`}>
                  <Globe size={16} className="me-2" />
                  <span>{user.website}</span>
                </div>
              </Col>
              <Col md={6}>
                <div className={`d-flex align-items-center mb-2 ${user.id === 0 ? 'my-profile-info' : 'text-white-50'}`}>
                  <Building size={16} className="me-2" />
                  <span>{user.company.name}</span>
                </div>
                <div className={`d-flex align-items-center ${user.id === 0 ? 'my-profile-info' : 'text-white-50'}`}>
                  <MapPin size={16} className="me-2" />
                  <span>
                    {user.address.street}, {user.address.city}
                  </span>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </motion.div>

      <Tabs activeKey={activeTab} onSelect={handleTabSelect} className="mb-4">
        <Tab eventKey="posts" title="Posts">
          {loadingPosts ? (
            <div className="text-center p-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Yükleniyor...</span>
              </Spinner>
            </div>
          ) : (
            <motion.div
              variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
            >
              <AnimatePresence>
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="mb-3"
                  >
                    <Card className="animated-card">
                      <Card.Body className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          {user.id === 0 && post.url ? (
                            // Kendi projellerim için dış linkler
                            <a
                              href={post.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-decoration-none"
                            >
                              <Card.Title className="h6 mb-2">
                                {post.title}
                              </Card.Title>
                              <Card.Text className="text-muted small">
                                {post.body.substring(0, 100)}...
                              </Card.Text>
                            </a>
                          ) : (
                            // Diğer kullanıcılar için normal post detay sayfası
                            <Link
                              to={`/users/${userId}/posts/${post.id}`}
                              className="text-decoration-none"
                            >
                              <Card.Title className="h6 mb-2">
                                {post.title}
                              </Card.Title>
                              <Card.Text className="text-muted small">
                                {post.body.substring(0, 100)}...
                              </Card.Text>
                            </Link>
                          )}
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {isPostFavorite(post.id) ? (
                            <button
                              onClick={() => handlePostFavorite(post)}
                              className="btn btn-danger btn-sm ms-2 rounded-circle"
                              style={{ width: "40px", height: "40px" }}
                            >
                              <Heart
                                size={16}
                                fill="white"
                              />
                            </button>
                          ) : (
                            <button
                              onClick={() => handlePostFavorite(post)}
                              className="btn btn-outline-danger btn-sm ms-2 rounded-circle"
                              style={{ width: "40px", height: "40px" }}
                            >
                              <Heart
                                size={16}
                                fill="none"
                              />
                            </button>
                          )}
                        </motion.div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </Tab>

        <Tab eventKey="albums" title="Albums">
          {loadingAlbums ? (
            <div className="text-center p-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Yükleniyor...</span>
              </Spinner>
            </div>
          ) : (
            <motion.div
              variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
            >
              {user.id === 0 ? (
                // Kendi profilim için teknoloji icon'ları grid'i
                <Row className="g-4">
                  <AnimatePresence>
                    {albums[0]?.photos?.map((photo: Photo, index: number) => (
                      <Col key={photo.id} xs={6} sm={4} md={3} lg={2}>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ 
                            scale: 1.1,
                            transition: { duration: 0.2 }
                          }}
                          className="text-center"
                        >
                          <div 
                            className="p-3 rounded-3 shadow-sm"
                            style={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              border: '2px solid transparent',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.4)';
                              e.currentTarget.style.borderColor = '#ffd700';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                              e.currentTarget.style.borderColor = 'transparent';
                            }}
                          >
                            <img
                              src={photo.thumbnailUrl}
                              alt={photo.title}
                              style={{
                                width: '50px',
                                height: '50px',
                                objectFit: 'contain',
                                filter: photo.title === 'Profile' ? 'none' : 'none'
                              }}
                              className="mb-2"
                            />
                            <div className="text-white small fw-semibold">
                              {photo.title}
                            </div>
                          </div>
                        </motion.div>
                      </Col>
                    ))}
                  </AnimatePresence>
                </Row>
              ) : (
                // Diğer kullanıcılar için normal album listesi
                <AnimatePresence>
                  {albums.map((album, index) => (
                    <motion.div
                      key={album.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="mb-3"
                    >
                      <Card className="animated-card">
                        <Card.Body>
                          <Link
                            to={`/users/${userId}/albums/${album.id}`}
                            className="text-decoration-none"
                          >
                            <Card.Title className="h6 mb-0">
                              {album.title}
                            </Card.Title>
                          </Link>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </motion.div>
          )}
        </Tab>

        <Tab eventKey="todos" title={`Todos (${todoStats.total})`}>
          {loadingTodos ? (
            <div className="text-center p-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Yükleniyor...</span>
              </Spinner>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* Todo Stats ve Controls */}
              <Card className="animated-card mb-4">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col md={6}>
                      <div className="d-flex gap-3">
                        <Badge
                          bg="primary"
                          className="d-flex align-items-center gap-1"
                        >
                          <span>Total: {todoStats.total}</span>
                        </Badge>
                        <Badge
                          bg="success"
                          className="d-flex align-items-center gap-1"
                        >
                          <Check size={14} />
                          <span>Completed: {todoStats.completed}</span>
                        </Badge>
                        <Badge
                          bg="warning"
                          className="d-flex align-items-center gap-1"
                        >
                          <X size={14} />
                          <span>Pending: {todoStats.pending}</span>
                        </Badge>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="d-flex gap-2 justify-content-md-end">
                        {/* Filter Buttons */}
                        {todoFilter === "all" ? (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => setTodoFilter("all")}
                          >
                            <Filter size={14} className="me-1" />
                            All
                          </button>
                        ) : (
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => setTodoFilter("all")}
                          >
                            <Filter size={14} className="me-1" />
                            All
                          </button>
                        )}
                        {todoFilter === "pending" ? (
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => setTodoFilter("pending")}
                          >
                            Pending
                          </button>
                        ) : (
                          <button
                            className="btn btn-outline-warning btn-sm"
                            onClick={() => setTodoFilter("pending")}
                          >
                            Pending
                          </button>
                        )}
                        {todoFilter === "completed" ? (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => setTodoFilter("completed")}
                          >
                            Completed
                          </button>
                        ) : (
                          <button
                            className="btn btn-outline-success btn-sm"
                            onClick={() => setTodoFilter("completed")}
                          >
                            Completed
                          </button>
                        )}
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => setIsAddingTodo(!isAddingTodo)}
                        >
                          <Plus size={14} className="me-1" />
                          New
                        </button>
                      </div>
                    </Col>
                  </Row>

                  {/* Yeni Todo Ekleme */}
                  <AnimatePresence>
                    {isAddingTodo && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-3"
                      >
                        <InputGroup>
                          <Form.Control
                            type="text"
                            placeholder="New Task Title..."
                            value={newTodoTitle}
                            onChange={(e) => setNewTodoTitle(e.target.value)}
                            onKeyPress={(e) =>
                              e.key === "Enter" && addNewTodo()
                            }
                          />
                          <button
                            className="btn btn-success"
                            onClick={addNewTodo}
                            disabled={!newTodoTitle.trim()}
                          >
                            <Plus size={16} />
                          </button>
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => {
                              setIsAddingTodo(false);
                              setNewTodoTitle("");
                            }}
                          >
                            <X size={16} />
                          </button>
                        </InputGroup>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card.Body>
              </Card>

              {/* Todo List */}
              <AnimatePresence>
                {filteredTodos.map((todo, index) => (
                  <motion.div
                    key={todo.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="mb-2"
                  >
                    <Card className="animated-card">
                      <Card.Body className="py-3">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center flex-grow-1">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {todo.completed ? (
                                <button
                                  className="btn btn-success btn-sm rounded-circle me-3"
                                  onClick={() => toggleTodo(todo.id)}
                                  style={{ width: "35px", height: "35px" }}
                                >
                                  <Check size={16} />
                                </button>
                              ) : (
                                <button
                                  className="btn btn-outline-success btn-sm rounded-circle me-3"
                                  onClick={() => toggleTodo(todo.id)}
                                  style={{ width: "35px", height: "35px" }}
                                >
                                </button>
                              )}
                            </motion.div>

                            <div className="flex-grow-1">
                              <Badge
                                bg={todo.completed ? "success" : "warning"}
                                className="me-2 small"
                              >
                                {todo.completed ? "Completed" : "Pending"}
                              </Badge>
                              <span
                                className={`${
                                  todo.completed
                                    ? "text-decoration-line-through text-muted"
                                    : ""
                                }`}
                                style={{ fontSize: "14px" }}
                              >
                                {todo.title}
                              </span>
                            </div>
                          </div>

                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <button
                              className="btn btn-outline-danger btn-sm rounded-circle"
                              onClick={() => deleteTodo(todo.id)}
                              style={{ width: "35px", height: "35px" }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </motion.div>
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredTodos.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="text-center py-4">
                    <Card.Body>
                      <div className="text-muted">
                        {todoFilter === "all"
                          ? "No tasks yet"
                          : todoFilter === "pending"
                          ? "No pending tasks"
                          : "No completed tasks"}
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          )}
        </Tab>
      </Tabs>
    </motion.div>
  );
}
