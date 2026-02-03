const Task = require("../models/Task");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.createTask = catchAsync(async (req, res, next) => {
  const { title, description } = req.body;

  const task = await Task.create({
    title,
    description,
    owner: req.userId,
  });

  res.status(201).json({
    status: "success",
    data: {
      task,
    },
  });
});

exports.getMyTasks = catchAsync(async (req, res, next) => {
  const tasks = await Task.find({ owner: req.userId });

  res.status(200).json({
    status: "success",
    results: tasks.length,
    data: {
      tasks,
    },
  });
});

exports.deleteTask = catchAsync(async (req, res, next) => {
  const task = await Task.findOne({
    _id: req.params.id,
    owner: req.userId,
  });

  if (!task) {
    return next(
      new AppError(
        "Task not found or you do not have permission to delete it",
        404,
      ),
    );
  }

  await Task.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
