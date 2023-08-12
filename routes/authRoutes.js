import express from 'express';
import {
    registerController,
    loginController,
    testController,
    otpForResetPassword,
    verifyOtpForResetPassword,
    updateProfileController,
    getOrdersController,
    getAllOrdersController,
    orderStatusController
} from "../controller/authController.js";
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';

//router object 
const router = express.Router()

// Routes

// REGISTER || METHOD POST
router.post('/register', registerController)

// Login user || POST
router.post('/login', loginController);

// Send otp for reset password || POST
router.post('/otp-for-reset-password', otpForResetPassword)

// verify otp for reset password || POST
router.post('/verify-otp-for-reset-password', verifyOtpForResetPassword)

//test routes
router.get('/test', requireSignIn, isAdmin, testController);

//protected route auth
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
});

//protected route auth
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
});

// update profile
router.put('/profile', requireSignIn, updateProfileController);

// orders
router.get('/orders', requireSignIn, getOrdersController)

//all orders
router.get('/all-orders', requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put('/order-status/:orderId', requireSignIn, isAdmin, orderStatusController);




export default router;