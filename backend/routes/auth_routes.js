//import express, express router as shown in lecture code

import { Router } from "express";
const router = Router();
import bcrypt from "bcryptjs";

import xss from "xss";
import admin from "../model/admin.js";
import customer from "../model/customer.js";
import helpers from "../helpers.js";

router.route("/").get(async (req, res) => {
  //code here for GET THIS ROUTE SHOULD NEVER FIRE BECAUSE OF MIDDLEWARE #1 IN SPECS.

  try {
    let adminUser = await admin.createAdmin();
    console.log(adminUser);
    return res.json({ success: "Admin Created!" });
  } catch (error) {
    return res.json({ Error: error });
  }
});

router.route("/register").post(async (req, res) => {
  try {
    console.log("Register post method is called in ExpressJS server!");

    // validate the data here using Joi or similar
    // const { error } = validationSchema.validate(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    // hash the password here if it's included in the data
    // req.body.password = await bcrypt.hash(req.body.password, saltRounds);

    console.log("Register user recieved -> ", req.body);

    let name = xss(req.body.name);
    let emailAddress = xss(req.body.emailAddress);
    let countryCode = xss(req.body.countryCode);
    let phoneNumber = xss(req.body.phoneNumber);
    let address = xss(req.body.address);
    let city = xss(req.body.city);
    let state = xss(req.body.state);
    let pinCode = xss(req.body.pinCode);
    let country = xss(req.body.country);
    let password = xss(req.body.password);
    let securityQuestion = xss(req.body.securityQuestion);
    let securityAnswer = xss(req.body.securityAnswer);

    console.log("Sanitized inputs -> ", {
      name: name,
      emailAddress: emailAddress,
      countryCode: countryCode,
      phoneNumber: phoneNumber,
      address: address,
      city: city,
      state: state,
      pinCode: pinCode,
      country: country,
      password: password,
      securityQuestion: securityQuestion,
      securityAnswer: securityAnswer,
    });

    // Consider not returning the entire user object for privacy/security
    // Consider returning only the needed data
    const createdCustomer = await customer.createCustomer(
      name,
      emailAddress,
      countryCode,
      phoneNumber,
      address,
      city,
      state,
      pinCode,
      country,
      password,
      securityQuestion,
      securityAnswer
    );

    if (createdCustomer.insertedUser === true) {
      //if this condition is valid i will load my login page
      //console.log("Created user validation hit");

      console.log("User created!");

      //using 201 instead of 200 to give more accurate description
      return res.status(201).json({ Success: "Register User Created!" });
    } else {
      //console.log("Didn't blow up !!");
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

router.route("/admin/login").post(async (req, res) => {
  console.log("Admin login route is called");
  try {
    let emailAddress = xss(req.body.emailAddress);
    let password = xss(req.body.password);
    console.log("Sanitized values = ", {
      emailAddress: emailAddress,
      password: password,
    });

    emailAddress = helpers.checkEmptyInputString(emailAddress, "Email Address");
    emailAddress = emailAddress.toLowerCase();
    password = helpers.checkEmptyInputString(password, "Password");

    helpers.checkValidEmail(emailAddress);
    helpers.checkValidPassword(password);

    const loginUser = await admin.checkAdmin(emailAddress, password);

    req.session.user = {
      _id: xss(loginUser._id.toString()),
      name: xss(loginUser.name),
      emailAddress: xss(loginUser.emailAddress),
      countryCode: xss(loginUser.countryCode),
      phoneNumber: xss(loginUser.phoneNumber),
      address: xss(loginUser.address),
      city: xss(loginUser.city),
      state: xss(loginUser.state),
      pinCode: xss(loginUser.pinCode),
      country: xss(loginUser.country),
      userType: xss("Admin"),
    };

    console.log("Ok Admin is logged in!!");

    return res.status(200).json({
      successMsg: "Admin is logged in successfully!",
      sessionUser: req.session.user,
    });
  } catch (error) {
    return res.status(404).json({ Error: error });
  }
});

router.route("/customer/login").post(async (req, res) => {
  console.log("Customer login route is called");
  try {
    let emailAddress = xss(req.body.emailAddress);
    let password = xss(req.body.password);
    console.log("Sanitized values = ", {
      emailAddress: emailAddress,
      password: password,
    });

    emailAddress = helpers.checkEmptyInputString(emailAddress, "Email Address");
    emailAddress = emailAddress.toLowerCase();
    password = helpers.checkEmptyInputString(password, "Password");

    helpers.checkValidEmail(emailAddress);
    helpers.checkValidPassword(password);

    const loginUser = await customer.checkCustomer(emailAddress, password);

    req.session.user = {
      _id: xss(loginUser._id.toString()),
      name: xss(loginUser.name),
      emailAddress: xss(loginUser.emailAddress),
      countryCode: xss(loginUser.countryCode),
      phoneNumber: xss(loginUser.phoneNumber),
      address: xss(loginUser.address),
      city: xss(loginUser.city),
      state: xss(loginUser.state),
      pinCode: xss(loginUser.pinCode),
      country: xss(loginUser.country),
      userType: xss("Customer"),
    };

    console.log("Ok customer is logged in!!");

    return res.status(200).json({
      successMsg: "Customer is logged in successfully!",
      sessionUser: req.session.user,
    });
  } catch (error) {
    return res.status(404).json({ Error: error });
  }
});

router.route("/logout").get((req, res) => {
  console.log("Logout route is called!!");
  req.session.destroy((err) => {
    if (err) {
      console.log("Error : Failed to destroy the session during logout.", err);
      res.status(500).json({ error: "Internal error during logout" });
    } else {
      req.session = null;
      res.status(200).json({ message: "Logged out successfully!" });
    }
  });
});

export default router;
