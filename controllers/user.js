const User = require('../models/user')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const { errorHandler} = require('../helpers/dbErrorHandler')

exports.register = (req, res) => {
    // console.log("req.body", req.body);
    const user = new User(req.body)
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                err: errorHandler(err)
            });
        }
        res.json({
            user
        });
    });
};

exports.login = (req, res) => {
    // find the user based on email
    const { name, password } = req.body
    User.findOne({ name }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that username does not exist. Please signup'
            });
        }
        // if user is found make sure the email and password match
        // create authenticate method in user model
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Username and password dont match'
            });
        }
        // generate a signed token with user id and secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
        // persist the token as 't' in cookie with expiry date
        res.cookie('t', token, { expire: new Date() + 9999 });
        // return response with user and token to frontend client
        const { _id, name, role } = user;
        return res.json({ token, user: { _id, name, role } });
    });
};

exports.logout = (req, res) => {
    res.clearCookie('t');
    res.json({ message: 'Logout success' });
};

exports.requireLogin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    userProperty: "auth",
});

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        req.profile = user;
        next();
    });
};

// exports.isAuth = (req, res, next) => {
//     const authHeader = req.headers['authorization']
//     const token = authHeader && authHeader.split(' ')[1]
//     if (token==null) return res.status(401)

//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (user._id == req.profile._id) {
//             return res.json(req.profile)
//         } else {
//             return res.status(403).json({
//             error: 'Access denied'
//         });
//         }
//     next()
//     })
// };

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!user) {
        return res.status(403).json({
            error: 'Access denied'
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: 'Admin resourse! Access denied'
        });
    }
    next();
};