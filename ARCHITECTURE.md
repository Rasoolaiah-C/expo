# Architecture & System Design

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                    │
├─────────────────────────────────────────────────────────────────────────┤
│  Postman │ Web Browser │ Mobile App │ CLI Tools │ Third-party Services  │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                    ┌────────────▼─────────────┐
                    │   HTTPS / REST API       │
                    │  (Port 80/443)           │
                    └────────────┬─────────────┘
                                 │
┌─────────────────────────────────▼─────────────────────────────────────┐
│                    LOAD BALANCER / API GATEWAY                        │
│              (Kubernetes Service - LoadBalancer)                      │
└─────────────────────────────────┬─────────────────────────────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
     ┌────▼──────────┐   ┌──────▼──────────┐   ┌──────▼──────────┐
     │  Pod 1        │   │  Pod 2         │   │  Pod 3         │
     │ (API Server)  │   │ (API Server)   │   │ (API Server)   │
     └────┬──────────┘   └──────┬──────────┘   └──────┬──────────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
        ┌────────────────────────▼────────────────────────┐
        │     Kubernetes Service - MongoDB (Headless)    │
        └────────────────────────┬────────────────────────┘
                                 │
        ┌────────────────────────▼────────────────────────┐
        │      MongoDB StatefulSet (Primary Replica)     │
        │                                                 │
        │  ┌─────────────────────────────────────────┐   │
        │  │  experiment-db (5GB PersistentVolume)  │   │
        │  └─────────────────────────────────────────┘   │
        └─────────────────────────────────────────────────┘
```

## Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Express.js Application                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         HTTP Request Processing Layer               │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────────┐ │   │
│  │  │ Express     │  │ Body Parser  │  │ CORS       │ │   │
│  │  │ Router      │  │ (JSON Limit) │  │ Handler    │ │   │
│  │  └─────────────┘  └──────────────┘  └────────────┘ │   │
│  └────────────────────────┬─────────────────────────────┘   │
│                           │                                 │
│  ┌────────────────────────▼─────────────────────────────┐   │
│  │       Middleware Pipeline                           │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │   │
│  │  │ Logger   │→ │Validator │→ │ Error Handler   │  │   │
│  │  │ Middleware │ │Middleware │ │ Middleware      │  │   │
│  │  └──────────┘  └──────────┘  └──────────────────┘  │   │
│  └────────────────────────┬─────────────────────────────┘   │
│                           │                                 │
│  ┌────────────────────────▼─────────────────────────────┐   │
│  │         Routes & Controllers Layer                  │   │
│  │  ┌────────────────────────────────────────────────┐ │   │
│  │  │ Health Endpoints                              │ │   │
│  │  │ └─ GET /api/health/health                     │ │   │
│  │  │ └─ GET /api/health/info                       │ │   │
│  │  ├────────────────────────────────────────────────┤ │   │
│  │  │ Experiment CRUD Endpoints                    │ │   │
│  │  │ ├─ POST   /api/v1/experiments                │ │   │
│  │  │ ├─ GET    /api/v1/experiments                │ │   │
│  │  │ ├─ GET    /api/v1/experiments/:id            │ │   │
│  │  │ ├─ PUT    /api/v1/experiments/:id            │ │   │
│  │  │ ├─ DELETE /api/v1/experiments/:id            │ │   │
│  │  │ └─ GET    /api/v1/experiments/stats/overview │ │   │
│  │  └────────────────────────────────────────────────┘ │   │
│  └────────────────────────┬─────────────────────────────┘   │
│                           │                                 │
│  ┌────────────────────────▼─────────────────────────────┐   │
│  │    Business Logic & Validation Layer               │   │
│  │  ┌────────────────────────────────────────────────┐ │   │
│  │  │ experimentController                          │ │   │
│  │  │ ├─ createExperiment()                         │ │   │
│  │  │ ├─ getAllExperiments()                        │ │   │
│  │  │ ├─ getExperimentById()                        │ │   │
│  │  │ ├─ updateExperiment()                         │ │   │
│  │  │ ├─ deleteExperiment()                         │ │   │
│  │  │ └─ getExperimentStats()                       │ │   │
│  │  └────────────────────────────────────────────────┘ │   │
│  └────────────────────────┬─────────────────────────────┘   │
│                           │                                 │
│  ┌────────────────────────▼─────────────────────────────┐   │
│  │        Data Access Layer (Mongoose ODM)            │   │
│  │  ┌────────────────────────────────────────────────┐ │   │
│  │  │ Experiment Schema & Model                     │ │   │
│  │  │ ├─ Validation Rules                           │ │   │
│  │  │ ├─ Indexes (status, researcher, tags)        │ │   │
│  │  │ ├─ Hooks (pre/post save)                      │ │   │
│  │  │ └─ Custom Methods                             │ │   │
│  │  └────────────────────────────────────────────────┘ │   │
│  └────────────────────────┬─────────────────────────────┘   │
│                                                              │
└───────────────────────────┬──────────────────────────────────┘
                            │
           ┌────────────────▼──────────────────┐
           │     MongoDB Connection            │
           │  (Connection Pooling)             │
           └────────────────┬──────────────────┘
                            │
           ┌────────────────▼──────────────────┐
           │    MongoDB Database               │
           │  (experiment-db)                  │
           └───────────────────────────────────┘
```

