import { User } from "../models/User.js";

export const registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  if ((!fullName, !email, !password)) {
    res.status(400).json({ message: "Please include all fields" });
    return;
  }

  //check iif user exit
  const userExit = await User.findOne({ email });
  if (userExit) {
    res.status(400).json({ message: "Email id already exits" });
    return;
  }

  // The 'pre' save hook in User.js will automatically hash the password here!

  const user = await User.create({
    fullName,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      fullName: user.fullName,
      email: user.email,
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};
