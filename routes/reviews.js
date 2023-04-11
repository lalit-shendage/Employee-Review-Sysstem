const express =require('express');

const router =express.Router();

const reviewController= require('../controllers/Review_controller')

router.get("/newReview/:id", reviewController.createReview);

router.post("/delete/:id", reviewController.deleteReview);


module.exports=router