const middlewareMethods = {
  description: "This is my helper function for adding middlewares",

  adminOnly: (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ error: "Not logged in! Please login as admin." });
    } else if (req.user.userType === "Admin") {
      next(); // The user is an admin, so we allow the request to proceed.
    } else {
      // The user is not an admin, so we send an error response.
      res.status(403).json({ error: "This route is for admins only." });
    }
  },

  customerOnly: (req, res, next) => {
    if (!req.user) {
      res
        .status(401)
        .json({ error: "Not logged in! Please login as customer." });
    } else if (req.user.userType === "Customer") {
      next(); // The user is a customer, so we allow the request to proceed.
    } else {
      // The user is not a customer, so we send an error response.
      res.status(403).json({ error: "This route is for customers only." });
    }
  },
};

export default middlewareMethods;
