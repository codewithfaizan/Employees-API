import express from "express";
import cors from "cors"
import userRoute from "./controller/users/index.js"

import "./utils/dbConnect.js";

const app = express();

const PORT = 3000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    try {
        res.status(200).send(" Server is Up");
    } catch (error) {
        res.json(500).json({ error: "Internal Server Error" })
    } // Send response
});

app.use("/users", userRoute)

app.use((req, res, next) => {
    res.status(404).send("404 - Route Not Found");
    next();
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});