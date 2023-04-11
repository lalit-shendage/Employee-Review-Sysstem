const express = require('express');
const router = express.Router();
const passport = require('passport');

const adminController = require('../controllers/Admin_Controller');

// get admin page
// router.get('/admin-page', passport.checkAuthentication, adminController.adminPage);

// set reviewers to employee
router.post('/set-Reviewers', passport.checkAuthentication, adminController.setReviewers);

// make new admin to employee
router.post('/newAdmin/:id', passport.checkAuthentication, adminController.newAdmin);

// for viewing all employees list
router.get('/view-employees', passport.checkAuthentication, adminController.viewEmployees);

router.get('/view-reviews', passport.checkAuthentication, adminController.viewReviews);

// delete an employee
router.get('/delete-employee/:id', passport.checkAuthentication, adminController.deleteEmployee);

module.exports = router;