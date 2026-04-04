import userModel from "../models/user.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import express from "express";
import sessionModel from "../models/session.model.js";
import { sendEmail } from "../services/email.service.js";
import { generateOtp, getOtphtml } from "../utils/utils.js";
import otpModel from "../models/otp.model.js";
import { send } from "process";



// ✅ REGISTER
export async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    // email = email.toLowerCase(); // normalize

    // 🔍 Check existing user
    const isAlreadyRegistered = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isAlreadyRegistered) {
      return res.status(409).json({
        message: "username or email already exists",
      });
    }

    // 🔐 Hash password
    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

    // 👤 Create user
    const user = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    await otpModel.deleteMany({ email }); // delete old OTPs if any

    const otp = generateOtp();
    console.log("Generated OTP:", otp); // debug
    const html = getOtphtml(otp);

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    await otpModel.create({
      email,
      user: user._id,
      otpHash
    });

    await sendEmail(email, "Verify your email, OTP Verification", `Your OTP is ${otp}`, html)

    // const refreshToken = jwt.sign(
    //   {
    //     id: user._id,
    //   },
    //   process.env.JWT_SECRET,
    //   {
    //     expiresIn: "7d",
    //   },
    // );

    // const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    // const session = await sessionModel.create({
    //   user: user._id,
    //   refreshTokenHash,
    //   ip: req.ip,
    //   userAgent: req.headers["user-agent"]
    // })

    // 🔑 Generate token
    // const accessToken = jwt.sign({ 
    //   id: user._id 
    // }, process.env.JWT_SECRET, {
    //   expiresIn: "15m",
    // });

    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "strict",
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    // });
  

    // ✅ Response
    res.status(201).json({
      message: "user registered successfully",
      user: {
        username: user.username,
        email: user.email,
        verified: user.verified
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

export async function login(req, res) {
  const {email, password} = req.body;

  const user = await userModel.findOne({ email })

  if(!user) {
    return res.status(401).json({
      message: "Invalid email or password"
    })
  }

  if(!user.verified) {
    return res.status(401).json({
      message: "Please verify your email before logging in"
    })
  }

  const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

  const isPasswordValid = hashedPassword === user.password;
  
  if(!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid email or password"
    })
  }

  const refreshToken = jwt.sign(
    {
      id: user._id,
    }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    }
  )
  const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

  const session = await sessionModel.create({
    user: user._id,
    refreshTokenHash,
    ip: req.ip,
    userAgent: req.headers["user-agent"]
  })

  const accessToken = jwt.sign({
    id: user._id,
    sessionId: session._id
  }, process.env.JWT_SECRET, {
    expiresIn: "15m"
  })

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // ⚠️ set false for localhost
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  })

  res.status(200).json({
    message: "Logged in successfully",
    user: {
      username: user.username,
      email: user.email
    },
    accessToken
  })
}

// 📁 `getMe` API

export async function getMe(req, res) {
  try {
    const authHeader = req.headers.authorization;
    console.log("Auth Header:", authHeader);

    if (!authHeader) {
      return res.status(401).json({
        message: "token not found",
      });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded:", decoded);

    // ✅ Fetch user from DB
    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ✅ Final response (ONLY ONE RESPONSE)
    res.status(200).json({
      message: "User fetched successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("ERROR:", error.message);

    res.status(401).json({
      message: "Invalid token",
    });
  }
}

export async function refreshToken(req, res) {
  try {
    console.log("SECRET:", process.env.JWT_SECRET);
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token not found",
      });
    }

    // ✅ VERIFY TOKEN
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    // ✅ HASH TOKEN (to match DB)
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    // ✅ CHECK SESSION IN DB
    const session = await sessionModel.findOne({
      refreshTokenHash,
      revoked: false 
    });

    if (!session) {
      return res.status(401).json({
        message: "Session not found or invalid",
      });
    }

    // ✅ CREATE NEW ACCESS TOKEN
    const accessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // ✅ ROTATE REFRESH TOKEN (BEST PRACTICE)
    const newRefreshToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const newRefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex");

    // ✅ UPDATE SESSION
    session.refreshTokenHash = newRefreshTokenHash;
    await session.save();

    // ✅ SET COOKIE
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false, // ⚠️ set false for localhost
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Access token refreshed successfully",
      accessToken,
    });

  } catch (error) {
    console.log("ERROR:", error.message);

    return res.status(401).json({
      message: "Invalid or expired refresh token",
    });
  }
}

// LogOut Function
export async function logout(req, res) {

  const refreshToken = req.cookies.refreshToken;

  if(!refreshToken) {
    return res.status(400).json({
      message: "Refresh token not found"
    })
  }

  const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

  const session = await sessionModel.findOne({
    refreshTokenHash,
    revoked: false
  })

  if(!session) {
    return res.status(400).json({
      message: "Invalid refresh token"
    })
  }

  session.revoked = true;
  await session.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  })

  return res.status(200).json({
    message: "Logged Out Successfully"
  })
}

// logoutAll
export async function logoutAll(req, res) {

  const refreshToken = req.cookies.refreshToken;

  if(!refreshToken) {
    return res.status(400).json({
      message: "Refresh token not found"
    })
  }

  const decoded =  jwt.verify(refreshToken, process.env.JWT_SECRET)

  await sessionModel.updateMany({
    user: decoded.id,
    revoked: false
  }, {
    revoked: true
  })

  res.clearCookie("refreshToken")

  return res.status(200).json({
    message: "Logged Out From all devices Successfully"
  })
}

export async function verifyEmail(req, res) {
  try {
    let { email, otp } = req.body;

    // ✅ normalize email
    email = email.toLowerCase();

    // ✅ normalize OTP (IMPORTANT FIX)
    const otpHash = crypto
      .createHash("sha256")
      .update(String(otp).trim())
      .digest("hex");

    console.log("Entered OTP:", otp);
    console.log("Generated Hash:", otpHash);

    const otpRecord = await otpModel.findOne({
      email,
      otpHash,
      expiresAt: { $gt: new Date() } // Check if not expired
    });

    if (!otpRecord) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    // ✅ update user
    const user = await userModel.findByIdAndUpdate(
      otpRecord.user,
      { verified: true },
      { new: true }
    );

    // ✅ delete OTP properly
    await otpRecord.deleteOne();

    return res.status(200).json({
      message: "Email verified successfully",
      user: {
        username: user.username,
        email: user.email,
        verified: user.verified,
      },
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
}

// ✅ RESEND OTP
export async function resendOTP(req, res) {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if already verified
    if (user.verified) {
      return res.status(400).json({
        message: "Email already verified",
      });
    }

    // Delete old OTPs
    await otpModel.deleteMany({ email });

    // Generate new OTP
    const otp = generateOtp();
    console.log("Resent OTP:", otp);
    const html = getOtphtml(otp);

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    await otpModel.create({
      email,
      user: user._id,
      otpHash
    });

    await sendEmail(email, "Verify your email, OTP Verification", `Your OTP is ${otp}`, html);

    res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
}