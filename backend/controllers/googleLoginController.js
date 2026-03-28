import { OAuth2Client } from "google-auth-library";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 🔐 JWT generator
const createToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const googleLoginUser = async (req, res) => {
  try {
    const { token } = req.body;

    // ✅ 1. Validate request
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Google token missing",
      });
    }

    // ✅ 2. Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).json({
        success: false,
        message: "Invalid Google token",
      });
    }

    const { email, name, picture, sub } = payload;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email not found",
      });
    }

    // ✅ 3. Find user
    let user = await userModel.findOne({ email });

    // ✅ 4. Create user if not exists
    if (!user) {
      user = await userModel.create({
        name,
        email,
        password: "google-auth",
        image: picture,
        googleId: sub,
      });
    }

    // ✅ 5. Generate JWT
    const authToken = createToken(user._id);

    // ✅ 6. Send response
    res.status(200).json({
      success: true,
      token: authToken,
      user,
    });

  } catch (error) {
    console.error("GOOGLE LOGIN ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Google Login Failed",
      error: error.message,
    });
  }
};

export default googleLoginUser;