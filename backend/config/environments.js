import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8001;
const MONGODB_URI = process.env.MONGODB_URI;

const JWT_SECRET = process.env.JWT_SECRET;

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

export {PORT, MONGODB_URI, JWT_SECRET, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET};