const jwt = require('jsonwebtoken');
const UserModel = require('../models/User.model');
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");

/** middleware for verify user */
const verfiyUser = async (req, res, next) => {
    try {

        const { username } = req.method == "GET" ? req.query : req.body;

        // check the user existance
        let exist = await UserModel.findOne({ username });
        if (!exist) {
            return res.status(404).send({ error: "Can't find User!" });
        }

        next();

    } catch (error) {
        return res.status(404).send({ error: "Authentication Error" });
    }
}

const register = async (req, res) => {
    try {
        const { username, password, profile, email } = req.body;

        // check the existing user
        const existUsername = async () => {
            try {
                const user = await UserModel.findOne({ username });
                if (user) {
                    throw { error: 'Please use unique username' };
                }
            } catch (err) {
                throw new Error(err);
            }
        };

        // check the existing email
        const existEmail = async () => {
            try {
                const email = await UserModel.findOne({ email });
                if (email) {
                    throw { error: 'Please use unique email' };
                }
            } catch (err) {
                throw new Error(err);
            }
        };

        Promise.all([existUsername, existEmail])
            .then(() => {
                if (password) {
                    bcrypt.hash(password, 10)
                        .then(hashedPassword => {

                            const user = new UserModel({
                                username,
                                password: hashedPassword,
                                profile: profile || '',
                                email
                            });

                            // return save result as a response
                            user.save()
                                .then(result => res.status(201).send({ msg: "User Register Successfully" }))
                                .catch(error => res.status(500).send({ error }))

                        }).catch(error => {
                            return res.status(500).send({
                                error: "Enable to hashed password"
                            })
                        })
                }
            }).catch(error => {
                return res.status(500).send({
                    error: "Enable to hashed password" + error
                })
            })

    } catch (error) {
        return res.status(500).send(error);
    }
}

const login = async (req, res) => {
    const { username, password } = req.body;

    try {

        UserModel.findOne({ username })
            .then(user => {
                bcrypt.compare(password, user.password)
                    .then(passwordCheck => {
                        if (!passwordCheck) return res.status(400).send({ error: "Don't have Password" });

                        // create jwt token
                        const token = jwt.sign({
                            userId: user._id,
                            username: user.username
                        }, process.env.JWT_SECRET, { expiresIn: "24h" });

                        return res.status(200).send({
                            msg: "Login Successful...!",
                            username: user.username,
                            token
                        });

                    })
                    .catch(error => {
                        return res.status(400).send({ error: "Password does not Match" })
                    })
            })
            .catch(error => {
                return res.status(404).send({ error: "Username not Found" });
            })

    } catch (error) {
        return res.status(500).send({ error });
    }
}

const getUser = async (req, res) => {
    const { username } = req.params;

    try {

        if (!username) return res.status(501).send({ error: "Invalid Username" });

        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }

        /** remove password from user */
        // Mongoose returns unnecessary data with object, so convert it into JSON
        const { password, ...rest } = user.toJSON();

        return res.status(200).send(rest);

    } catch (error) {
        return res.status(404).send({ error: "Cannot Find User Data" });
    }
}

const updateUser = async (req, res) => {
    try {
        const { userId } = req.user;

        if (userId) {
            const body = req.body;

            // Update the data
            await UserModel.updateOne({ _id: userId }, body);

            return res.status(201).send({ msg: "Record Updated...!" });
        } else {
            return res.status(401).send({ error: "User Not Found...!" });
        }
    } catch (error) {
        return res.status(401).send({ error: error.message });
    }
}

const generateOTP = async (req, res) => {
    req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
    res.status(201).send({ code: req.app.locals.OTP })
}

const verifyOTP = async (req, res) => {
    const { code } = req.query;
    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
        req.app.locals.OTP = null; // reset the OTP value
        req.app.locals.resetSession = true; // start session for reset password
        return res.status(201).send({ msg: 'Verify Successsfully!' })
    }
    return res.status(400).send({ error: "Invalid OTP" });
}

const createResetSession = async (req, res) => {
    if (req.app.locals.resetSession) {
        return res.status(201).send({ flag: req.app.locals.resetSession })
    }
    return res.status(440).send({ error: "Session expired!" })
}

const resetPassword = async (req, res) => {
    try {
        if (!req.app.locals.resetSession) {
            return res.status(440).send({ error: "Session expired!" });
        }

        const { username, password } = req.body;

        const user = await UserModel.findOne({ username });

        if (!user) {
            return res.status(404).send({ error: "Username not found" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await UserModel.updateOne(
            { username: user.username },
            { password: hashedPassword }
        );

        req.app.locals.resetSession = false; // reset session

        return res.status(201).send({ msg: "Record Updated...!" });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

module.exports = { verfiyUser, register, login, getUser, updateUser, generateOTP, verifyOTP, createResetSession, resetPassword };