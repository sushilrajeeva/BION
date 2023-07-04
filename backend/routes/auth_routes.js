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

export default router;
