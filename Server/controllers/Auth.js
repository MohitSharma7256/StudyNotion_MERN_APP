/**
 * Auth Controller
 * ---------------
 * Houses every auth-adjacent action: OTP generation, signup, login,
 * and password management.
 */
const OTP = require("../models/OTP")
const User = require("../models/User")
const otpGenerator = require("otp-generator")
const bcrypt = require("bcrypt")
const Profile = require("../models/Profile")
const jwt = require("jsonwebtoken")
const mailSender = require("../utils/mailSender")
const { passwordUpdated } = require("../mail/templates/passwordUpdate")
require("dotenv").config()

/**
 * sendOtp
 * -------
 * Issues a 6-digit OTP to a prospective user and stores it with a 5-minute TTL.
 * This endpoint also guards against duplicate email registrations.
 */
exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        console.log("Email in senOtp controller", email)
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(401).json({
                success: false,
                message: "Email already exists"
            })
        }

        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });


        let result = await OTP.findOne({ otp: otp });

        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = OTP.findOne({ otp: otp });
        }
        console.log("OTP generated", otp);

        const createdOtp = await OTP.create({
            email,
            otp
        })

        return res.status(200).json({
            success: true,
            message: "OTP created!",
            createdOtp
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

/**
 * signUp
 * ------
 * Validates the OTP, hashes the password, creates the profile and user record.
 * Instructors start with `approved = false` so admins can audit them.
 * Admin creation requires the shared secret stored in env.
 */
exports.signUp = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            otp,
            contactNumber,
            adminSecret,
        } = req.body;

        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: "Fill all details"
            })
        }

        if (password !== confirmPassword) {
            return res.status(403).json({
                success: false,
                message: "Passwords don't match"
            })
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(401).json({
                success: false,
                message: "Email already exists"
            })
        }

        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log("Otp in signup page is:", recentOtp[0].otp)
        if (recentOtp.length == 0) {
            return res.status(400).json({
                success: false,
                message: 'OTP Not Found',
            })
        } else if (otp !== recentOtp[0].otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        const hashedPwd = await bcrypt.hash(password, 10);

        if (accountType === "Admin") {
            if (
                !process.env.ADMIN_CREATION_SECRET ||
                adminSecret !== process.env.ADMIN_CREATION_SECRET
            ) {
                return res.status(403).json({
                    success: false,
                    message: "Invalid admin secret",
                });
            }
        }

        // Students/Admins are fully active immediately, instructors await approval.
        const approved = accountType === "Instructor" ? false : true;

        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: contactNumber || null,
        });

        console.log("Data received in signup is", firstName)
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPwd,
            accountType,
            approved: approved,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        })
        console.log("Data created successfully")
        return res.status(200).json({
            success: true,
            message: 'User is registered Successfully',
            newUser,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registrered. Please try again",
        })
    }
}

/**
 * login
 * -----
 * Verifies credentials, signs a JWT, and returns sanitized user data.
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email or Password empty',
            })
        }

        const existingUser = await User.findOne({ email }).populate("additionalDetails").exec();
        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email not registered',
            })
        }

        if (await bcrypt.compare(password, existingUser.password)) {
            const payload = {
                email: email,
                accountType: existingUser.accountType,
                id: existingUser._id
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "3d"
            })

            existingUser.toObject();
            existingUser.token = token;
            existingUser.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }

            return res.cookie("token", token, options).status(200).json({
                success: true,
                message: 'Login successfull',
                token,
                existingUser
            })
        }
        else {
            return res.status(401).json({
                success: false,
                message: 'Password is incorrect',
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Login Failure, please try again',
        });
    }
}

// Controller for Changing Password
/**
 * changePassword
 * --------------
 * Authenticated route that verifies the existing password
 * and updates it to the new hash. Also emails a confirmation notice.
 */
exports.changePassword = async (req, res) => {
    try {
        // Get user data from req.user
        const userDetails = await User.findById(req.user.id);

        // Get old password, new password, and confirm new password from req.body
        const { oldPassword, newPassword } = req.body;

        // Validate old password
        const isPasswordMatch = await bcrypt.compare(
            oldPassword,
            userDetails.password
        );
        if (!isPasswordMatch) {
            // If old password does not match, return a 401 (Unauthorized) error
            return res
                .status(401)
                .json({ success: false, message: "The password is incorrect" });
        }

        // Match new password and confirm new password
        // if (newPassword !== confirmNewPassword) {
        // 	// If new password and confirm new password do not match, return a 400 (Bad Request) error
        // 	return res.status(400).json({
        // 		success: false,
        // 		message: "The password and confirm password does not match",
        // 	});
        // }

        // Update password
        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUserDetails = await User.findByIdAndUpdate(
            req.user.id,
            { password: encryptedPassword },
            { new: true }
        );

        // Send notification email
        try {
            const emailResponse = await mailSender(
                updatedUserDetails.email,
                passwordUpdated(
                    updatedUserDetails.email,
                    `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
                )
            );
            console.log("Email sent successfully:", emailResponse.response);
        } catch (error) {
            // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
            console.error("Error occurred while sending email:", error);
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending email",
                error: error.message,
            });
        }

        // Return success response
        return res
            .status(200)
            .json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
        console.error("Error occurred while updating password:", error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while updating password",
            error: error.message,
        });
    }
};