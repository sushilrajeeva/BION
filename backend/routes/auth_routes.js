//import express, express router as shown in lecture code

import { Router } from "express";
const router = Router();
import bcrypt from "bcryptjs";

import xss from "xss";
import admin from "../model/admin.js";

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

    // Consider not returning the entire user object for privacy/security
    // Consider returning only the needed data
    res.status(200).json({ adminUser: "Register User Created!" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while registering the admin" });
  }
});

export default router;
