# Jenkins CI/CD Pipeline Template

A production-ready Jenkins pipeline configuration for Java Spring Boot projects. Demonstrates DevOps automation, multi-stage builds, and Docker integration.

## 📋 Features

- ✅ Multi-stage pipeline (Build → Test → Package → Deploy)
- ✅ Docker-based builds for consistency
- ✅ Automated testing with JUnit reports
- ✅ SonarQube integration (optional)
- ✅ Slack/Email notifications
- ✅ Environment-specific deployments (dev/staging/prod)

## 🚀 Quick Start

1. Copy `Jenkinsfile` to your Spring Boot project root
2. Configure Jenkins with required credentials
3. Create a new Pipeline job pointing to your repo

## 📁 Project Structure

```
.
├── Jenkinsfile              # Main pipeline definition
├── docker/
│   └── Dockerfile           # Build container
├── scripts/
│   ├── build.sh             # Build script
│   └── deploy.sh            # Deployment script
└── README.md
```

## 🔧 Pipeline Stages

| Stage | Description |
|-------|-------------|
| **Checkout** | Clone repository |
| **Build** | Compile with Maven/Gradle |
| **Test** | Run unit & integration tests |
| **Code Analysis** | SonarQube scan (optional) |
| **Package** | Build Docker image |
| **Deploy** | Push to registry & deploy |

## 📞 Author

**Santanu Dhali** - Full-Stack Java & DevOps Engineer  
[GitHub](https://github.com/santanudhali) | [LinkedIn](https://linkedin.com/in/santanu-dhali)
