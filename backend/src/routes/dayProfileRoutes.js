const express = require('express');
const validate = require("../middleware/validate");

const {
  dayProfileSchema,
} = require("../validators/dayProfileValidator");
const {
  saveDayProfile,
  getDayProfile,
  deleteDayProfile,
} = require('../controllers/dayProfileController');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


/* =========================================================
   DAY PROFILE
========================================================= */

router.post(
  '/',
  authMiddleware,
  validate(dayProfileSchema),
  saveDayProfile
);


router.get(
  '/',
  authMiddleware,
  getDayProfile
);


router.delete(
  '/',
  authMiddleware,
  deleteDayProfile
);


module.exports = router;