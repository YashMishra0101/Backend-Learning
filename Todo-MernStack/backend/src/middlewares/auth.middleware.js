import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/user.model.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    //Read token from Authorization header
    // Format: "Authorization: Bearer <token>"

    /*
      Example of an actual request header
      const headers = {
      Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9 eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNjcwNDA5ODIyfQ.sflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    };
    */
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    //If token is missing → block access
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }
    //Verify JWT tokens
    const decoded = jwt.verify(token, env.JWT_SECRET);

    //Fetch user from database using decoded userId

    const user = await User.findById(decoded.userId).select("-password");//The JWT token contained a hidden user ID (decoded.userId). We use this ID to search your MongoDB database to ensure the user actually exists.


    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    //Attach user to request object

    req.user = user; //The Backpack: In Express, the req object is like a backpack that gets passed from one function to the next, any future function (like your createTodo controller) can simply open the backpack (req.user) to know exactly who is making the request (e.g., req.user._id). This is how the Todo controller knows who owns the new Task. 

    //Allow request to proceed
    next(); // When next() is executed in the Auth Middleware, it signals that the security check is passed. The request leaves the router.use(protect) middleware (In todo.routes.js file) and immediately executes the specific controller function that matches the user's request, such as createTodo for POST or getTodos for GET.
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, invalid token",
    });
  }
};



/*
Extracting the Bearer Token in Middleware

In standard JWT authentication, the client sends the token in the Authorization header as a single string following the format "Bearer <actual_token_string>". To isolate the token for verification, we use the method .split(" ")[1].

The Split: The .split(" ") command acts like a separator, cutting the string wherever it finds a space.

The Result: It creates an array with two parts: index [0] holds the prefix "Bearer", and index [1] holds the actual token.

The Usage: We specifically target [1] to discard the "Bearer" label and retrieve the clean token string needed to verify the user's identity.

Result (Array): ["Bearer", "myToken123"]
[0] is "Bearer"
[1] is "myToken123" (The part we want)
*/