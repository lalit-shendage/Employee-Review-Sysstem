const User = require("../models/User");
const Review = require("../models/Review");

module.exports.admin = async function (req, res) {
  let user = await User.find({});
  var employeeList = [];
  for (let i = 0; i < user.length; i++) {
    var temp = {
      name: user[i].name,
      id: user[i].id,
    };
    employeeList.push(temp);
  }

  return res.render("adminview", {
    title: " Set Reviews",
    employeeList: employeeList,
  });
};

module.exports.employee = function (req, res) {
  return res.render("home", {
    title: "employee dashboard",
  });
};

module.exports.signin = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("signin", {
    title: "signin",
  });
};

module.exports.signup = function (req, res) {
  if (req.isAuthenticated()) {
    if (req.user.role == "admin") {
      return res.redirect("/users/admin");
    } else {
      return res.redirect("/users/employee");
    }
  }

  return res.render("signup", {
    title: "signup",
  });
};

module.exports.createUser = async function (req, res) {
  try {
    if (req.body.password != req.body.password2) {
      console.log("password did not match");
      return res.redirect("/users/register");
    }

    let user = await User.findOne({ email: req.body.emai });

    if (user) {
      console.log("user already exist");
      return res.redirect("/users/register");
    } else {
      let role = "User";
      if (!(await User.exists())) {
        role = "admin";
      }

      await User.create({
        name: req.body.name,
        email: req.body.email,
        role: role,
        password: req.body.password,
      });

      console.log("User created successfully");

      if (req.user && req.user.role === "admin") {
        return res.redirect("/");
      }

      return res.redirect("/");
    }
  } catch (error) {
    console.log("error while creating user", error);
    return res.redirect("/users/register");
  }
};

module.exports.createSession = async function (req, res) {
  if (!req.isAuthenticated()) {
    return res.redirect("/users/login");
  } else {
    if (req.user.role != "admin") {
      console.log("You are not an admin");
      return res.redirect("/");
    } else {
      return res.redirect("/users/admin");
    }
  }
};

module.exports.destroySession = function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  return res.redirect("/users/signin");
};

module.exports.home = async function (req, res) {
  try {
    // if user is not logged in then send back to login
    if (!req.isAuthenticated()) {
      console.log("not logged in");
      return res.redirect("/users/login");
    }

    let user = await User.findById(req.user.id);
    let reviews = await Review.find({ to: req.user.id });

    let recipients = [];
    for (let i = 0; i < user.to.length; i++) {
      let x = await User.findById(user.to[i]);
      recipients.push(x);
    }

    // find reviews
    let reviewList = [];

    if (reviews.length > 0) {
      for (let i = 0; i < reviews.length; i++) {
        let x = await User.findById(reviews[i].from);

        let curr_review = {
          name: x.name,
          review: reviews[i].review,
          updated: reviews[i].updatedAt,
        };
        reviewList.push(curr_review);
      }
    }
    console.log(reviewList);
    return res.render("home", {
      title: "setReviewers Home",
      recipients: recipients,
      reviews: reviewList,
      user: user,
    });
  } catch (error) {
    console.log(error);
    return;
  }
};

module.exports.register = function (req, res) {
  // if user is authenticate then not able to register self;
  if (req.isAuthenticated() && req.user.role == "admin") {
    return res.render("addemployee", {
      title: "Add employee",
    });
  }

  if (req.isAuthenticated()) {
    console.log();
    return res.redirect("back");
  }
  return res.render("addemployee", {
    title: "Register",
  });
};
