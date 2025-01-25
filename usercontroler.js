const user = require("./usermodles.js");
const { setUser } = require("./service/auth");

async function register(req, res) {
  const { name, email, password } = req.body;
  try {
    const create = await user.create({
      name: name,
      email: email,
      password: password,
    });
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "error is found!" });
  }
}

async function loginuser(req, res) {
  const { email, password } = req.body;
  const users = await user.findOne({ email, password });
  if (!users)
    return res.render("login", { error: "invailed username or password" });
  const token = setUser(users);
  res.cookie("token", token);
  return res.redirect("/");
}

module.exports = {
  register,
  loginuser,
};
