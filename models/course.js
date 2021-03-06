const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const Field = require("./field");
const User = require("./user");
const Review = require("./review");

const Schema = mongoose.Schema;

const reqString = {
    type: String,
    required: true
}
const reqNum = {
    type: Number,
    default: 0
}

const CourseSchema = new Schema({
    // course's title
    title: {
        type: String,
        required: true,
        unique: true
    },

    // the subtitle or short description of the course
    subtitle: reqString,

    // detailed descriptions of the course
    description: String,

    // the field that the course belongs to
    field: {
        type: Schema.Types.ObjectId,
        ref: "Field"
    },

    // instructor of the course
    instructor: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    // reviews of the course
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],

    // course's average ratings
    rating: reqNum,

    students: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    totalStudents: reqNum,

    // course's image    
    image1xURL: String,
    image2xURL: String,
    image3xURL: String,
    // cost of the course
    discountPrice: reqNum,
    originalPrice: reqNum,

    // number of views of this course
    numViews: reqNum,

    // course's curriculum
    curriculum: {},

    // Check whether the uploaded course is complete
    isComplete: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }


})

// create indexes for course.name to perform a full-text search on
CourseSchema.index({ title: "text" });

CourseSchema.plugin(mongoosePaginate);

CourseSchema.methods.calculateAverageRating = function (cb) {
    this.rating = 0;
    this.reviews.forEach((review) => {
        this.rating += review.rating
    })
    return this.rating = (this.reviews.length === 0 ? 0 : (this.rating / this.reviews.length).toFixed(1));
}

CourseSchema.methods.addReview = function (review) {
    var avg = 0;
    this.reviews.push(review);
    for (const review of this.reviews) {
        avg += review.rating;
    }
    this.rating = (avg / (this.reviews.length)).toFixed(1);
}

module.exports = mongoose.model("Course", CourseSchema);