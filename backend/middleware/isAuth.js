import jwt from "jsonwebtoken";
import {JWT_SECRET} from "../config/environments.js";
import User from "../models/User.js";

export const isAuth = async (req, res, next) => {

    /*
        CODE FLOW:
        1. Extract the token using authorization header : Bearer __token___
        2. Verify the token with jwt.verify using JWT_SECRET to extracted _id
        3. Find the user in the database using _id and attach it to req.user
        4. If any step fails, throw error -> "Unauthorized Access"
    */

    const {authorization} = req.headers;
    if (!authorization) {
        return res.status(401).json({message: "No token provided"});
    }

    const token = authorization.split(' ')[1];
    try {
        const {_id} = jwt.verify(token, JWT_SECRET);

        req.user = await User.findOne({_id}).select('_id');
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({message: "Request is not authorized"});
    }
}