## Deployment Pipeline

```
┌────────────────────────────────────────────────────────────────┐
│                   Developer Workflow                           │
├────────────────────────────────────────────────────────────────┤
│  1. Create feature branch                                      │
│  2. Make changes locally                                       │
│  3. Run tests locally                                          │
│  4. Commit and push                                            │
│  5. Create Pull Request                                        │
│  6. Request review                                             │
└──────────────────────────┬───────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│              GitHub Actions CI/CD Pipeline                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  STAGE 1: TEST & VALIDATE                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  ✓ Checkout code                                         │  │
│  │  ✓ Setup Node.js 18                                      │  │
│  │  ✓ Install dependencies (npm ci)                         │  │
│  │  ✓ Run ESLint                                            │  │
│  │  ✓ Run Jest tests                                        │  │
│  │  ✓ Upload coverage reports                              │  │
│  │  ✓ Code quality checks (SonarQube)                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                        │                                        │
│                   All checks pass?                              │
│                   YES ↓    NO → Notify developer                │
│                                                                  │
│  STAGE 2: BUILD CONTAINER (Push only)                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  ✓ Setup Docker Buildx                                   │  │
│  │  ✓ Login to GitHub Container Registry                   │  │
│  │  ✓ Build Docker image                                   │  │
│  │  ✓ Tag with branch/version                              │  │
│  │  ✓ Push to ghcr.io                                      │  │
│  │  ✓ Build cache optimization                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                        │                                        │
│  STAGE 3: DEPLOY TO K8S (Main branch only)                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  ✓ Setup kubectl                                         │  │
│  │  ✓ Configure kubeconfig from secrets                     │  │
│  │  ✓ Apply namespace                                       │  │
│  │  ✓ Apply ConfigMaps & Secrets                            │  │
│  │  ✓ Deploy MongoDB StatefulSet                            │  │
│  │  ✓ Deploy API Deployment                                 │  │
│  │  ✓ Apply Services & LoadBalancer                         │  │
│  │  ✓ Apply HPA & PDB                                       │  │
│  │  ✓ Wait for rollout (5min timeout)                       │  │
│  │  ✓ Verify deployment health                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                        │                                        │
│              Deployment successful!                             │
│              API ready at LoadBalancer IP                       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Kubernetes Deployment Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│              Kubernetes Cluster - experiment-backend Namespace     │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │           LoadBalancer Service (Port 80)                  │   │
│  │                    ↓                                        │   │
│  │            ClusterIP: experiment-api-service              │   │
│  └────────────────────────────────────────────────────────────┘   │
│                         │                                         │
│         ┌───────────────┼───────────────┐                         │
│         │               │               │                         │
│    ┌────▼────┐    ┌────▼────┐    ┌────▼────┐                     │
│    │ Pod 1   │    │ Pod 2   │    │ Pod 3   │                     │
│    │ API     │    │ API     │    │ API     │  (HPA: 2-10 pods)   │
│    │ Port:  │    │ Port:   │    │ Port:   │                     │
│    │ 3000   │    │ 3000    │    │ 3000    │                      │
│    │        │    │         │    │         │                      │
│    │┌──────┐│    │┌──────┐ │    │┌──────┐ │                     │
│    ││Probes││    ││Probes│ │    ││Probes│ │                     │
│    │├─Live ├┤    │├─Live ├─┤    │├─Live ├─┤                     │
│    ││Ready ││    ││Ready │ │    ││Ready │ │                      │
│    │└──────┘│    │└──────┘ │    │└──────┘ │                     │
│    └─────┬──┘    └─────┬───┘    └─────┬──┘                      │
│          │             │              │                          │
│          └─────────────┼──────────────┘                           │
│                        │                                         │
│    ┌───────────────────▼────────────────────┐                    │
│    │   ClusterIP Service: mongodb-service   │                    │
│    │   (Headless - used by StatefulSet)     │                    │
│    └───────────────────┬────────────────────┘                    │
│                        │                                         │
│    ┌───────────────────▼────────────────────┐                    │
│    │    StatefulSet: mongodb                │                    │
│    │    (Replicas: 1)                       │                    │
│    │                                         │                    │
│    │  ┌──────────────────────────────────┐  │                    │
│    │  │ Pod: mongodb-0                   │  │                    │
│    │  │ Container: MongoDB 6.0-Alpine    │  │                    │
│    │  │ Port: 27017                      │  │                    │
│    │  │ PVC: 5GB PersistentVolume        │  │                    │
│    │  │ ├─ Health Check (TCP 27017)     │  │                    │
│    │  │ └─ Data persisted across restarts│  │                    │
│    │  └──────────────────────────────────┘  │                    │
│    └─────────────────────────────────────────┘                    │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │              Other K8s Resources                            │  │
│  │  ├─ ConfigMap: experiment-api-config                       │  │
│  │  ├─ Secret: experiment-api-secrets                         │  │
│  │  ├─ ServiceAccount: experiment-api                         │  │
│  │  ├─ Role & RoleBinding: Pod access                         │  │
│  │  ├─ HPA: Auto-scale based on metrics                       │  │
│  │  ├─ PDB: Pod Disruption Budget (min 1)                     │  │
│  │  └─ Job: Database migration/seeding                        │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌─────────────┐
│   Client    │
│  (Postman/  │
│   Browser)  │
└──────┬──────┘
       │ HTTP Request
       │ {title, description, ...}
       │
┌──────▼──────────────────────────────────┐
│      Express.js Server                  │
├─────────────────────────────────────────┤
│                                          │
│  1. Parse JSON Body                      │
│  2. CORS Check                           │
│  3. Route Matching                       │
│  └─→ POST /api/v1/experiments           │
│                                          │
└──────┬──────────────────────────────────┘
       │
┌──────▼──────────────────────────────────┐
│    Middleware Pipeline                   │
├─────────────────────────────────────────┤
│                                          │
│  1. Logger Middleware                    │
│     → Logs: [timestamp] POST /api/v1... │
│                                          │
│  2. Validation Middleware                │
│     → Joi Schema Validation              │
│     → Check: title, description, etc.    │
│     → If invalid → Error Response 400    │
│                                          │
│  3. Route Handler (Controller)           │
│     → experimentController.create()      │
│                                          │
└──────┬──────────────────────────────────┘
       │
┌──────▼──────────────────────────────────┐
│  Business Logic & Data Processing       │
├─────────────────────────────────────────┤
│                                          │
│  1. Create Experiment Model              │
│     new Experiment({...validated data})  │
│                                          │
│  2. Run Mongoose Validations             │
│     → Schema validators                  │
│     → Custom validators                  │
│     → If invalid → Error                 │
│                                          │
│  3. Call save()                          │
│     → Triggers pre-save hooks            │
│                                          │
└──────┬──────────────────────────────────┘
       │
┌──────▼──────────────────────────────────┐
│      MongoDB Database                    │
├─────────────────────────────────────────┤
│                                          │
│  1. Insert Document                      │
│     → Generate _id                       │
│     → Add timestamps                     │
│     → Update indexes                     │
│                                          │
│  2. Persist to Disk                      │
│     → Write to storage engine            │
│     → Write-ahead logging                │
│                                          │
└──────┬──────────────────────────────────┘
       │
┌──────▼──────────────────────────────────┐
│   Response Processing                    │
├─────────────────────────────────────────┤
│                                          │
│  1. Build Response Object                │
│     {                                    │
│       success: true,                     │
│       message: "Created successfully",   │
│       data: {_id, title, ...}            │
│     }                                    │
│                                          │
│  2. Set HTTP Status: 201 Created         │
│                                          │
│  3. Set Content-Type: application/json  │
│                                          │
│  4. Send Response                        │
│                                          │
└──────┬──────────────────────────────────┘
       │ JSON Response
       │ {success: true, data: {...}}
       │
┌──────▼────────────┐
│  Client Receives  │
│  Response         │
│  & Updates UI     │
└───────────────────┘
```

