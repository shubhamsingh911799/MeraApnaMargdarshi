const express = require('express');

const {
 registerUser,
 loginUser,
 getCurrentUser,
 updateUserProfile,
} = require('../controllers/authController');

const authMiddleware =
require('../middleware/authMiddleware');

const validate =
require('../middleware/validate');

const {
 registerSchema,
 loginSchema,
} = require('../validators/authValidator');

const router =
express.Router();

router.post(
 '/register',
 validate(registerSchema),
 registerUser
);

router.post(
 '/login',
 validate(loginSchema),
 loginUser
);

router.get(
 '/me',
 authMiddleware,
 getCurrentUser
);

router.put(
 '/profile',
 authMiddleware,
 updateUserProfile
);

module.exports = router;