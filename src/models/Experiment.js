const mongoose = require('mongoose');

const experimentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    status: {
      type: String,
      enum: ['planned', 'ongoing', 'completed', 'paused', 'cancelled'],
      default: 'planned'
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: ['research', 'testing', 'validation', 'prototype', 'other']
    },
    startDate: {
      type: Date,
      required: [true, 'Please provide a start date']
    },
    endDate: {
      type: Date,
      validate: {
        validator: function(value) {
          return !value || value >= this.startDate;
        },
        message: 'End date must be greater than or equal to start date'
      }
    },
    budget: {
      type: Number,
      min: [0, 'Budget cannot be negative'],
      default: 0
    },
    researcher: {
      type: String,
      required: [true, 'Please provide researcher name']
    },
    team: [
      {
        name: String,
        role: String,
        email: String
      }
    ],
    objectives: [String],
    methodology: String,
    expectedOutcomes: String,
    results: {
      status: String,
      findings: String,
      metrics: mongoose.Schema.Types.Mixed
    },
    attachments: [
      {
        filename: String,
        url: String,
        uploadedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    tags: [String],
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    notes: String,
    customFields: mongoose.Schema.Types.Mixed
  },
  {
    timestamps: true,
    collection: 'experiments'
  }
);

// Index for frequently queried fields
experimentSchema.index({ status: 1, createdAt: -1 });
experimentSchema.index({ researcher: 1 });
experimentSchema.index({ tags: 1 });
experimentSchema.index({ category: 1 });

module.exports = mongoose.model('Experiment', experimentSchema);
