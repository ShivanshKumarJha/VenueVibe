import jwt from "jsonwebtoken";
import {JWT_SECRET} from "./environments.js";

export const createToken = async (_id) => {
    return jwt.sign({_id}, JWT_SECRET, {expiresIn: '1d'});
}