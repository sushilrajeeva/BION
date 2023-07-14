import { Router } from "express";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import Joi from "joi";
import { customerCollection } from "../config/mongoCollections.js";
import helpers from "../helpers.js";

const saltRounds = 12;

const router = Router();

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
  securityQuestion: Joi.string().required(),
  securityAnswer: Joi.string().required(),
});

export const createCustomer = async (
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
) => {
  console.log("Create Customer Function Model is called!");

  try {
    let custData = {
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
    };

    // Validate the data
    const validationResult = userSchema.validate(custData);
    if (validationResult.error) {
      throw new Error(validationResult.error.details[0].message);
    }

    const hashedPassword = await bcrypt.hash(custData.password, saltRounds);
    const custCol = await customerCollection();

    const custUser = await custCol.findOne({
      emailAddress: custData.emailAddress,
    });

    if (custUser) {
      throw `The email address - ${adminData.emailAddress} that you used to register as a customer user, already exist! Please login!`;
    }

    let custUserData = {
      _id: new ObjectId(),
      name: custData.name,
      emailAddress: custData.emailAddress,
      countryCode: custData.countryCode,
      phoneNumber: custData.phoneNumber,
      address: custData.address,
      city: custData.city,
      state: custData.state,
      pinCode: custData.pinCode,
      country: custData.country,
      password: hashedPassword,
      securityQuestion: custData.securityQuestion,
      securityAnswer: custData.securityAnswer,
    };

    const insertInfo = await custCol.insertOne(custUserData);

    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw "Could not add customer!!";
    }

    return { insertedUser: true };
  } catch (error) {
    throw error;
  }
};

export const getCustomer = async (emailAddress) => {
  try {
    console.log("Get customer model is called!");
    const custCol = await customerCollection();
    const custUser = await custCol.findOne({ emailAddress });

    // If findOne returns null (no adminUser found), it means the admin doesn't exist
    return custUser !== null;
  } catch (error) {
    throw error;
  }
};

export const checkCustomer = async (emailAddress, password) => {
  try {
    console.log("Check customer model is called!");

    emailAddress = helpers.checkEmptyInputString(emailAddress, "Email Address");
    emailAddress = emailAddress.toLowerCase();
    password = helpers.checkEmptyInputString(password, "Password");

    helpers.checkValidEmail(emailAddress);
    helpers.checkValidPassword(password);

    const usersCollection = await customerCollection();
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
    throw error;
  }
};

export const forgotPassword = async (
  emailAddress,
  securityQuestion,
  securityAnswer,
  newPassword
) => {
  try {
    console.log("forgot password customer model is called!");

    emailAddress = helpers.checkEmptyInputString(emailAddress, "Email Address");
    emailAddress = emailAddress.toLowerCase();
    securityQuestion = helpers.checkEmptyInputString(
      securityQuestion,
      "Security Question"
    );
    securityAnswer = helpers.checkEmptyInputString(
      securityAnswer,
      "Security Answer"
    );
    newPassword = helpers.checkEmptyInputString(newPassword, "Password");

    helpers.checkValidEmail(emailAddress);
    helpers.checkValidPassword(newPassword);

    const usersCollection = await customerCollection();
    const user = await usersCollection.findOne({ emailAddress });

    if (!user) {
      throw `The email address ${emailAddress} you entered doesn't exist`;
    }

    let compareToMatch = await bcrypt.compare(newPassword, user.password);

    if (compareToMatch) {
      throw `can't use your old password to reset`;
    }

    if (user.securityQuestion !== securityQuestion) {
      throw `Security Question or Answer is incorrect`;
    }

    if (user.securityAnswer !== securityAnswer) {
      throw `Security Question or Answer is incorrect`;
    }

    resetPassword(emailAddress, newPassword);
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (emailAddress, newPassword) => {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    const custCol = await customerCollection();

    const result = await custCol.updateOne(
      { emailAddress: emailAddress },
      { $set: { password: hashedPassword } }
    );

    if (result.modifiedCount === 0) {
      throw new Error(
        "Password reset failed. No matching customer found for the given email address."
      );
    }

    return true;
  } catch (error) {
    throw error;
  }
};

export default {
  createCustomer,
  getCustomer,
  checkCustomer,
  resetPassword,
  forgotPassword,
};
