group "default" {
  targets = ["backend", "frontend"]
}

target "backend" {
  context = "./backend"
  dockerfile = "Dockerfile"
  tags = ["pms-backend:latest"]
}

target "frontend" {
  context = "./frontend"
  dockerfile = "Dockerfile"
  tags = ["pms-frontend:latest"]
  args = {
    REACT_APP_BACKEND_API_BASE_URL = "${REACT_APP_BACKEND_API_BASE_URL}"
    REACT_APP_SYSTEM_TITLE = "${REACT_APP_SYSTEM_TITLE}"
  }
}
