import * as fs from "node:fs";
import bcrypt from "bcrypt";

import User from '../models/User.js'
import {uploadToCloudinary} from "../config/cloudinary.js";
import {createToken} from "../config/createToken.js";


const getUser = async (req, res) => {

    /*
        CODE FLOW:
        1. Get the userId from the req.params.
        2. Search for the user in the DB -> if DNE, throw error.
        3. Populate the required fields of the user then return it.
    */

    try {
        const {userId} = req.params;

        if (!userId) {
            return res.status(400).json({message: 'You are not logged in!'});
        }

        const user = await User.findById(userId).select('-password').populate('eventsCreatedAt ticketsPurchased');
        if (!user) {
            return res.status(404).json({message: 'User does not exist!'});
        }

        return res.status(200).json({user: user});
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}


const postSignup = async (req, res) => {

    /*
          CODE FLOW:
          1. Extract name, email, password, confirm_password, role from req.body.
          2. Check if password === confirm_password -> if not throw error
          3. Also check if the user email exists -> if it exists then throw error
          4. If an image is uploaded:
              - Upload to Cloudinary, store publicId & url.
          6. Hash the password and create a new user in DB.
          7. Return user details (excluding password) in response.
          8. Handle errors and return 500 if any issue occurs.
    */

    try {
        const {name, email, password, confirm_password, role} = req.body;
        const imageFile = req.file;

        if (!name || !email || !password || !confirm_password || !role) {
            return res.status(400).json({message: 'Please fill all the required fields'});
        }

        if (password !== confirm_password) {
            return res.status(400).json({message: 'Passwords do not match'});
        }

        const user = await User.findOne({email: email});
        if (user) {
            return res.status(400).json({message: 'User already exists'});
        }

        let imageData = null;
        if (imageFile) {
            try {
                const cloudinaryResult = await uploadToCloudinary(imageFile.path, 'venue-vibe');
                fs.unlinkSync(imageFile.path);
                imageData = {
                    publicId: cloudinaryResult.publicId,
                    url: cloudinaryResult.url,
                };
            } catch (uploadError) {
                fs.unlinkSync(imageFile.path);
                return res.status(500).json({message: uploadError.message});
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name, email, password: hashedPassword, image: imageData || {publicId: '', url: ''}, role
        })
        await newUser.save();

        const userResponse = newUser.toObject();
        delete userResponse.password;
        delete userResponse.__v;

        return res.status(200).json({user: userResponse});
    } catch (error) {
        return res.status(401).json({message: error.message});
    }
}


const postLogin = async (req, res) => {

    /*
        CODE FLOW:
        1. Get the email and password from req.body
        2. Search for the user in the DB -> if DNE, throw error
        3. Populate the required fields of the user then return it.
    */

    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({message: 'Please fill all the required fields'});
        }

        const doExist = await User.findOne({email: email}).select('-password');
        if (!doExist) {
            return res.status(400).json({message: 'User do not exists'});
        }
        const token = await createToken(doExist._id);
        return res.status(200).json({user: doExist, token});
    } catch (error) {
        return res.status(401).json({message: error.message});
    }
}


const updateUser = async (req, res) => {
    /*
          CODE FLOW:
          1. Extract `userId` from `req.params`, `{ name, email }` from `req.body`.
          2. Fetch user; return `404` if not found.
          3. Set `imageData` from existing user image.
          4. If a new image is uploaded:
              - Upload to Cloudinary, store `publicId` & `url`.
              - Delete old image from Cloudinary (if exists).
              - Remove temp file from the server.
          5. Fetch and associate user's eventsCreated and ticketsPurchased.
          6. Update user with new details and return updated data.
          7. Handle errors and return `500` if any issue occurs.
    */

    try {
        const {userId} = req.params;
        const {name, email} = req.body;
        const imageFile = req.file;

        if (!name && !email && !imageFile) {
            return res.status(400).json({message: 'No fields to update'});
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        let imageData = {...user.image};
        let oldPublicId = null;

        if (imageFile) {
            try {
                const result = await uploadToCloudinary(imageFile.path, 'user-profiles');
                oldPublicId = user.image?.publicId;
                imageData = {
                    publicId: result.publicId,
                    url: result.url
                };
                fs.unlinkSync(imageFile.path);
            } catch (uploadError) {
                fs.unlinkSync(imageFile.path);
                return res.status(500).json({
                    message: 'Image upload failed',
                    error: uploadError.message
                });
            }
        }

        const updateFields = {
            ...(name && {name}),
            ...(email && {email}),
            image: imageData
        };

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateFields,
            {
                new: true,
                runValidators: true,
                select: '-password -__v'
            }
        ).populate('eventsCreated ticketsPurchased');

        if (oldPublicId) {
            try {
                await cloudinary.uploader.destroy(oldPublicId);
            } catch (deleteError) {
                console.error('Cloudinary cleanup failed:', deleteError);
            }
        }

        return res.status(200).json(updatedUser);
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
}

export {getUser, postSignup, postLogin, updateUser}