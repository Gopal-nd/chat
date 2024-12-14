import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { genrateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";


export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashPassword,
    });

    await newUser.save();

    // Generate JWT token
    genrateToken(newUser._id, res);

    return res.status(200).json({
      message: "User created successfully",
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
    });
  } catch (error) {
    console.error("Error in signup controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};





export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    genrateToken(user._id, res);

    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



   export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successful" });
  } catch (error) {
    console.log("Error in controller", error);

    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      res.status(400).json({ message: "profile pic required" });
    }

    const uploadReponse = await cloudinary.uploader.upload(profilePic);

    const updateUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadReponse.secure_url },
      { new: true },
    );

    return res.status(200).json(uploadReponse);
  } catch (error) {
    console.log("Error in controller", error);

    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = async(req,res)=>{
try {
 res.status(200).json(req.user); 
} catch (error) {
      console.log("Error in controller", error);

    res.status(500).json({ message: "Internal server error" });

}
}

