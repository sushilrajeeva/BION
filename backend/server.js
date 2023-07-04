import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import routes from "./routes/index.js"; // Import your routes

const app = express();

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

app.use("/", routes); // Use your routes in your Express application

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

// Close connection when the server stops
process.on("SIGINT", async () => {
  await closeConnection();
  process.exit(0);
});
