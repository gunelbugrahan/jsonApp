import { Outlet, Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Container, Badge, Dropdown } from "react-bootstrap";
import { useFavoritesStore } from "../store/favoritesStore";
import { RecentViewsService, ThemeService } from "../services/localStorage";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Silk from "./Silk";
import type { RecentView } from "../services/localStorage";

export default function Layout() {
  const photos = useFavoritesStore((state) => state.photos);
  const posts = useFavoritesStore((state) => state.posts);
  const totalFavorites = (photos?.length || 0) + (posts?.length || 0);
  const location = useLocation();

  const [recentViews, setRecentViews] = useState<RecentView[]>([]);
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark" | "auto">(
    "light"
  );

  useEffect(() => {
    // Recent views'i yükle
    setRecentViews(RecentViewsService.getRecentViews());

    // Mevcut temayı yükle
    setCurrentTheme(ThemeService.getTheme());
  }, [location]);

  const handleThemeChange = (theme: "light" | "dark" | "auto") => {
    ThemeService.setTheme(theme);
    setCurrentTheme(theme);
  };

  const clearRecentViews = () => {
    RecentViewsService.clearRecentViews();
    setRecentViews([]);
  };

  // Helper variables to avoid complex union types
  const themeDropdownStyle = { cursor: "pointer", color: currentTheme === "light" ? "#fffffa" : undefined };

  return (
    <>
      {/* Silk Background - Only for light theme */}
      {currentTheme === "light" && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: -1,
            pointerEvents: 'none'
          }}
        >
          <Silk
            speed={3}
            scale={1.2}
            color="#5226ff"
            noiseIntensity={1.2}
            rotation={0}
          />
        </div>
      )}
      
      <Navbar expand="lg" className="mb-4 floating-navbar" style={currentTheme === "light" ? { backgroundColor: "rgba(255, 255, 255, 0.05)", backdropFilter: "blur(15px)", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" } : {}}>
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold" style={currentTheme === "light" ? { color: "#fffffa" } : {}}>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              Incredibly Beautiful App
            </motion.span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Item>
                <Nav.Link
                  as={Link}
                  to="/users"
                  className={location.pathname.startsWith("/users") ? "active" : ""}
                  style={currentTheme === "light" ? { color: "#fffffa" } : {}}
                >
                  👥 Users
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  as={Link}
                  to="/favorites"
                  className={location.pathname === "/favorites" ? "active" : ""}
                  style={currentTheme === "light" ? { color: "#fffffa" } : {}}
                >
                  ❤️ Favorites{" "}
                  {totalFavorites > 0 && (
                    <Badge bg="danger">{totalFavorites}</Badge>
                  )}
                </Nav.Link>
              </Nav.Item>
            </Nav>
            <Nav className="ms-auto">
              {/* Recent Views Dropdown */}
              {/* @ts-expect-error - Bootstrap Dropdown complex union type issue */}
              <Dropdown as={Nav.Item}>
                {currentTheme === "light" ? (
                  <Dropdown.Toggle 
                    as="button"
                    className="nav-link"
                    style={{ cursor: "pointer", color: "#fffffa", backgroundColor: "transparent", border: "none" }}
                  >
                    Recent Views{" "}
                    {(recentViews?.length || 0) > 0 && (
                      <Badge bg="info">{recentViews?.length}</Badge>
                    )}
                  </Dropdown.Toggle>
                ) : (
                  <Dropdown.Toggle 
                    as="button"
                    className="nav-link"
                    style={{ cursor: "pointer", backgroundColor: "transparent", border: "none" }}
                  >
                    Recent Views{" "}
                    {(recentViews?.length || 0) > 0 && (
                      <Badge bg="info">{recentViews?.length}</Badge>
                    )}
                  </Dropdown.Toggle>
                )}
                <Dropdown.Menu>
                  {!recentViews || recentViews.length === 0 ? (
                    <Dropdown.Item disabled>No recent views</Dropdown.Item>
                  ) : (
                    <>
                      {recentViews.slice(0, 5).map((view) => (
                        <Dropdown.Item
                          key={`${view.type}-${view.id}`}
                          as={Link}
                          to={view.url}
                        >
                          <small className="text-muted">
                            {view.type.toUpperCase()}
                          </small>
                          <br />
                          {(view.title?.length || 0) > 30
                            ? (view.title || "").substring(0, 30) + "..."
                            : (view.title || "Untitled")}
                        </Dropdown.Item>
                      ))}
                      <Dropdown.Divider />
                      <Dropdown.Item
                        onClick={clearRecentViews}
                        className="text-danger"
                      >
                        Clear All
                      </Dropdown.Item>
                    </>
                  )}
                </Dropdown.Menu>
              </Dropdown>

              {/* Theme Dropdown */}
              <Dropdown as={Nav.Item}>
                <Dropdown.Toggle as={Nav.Link} style={themeDropdownStyle}>
                  Theme:{" "}
                  {currentTheme === "auto"
                    ? "🌓"
                    : currentTheme === "dark"
                    ? "🌙"
                    : "☀️"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => handleThemeChange("light")}
                    active={currentTheme === "light"}
                  >
                    ☀️ Light
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleThemeChange("dark")}
                    active={currentTheme === "dark"}
                  >
                    🌙 Dark
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleThemeChange("auto")}
                    active={currentTheme === "auto"}
                  >
                    🌓 Auto
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item as={Link} to="/settings">
                    ⚙️ Settings
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container fluid>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Outlet />
          </motion.div>
        </Container>
      </Container>
    </>
  );
}