## Database Schema & Indexing

```
┌─────────────────────────────────────────────────────────────┐
│                   Experiment Collection                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Document Structure (MongoDB)                         │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ _id: ObjectId (Primary Key)                         │   │
│  │ title: String (100 char max) - Required             │   │
│  │ description: String (1000 char max) - Required      │   │
│  │ category: String - Enum                             │   │
│  │ status: String - Enum                               │   │
│  │ startDate: Date - Required                          │   │
│  │ endDate: Date (nullable)                            │   │
│  │ budget: Number                                      │   │
│  │ researcher: String - Required                       │   │
│  │ priority: String - Enum                             │   │
│  │ team: [                                              │   │
│  │   { name: String, role: String, email: String }     │   │
│  │ ]                                                    │   │
│  │ objectives: [String]                                │   │
│  │ methodology: String                                 │   │
│  │ expectedOutcomes: String                            │   │
│  │ results: {                                           │   │
│  │   status: String,                                   │   │
│  │   findings: String,                                 │   │
│  │   metrics: Mixed (any structure)                    │   │
│  │ }                                                    │   │
│  │ tags: [String]                                      │   │
│  │ notes: String                                       │   │
│  │ customFields: Mixed                                 │   │
│  │ createdAt: Date (auto)                              │   │
│  │ updatedAt: Date (auto)                              │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Indexes (Performance Optimization)                  │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ 1. {status: 1, createdAt: -1}                       │   │
│  │    → Speed up: List by status, sorted by date       │   │
│  │                                                      │   │
│  │ 2. {researcher: 1}                                   │   │
│  │    → Speed up: Filter by researcher name            │   │
│  │                                                      │   │
│  │ 3. {tags: 1}                                         │   │
│  │    → Speed up: Search by tags                       │   │
│  │                                                      │   │
│  │ 4. {category: 1}                                     │   │
│  │    → Speed up: Filter by category                   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Query Examples & Index Usage                        │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ Q1: Find ongoing experiments by date                │   │
│  │     db.experiments.find(                            │   │
│  │       {status: "ongoing"}                           │   │
│  │     ).sort({createdAt: -1})                         │   │
│  │     → Uses index 1                                  │   │
│  │                                                      │   │
│  │ Q2: Get experiments by researcher                   │   │
│  │     db.experiments.find(                            │   │
│  │       {researcher: "Dr. Sarah"}                     │   │
│  │     )                                               │   │
│  │     → Uses index 2                                  │   │
│  │                                                      │   │
│  │ Q3: Find experiments with tag 'ml'                  │   │
│  │     db.experiments.find(                            │   │
│  │       {tags: "ml"}                                  │   │
│  │     )                                               │   │
│  │     → Uses index 3                                  │   │
│  │                                                      │   │
│  │ Q4: Aggregate stats by status                       │   │
│  │     db.experiments.aggregate([                      │   │
│  │       {$group: {_id: "$status", count: {$sum:1}}}  │   │
│  │     ])                                              │   │
│  │     → Uses index 1 (status field)                   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Error Handling Flow

```
┌──────────────────────────────────┐
│    Request Processing Error      │
└────────────┬─────────────────────┘
             │
      ┌──────▼──────────┐
      │ Error Type?     │
      └────┬────┬────┬──┘
           │    │    │
    ┌──────┘    │    └──────┐
    │           │           │
    │      ┌────▼────┐      │
    │      │Mongoose │      │
    │      │Validation│     │
    │      │Error    │      │
    │      └────┬────┘      │
    │           │ Return 400
    │      {error: "Validation...",
    │       details: [...]}
    │
