import { useLoaderData, Link } from "react-router-dom";
import { Card, Row, Col, Form, Badge } from "react-bootstrap";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Users as UsersIcon,
  Building,
  Mail,
  Phone,
  Globe,
  MapPin,
  Github,
  Linkedin,
} from "lucide-react";
import profileImage from "../assets/myCard/198758288.jpg";
import type { User } from "../types/api";

export default function Users() {
  const users = useLoaderData() as User[];
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "email" | "company">("name");
  const [filterBy, setFilterBy] = useState("all");

  // Search and filter logic
  const filteredUsers = useMemo(() => {
    // Kendi profilimi en başa ekle
    const myProfile: User = {
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
        geo: { lat: "", lng: "" },
      },
      company: {
        name: "OnlyJS",
        catchPhrase: "React Developer",
        bs: "Frontend Development",
      },
    };

    // Tüm kullanıcıları birleştir (kendi profilim en başta)
    const allUsers = [myProfile, ...users];
    let filtered = allUsers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.address.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "email":
          return a.email.localeCompare(b.email);
        case "company":
          return a.company.name.localeCompare(b.company.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [users, searchTerm, sortBy]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 24,
      },
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  const getEmailDomain = (email: string) => {
    return email.split("@")[1];
  };

  const handleFilterAll = () => setFilterBy("all");
  const handleFilterDomain = (domain: string) => () => setFilterBy(domain);

  const uniqueDomains = useMemo(() => {
    // Kendi profilim dahil tüm kullanıcıların domain'lerini al
    const myProfile = {
      email: "gunelbugrahann@gmail.com",
    };
    const allUsers = [myProfile, ...users];
    const domains = allUsers.map((user) => getEmailDomain(user.email));
    return [...new Set(domains)];
  }, [users]);

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      {/* Header Section */}
      <motion.div
        className="mb-5 users-directory-container"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-4">
          <h1 className="display-4 fw-bold bg-gradient p-4 rounded-3 gradient-card users-directory-title">
            <UsersIcon className="me-3 users-title-icon" size={48} />
            Users Directory
          </h1>
          <p className="lead text-muted">
            Discover and connect with {users.length} amazing users
          </p>
        </div>

        {/* Search and Filter Section */}
        <Card className="animated-card mb-4 users-search-card">
          <Card.Body>
            <Row className="g-3 align-items-end">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Search Users</Form.Label>
                  <div className="search-container">
                    <Form.Control
                      type="text"
                      placeholder="Search by name, email, company, or city..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                    <Search className="search-icon" size={20} />
                  </div>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Sort By</Form.Label>
                  <Form.Select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value as "name" | "email" | "company")
                    }
                    className="animated-card"
                  >
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                    <option value="company">Company</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={3}>
                <div className="text-end">
                  <Badge bg="primary" className="fs-6 p-2">
                    {filteredUsers.length} users found
                  </Badge>
                </div>
              </Col>
            </Row>

            {/* Domain Filters */}
            <div className="mt-3">
              <small className="text-muted fw-semibold">
                Filter by domain:
              </small>
              <div className="mt-2">
                <button
                  type="button"
                  className="btn btn-primary btn-sm filter-btn"
                  onClick={handleFilterAll}
                >
                  All
                </button>
                {uniqueDomains.map((domain) => (
                  <button
                    key={domain}
                    type="button"
                    className="btn btn-outline-secondary btn-sm filter-btn"
                    onClick={handleFilterDomain(domain)}
                  >
                    @{domain}
                  </button>
                ))}
              </div>
            </div>
          </Card.Body>
        </Card>
      </motion.div>

      {/* Users Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={searchTerm + sortBy + filterBy}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <Row className="g-4">
            {filteredUsers
              .filter(
                (user) =>
                  filterBy === "all" || getEmailDomain(user.email) === filterBy
              )
              .map((user, index) => (
                <Col key={user.id} md={6} lg={4} xl={3}>
                  <motion.div
                    variants={cardVariants}
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`h-100 animated-card ${
                        index % 3 === 0
                          ? "gradient-card"
                          : index % 3 === 1
                          ? "glass-card"
                          : ""
                      }`}
                    >
                      <Card.Body className="d-flex flex-column">
                        {/* User Avatar */}
                        <div className="text-center mb-3">
                          {user.id === 0 ? (
                            // Kendi profilim için özel avatar
                            <div
                              className="rounded-circle mx-auto d-flex align-items-center justify-content-center"
                              style={{
                                width: "80px",
                                height: "80px",
                                backgroundImage: `url(${profileImage})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                border: "3px solid #ffd700",
                              }}
                            />
                          ) : (
                            // Diğer kullanıcılar için normal avatar
                            <div
                              className="rounded-circle mx-auto d-flex align-items-center justify-content-center"
                              style={{
                                width: "80px",
                                height: "80px",
                                background: `linear-gradient(135deg, ${
                                  index % 2 === 0
                                    ? "#667eea, #764ba2"
                                    : "#f093fb, #f5576c"
                                })`,
                                color: "white",
                                fontSize: "24px",
                                fontWeight: "bold",
                              }}
                            >
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .substring(0, 2)}
                            </div>
                          )}
                        </div>

                        {/* User Info */}
                        <Card.Title
                          className={`text-center mb-2 ${
                            index % 3 === 0 ? "text-white" : ""
                          }`}
                        >
                          {user.name}
                        </Card.Title>
                        <Card.Subtitle
                          className={`text-center mb-3 ${
                            index % 3 === 0 ? "text-white-50" : "text-muted"
                          } card-username`}
                        >
                          @{user.username}
                        </Card.Subtitle>

                        <div className="flex-grow-1">
                          <div
                            className={`small mb-2 d-flex align-items-center ${
                              index % 3 === 0 ? "text-white-50" : "text-muted"
                            }`}
                          >
                            <Mail size={14} className="me-2" />
                            <span style={{ wordBreak: "break-all" }}>
                              {user.email}
                            </span>
                          </div>
                          <div
                            className={`small mb-2 d-flex align-items-center ${
                              index % 3 === 0 ? "text-white-50" : "text-muted"
                            }`}
                          >
                            <Phone size={14} className="me-2" />
                            <span>{user.phone}</span>
                          </div>
                          {user.id === 0 ? (
                            // Kendi profilim için özel linkler
                            <>
                              <div
                                className={`small mb-2 d-flex align-items-center ${
                                  index % 3 === 0
                                    ? "text-white-50"
                                    : "text-muted"
                                }`}
                              >
                                <Github size={14} className="me-2" />
                                <a
                                  href="https://github.com/gunelbugrahan"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={
                                    index % 3 === 0
                                      ? "text-white-50"
                                      : "text-muted"
                                  }
                                >
                                  github.com/gunelbugrahan
                                </a>
                              </div>
                              <div
                                className={`small mb-2 d-flex align-items-center ${
                                  index % 3 === 0
                                    ? "text-white-50"
                                    : "text-muted"
                                }`}
                              >
                                <Linkedin size={14} className="me-2" />
                                <a
                                  href="https://www.linkedin.com/in/bu%C4%9Frahan-g%C3%BCnel-1b8401352/"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={
                                    index % 3 === 0
                                      ? "text-white-50"
                                      : "text-muted"
                                  }
                                >
                                  LinkedIn Profile
                                </a>
                              </div>
                            </>
                          ) : (
                            // Diğer kullanıcılar için normal website
                            <div
                              className={`small mb-2 d-flex align-items-center ${
                                index % 3 === 0 ? "text-white-50" : "text-muted"
                              }`}
                            >
                              <Globe size={14} className="me-2" />
                              <span>{user.website}</span>
                            </div>
                          )}
                          <div
                            className={`small mb-2 d-flex align-items-center ${
                              index % 3 === 0 ? "text-white-50" : "text-muted"
                            }`}
                          >
                            <Building size={14} className="me-2" />
                            <span>{user.company.name}</span>
                          </div>
                          <div
                            className={`small mb-3 d-flex align-items-center ${
                              index % 3 === 0 ? "text-white-50" : "text-muted"
                            }`}
                          >
                            <MapPin size={14} className="me-2" />
                            <span>{user.address.city}</span>
                          </div>
                        </div>

                        <div className="mt-auto">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Link
                              to={`/users/${user.id}`}
                              className={`btn w-100 fw-semibold ${
                                index % 3 === 0 ? "btn-light" : "btn-primary"
                              }`}
                            >
                              View Profile
                            </Link>
                          </motion.div>
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
          </Row>
        </motion.div>
      </AnimatePresence>

      {/* No Results */}
      {filteredUsers.filter(
        (user) => filterBy === "all" || getEmailDomain(user.email) === filterBy
      ).length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-5"
        >
          <UsersIcon size={64} className="text-muted mb-3" />
          <h4 className="text-muted">No users found</h4>
          <p className="text-muted">Try adjusting your search criteria</p>
        </motion.div>
      )}
    </motion.div>
  );
}
