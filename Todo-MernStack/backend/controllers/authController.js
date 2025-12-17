import { User } from "../models/User.js";

export const registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "Please include all fields" });
    return;
  }

  //check if user exit
  const userExit = await User.findOne({ email });
  if (userExit) {
    return res.status(400).json({ message: "Email id already exits" });
    return;
  }

  // The 'pre' save hook in User.js will automatically hash the password here.
  const user = await User.create({
    fullName,
    email,
    password,
  });

  if (user) {
    return res.status(201).json({
      _id: user.id,
      fullName: user.fullName,
      email: user.email,
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password are required" });
    }
    const emailExit = await User.findOne({ email });

    if (!emailExit) {
      return res.status(400).json({ message: "Email does not exist" });
    }

    const isPasswordMatch = await emailExit.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Password not matched" });
    }

    return res.status(200).json({
      _id: emailExit._id,
      fullName: emailExit.fullName,
      email: emailExit.email,
      message: "Login successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
