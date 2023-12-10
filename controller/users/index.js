import express, { raw } from "express";
import fs from "fs"
import userModel from "../../models/Users/Users.js"
import { fail } from "assert";

const router = express();
router.use(express.json());

const rawData = fs.readFileSync("data.json");
const usersData = JSON.parse(rawData);

router.post("/temp", async (req, res) => {
    try {
        for (let userData of usersData) {
            const existingUser = await userModel.findOne({ id: userData.id });
            if (!existingUser) {
                await userModel.create(usersData);
            }
        }
        res.status(200).json({ message: "Data Stored Sucessfully" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/getAllUsers", async (req, res) => {
    try {
        const AllUsers = await userModel.find({});
        res.status(200).json(AllUsers);
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal Server Error" });
    }
})

router.get("/getUserbyId/:id", async (req, res) => {
    try {
        let getid = req.params.id;

        if (!getid && isNaN(getid)) {
            res.status(400).json({ message: "Enter a Valid id" })
        }
        // const data = await userModel.findOne({ id: getid });
        // res.status(200).json(data);

        const existingUser = await userModel.findOne({ id: getid });
        if (existingUser) {
            return res.status(201).json({ message: "User Found", userData: existingUser });
        } res.status(404).json({ message: "User Not Found" });

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal Server Error" });
    }
})


router.post("/createUser", async (req, res) => {
    try {
        const userData = req.body;

        const existingUser = await userModel.findOne({ id: userData.id });
        if (!existingUser) {
            await userModel.create(usersData);
            res.status(201).json({ msg: "User Added Successfully" });
            console.log(userData)
        } res.status(409).json({ message: "User Already Exist" });

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal Server Error" });
    }
})


router.put("/updateUser/:id", async (req, res) => {
    try {

        const getId = req.params.id;
        let updatedUser = req.body;

        let getUserData = await userModel.findOneAndUpdate(
            { id: getId }, { $set: updatedUser }, { new: true }
        );

        if (!getUserData) {
            return res.status(404).json({ error: "User Not found" })
        }
        return res.status(200).json({ msg: "User updated Successfully", getUserData })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal Server Error" });
    }
}
)

router.delete("/deleteUser/:id", async (req, res, next) => {
    try {
        const userId = req.params.id;
        console.log(userId)
        const existingUser = await userModel.findById({ id: userId });
        if (existingUser) {
            await userModel.findOneAndDelete(existingUser);
            return res.status(201).json({ success: true, msg: "User Deleted Successfully" });
        } res.status(404).json({ message: "User Not Found" });
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal Server Error" });
    }
})

router.post("/filter", async (req, res) => {
    try {
        const { domain, gender, available, first_name } = req.body;
        let page = req.body.page || 1;

        // if (!domain || !gender || !available || !first_name) {
        //     return res.status(400).json({ success: false, error: "Missing required parameters." });
        // }

        const pipeline = [
            {
                $match: {
                    $or: [
                        { domain: domain },
                        { gender: gender },
                        { available: available },
                        { first_name: { $regex: new RegExp(first_name, "i") } }, // Case-insensitive name search
                    ],

                }
            }, {
                $skip: (page - 1) * 20
            },
            {
                $limit: 20
            }

        ]
        const userData = await userModel.aggregate(pipeline)
        console.log(userData)
        return res.status(200).json({ message: "Filter Search", userData })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
})


router.delete("/deleteAll", async (req, res) => {
    try {
        await userModel.deleteMany({});
        res.status(200).json({ message: "All Users Deleted" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal Server Error" });
    }
})

export default router;
