import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // const hashedPassword = await bcrypt.hash(password, 10); //double hashing hori toh comment out kr diya
    const newUser = new User({ name, email, password });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(201).json({ token });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ error: "Signup failed" });
  }
};

// export const login = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: 'User not found' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
//     res.json({ token });
//   } catch (error) {
//     console.error('Login error:', error.message);
//     res.status(500).json({ error: 'Login failed' });
//   }
// };

export const login = async (req, res) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const password = String(req.body.password || "");

    const user = await User.findOne({ email });
    // same generic error for both cases (security)
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Ensure comparePassword is defined in your User model (User.js), not here.
    // Remove any comparePassword method definition from this controller.
    // If password is not hashed before saving, add a pre-save hook in your User model:
    //
    // userSchema.pre('save', async function (next) {
    //   if (!this.isModified('password')) return next();
    //   this.password = await bcrypt.hash(this.password, 10);
    //   next();
    // });
    //
    // Then, in your User model:
    // userSchema.methods.comparePassword = async function (enteredPassword) {
    //   return await bcrypt.compare(enteredPassword, this.password);
    // };
    //
    // Here, just call the method:
    const isMatch = await user.comparePassword(password); // <-- use model method
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Login failed" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Profile error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};
