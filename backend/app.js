import * as path from "node:path";
import express from "express";
import cors from "cors";
import {fileURLToPath} from "url";

import {PORT} from "./config/environments.js";
import {connectDB} from "./config/db.js";
import routes from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Content-Disposition'],
    exposedHeaders: ['Content-Disposition'],
    credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

app.get('/', routes);

app.listen(PORT, () => {
    console.log(`Server running on PORT : ${PORT}`)
    connectDB();
})
