const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator');

const {
    register,
    login,
    logout,
    requireLogin,
    userById,
    isAuth,
    isAdmin
} = require("../controllers/user")

router.post('/register'
    // [
    // 	check('name')
    //         .notEmpty()
    //         .withMessage('Name cannot be empty'),
    //     // check('email')
    //     //     .isEmail()
    //     //     .withMessage('Email is not valid')
    //     //     .isLength({
    //     //         min: 4,
    //     //         max: 32
    //     //     }),
    //     check('password', 'Password is required').notEmpty(),
    //     check('password')
    //         .isLength({ min: 4 })
    //         .withMessage('Password must contain at least 6 characters')
    //         .matches(/\d/)
    //         .withMessage('Password must contain a number')
    //    ],(req,res) => {
    //    	const errors = validationResult(req);

    //    	if (!errors.isEmpty()) {
    //    		return res.status(400).json({ error: errors.array().map(error => error.msg)[0]});
    //    	}
    //    }
    , register)
router.post('/login', login)
router.get('/logout', logout)
router.get('/secret/:userId', requireLogin, isAuth, isAdmin, (req, res) => {
    res.json({
        user: req.profile
    });
});

router.param('userId', userById)

module.exports = router