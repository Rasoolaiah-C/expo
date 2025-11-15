# Experiment Data Backend

A full-stack backend application for managing experiment data with REST APIs, Docker containerization, Kubernetes deployment, and CI/CD automation.

## Features

- **REST API**: Full CRUD operations for experiment data
- **MongoDB**: NoSQL database for flexible data storage
- **Docker**: Container support for easy deployment
- **Kubernetes**: Orchestration and scaling
- **CI/CD**: Automated testing and deployment with GitHub Actions
- **Testing**: Jest unit and integration tests
- **API Documentation**: Postman collection

## Project Structure

```
experiment-backend/
├── src/
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── controllers/      # Route handlers
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utility functions
│   └── index.js          # Application entry point
├── tests/               # Test files
├── kubernetes/          # K8s manifests
├── postman/             # Postman collection
├── .github/workflows/   # CI/CD pipeline
├── Dockerfile           # Container image
├── docker-compose.yml   # Local development environment
└── package.json         # Dependencies
```

## Prerequisites

- Node.js 16+
- MongoDB 5+
- Docker & Docker Compose
- Kubernetes cluster (for production)
- Git & GitHub

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start MongoDB and application**:
   ```bash
   docker-compose up -d
   npm run dev
   ```

3. **API will be available at**: `http://localhost:3000`

4. **Run tests**:
   ```bash
   npm test
   ```

## API Endpoints

### Experiments

- `POST /api/v1/experiments` - Create experiment
- `GET /api/v1/experiments` - List all experiments
- `GET /api/v1/experiments/:id` - Get experiment by ID
- `PUT /api/v1/experiments/:id` - Update experiment
- `DELETE /api/v1/experiments/:id` - Delete experiment

## Docker

Build and run:
```bash
docker build -t experiment-backend:latest .
docker run -p 3000:3000 --env-file .env experiment-backend:latest
```

## Kubernetes Deployment

Deploy to cluster:
```bash
kubectl apply -f kubernetes/
```

## CI/CD Pipeline

GitHub Actions automatically:
- Runs tests on push
- Builds Docker image
- Pushes to registry
- Deploys to Kubernetes cluster

## Testing with Postman

Import the Postman collection from `postman/collection.json` to test all endpoints.

## API Documentation

Detailed API docs available in Postman collection.

## License

MIT
