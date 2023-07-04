import { Router } from "express";
import { ObjectId } from "mongodb";
import { primaryUsers } from "../config/mongoCollections.js";
import { listings } from "../config/mongoCollections.js";
import { scoutUsers } from "../config/mongoCollections.js";
import { messages } from "../config/mongoCollections.js";
import helpers from "../helpers.js";

import bcrypt from "bcryptjs";

const saltRounds = 12;

const router = Router();
