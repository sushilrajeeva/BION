import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors"; // Add this
import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import routes from "./routes/index.js";

const app = express();

// Enable All CORS Requests
app.use(cors()); // Add this

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/", routes);

app.use((req, res, next) => {
  // Catch 404 and forward to error handler
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.listen(3000, async () => {
  await dbConnection();
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});

process.on("SIGINT", async () => {
  await closeConnection();
  process.exit(0);
});
