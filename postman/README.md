# Postman Collection Guide

## Setup

1. **Import Collection**: Open Postman → Import → Select `collection.json`
2. **Select Environment**: 
   - Import `environment-local.json` for local testing
   - Import `environment-prod.json` for production

## Variables

- `base_url`: API base URL (default: http://localhost:3000)
- `api_version`: API version (default: v1)
- `experiment_id`: Experiment ID for testing specific endpoints

## Testing Workflow

### 1. Health Check
- Start with "Health Check" endpoint to verify API is running
- Expected: 200 OK

### 2. Create Experiment
- Use "Create Experiment" to create a new experiment
- Copy the returned `_id` to `experiment_id` variable
- Expected: 201 Created

### 3. Retrieve & Query
- Use "Get All Experiments" to list all
- Use "Filter by Status" to test filtering
- Use "Get Experiment by ID" with the saved ID

### 4. Update & Delete
- Use "Update Experiment" to modify the experiment
- Use "Delete Experiment" to remove it

### 5. Statistics
- Use "Get Experiment Statistics" to see aggregated data

## Response Examples

### Success Response
```json
{
  "success": true,
  "message": "Experiment created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Test Experiment",
    ...
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Validation Error",
  "details": [...]
}
```

## Validation Rules

- **Title**: Required, max 100 chars
- **Description**: Required, max 1000 chars
- **Category**: One of: research, testing, validation, prototype, other
- **Status**: One of: planned, ongoing, completed, paused, cancelled
- **Start Date**: Required, must be ISO date
- **End Date**: Optional, must be >= start date
- **Budget**: Non-negative number
- **Priority**: low, medium, high, critical

## Testing Tips

1. **Pagination**: Test with `?page=2&limit=5`
2. **Sorting**: Test with `?sortBy=-createdAt` or `?sortBy=title`
3. **Filtering**: Combine filters like `?status=ongoing&category=research`
4. **Error Cases**: Try missing fields, invalid dates, wrong IDs

## Scripts

Use Postman scripts in Pre-request tab to automate workflows:
```javascript
// Extract experiment ID from response and save to variable
pm.environment.set("experiment_id", pm.response.json().data._id);
```

## Performance Notes

- Default pagination: 10 items per page
- Max items per page: Configurable
- Response times should be <200ms for indexed queries
