// import OPENAI from "openai";
import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import chatStreamRoutes from "./routes/chatStream.js";
import authRoutes from "./routes/auth.js";
import uploadRoutes from "./routes/upload.js";
import { apiLimiter } from "./middleware/rateLimit.js";

import path from "path";


const app = express();
app.use(express.json()); // <-- Move this to the very top
app.use(cors());
// Serve uploaded files (must be after app is initialized)
app.use("/uploads", express.static(path.resolve("uploads")));
app.use("/api/upload", uploadRoutes);
const PORT = 8080;

app.use("/api/auth", authRoutes);
app.use("/api", apiLimiter, chatRoutes);
app.use("/api", apiLimiter, chatStreamRoutes);

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
    connectDB();
});

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected with Database!");
    } catch(err) {
        console.log("Failed to connect with Db", err);
        console.log("Continuing without database connection...");
    }
}


// app.post("/test", async (req, res) => {
//     const options = {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
//         },
//         body: JSON.stringify({
//             model: "gpt-4o-mini",
//             messages: [{
//                 role: "user",
//                 content: req.body.message
//             }]
//         })
//     };

//     try {
//         const response = await fetch("https://api.openai.com/v1/chat/completions", options);
//         const data = await response.json();
//         //console.log(data.choices[0].message.content); //reply
//         res.send(data.choices[0].message.content);
//     } catch(err) {
//         console.log(err);
//     }
// });
