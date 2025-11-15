# API Reference

## Base URL

```
Local: http://localhost:3000
Production: https://api.experiment-backend.com
```

## API Versioning

Current version: `v1`

All endpoints use: `/api/v1/`

## Authentication

Currently no authentication required. In production, add JWT or OAuth2.

## Content Type

All requests and responses use `application/json`

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* resource */ }
}
```

### List Response

```json
{
  "success": true,
  "data": [ /* array of resources */ ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "details": [ /* optional error details */ ]
}
```

## Endpoints

### Health Endpoints

#### Health Check

```
GET /api/health/health
```

Returns API health status.

**Response:**
```json
{
  "success": true,
  "message": "API is healthy",
  "timestamp": "2024-01-20T10:30:00Z"
}
```

#### API Info

```
GET /api/health/info
```

Returns API information.

**Response:**
```json
{
  "success": true,
  "name": "Experiment Backend API",
  "version": "v1",
  "environment": "production"
}
```

### Experiment Endpoints

#### Create Experiment

```
POST /api/v1/experiments
```

Create a new experiment.

**Request Body:**
```json
{
  "title": "string (required, max 100)",
  "description": "string (required, max 1000)",
  "category": "string (required, enum: research|testing|validation|prototype|other)",
  "startDate": "ISO date (required)",
  "endDate": "ISO date (optional, >= startDate)",
  "budget": "number (optional, >= 0)",
  "researcher": "string (required)",
  "status": "string (enum: planned|ongoing|completed|paused|cancelled, default: planned)",
  "priority": "string (enum: low|medium|high|critical, default: medium)",
  "team": [
    {
      "name": "string",
      "role": "string",
      "email": "string (valid email)"
    }
  ],
  "objectives": ["string"],
  "methodology": "string (max 2000)",
  "expectedOutcomes": "string (max 2000)",
  "tags": ["string"],
  "notes": "string (max 1000)"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Experiment created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Machine Learning Model Validation",
    "description": "Testing and validating ML models",
    "category": "validation",
    "status": "planned",
    "startDate": "2024-01-15T00:00:00Z",
    "endDate": "2024-03-15T00:00:00Z",
    "budget": 50000,
    "researcher": "Dr. Sarah Johnson",
    "priority": "high",
    "createdAt": "2024-01-20T10:30:00Z",
    "updatedAt": "2024-01-20T10:30:00Z"
  }
}
```

**Validation Errors:** `400 Bad Request`
```json
{
  "success": false,
  "error": "Validation Error",
  "details": [
    {
      "field": "title",
      "message": "title is required"
    }
  ]
}
```

#### Get All Experiments

```
GET /api/v1/experiments
```

Get all experiments with optional filtering and pagination.

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10) - Items per page
- `status` (string) - Filter by status
- `category` (string) - Filter by category
- `researcher` (string) - Filter by researcher name (case-insensitive)
- `sortBy` (string, default: '-createdAt') - Sort field (prefix with `-` for descending)

**Examples:**
```
GET /api/v1/experiments
GET /api/v1/experiments?page=2&limit=20
GET /api/v1/experiments?status=ongoing
GET /api/v1/experiments?category=research&status=completed
GET /api/v1/experiments?sortBy=title
GET /api/v1/experiments?sortBy=-budget
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Experiment 1",
      "description": "Description",
      "category": "research",
      "status": "completed",
      "startDate": "2024-01-15T00:00:00Z",
      "researcher": "John Doe",
      "priority": "high",
      "createdAt": "2024-01-20T10:30:00Z",
      "updatedAt": "2024-01-20T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

#### Get Experiment by ID

```
GET /api/v1/experiments/:id
```

Get a specific experiment by ID.

**Path Parameters:**
- `id` (string) - MongoDB ObjectId

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Experiment Title",
    "description": "Full description",
    "category": "research",
    "status": "completed",
    "startDate": "2024-01-15T00:00:00Z",
    "endDate": "2024-03-15T00:00:00Z",
    "budget": 50000,
    "researcher": "Dr. Sarah Johnson",
    "priority": "high",
    "team": [
      {
        "name": "Team Member",
        "role": "Role",
        "email": "email@example.com"
      }
    ],
    "objectives": ["Objective 1", "Objective 2"],
    "methodology": "Method description",
    "expectedOutcomes": "Expected outcomes",
    "results": {
      "status": "successful",
      "findings": "Findings description",
      "metrics": {
        "accuracy": 0.96,
        "f1_score": 0.95
      }
    },
    "tags": ["tag1", "tag2"],
    "notes": "Additional notes",
    "createdAt": "2024-01-20T10:30:00Z",
    "updatedAt": "2024-01-20T10:30:00Z"
  }
}
```

**Not Found:** `404 Not Found`
```json
{
  "success": false,
  "error": "Experiment not found"
}
```

#### Update Experiment

```
PUT /api/v1/experiments/:id
```

Update an experiment (all fields optional).

**Path Parameters:**
- `id` (string) - MongoDB ObjectId

**Request Body:** (any of the fields from Create)
```json
{
  "status": "completed",
  "results": {
    "status": "successful",
    "findings": "Model achieved 96.5% accuracy",
    "metrics": {
      "accuracy": 0.965,
      "precision": 0.968
    }
  }
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Experiment updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Updated Title",
    "status": "completed",
    ...
  }
}
```

#### Delete Experiment

```
DELETE /api/v1/experiments/:id
```

Delete an experiment.

**Path Parameters:**
- `id` (string) - MongoDB ObjectId

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Experiment deleted successfully"
}
```