┌───▼────────┐    ┌─────────────┐    ┌────────────┐
│Joi         │    │Mongoose     │    │HTTP Status │
│Validation  │    │Cast Error   │    │Error       │
│Error       │    │             │    │            │
├────────────┤    ├─────────────┤    ├────────────┤
│Return 400  │    │Return 400   │    │Return 5xx  │
└────────────┘    └─────────────┘    └────────────┘
```

---

## Performance Considerations

### Database Optimization
- **Indexes**: Reduce query time by 100x+
- **Connection Pooling**: Default 5-10 connections
- **Query Optimization**: Use projection to limit fields
- **Aggregation**: Server-side computation

### API Performance
- **Pagination**: Limit default 10, max 100
- **Response Compression**: Enabled by default
- **Caching**: Can be added at application level
- **Rate Limiting**: Can be implemented per route

### Kubernetes Optimization
- **HPA**: Auto-scales 2-10 pods based on CPU/memory
- **Resource Limits**: CPU 500m, Memory 512Mi per pod
- **Pod Anti-Affinity**: Spread pods across nodes
- **Graceful Shutdown**: 15s pre-stop hook

---

## Monitoring & Observability

### Logging
- **Application Logs**: Morgan HTTP logger
- **Error Logs**: Centralized error handler
- **Kubernetes Logs**: `kubectl logs -f deployment/`

### Health Checks
- **Liveness Probe**: HTTP GET /api/health/health (30s interval)
- **Readiness Probe**: HTTP GET /api/health/health (5s interval)
- **Startup Probe**: Optional for slow startups

### Metrics (To be implemented)
- **Application**: Response time, throughput, error rate
- **Infrastructure**: CPU, memory, disk usage
- **Database**: Query performance, connection count

---

## Disaster Recovery

### Backup Strategy
```bash
# Daily MongoDB backup
0 2 * * * docker-compose exec mongodb mongodump --out /backups/$(date +%Y%m%d)

# Weekly data snapshot
0 3 * * 0 kubectl exec -n experiment-backend mongodb-0 -- mongodump --archive=/snapshots/$(date +%Y%m%d).archive
```

### Recovery Procedures
```bash
# Restore from backup
mongorestore --archive=backup.archive

# Rebuild deployment
kubectl delete deployment experiment-api -n experiment-backend
kubectl apply -f kubernetes/deployment.yaml
```

---

This comprehensive architecture provides enterprise-grade reliability, scalability, and maintainability.
