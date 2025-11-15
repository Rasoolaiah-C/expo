# Experiment Backend - Setup & Deployment Guide

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 6.0+
- Docker & Docker Compose
- Git

### Local Development

```bash
# Clone repository
git clone https://github.com/yourusername/experiment-backend.git
cd experiment-backend

# Install dependencies
npm install

# Start services with Docker Compose
docker-compose up -d

# Run in development mode
npm run dev

# Run tests
npm test

# API available at: http://localhost:3000
```

### Using Docker

```bash
# Build production image
docker build -t experiment-backend:latest .

# Build development image
docker build -f Dockerfile.dev -t experiment-backend:dev .

# Run with docker-compose
docker-compose up

# Run production stack
docker-compose -f docker-compose.prod.yml up
```

## Kubernetes Deployment

### Prerequisites
- Kubernetes cluster (1.27+)
- kubectl configured
- Docker image pushed to registry

### Deploy to Cluster

```bash
# Create namespace and deploy all resources
kubectl apply -f kubernetes/

# Check deployment status
kubectl get all -n experiment-backend

# View logs
kubectl logs -f deployment/experiment-api -n experiment-backend

# Port forward to test locally
kubectl port-forward svc/experiment-api-service 8080:80 -n experiment-backend
# Then access: http://localhost:8080
```

### Scale Deployment

```bash
# Manual scaling
kubectl scale deployment experiment-api --replicas=5 -n experiment-backend

# HPA auto-scaling (uses metrics from metrics-server)
# Already configured to scale 2-10 replicas based on CPU/memory
```

### Monitor Deployment

```bash
# Check HPA status
kubectl get hpa -n experiment-backend

# Get deployment details
kubectl describe deployment experiment-api -n experiment-backend

# Stream logs
kubectl logs -f deployment/experiment-api -n experiment-backend --all-containers

# Watch events
kubectl get events -n experiment-backend --sort-by='.lastTimestamp'
```

## CI/CD Pipeline

### GitHub Actions Workflow

Automatic workflows on push:

1. **Test** (`ci-cd.yml`)
   - Runs lint checks
   - Executes unit and integration tests
   - Uploads coverage reports

2. **Build** 
   - Builds Docker image
   - Pushes to GitHub Container Registry

3. **Deploy**
   - Applies to Kubernetes cluster
   - Performs health checks

### Manual Workflows

```bash
# Trigger rollback via GitHub UI
# or use CLI:
gh workflow run rollback.yml -f environment=production
```

### Setup Secrets

Add to GitHub repository settings:
```
KUBE_CONFIG: base64-encoded kubeconfig file
SONAR_TOKEN: SonarQube token
```

## API Testing

### Postman

1. Import `postman/collection.json`
2. Select environment (`environment-local.json` or `environment-prod.json`)
3. Run requests

### CLI Testing

```bash
# Health check
curl http://localhost:3000/api/health/health

# Create experiment
curl -X POST http://localhost:3000/api/v1/experiments \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test",
    "description": "Test experiment",
    "category": "research",
    "startDate": "2024-01-01T00:00:00Z",
    "researcher": "John Doe"
  }'

# Get all experiments
curl http://localhost:3000/api/v1/experiments

# Get by ID
curl http://localhost:3000/api/v1/experiments/{id}

# Update
curl -X PUT http://localhost:3000/api/v1/experiments/{id} \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'

# Delete
curl -X DELETE http://localhost:3000/api/v1/experiments/{id}

# Statistics
curl http://localhost:3000/api/v1/experiments/stats/overview
```

## Database Management

### MongoDB

```bash
# Access MongoDB shell in container
docker-compose exec mongodb mongosh experiment-db

# Inside mongosh:
> db.experiments.find()
> db.experiments.countDocuments()
> db.experiments.deleteMany({})
```

### Backup & Restore

```bash
# Backup
docker-compose exec mongodb mongodump --out /backup

# Restore
docker-compose exec mongodb mongorestore /backup
```

## Logging & Monitoring

### View Logs

```bash
# Docker container logs
docker-compose logs -f api

# Kubernetes pod logs
kubectl logs -f pod/experiment-api-xxx -n experiment-backend

# Stream multiple pods
kubectl logs -f deployment/experiment-api -n experiment-backend --all-containers=true
```

### Debugging

```bash
# Execute command in running container
docker-compose exec api npm run lint

# Interactive shell
kubectl exec -it pod/experiment-api-xxx -n experiment-backend -- /bin/sh

# Port debugging to local port
kubectl port-forward pod/experiment-api-xxx 9229:9229 -n experiment-backend
```

## Troubleshooting

### Common Issues

**API won't start**
```bash
# Check logs
docker-compose logs api

# Verify MongoDB is healthy
docker-compose logs mongodb
```

**MongoDB connection fails**
```bash
# Check MongoDB service
docker-compose ps

# Verify connection string
# Should be: mongodb://mongodb:27017/experiment-db
```

**Tests failing**
```bash
# Run with verbose output
npm test -- --verbose

# Run specific test file
npm test -- tests/experiment.test.js
```

**Kubernetes pod crashing**
```bash
# Check events
kubectl describe pod POD_NAME -n experiment-backend

# Check resource limits
kubectl top pod -n experiment-backend
```

## Security

- Use environment variables for sensitive data
- Never commit `.env` file
- Rotate secrets regularly
- Use RBAC in Kubernetes
- Enable network policies
- Use resource quotas

## Performance Tuning

### Database Optimization
- Indexes are already created on frequently queried fields
- Use pagination with `limit` and `page` parameters
- Filter queries efficiently

### Application Optimization
- Enable compression middleware
- Cache responses where applicable
- Use connection pooling

### Kubernetes Optimization
- HPA configured for automatic scaling
- Pod disruption budgets configured
- Resource requests/limits set

## Maintenance

### Regular Tasks

```bash
# Update dependencies
npm update

# Audit security
npm audit

# Prune Docker resources
docker system prune

# Clean Kubernetes resources
kubectl delete pod --field-selector status.phase=Failed -n experiment-backend
```

### Backup Strategy

```bash
# Backup database daily
0 2 * * * docker-compose exec mongodb mongodump --out /backups/$(date +%Y%m%d)
```

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "feat: description"`
3. Push to branch: `git push origin feature/your-feature`
4. Open Pull Request

## License

MIT
