const User = require("../models/User");
const Review = require("../models/Review");

// creating review
module.exports.createReview = async function (req, res) {
  try {
    let recipient = await User.findById(req.params.id);

    if (!recipient) {
      console.log("Recipient is not valid");
      return res.redirect("back");
    }

    let existing_review = await Review.findOne({
      to: recipient.id,
      from: req.user.id
    });

    if (existing_review) {
      existing_review.review = req.query.newReview;
      await existing_review.save();
    } else {
      const new_review = await Review.create({
        to: recipient.id,
        from: req.user.id,
        review: req.query.newReview,
      });

      if (!new_review) {
        console.log("Review is not created");
      }
    }

    return res.redirect("back");
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
}

// deleting review
module.exports.deleteReview = async function(req, res) {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      console.log("Review not found");
      return res.redirect("back");
    }
    
    const reviewer = await User.findById(review.from);
    if (!reviewer) {
      console.log("Reviewer not found");
      return res.redirect("back");
    }
    
    const recipient = await User.findById(review.to);
    if (!recipient) {
      console.log("Recipient not found");
      return res.redirect("back");
    }
    
    await Review.findByIdAndRemove(req.params.id);
    reviewer.from.pull(review.id);
    recipient.to.pull(review.id);
    await reviewer.save();
    await recipient.save();
    
    return res.redirect("back");
  } catch (err) {
    console.log("Error deleting review", err);
    return res.redirect("back");
  }
};
