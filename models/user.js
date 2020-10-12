const mongoose = require('mongoose')
const crypto = require('crypto')
const { v1: uuidv1 } = require('uuid')

// const division = {
//     values: ['IT', 'Design', 'Human Resources'],
//     message: 'Division not found.'
// }

// const level = {
//     values: ['Employee', 'Manager'],
//     message: 'Level not valid'
// }

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please fill in all fields.']
        },
        // email: {
        //     type: String,
        //     trim: true,
        //     required: true,
        //     unique: true
        // },
        hashed_password: {
            type: String,
            required: true
        },
        // division: {
        //     type: String,
        //     required: [true, 'Please fill in all fields.'],
        //     enum: division
        // },
        salt: String,
        role: {
            type: Number,
            default: 0
        },
        // level: {
        //     type: String,
        //     required: [true, 'Please fill in all fields.'],
        //     enum: level
        // }
    },
    { timestamps: true }
);

// virtual field
userSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = uuidv1();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

userSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    encryptPassword: function(password) {
        if (!password) return '';
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    }
};

module.exports = mongoose.model('User', userSchema);
