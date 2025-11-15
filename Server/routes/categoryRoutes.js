const express = require("express");
const router = express.Router();
const { createCategory, showAllCategories, categoryPageDetails, updateCategory, deleteCategory } = require("../controllers/Categories");

// सही रास्ते
router.post("/create", createCategory);
router.get("/showAllCategories", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);
router.put("/update/:id", updateCategory);
router.delete("/delete/:id", deleteCategory);

module.exports = router;