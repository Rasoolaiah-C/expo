const Experiment = require('../models/Experiment');

// Create experiment
const createExperiment = async (req, res) => {
  const experiment = new Experiment(req.validated);
  const saved = await experiment.save();
  
  res.status(201).json({
    success: true,
    message: 'Experiment created successfully',
    data: saved
  });
};

// Get all experiments
const getAllExperiments = async (req, res) => {
  const { status, category, researcher, page = 1, limit = 10, sortBy = '-createdAt' } = req.query;
  
  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (researcher) filter.researcher = new RegExp(researcher, 'i');
  
  const skip = (page - 1) * limit;
  
  const experiments = await Experiment.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(parseInt(limit));
  
  const total = await Experiment.countDocuments(filter);
  
  res.json({
    success: true,
    data: experiments,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    }
  });
};

// Get experiment by ID
const getExperimentById = async (req, res) => {
  const experiment = await Experiment.findById(req.params.id);
  
  if (!experiment) {
    return res.status(404).json({
      success: false,
      error: 'Experiment not found'
    });
  }
  
  res.json({
    success: true,
    data: experiment
  });
};

// Update experiment
const updateExperiment = async (req, res) => {
  const experiment = await Experiment.findByIdAndUpdate(
    req.params.id,
    req.validated,
    { new: true, runValidators: true }
  );
  
  if (!experiment) {
    return res.status(404).json({
      success: false,
      error: 'Experiment not found'
    });
  }
  
  res.json({
    success: true,
    message: 'Experiment updated successfully',
    data: experiment
  });
};

// Delete experiment
const deleteExperiment = async (req, res) => {
  const experiment = await Experiment.findByIdAndDelete(req.params.id);
  
  if (!experiment) {
    return res.status(404).json({
      success: false,
      error: 'Experiment not found'
    });
  }
  
  res.json({
    success: true,
    message: 'Experiment deleted successfully'
  });
};

// Get experiment statistics
const getExperimentStats = async (req, res) => {
  const stats = await Experiment.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgBudget: { $avg: '$budget' }
      }
    }
  ]);
  
  const categoryStats = await Experiment.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    }
  ]);
  
  res.json({
    success: true,
    data: {
      byStatus: stats,
      byCategory: categoryStats,
      total: await Experiment.countDocuments()
    }
  });
};

module.exports = {
  createExperiment,
  getAllExperiments,
  getExperimentById,
  updateExperiment,
  deleteExperiment,
  getExperimentStats
};
