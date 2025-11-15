#!/bin/bash

# Database seeding script
# Run: npm run seed or node scripts/seed.js

require('../src/models/Experiment');
const mongoose = require('mongoose');

const Experiment = require('../src/models/Experiment');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/experiment-db';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await Experiment.deleteMany({});
    console.log('Cleared existing experiments');

    // Sample data
    const experiments = [
      {
        title: 'AI Model Training Phase 1',
        description: 'Initial training of neural network models for image recognition',
        status: 'completed',
        category: 'research',
        startDate: new Date('2023-01-15'),
        endDate: new Date('2023-03-15'),
        budget: 75000,
        researcher: 'Dr. Emily Chen',
        team: [
          { name: 'Alex Wong', role: 'ML Engineer', email: 'alex@example.com' },
          { name: 'Jessica Brown', role: 'Data Scientist', email: 'jessica@example.com' }
        ],
        objectives: ['Achieve 85% accuracy', 'Reduce training time by 30%', 'Document results'],
        methodology: 'Supervised learning with cross-validation',
        expectedOutcomes: 'Production-ready model',
        priority: 'high',
        tags: ['ai', 'ml', 'research'],
        results: {
          status: 'successful',
          findings: 'Achieved 89% accuracy on test set',
          metrics: { accuracy: 0.89, loss: 0.0234 }
        }
      },
      {
        title: 'Database Performance Optimization',
        description: 'Testing and optimizing database queries for production environment',
        status: 'ongoing',
        category: 'testing',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-02-28'),
        budget: 45000,
        researcher: 'Prof. Michael Rodriguez',
        team: [
          { name: 'Sarah Kim', role: 'Database Admin', email: 'sarah@example.com' }
        ],
        objectives: ['Reduce query time by 40%', 'Increase throughput', 'Load testing'],
        methodology: 'Benchmark testing and profiling',
        priority: 'critical',
        tags: ['database', 'performance', 'optimization']
      },
      {
        title: 'Blockchain Smart Contract Audit',
        description: 'Security audit and validation of smart contracts',
        status: 'planned',
        category: 'validation',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-03-01'),
        budget: 60000,
        researcher: 'Dr. James Miller',
        team: [
          { name: 'Mark Johnson', role: 'Security Analyst', email: 'mark@example.com' },
          { name: 'Lisa Garcia', role: 'Smart Contract Dev', email: 'lisa@example.com' }
        ],
        objectives: ['Identify vulnerabilities', 'Performance testing', 'Generate audit report'],
        methodology: 'Static analysis and dynamic testing',
        priority: 'high',
        tags: ['blockchain', 'security', 'audit']
      },
      {
        title: 'Mobile App Prototype Testing',
        description: 'Testing and validation of mobile application prototype',
        status: 'ongoing',
        category: 'prototype',
        startDate: new Date('2023-12-01'),
        budget: 35000,
        researcher: 'Jennifer Lee',
        team: [
          { name: 'David Park', role: 'QA Engineer', email: 'david@example.com' },
          { name: 'Emma Wilson', role: 'UX Tester', email: 'emma@example.com' }
        ],
        objectives: ['Identify bugs', 'Usability testing', 'Performance validation'],
        methodology: 'User acceptance testing',
        priority: 'medium',
        tags: ['mobile', 'testing', 'prototype']
      },
      {
        title: 'Climate Data Analysis',
        description: 'Analyzing climate patterns using machine learning techniques',
        status: 'completed',
        category: 'research',
        startDate: new Date('2023-06-01'),
        endDate: new Date('2023-12-31'),
        budget: 120000,
        researcher: 'Dr. Robert Wilson',
        team: [
          { name: 'Nancy Martinez', role: 'Data Scientist', email: 'nancy@example.com' },
          { name: 'Charles Davis', role: 'Environmental Scientist', email: 'charles@example.com' }
        ],
        objectives: ['Climate trend prediction', 'Seasonal analysis', 'Impact assessment'],
        methodology: 'Time series analysis and ML models',
        expectedOutcomes: 'Accurate climate predictions for next 5 years',
        priority: 'high',
        tags: ['climate', 'research', 'analytics'],
        results: {
          status: 'successful',
          findings: 'Successfully predicted climate trends with 87% accuracy',
          metrics: { accuracy: 0.87, mape: 5.6 }
        }
      }
    ];

    const created = await Experiment.insertMany(experiments);
    console.log(`\n✓ Created ${created.length} experiments`);
    
    // Log statistics
    const stats = await Experiment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    console.log('\nExperiment Statistics:');
    stats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count}`);
    });

    await mongoose.disconnect();
    console.log('\n✓ Database seeding complete');
    process.exit(0);
  } catch (error) {
    console.error('✗ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
