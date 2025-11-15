const request = require('supertest');
const app = require('../src/index');
const Experiment = require('../src/models/Experiment');

describe('Experiment API', () => {
  const mockExperiment = {
    title: 'Test Experiment',
    description: 'This is a test experiment',
    category: 'research',
    startDate: new Date('2024-01-01'),
    researcher: 'John Doe'
  };

  describe('POST /api/v1/experiments', () => {
    it('should create a new experiment', async () => {
      const res = await request(app)
        .post('/api/v1/experiments')
        .send(mockExperiment);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.title).toBe(mockExperiment.title);
    });

    it('should return 400 if title is missing', async () => {
      const { title, ...invalidExperiment } = mockExperiment;
      const res = await request(app)
        .post('/api/v1/experiments')
        .send(invalidExperiment);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 if endDate is before startDate', async () => {
      const invalidExperiment = {
        ...mockExperiment,
        startDate: new Date('2024-12-01'),
        endDate: new Date('2024-01-01')
      };

      const res = await request(app)
        .post('/api/v1/experiments')
        .send(invalidExperiment);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/experiments', () => {
    beforeEach(async () => {
      await Experiment.create(mockExperiment);
      await Experiment.create({
        ...mockExperiment,
        title: 'Second Experiment',
        status: 'completed'
      });
    });

    it('should get all experiments', async () => {
      const res = await request(app).get('/api/v1/experiments');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.pagination).toBeDefined();
    });

    it('should filter experiments by status', async () => {
      const res = await request(app)
        .get('/api/v1/experiments')
        .query({ status: 'completed' });

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].status).toBe('completed');
    });

    it('should support pagination', async () => {
      const res = await request(app)
        .get('/api/v1/experiments')
        .query({ page: 1, limit: 1 });

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.limit).toBe(1);
    });
  });

  describe('GET /api/v1/experiments/:id', () => {
    let experimentId;

    beforeEach(async () => {
      const experiment = await Experiment.create(mockExperiment);
      experimentId = experiment._id.toString();
    });

    it('should get experiment by ID', async () => {
      const res = await request(app).get(`/api/v1/experiments/${experimentId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(experimentId);
    });

    it('should return 404 if experiment not found', async () => {
      const invalidId = '507f1f77bcf86cd799439011';
      const res = await request(app).get(`/api/v1/experiments/${invalidId}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/experiments/:id', () => {
    let experimentId;

    beforeEach(async () => {
      const experiment = await Experiment.create(mockExperiment);
      experimentId = experiment._id.toString();
    });

    it('should update experiment', async () => {
      const updateData = { status: 'completed', title: 'Updated Title' };
      const res = await request(app)
        .put(`/api/v1/experiments/${experimentId}`)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('completed');
      expect(res.body.data.title).toBe('Updated Title');
    });

    it('should return 404 if experiment not found', async () => {
      const invalidId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .put(`/api/v1/experiments/${invalidId}`)
        .send({ status: 'completed' });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/v1/experiments/:id', () => {
    let experimentId;

    beforeEach(async () => {
      const experiment = await Experiment.create(mockExperiment);
      experimentId = experiment._id.toString();
    });

    it('should delete experiment', async () => {
      const res = await request(app).delete(`/api/v1/experiments/${experimentId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const deletedExperiment = await Experiment.findById(experimentId);
      expect(deletedExperiment).toBeNull();
    });

    it('should return 404 if experiment not found', async () => {
      const invalidId = '507f1f77bcf86cd799439011';
      const res = await request(app).delete(`/api/v1/experiments/${invalidId}`);

      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/v1/experiments/stats/overview', () => {
    beforeEach(async () => {
      await Experiment.create({ ...mockExperiment, status: 'planned' });
      await Experiment.create({ ...mockExperiment, status: 'ongoing', title: 'Exp 2' });
      await Experiment.create({ ...mockExperiment, status: 'completed', title: 'Exp 3' });
    });

    it('should get experiment statistics', async () => {
      const res = await request(app).get('/api/v1/experiments/stats/overview');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.byStatus).toBeDefined();
      expect(res.body.data.byCategory).toBeDefined();
      expect(res.body.data.total).toBe(3);
    });
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/api/health/health');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
