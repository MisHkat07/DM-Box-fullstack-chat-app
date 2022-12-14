const formidable = require("formidable");
const validator = require("validator");
const UserModel = require("../models/auth-model");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.userRegister = (req, res) => {
  const form = formidable();
  form.parse(req, async (err, fields, files) => {
    const { username, email, password, confirmPassword } = fields;

    const error = [];
    if (!username) {
      error.push("Username can't be empty.");
    }
    if (!email) {
      error.push("Email can't be empty.");
    }
    if (email && !validator.isEmail(email)) {
      error.push("Provide a valid Email.");
    }
    if (!password) {
      error.push("Provide a password.");
    }
    if (!confirmPassword) {
      error.push("Confirm your password.");
    }
    if (password && confirmPassword && password !== confirmPassword) {
      error.push("Unmatched Password!");
    }
    if (password && password.length < 6) {
      error.push("Password must be more than 6 charecters.");
    }
    if (error.length > 0) {
      res.status(400).json({
        error: {
          errorMessage: error,
        },
      });
    } else {
      const getImageName = files.image.originalFilename;
      const randomNum = Math.floor(Math.random() * 99999);
      let newImageName = randomNum + getImageName;
      files.image.originalFilename = newImageName;
      const newPath =
        __dirname +
        `../../../frontend/public/image/${files.image.originalFilename}`;
      try {
        const checkUser = await UserModel.findOne({ email: email });
        if (checkUser) {
          res.status(404).json({
            error: {
              errorMessage: ["User already exists!"],
            },
          });
        } else {
          fs.copyFile(files.image.filepath, newPath, async (error) => {
            if (!error) {
              const userCreate = await UserModel.create({
                username,
                email,
                password: await bcrypt.hash(password, 10),
                image: files.image.originalFilename,
              });

              const token = jwt.sign(
                {
                  id: userCreate.id,
                  email: userCreate.email,
                  username: userCreate.username,
                  image: userCreate.image,
                  registerTime: userCreate.createdAt,
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.TOKEN_EXPIRE }
              );

              const options = {
                expires: new Date(
                  Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
                ),
              };
              res.status(201).cookie("authToken", token, options).json({
                successMessage: "Registration Successful!",
                token,
              });
            } else {
              res.status(500).json({
                error: { errorMessage: ["Server Error!"] },
              });
            }
          });
        }
      } catch (error) {
        res.status(500).json({
          error: { errorMessage: ["Server Error!"] },
        });
      }
    }
  });
};

module.exports.userLogin = async (req, res) => {
  const error = [];
  const { email, password } = req.body;
  if (!email) error.push("Please enter your Email!");
  if (!password) error.push("Please enter your Password!");
  if (email && !validator.isEmail(email)) {
    error.push("Provide your valid Email.");
  }
  if (error.length > 0) {
    res.status(400).json({
      error: {
        errorMessage: error,
      },
    });
  } else {
    try {
      const checkUser = await UserModel.findOne({ email: email }).select(
        "+password"
      );

      if (checkUser) {
        const matchPassword = await bcrypt.compare(
          password,
          checkUser.password
        );

        if (matchPassword) {
          const token = jwt.sign(
            {
              id: checkUser.id,
              email: checkUser.email,
              username: checkUser.username,
              image: checkUser.image,
              registerTime: checkUser.createdAt,
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.TOKEN_EXPIRE }
          );

          const options = {
            expires: new Date(
              Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
            ),
          };

          res.status(200).cookie("authToken", token, options).json({
            successMessage: "Login was Successful!",
            token,
          });
        } else {
          res
            .status(400)
            .json({ error: { errorMessage: ["Wrong Password!"] } });
        }
      } else {
        res.status(400).json({
          error: { errorMessage: ["User not found with this email!"] },
        });
      }
    } catch (error) {
      res
        .status(404)
        .json({ error: { errorMessage: ["Internal server error!"] } });
    }
  }
};
