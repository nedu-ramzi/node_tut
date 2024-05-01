import { asyncWrapper } from '../helpers/asyncwrapper.helper.js';
import * as authService from '../services/auth.service.js';
import { User } from '../models/user.model.js';
import { otpGen } from '../helpers/otp.helper.js';
import { sendMail } from '../services/mail/mail.services.js';
import e from 'express';

export const registerUser = asyncWrapper(async function (req, res, next) {
    console.log(req.body);
    const user = await authService.register(req.body);

    return res.status(201).json({
        "success": true,
        "message": "User registered successfully",
        "data": {
            "user": user
        },

    });
});

export const logUserIn = asyncWrapper(async function (req, res, next) {
    const token = await authService.login(req.body);

    res.status(200).json({
        "success": true,
        "message": "User logged in successfully",
        authorization: {
            type: "Bearer",
            token: token
        }
    });
});

export const authenticatedUser = asyncWrapper(async function (req, res, next) {
    return res.status(200).json({
        success: true,
        message: "Authenticated user record returned",
        data: {
            user: req.user
        }
    });
});

export const requestPasswordReset = asyncWrapper(async function (req, res, next) {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email });

        if (!user) {
            return (
                res.status(400).json({
                    success: false,
                    message: "User email not found",
                })
            )
        }
        const otp = otpGen();
        user.otp = otp;
        await user.save();
        console.log({ otp });

        // sendMail({ to: email }, null)
        res.status(200).json({
            success: true,
            message: "OTP sent to your " + email,
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }

});

export const resetPassword = asyncWrapper(async function (req, res, next) { 

});
