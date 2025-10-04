import { useState, useEffect } from "react";
import { Card, Form, Row, Col, Alert, Badge } from "react-bootstrap";
import {
  UserPreferencesService,
  RecentViewsService,
  ThemeService,
  LocalStorageService,
  type UserPreferences,
  type RecentView,
} from "../services/localStorage";

export default function Settings() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: "light",
    itemsPerPage: 12,
    autoPlayImages: true,
    showNotifications: true,
    language: "en",
  });

  const [recentViews, setRecentViews] = useState<RecentView[]>([]);
  const [storageSize, setStorageSize] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Load current preferences
    setPreferences(UserPreferencesService.getPreferences());
    setRecentViews(RecentViewsService.getRecentViews());
    setStorageSize(LocalStorageService.getStorageSize());
  }, []);

  const handlePreferenceChange = (
    key: keyof UserPreferences,
    value: UserPreferences[keyof UserPreferences]
  ) => {
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
    UserPreferencesService.setPreferences({ [key]: value });

    // Apply theme immediately if changed
    if (key === "theme") {
      ThemeService.setTheme(value as "light" | "dark" | "auto");
    }

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const clearAllData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all stored data? This cannot be undone."
      )
    ) {
      LocalStorageService.clear();
      setPreferences(UserPreferencesService.getPreferences());
      setRecentViews([]);
      setStorageSize(0);
    }
  };

  const clearRecentViews = () => {
    RecentViewsService.clearRecentViews();
    setRecentViews([]);
    setStorageSize(LocalStorageService.getStorageSize());
  };

  const resetPreferences = () => {
    UserPreferencesService.resetPreferences();
    setPreferences(UserPreferencesService.getPreferences());
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div>
      <h1 className="mb-4">Settings</h1>

      {showSuccess && (
        <Alert variant="success" className="mb-4">
          Settings saved successfully!
        </Alert>
      )}

      <Row>
        <Col lg={8}>
          {/* User Preferences */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">User Preferences</h5>
            </Card.Header>
            <Card.Body>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Theme</Form.Label>
                      <Form.Select
                        value={preferences.theme}
                        onChange={(e) =>
                          handlePreferenceChange("theme", e.target.value)
                        }
                      >
                        <option value="light">☀️ Light</option>
                        <option value="dark">🌙 Dark</option>
                        <option value="auto">🌓 Auto</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Items per Page</Form.Label>
                      <Form.Select
                        value={preferences.itemsPerPage}
                        onChange={(e) =>
                          handlePreferenceChange(
                            "itemsPerPage",
                            parseInt(e.target.value)
                          )
                        }
                      >
                        <option value={6}>6</option>
                        <option value={12}>12</option>
                        <option value={24}>24</option>
                        <option value={48}>48</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Check
                      type="switch"
                      id="autoPlayImages"
                      label="Auto-play Images"
                      checked={preferences.autoPlayImages}
                      onChange={(e) =>
                        handlePreferenceChange(
                          "autoPlayImages",
                          e.target.checked
                        )
                      }
                      className="mb-3"
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Check
                      type="switch"
                      id="showNotifications"
                      label="Show Notifications"
                      checked={preferences.showNotifications}
                      onChange={(e) =>
                        handlePreferenceChange(
                          "showNotifications",
                          e.target.checked
                        )
                      }
                      className="mb-3"
                    />
                  </Col>
                </Row>

                <button className="btn btn-outline-warning" onClick={resetPreferences}>
                  Reset to Defaults
                </button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          {/* Storage Info */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Storage Information</h5>
            </Card.Header>
            <Card.Body>
              <p>
                <strong>Total Storage Used:</strong> {formatBytes(storageSize)}
              </p>
              <p>
                <strong>Recent Views:</strong>{" "}
                <Badge bg="info">{recentViews.length}</Badge>
              </p>
              <hr />
              <div className="d-grid gap-2">
                <button className="btn btn-outline-warning" onClick={clearRecentViews}>
                  Clear Recent Views
                </button>
                <button className="btn btn-outline-danger" onClick={clearAllData}>
                  Clear All Data
                </button>
              </div>
            </Card.Body>
          </Card>

          {/* Recent Views */}
          {recentViews.length > 0 && (
            <Card>
              <Card.Header>
                <h5 className="mb-0">Recent Views</h5>
              </Card.Header>
              <Card.Body>
                {recentViews.slice(0, 10).map((view) => (
                  <div
                    key={`${view.type}-${view.id}`}
                    className="mb-2 p-2 border rounded"
                  >
                    <small className="text-muted d-block">
                      {view.type.toUpperCase()}
                    </small>
                    <div style={{ fontSize: "14px" }}>{view.title}</div>
                    <small className="text-muted">
                      {new Date(view.timestamp).toLocaleDateString()}
                    </small>
                  </div>
                ))}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
}
