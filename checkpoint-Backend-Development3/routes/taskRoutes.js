const express = require("express");
const taskController = require("../controllers/taskController");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// Protect all routes
router.use(verifyToken);

router.post("/", taskController.createTask);
router.get("/", taskController.getMyTasks);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
