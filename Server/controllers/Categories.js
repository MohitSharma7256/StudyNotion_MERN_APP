/**
 * Category Controller
 * -------------------
 * Handles CRUD-like behavior for course categories
 * and provides curated category page data sets.
 */
const Category = require("../models/Category")
const Course = require("../models/Course")

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}

/**
 * createCategory
 * --------------
 * Simple helper to create catalog groupings from the dashboard.
 */
exports.createCategory = async (req, res) => {
    try {
        const {name, description} =  req.body;

        if(!name || !description){
            return res.status(401).json({
                success:false,
                message:"Tag name or description not available"
            })
        }

        const newCategory = await Category.create({
            name,
            description
        })

        if (!newCategory) {
            return res.status(401).json({
                success:false,
                message:"Error in pushing new tag to db"
            }) 
        }

        return res.status(200).json({
            success:true,
            message:"Tag created successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

/**
 * showAllCategories
 * -----------------
 * Returns id/name/description for every category. Used to populate dropdowns.
 */
exports.showAllCategories = async (req, res) => {

    try {
        const allCategories =  await Category.find({},{name:true,
                                        description:true});
        
            return res.status(200).json({
                success:true,
                message:"All tags received",
                data:allCategories
            })  
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

/**
 * categoryPageDetails
 * -------------------
 * Builds the "category landing page" payload containing:
 * - selected category courses
 * - suggested courses from a different category
 * - overall top sellers
 */
exports.categoryPageDetails = async (req, res) => {
    try {
        const { categoryId } = req.body;
        console.log("PRINTING CATEGORY ID: ", categoryId);
        
        // Get courses for the specified category
        const selectedCategory = await Category.findById(categoryId)
            .populate({
                path: "course",
                match: { status: "Published" },
                populate: "ratingAndReviews",
            })
            .exec();

        // Handle the case when the category is not found
        if (!selectedCategory) {
            console.log("Category not found.");
            return res.status(404).json({ 
                success: false, 
                message: "Category not found" 
            });
        }

        // Handle the case when there are no courses in the selected category
        if (!selectedCategory.course || selectedCategory.course.length === 0) {
            console.log("No courses found for the selected category.");
            return res.status(200).json({
                success: true,
                selectedCourses: { course: [] },
                differentCourses: { course: [] },
                mostSellingCourses: [],
                name: selectedCategory.name,
                description: selectedCategory.description,
                message: "No courses found for the selected category."
            });
        }

        // Get other categories that have courses
        const categoriesExceptSelected = await Category.find({
            _id: { $ne: categoryId },
            course: { $exists: true, $not: { $size: 0 } }
        });

        let differentCourses = { course: [] }; // Default empty result

        // Only try to get a different category if there are other categories with courses
        if (categoriesExceptSelected.length > 0) {
            const randomIndex = getRandomInt(categoriesExceptSelected.length);
            const randomCategory = categoriesExceptSelected[randomIndex];
            
            if (randomCategory) {
                differentCourses = await Category.findOne({ _id: randomCategory._id })
                    .populate({
                        path: "course",
                        match: { status: "Published" },
                        populate: "ratingAndReviews",
                    })
                    .exec();
            }
        }

        // Get top-selling courses across all categories
        const mostSellingCourses = await Course.find({ status: 'Published' })
            .sort({ "studentsEnrolled": -1 })
            .populate("ratingAndReviews")
            .limit(10) // Limit to top 10 selling courses
            .exec();

        return res.status(200).json({
            success: true,
            selectedCourses: selectedCategory,
            differentCourses: differentCourses,
            mostSellingCourses: mostSellingCourses || [],
            name: selectedCategory.name,
            description: selectedCategory.description
        });

    } catch (error) {
        console.error("Error in categoryPageDetails:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}


//  update category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const category = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    if (!category) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



//  delete category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};