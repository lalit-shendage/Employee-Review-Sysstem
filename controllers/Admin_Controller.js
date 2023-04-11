const User = require("../models/User");
const Review = require("../models/Review");

// set review for employee
module.exports.setReviewers = async function (req, res) {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/users/login");
    }

    const employee = await User.findById(req.user.id);

    if (employee.role == "User") {
      console.log("You are not an admin");
      return res.redirect("/");
    }

    if (req.body.Reviewer == req.body.Recipient) {
      return res.redirect("back");
    }

    const reviewer = await User.findById(req.body.Reviewer);
    const recipient = await User.findById(req.body.Recipient);

    if (!reviewer || !recipient) {
      return res.redirect("back");
    }

    const reviewExists = reviewer.to.some((review) =>
      review.equals(recipient._id)
    );

    if (reviewExists) {
      console.log("A review for the same reviewer and recipient already exists");
      return res.redirect("back");
    }

    reviewer.to.push(recipient);
    await reviewer.save();

    recipient.from.push(reviewer);
    await recipient.save();

    return res.redirect("/users/admin");
  } catch (err) {
    console.log("Error", err);
    return;
  }
};

// make admin to an employee
module.exports.newAdmin = async function (req, res) {
  try {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).send("Forbidden");
    }

    const id = req.params.id;

    const employee = await User.findByIdAndUpdate(id, { role: "admin" });

    if (!employee || employee.role !== "User") {
      return res.status(404).send("Not Found");
    }

    res.redirect("/users/admin");
  } catch (err) {
    console.log("Error", err);
    return res.status(500).send("Internal Server Error");
  }
};

// views employees
module.exports.viewEmployees = async function (req, res) {
  try {
    if (req.isAuthenticated()) {
      if (req.user.role == "admin") {
        let employees = await User.find({});

        if (employees) {
          return res.render("employeeList", {
            title: "ERS",
            employees: employees,
          });
        }
      } else {
        console.log("user is not authorized check list of Employees");
        return res.redirect("/");
      }
    } else {
      console.log("user not authenticated");
      return res.redirect("/users/login");
    }
  } catch (err) {
    console.log("Error", err);
    return;
  }
};

// delete employee
module.exports.deleteEmployee = async function (req, res) {
  try {
    if (req.isAuthenticated()) {
      if (req.user.role == "admin") {
        await User.deleteOne({ _id: req.params.id });
        return res.redirect("/admin/view-employees");
      }
    }
  } catch (err) {
    console.log("Error", err);
    return;
  }
};

module.exports.viewReviews = async function (req, res) {
  try {
    if (req.isAuthenticated()) {
      if (req.user.role == "admin") {
        const reviewers = await User.find({ role: "Reviewer" }).populate("to");
        const reviews = await Review.find().populate("to").populate("from");
        res.render("reviewList", {
          reviews: reviews,
          title: "Review List",
          reviewers: reviewers,
        });
      } else {
        console.log("user is not authorized check list of Employees");
        return res.redirect("/");
      }
    } else {
      console.log("user not authenticated");
      return res.redirect("/users/login");
    }
  } catch (err) {
    console.log("Error", err);
    return;
  }
};
