const isEmail = require("validator/lib/isEmail");
const activitySectors = require("../Configuration/activity_sectors");
const format = require("date-fns/format");
const { isAfter } = require("date-fns");

const inputDataTreatment = (req, res, next) => {
  req.errorMessage = "";

  if (!Object.keys(req.body).includes("password")) {
    req.isError = true;
    req.errorMessage += "You need to specify a password";
  }

  Object.keys(req.body).forEach(key => {
    req.body[key] = req.body[key].trim();

    switch (key) {
      case "firstName":
        req.body[key] =
          req.body[key].slice(0, 1).toUpperCase() +
          req.body[key].slice(1).toLowerCase();
        break;

      case "lastName":
        req.body[key] = req.body[key].toUpperCase();
        break;

      case "email":
        if (!isEmail(req.body[key])) {
          req.isError = true;
          req.errorMessage += "Wrong email format. ";
        } else {
          req.body[key] = req.body[key].toLowerCase();
        }
        break;
      case "activitySectors":
        if (!activitySectors.includes(req.body[key])) {
          req.isError = true;
          req.errorMessage += "Wrong activity sectors. ";
        }
        break;
      case "telephone":
        if (req.body[key].length !== 10 || isNaN(parseInt(req.body[key]))) {
          req.isError = true;
          req.errorMessage += "Wrong telephone format. ";
        }
        break;
      case "availableDate":
        if (Date.parse(req.body[key])) {
          if (isAfter(Date.parse(req.body[key]), Date.now())) {
            req.body[key] = format(Date.parse(req.body[key]), "YYYY-MM-DD");
          } else {
            req.isError = true;
            req.errorMessage += "Date is in the past. Not possible. ";
          }
        } else {
          req.isError = true;
          req.errorMessage += "Wrong date format";
        }
        break;
      case "password":
        if (req.body[key].length < 6) {
          req.isError = true;
          req.errorMessage +=
            "Your password should be at least 6 characters long.";
        }
        break;
    }
  });

  next();
};

module.exports = inputDataTreatment;
