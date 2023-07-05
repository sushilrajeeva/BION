//import express, express router as shown in lecture code

import { Router } from "express";
const router = Router();
import bcrypt from "bcryptjs";

import xss from "xss";
import admin from "../model/admin.js";
import customer from "../model/customer.js";

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
      password
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

export default router;
