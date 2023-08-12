import { comparePassword, hashPassword } from '../helpers/authHelper.js';
import User from '../models/userModel.js'
import Otp from '../models/otpModel.js';
import JWT from 'jsonwebtoken';
import sendMail from '../mailers/mail.js';
import orderModel from '../models/orderModel.js';


export const registerController = async (req, res) => {

    try {
        const { name, email, password, phone, address } = req.body;

        // validation
        if (!name) {
            return res.send({ message: 'Name is required' })
        }
        if (!email) {
            return res.send({ message: 'Email is required' })
        }
        if (!password) {
            return res.send({ message: 'Password is required' })
        }
        if (!phone) {
            return res.send({ message: 'Phone is required' })
        }
        if (!address) {
            return res.send({ message: 'Address is required' })
        }

        // check user
        const existingUser = await User.findOne({ email });

        // existing user
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: 'Already register please login',

            })
        }


        // register user
        const hashedPassword = await hashPassword(password);

        // const user = await new User.create({
        //     name: name,
        //     email: email,
        //     password: password,
        //     phone: phone,
        //     address: address,
        //     password: hashedPassword
        // })

        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            phone: req.body.phone,
            address: req.body.address,
        })

        res.status(200).send({
            success: true,
            message: "User register successfully",
            user,
        })
    } catch (error) {
        res.status(500).send({
            stauts: false,
            message: 'Error in registration',
            error
        })
    }
};


export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        // validation
        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: 'email and password is required'
            })
        }

        // check user
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Invalid email and password'
            })
        }

        const match = await comparePassword(password, user.password);

        if (!match) {
            return res.status(404).send({
                success: false,
                message: 'Invalid email and password'
            })
        }

        // token 
        const token = await JWT.sign({ _id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(200).send({
            success: true,
            message: 'Login successfully',
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            },
            token
        })
    } catch (error) {
        res.stauts(500).send({
            status: false,
            message: 'Error in login',
            error
        })
    }
}

export const otpForResetPassword = async (req, res) => {

    try {
        const { email } = req.body;

        // validation
        if (!email) {
            return res.status(400).send({
                success: false,
                message: 'email is required'
            })
        }

        // check user is valid or not
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send({
                success: "false",
                message: "user not found"
            })
        }

        // send mail
        const otp = Math.trunc(Math.random() * 9999);
        const text = `OTP is ${otp} `;
        const subject = 'OTP for Reset Password of Ecommerce App'
        const to = user.email

        await sendMail(to, subject, text);

        // save otp in database
        const d = new Date();
        const saveOtp = await Otp.create({
            id: user._id,
            otp: otp,
            time: d.getTime()
        })

        res.status(200).send({
            success: true,
            message: "OTP Send Successfully"
        })


    } catch (error) {
        res.status(500).send({
            stauts: false,
            message: 'Error in otp send',
            error
        })
    }





}

export const verifyOtpForResetPassword = async (req, res) => {

    try {
        const { email, otp, n_password } = req.body;

        // validation
        if (!email) {
            return res.status(400).send({ success: false, message: 'email is required' })
        }
        if (!otp) {
            return res.status(400).send({ success: false, message: 'otp is required' })
        }
        if (!n_password) {
            return res.status(400).send({ success: false, message: 'new Password is required' })
        }

        // find user 

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "user not found"
            })
        }


        const otpdb = await Otp.findOne({ id: user._id });
        const d = new Date();

        // check otp is valid or not

        if (otp !== otpdb.otp) {
            return res.status(400).send({ success: false, message: "Invalid OTP" })
        }

        // check otp expiration
        if (((d.getTime() - otpdb.time) / 1000 / 60) > 10) {
            return await Otp.deleteOne({ id: user._id }).then((d_res) => {


                res.status(400).send({ success: false, message: "OTP has been expired !! Please genrate a new OTP" })
            }).catch((err) => {
                res.status(500).send({ status: 500, message: "Something went wrong" });
            });


        }

        // genrate a hash
        const hash = await hashPassword(n_password);

        // update a password
        await User.findByIdAndUpdate(user._id, { password: hash }).then((result) => {

            // delete otp in database
            Otp.deleteOne({ id: user._id }).then((d_result) => {
                res.status(200).send({ success: true, message: "Password Reset Successfully" });
            }).catch((err) => {
                res.status(500).send({ status: 500, message: "Something went wrong" });
            });

        }).catch((err) => {
            res.status(500).send({ status: 500, message: "Something went wrong" });
        });



    } catch (error) {
        res.status(500).send({
            stauts: false,
            message: 'Error in reset password',
            error
        })
    }

}


export const testController = async (req, res) => {

    res.send("hello");

}

export const updateProfileController = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;
        const user = await User.findById(req.user._id);

        // password 
        if (password && password.length < 6) {
            return res.json({ error: "Password is required and 6 chracter long" });
        }

        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await User.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address
        }, { new: true })

        res.status(200).send({
            success: true,
            message: "Profile Updated Successfully",
            updatedUser: {
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                address: updatedUser.address,
                role: updatedUser.role
            },
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false, message: "Error while update profile", error
        })
    }
}

export const getOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find({ buyer: req.user._id }).populate("products").populate("buyer", "name");
        res.json(orders)
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error while getting orders", error })
    }
}

export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find({}).populate("products").populate("buyer", "name").sort({ createdAt: "-1" });
        res.json(orders)
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error while getting all orders", error });
    }
}

export const orderStatusController = async (req, res) => {
    try {
        const { status } = req.body;
        const { orderId } = req.params;
        const orders = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error while updating order status" });
    }
}