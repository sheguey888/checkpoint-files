const express = require("express");
const router = express.Router();
const sqlController = require("../controllers/sqlController");

router.post("/", sqlController.createProduct);
router.get("/", sqlController.getAllProducts);
router.get("/:id", sqlController.getProduct);
router.put("/:id", sqlController.updateProduct);
router.delete("/:id", sqlController.deleteProduct);

module.exports = router;
