const Joi = require('joi');

const createExperimentSchema = Joi.object({
  title: Joi.string().required().max(100),
  description: Joi.string().required().max(1000),
  status: Joi.string().valid('planned', 'ongoing', 'completed', 'paused', 'cancelled').default('planned'),
  category: Joi.string().valid('research', 'testing', 'validation', 'prototype', 'other').required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().min(Joi.ref('startDate')).allow(null),
  budget: Joi.number().min(0).default(0),
  researcher: Joi.string().required(),
  team: Joi.array().items(
    Joi.object({
      name: Joi.string(),
      role: Joi.string(),
      email: Joi.string().email()
    })
  ),
  objectives: Joi.array().items(Joi.string()),
  methodology: Joi.string().max(2000),
  expectedOutcomes: Joi.string().max(2000),
  tags: Joi.array().items(Joi.string()),
  priority: Joi.string().valid('low', 'medium', 'high', 'critical').default('medium'),
  notes: Joi.string().max(1000)
});

const updateExperimentSchema = Joi.object({
  title: Joi.string().max(100),
  description: Joi.string().max(1000),
  status: Joi.string().valid('planned', 'ongoing', 'completed', 'paused', 'cancelled'),
  category: Joi.string().valid('research', 'testing', 'validation', 'prototype', 'other'),
  startDate: Joi.date(),
  endDate: Joi.date().min(Joi.ref('startDate')).allow(null),
  budget: Joi.number().min(0),
  researcher: Joi.string(),
  team: Joi.array().items(
    Joi.object({
      name: Joi.string(),
      role: Joi.string(),
      email: Joi.string().email()
    })
  ),
  objectives: Joi.array().items(Joi.string()),
  methodology: Joi.string().max(2000),
  expectedOutcomes: Joi.string().max(2000),
  results: Joi.object({
    status: Joi.string(),
    findings: Joi.string(),
    metrics: Joi.any()
  }),
  tags: Joi.array().items(Joi.string()),
  priority: Joi.string().valid('low', 'medium', 'high', 'critical'),
  notes: Joi.string().max(1000)
}).min(1);

module.exports = {
  createExperimentSchema,
  updateExperimentSchema
};
