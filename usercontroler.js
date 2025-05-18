const user = require("./usermodles.js");
const { setUser } = require("./src/service/auth.js");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const bcrypt = require("bcrypt");
require('dotenv').config();

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,  
    pass: process.env.GMAIL_APP_PASS  
  }
});

async function sendmail(name, email, token) {
  try {
    const mailOptions = {
      from: 'devpriyasaini6@gmail.com',
      to: email,
      subject: 'Password Reset Request',
      html: `<p>Hi ${name}, please copy the token :-<br>${token} <br> and paste it into token input field to reset your password !</p>`
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return info;
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
}

async function register(req, res) {
  const { name, email, password } = req.body;
  try {
    if (password.length <5) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 5 characters"
      });
    }
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await user.create({
      name: name,
      email: email,
      password: hashedPassword,
      token: ''
    });

    const token = setUser(newUser);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    console.error(error);
    return res.status(400).render("register", { 
      error: "Email already exists" 
    });
  }
}

async function loginuser(req, res) {
  const { email, password } = req.body;
  try {
    const users = await user.findOne({ email });
    if (!users) {
      return res.render("login", { error: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, users.password);
    if (!isMatch) {
      return res.render("login", { error: "Invalid username or password" });
    }

    const token = setUser(users);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    console.error(error);
    return res.status(500).render("login", { error: "Server error" });
  }
}

async function forgetpass(req, res) {
  try {
    const { email } = req.body;
    const users = await user.findOne({ email });
    
    if (!users) {
      return res.status(400).json({ msg: "Email not found" });
    }

    const resetToken = randomstring.generate();
    const tokenExpiry = Date.now() + 360; // 1 hour expiry

    await user.updateOne(
      { email }, 
      { $set: { token: resetToken, tokenExpiry } }
    );

    await sendmail(users.name, users.email, resetToken);
    return res.render('reset');
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
}

async function resetpass(req, res) {
  try {
    const { newPassword, confirmPassword,token} = req.body;
    // Check if required fields exist
    if (!newPassword || !confirmPassword ||!token) {
      return res.status(400).json({
        success: false,
        message: "Password and confirmation password are required"
      });
    }

    // Validate password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ 
        success: false,
        message: "Password and confirmation do not match" 
      });
    }

    // Validate password strength
    if (newPassword.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 5 characters"
      });
    }

    // Find user with valid token
    const userData = await user.findOne({ 
      token,
      // tokenExpiry: { $gt: Date.now() } 
    });
   

    if (!userData) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid or expired token" 
      });
    }

    // Update password and clear token
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.findByIdAndUpdate(
      { _id: userData._id },
      { 
        $set: { 
          password: hashedPassword,
          token: null,
          tokenExpiry: null 
        } 
      }
    );

    return res.redirect('/login');
    
  } catch (error) {
    console.error("Password reset error:", error);
    return res.status(500).json({ 
      success: false,
      message: error.message,
    });
  }
}
module.exports = {
  register,
  loginuser,
  forgetpass,
  resetpass,
};