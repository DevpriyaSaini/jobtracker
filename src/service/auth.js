const jwt = require("jsonwebtoken");
const secret = "devpriya$123@";
function setUser(user) {
  if (!user || !user._id || !user.email) {
    console.error("Invalid user object provided.");

    return null;
  }

  try {
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
      },
      secret,
      { expiresIn: "8h" }
    );
    return token;
  } catch (error) {
    console.error("Error generating JWT:", error.message);
    return null;
  }
}

function getUser(token) {
  if (!token) {
    console.error("No token provided.");
    return null;
  }

  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return null;
  }
}

module.exports = {
  setUser,
  getUser,
};
