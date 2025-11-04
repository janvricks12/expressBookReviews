const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Initialize session middleware
app.use("/customer", session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

// 🔒 Authentication middleware using session authorization
app.use("/customer/auth/*", function auth(req, res, next) {
  if (req.session.authorization) { // Check if session has authorization info
    const token = req.session.authorization['accessToken']; // Retrieve JWT token

    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        req.user = user; // Attach decoded user info to the request
        next(); // Proceed to the next middleware/route
      } else {
        return res.status(403).json({ message: "User not authenticated" });
      }
    });
  } else {
    return res.status(403).json({ message: "User not logged in" });
  }
});

const PORT = process.env.PORT || 8080;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