#### Get Experiment Statistics

```
GET /api/v1/experiments/stats/overview
```

Get aggregated statistics about experiments.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "byStatus": [
      {
        "_id": "planned",
        "count": 5,
        "avgBudget": 45000
      },
      {
        "_id": "ongoing",
        "count": 8,
        "avgBudget": 55000
      },
      {
        "_id": "completed",
        "count": 12,
        "avgBudget": 50000
      }
    ],
    "byCategory": [
      {
        "_id": "research",
        "count": 10
      },
      {
        "_id": "testing",
        "count": 8
      },
      {
        "_id": "validation",
        "count": 7
      }
    ],
    "total": 25
  }
}
```

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Duplicate key error |
| 500 | Internal Server Error |

## Error Codes

| Error | Description |
|-------|-------------|
| Validation Error | Request validation failed |
| Invalid ID format | Malformed MongoDB ObjectId |
| Duplicate key error | Unique constraint violation |
| Experiment not found | Resource doesn't exist |
| Route not found | Endpoint doesn't exist |

## Rate Limiting

Currently not implemented. Recommended for production:
- 1000 requests per hour per IP
- 10 requests per second per IP

## Pagination

Default: 10 items per page, max 100 per page

Use `page` and `limit` query parameters:
```
GET /api/v1/experiments?page=2&limit=25
```

## Sorting

Sort by any field using `sortBy` parameter:
- Ascending: `sortBy=fieldName`
- Descending: `sortBy=-fieldName`

Examples:
```
GET /api/v1/experiments?sortBy=title
GET /api/v1/experiments?sortBy=-createdAt
GET /api/v1/experiments?sortBy=-budget&page=1&limit=10
```

## Filtering

Available filters:
- `status`: One of: planned, ongoing, completed, paused, cancelled
- `category`: One of: research, testing, validation, prototype, other
- `researcher`: Text search (case-insensitive)

Combine filters:
```
GET /api/v1/experiments?status=completed&category=research
```

## Validation Rules

| Field | Rules |
|-------|-------|
| title | Required, 1-100 chars |
| description | Required, 1-1000 chars |
| category | Required, enum value |
| startDate | Required, valid ISO date |
| endDate | Optional, >= startDate |
| budget | Non-negative number |
| researcher | Required, text |
| status | Valid enum value |
| priority | Valid enum value |

## Example Workflows

### Create and Update Workflow

```bash
# 1. Create experiment
curl -X POST http://localhost:3000/api/v1/experiments \
  -H "Content-Type: application/json" \
  -d '{ "title": "Test", ... }'
# Returns: _id in response

# 2. Store the ID
EXPERIMENT_ID="507f1f77bcf86cd799439011"

# 3. Update it
curl -X PUT http://localhost:3000/api/v1/experiments/$EXPERIMENT_ID \
  -H "Content-Type: application/json" \
  -d '{ "status": "completed" }'

# 4. View updated experiment
curl http://localhost:3000/api/v1/experiments/$EXPERIMENT_ID

# 5. Delete it
curl -X DELETE http://localhost:3000/api/v1/experiments/$EXPERIMENT_ID
```

### Search and Filter Workflow

```bash
# 1. Get all ongoing experiments
curl "http://localhost:3000/api/v1/experiments?status=ongoing"

# 2. Get completed research projects
curl "http://localhost:3000/api/v1/experiments?status=completed&category=research"

# 3. Sort by budget (highest first)
curl "http://localhost:3000/api/v1/experiments?sortBy=-budget&limit=5"

# 4. Search by researcher
curl "http://localhost:3000/api/v1/experiments?researcher=Sarah"
```

## Best Practices

1. **Always validate input** before sending
2. **Use pagination** for large result sets
3. **Handle errors** gracefully
4. **Cache responses** when appropriate
5. **Use filters** to reduce data transfer
6. **Sort efficiently** on indexed fields
7. **Check health endpoint** before operations
8. **Implement retry logic** for failed requests
