const express = require("express");

const router = express.Router();

//import model USER.
const User = require("../Models/User.js");

//import package to salt password
const uidSafe = require("uid-safe");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

//import middleware
const isLogged = require("../Middlewares/isLogged");
const inputDataTreatment = require("../Middlewares/inputDataTreatment");

// CRUD
//Create new users
router.post("/createUser", inputDataTreatment, async (req, res) => {
  if (req.isError) {
    res.status(400).json({ message: req.errorMessage });
  } else {
    try {
      const user = await User.findOne({ "public.email": req.body.email });
      if (user) {
        res.status(400).json({ message: "Email already in the database." });
      } else {
        const salt = uidSafe.sync(19);

        const token = uidSafe.sync(19);

        const newUser = new User({
          public: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            telephone: req.body.telephone,
            activitySectors: req.body.activitySectors,
            availableDate: req.body.availableDate,
            token: token
          },
          private: {
            salt: salt,
            hash: SHA256(req.body.password, salt).toString(encBase64)
          }
        });

        await newUser.save();
        res.status(200).json({ user: newUser.public });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
});

router.get("/readUsers", isLogged, async (req, res) => {
  try {
    const users = await User.find(null, "public");
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/login", inputDataTreatment, async (req, res) => {
  if (req.isError) {
    res.status(400).json({ message: req.errorMessage });
  } else {
    try {
      const user = await User.findOne({ "public.email": req.body.email });

      if (user) {
        if (
          SHA256(req.body.password, user.private.salt).toString(encBase64) ===
          user.private.hash
        ) {
          res.status(200).json({ user: user.public });
        } else {
          res.status(400).json({ message: "Wrong password" });
        }
      } else {
        return res.status(400).json({ message: "Wrong email" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
});

router.get("/readToken", isLogged, async (req, res) => {
  try {
    if (req.user) {
      res.status(200).json({ user: req.user.public });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
module.exports = router;
