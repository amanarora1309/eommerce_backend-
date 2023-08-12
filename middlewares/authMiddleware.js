import JWT from 'jsonwebtoken';
import userModel from '../models/userModel.js';

// protected Routes token base
export const requireSignIn = async (req, res, next) => {
    const token = req.header("authentication");
    if (!token) {
        return res.status(401).send({ error: "Please authenticate using a valid token" });
    }

    try {
        const data = JWT.verify(token, process.env.JWT_SECRET);
        req.user = data;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
}

export const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);
        if (user.role !== 1) {
            return res.status(401).send({
                success: false,
                message: "UnAuthorized Access"
            });
        } else {
            next();
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "something went wrong"
        })
    }
}