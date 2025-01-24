const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

exports.registerUser = async (userData) => {
    const { username, email, password } = userData;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        throw new Error('Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const token = crypto.randomBytes(20).toString('hex');

    const tempUser = {
        username,
        fullname: userData.fullname,
        password: hashedPassword,
        email,
        ngaySinh: userData.ngaySinh,
        gioiTinh: userData.gioiTinh,
        sachYeuThich: [],
        sachSangTac: [],
        confirmationToken: token,
        confirmationExpires: Date.now() + 3600000, // 1 hour

    };

    global.tempUsers = global.tempUsers || {};
    global.tempUsers[token] = tempUser;

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'tranthanhnam3024@gmail.com',
            pass: 'zeku tdtg hhcd xsth'
        }
    });


    const mailOptions = {
        to: tempUser.email,
        from: 'tranthanhnam3024@gmail.com',
        subject: 'Email Confirmation',
        text: `Please click the following link to confirm your email: 
        http://${userData.host}/auth/confirm/${token}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
               
                <h2 style="color: #333;">Email Confirmation</h2>
                <p>Dear ${tempUser.fullname},</p>
                <p>Thank you for registering. Please click the button below to confirm your email address:</p>
                <div style="text-align: center; margin: 20px 0;">
                    <a href="http://${userData.host}/api/user/confirm/${token}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; border-radius: 5px; text-decoration: none;">Confirm Email</a>
                </div>
                <p>If you did not request this, please ignore this email.</p>
                <p>Best regards,<br>Your Company</p>
                <hr style="border: 0; border-top: 1px solid #eee;">
                <p style="font-size: 12px; color: #999;">This is an automated message, please do not reply.</p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);

    return tempUser;
};

exports.confirmEmail = async (token) => {
    const tempUser = global.tempUsers && global.tempUsers[token];

    if (!tempUser || tempUser.confirmationExpires < Date.now()) {
        throw new Error('Confirmation token is invalid or has expired.');
    }

    const newUser = new User(tempUser);

    await newUser.save();

    delete global.tempUsers[token];

    return newUser;
};

exports.resendConfirmationEmail = async (email, host) => {
    const tempUser = Object.values(global.tempUsers || {}).find(user => user.email === email);

    if (!tempUser) {
        throw new Error('User not found.');
    }

    if (tempUser.isConfirmed) {
        throw new Error('Email is already confirmed.');
    }

    const token = crypto.randomBytes(20).toString('hex');
    tempUser.confirmationToken = token;
    tempUser.confirmationExpires = Date.now() + 3600000; // 1 hour

    global.tempUsers[token] = tempUser;

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'tranthanhnam3024@gmail.com',
            pass: 'zeku tdtg hhcd xsth'
        }
    });


    const mailOptions = {
        to: tempUser.email,
        from: 'tranthanhnam3024@gmail.com',
        subject: 'Email Confirmation',
        text: `Please click the following link to confirm your email: 
        http://${host}/auth/confirm/${token}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
                
                <h2 style="color: #333;">Email Confirmation</h2>
                <p>Dear ${tempUser.fullname},</p>
                <p>Thank you for registering. Please click the button below to confirm your email address:</p>
                <div style="text-align: center; margin: 20px 0;">
                    <a href="http://${host}/api/user/confirm/${token}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; border-radius: 5px; text-decoration: none;">Confirm Email</a>
                </div>
                <p>If you did not request this, please ignore this email.</p>
                <p>Best regards,<br>Your Company</p>
                <hr style="border: 0; border-top: 1px solid #eee;">
                <p style="font-size: 12px; color: #999;">This is an automated message, please do not reply.</p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);

    return tempUser;
};

exports.requestPasswordReset = async (email, host) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('User not found.');
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; 

    await user.save();

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'tranthanhnam3024@gmail.com',
            pass: 'zeku tdtg hhcd xsth'
        }
    });

    const imagePath = path.join(__dirname, '../assets/Picture.png');
    const imageBase64 = fs.readFileSync(imagePath, 'base64');
    const imageSrc = `data:image/png;base64,${imageBase64}`;

    const mailOptions = {
        to: user.email,
        from: 'tranthanhnam3024@gmail.com',
        subject: 'Password Reset',
        text: `Please click the following link to reset your password: 
        http://${host}/api/user/reset-password/${token}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
                <div style="text-align: center;">
                    <img src="${imageSrc}" alt="Your Company Logo" style="max-width: 100px; margin-bottom: 20px;">
                </div>
                <h2 style="color: #333;">Password Reset</h2>
                <p>Dear ${user.fullname},</p>
                <p>You have requested to reset your password. Please click the button below to reset your password:</p>
                <div style="text-align: center; margin: 20px 0;">
                    <a href="http://${host}/api/user/reset-password/${token}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; border-radius: 5px; text-decoration: none;">Reset Password</a>
                </div>
                <p>If you did not request this, please ignore this email.</p>
                <p>Best regards,<br>Your Company</p>
                <hr style="border: 0; border-top: 1px solid #eee;">
                <p style="font-size: 12px; color: #999;">This is an automated message, please do not reply.</p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);

    return user;
};

exports.resetPassword = async (token, newPassword) => {
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        throw new Error('Password reset token is invalid or has expired.');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return user;
};