/**
 * Rating & Review Controller
 * --------------------------
 * Manages creation, aggregation, and listing of course reviews.
 */
const RatingAndReview = require("../models/RatingAndReview")
const Course = require("../models/Course")
const mongoose = require("mongoose")

/**
 * createRating
 * ------------
 * Validates enrollment, ensures user hasn't reviewed already,
 * persists the review, and links it back to the course.
 */
exports.createRating = async (req, res) => {
    try{

        //get user id
        const userId = req.user.id;
        //fetchdata from req body
        const {rating, review, courseId} = req.body;
        //check if user is enrolled or not
        const courseDetails = await Course.findOne(
                                    {_id:courseId,
                                    studentsEnrolled: {$elemMatch: {$eq: userId} },
                                });

        if(!courseDetails) {
            return res.status(404).json({
                success:false,
                message:'Student is not enrolled in the course',
            });
        }
        //check if user already reviewed the course
        const alreadyReviewed = await RatingAndReview.findOne({
                                                user:userId,
                                                course:courseId,
                                            });
        if(alreadyReviewed) {
                    return res.status(403).json({
                        success:false,
                        message:'Course is already reviewed by the user',
                    });
                }
        //create rating and review
        const ratingReview = await RatingAndReview.create({
                                        rating, review, 
                                        course:courseId,
                                        user:userId,
                                    });
       
        //update course with this rating/review
        const updatedCourseDetails = await Course.findByIdAndUpdate({_id:courseId},
                                    {
                                        $push: {
                                            ratingAndReviews: ratingReview._id,
                                        }
                                    },
                                    {new: true});
        console.log(updatedCourseDetails);
        //return response
        return res.status(200).json({
            success:true,
            message:"Rating and Review created Successfully",
            ratingReview,
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

/**
 * getAverageRating
 * ----------------
 * Aggregates average rating for a course via Mongo's aggregation pipeline.
 */
exports.getAverageRating = async (req, res) => {

    try {
        const {courseId} = req.body;

        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    course:courseId
                }
            },
            {
                $group:{
                    _id:null,
                    averageRating : {$avg :rating}
                }
            }
        ])

        if (result.length>0) {
            return res.status(200).json({
                success:true,
                message:'Avg rating recived for the course',
                averageRating: result[0].averageRating
            })
        }
        return res.status(200).json({
            success:true,
            message:'Average Rating is 0, no ratings given till now',
            averageRating:0,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
    

}

/**
 * getAllRating
 * ------------
 * Provides a global reviews feed sorted by highest rating first.
 */
exports.getAllRating = async (req, res) => {
    try{
            const allReviews = await RatingAndReview.find({})
                                    .sort({rating: "desc"})
                                    .populate({
                                        path:"user",
                                        select:"firstName lastName email image",
                                    })
                                    .populate({
                                        path:"course",
                                        select: "courseName",
                                    })
                                    .exec();
            return res.status(200).json({
                success:true,
                message:"All reviews fetched successfully",
                data:allReviews,
            });
    }   
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    } 
}