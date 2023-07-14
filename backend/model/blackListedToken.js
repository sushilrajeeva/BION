import { Router } from "express";
import { ObjectId } from "mongodb";
import Joi from "joi";
import helpers from "../helpers.js";

import mongoose from "mongoose";

import { blackListedTokenCollection } from "../config/mongoCollections.js";

export const createBlackListedToken = async (token, expiry) => {
  const schema = Joi.object({
    token: Joi.string().required(),
    expiry: Joi.date().required(),
  });

  const { error } = schema.validate({ token, expiry });

  if (error) {
    throw new Error("Validation Error: " + error.details[0].message);
  }

  const blackListedTokens = await blackListedTokenCollection();

  // Create the TTL index on the expiry field
  await blackListedTokens.createIndex({ expiry: 1 }, { expireAfterSeconds: 0 });

  const newBlackListedToken = {
    token: token,
    expiry: expiry,
  };

  const insertInfo = await blackListedTokens.insertOne(newBlackListedToken);
  if (insertInfo.insertedCount === 0) throw new Error("Could not add token");

  return newBlackListedToken;
};

// export const isTokenBlacklisted = async (token) => {
//   const blackListedTokens = await blackListedTokenCollection();
//   const blacklistedToken = await blackListedTokens.findOne({
//     token: token,
//   });

//   return blacklistedToken !== null;
// };

export const isTokenBlacklisted = async (token) => {
  console.log("Logging token!!", token);
  const blackListedTokens = await blackListedTokenCollection();
  const blacklistedToken = await blackListedTokens.findOne({ token });
  console.log("Is token blacklisted? ", !!blacklistedToken);
  return !!blacklistedToken; // return true if the token is found, else false
};
export default { createBlackListedToken, isTokenBlacklisted };
