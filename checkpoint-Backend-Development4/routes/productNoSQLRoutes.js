const express = require("express");
const router = express.Router();
const noSQLController = require("../controllers/noSQLController");

router.post("/", noSQLController.createProduct);
router.get("/", noSQLController.getAllProducts);
router.get("/:id", noSQLController.getProduct);
router.put("/:id", noSQLController.updateProduct);
router.delete("/:id", noSQLController.deleteProduct);

module.exports = router;
