import { Router } from "express";
import { ObjectId } from "mongodb";
import { adminCollection } from "../config/mongoCollections.js";
import bcrypt from "bcryptjs";
import Joi from "joi";
import helpers from "../helpers.js";

const saltRounds = 12;

const router = Router();

// User input validation schema
const userSchema = Joi.object({
  name: Joi.string().required(),
  emailAddress: Joi.string().email().required(),
  countryCode: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  pinCode: Joi.string().required(),
  country: Joi.string().required(),
  password: Joi.string().required(),
});

export const createAdmin = async () => {
  try {
    let adminData = {
      name: "Meenakshi Verma",
      emailAddress: "bion.essentials@gmail.com",
      countryCode: "+91",
      phoneNumber: "9873938621",
      address: "Rohini, New Delhi",
      city: "Rohini",
      state: "New Delhi",
      pinCode: "110085",
      country: "India",
      password: "Admin@123",
    };

    // Validate the hardcoded data
    const validationResult = userSchema.validate(adminData);
    if (validationResult.error) {
      throw new Error(validationResult.error.details[0].message);
    }

    const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);
    const adminCol = await adminCollection();

    const adminUser = await adminCol.findOne({
      emailAddress: adminData.emailAddress,
    });

    if (adminUser) {
      throw `The email address - ${adminData.emailAddress} that you used to register as admin user, already exist! Please login!`;
    }

    let adminUserData = {
      _id: new ObjectId(),
      name: adminData.name,
      emailAddress: adminData.emailAddress,
      countryCode: adminData.countryCode,
      phoneNumber: adminData.phoneNumber,
      address: adminData.address,
      city: adminData.city,
      state: adminData.state,
      pinCode: adminData.pinCode,
      country: adminData.country,
      password: hashedPassword,
    };

    const insertInfo = await adminCol.insertOne(adminUserData);

    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw "Could not add user";
    }

    return { insertedUser: true };
  } catch (error) {
    throw error;
  }
};

export const getAdmin = async (emailAddress) => {
  try {
    const adminCol = await adminCollection();
    const adminUser = await adminCol.findOne({ emailAddress });

    // If findOne returns null (no adminUser found), it means the admin doesn't exist
    return adminUser !== null;
  } catch (error) {
    throw error;
  }
};

export const checkAdmin = async (emailAddress, password) => {
  try {
    console.log("Check Admin model is called!");

    emailAddress = helpers.checkEmptyInputString(emailAddress, "Email Address");
    emailAddress = emailAddress.toLowerCase();
    password = helpers.checkEmptyInputString(password, "Password");

    helpers.checkValidEmail(emailAddress);
    helpers.checkValidPassword(password);

    const usersCollection = await adminCollection();
    const user = await usersCollection.findOne({ emailAddress });

    if (!user) {
      throw `Either the email address or password is invalid`;
    }

    let compareToMatch = await bcrypt.compare(password, user.password);

    if (compareToMatch) {
      console.log("The passwords match.. this is good");
      return {
        _id: user._id.toString(),
        name: user.name,
        emailAddress: user.emailAddress,
        countryCode: user.countryCode,
        phoneNumber: user.phoneNumber,
        address: user.address,
        city: user.city,
        state: user.state,
        pinCode: user.pinCode,
        country: user.country,
      };
    } else {
      console.log(
        "The passwords do not match, this is not good, they should match"
      );
      throw `Either the email address or password is invalid`;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default { createAdmin, getAdmin, checkAdmin };
