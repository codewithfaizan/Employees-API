import express from "express";

import employee_data from "./employee.js";

const app = express();

const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    try {
        res.status(200).json({ message: "Server is Up" })
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
});

app.get("/data", (req, res) => {
    try {
        let data = employee_data;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
})

app.get("/data/employees", (req, res) => {
    try {
        let data = employee_data;
        let Array = data.employees
        res.status(200).json(Array);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
});

app.get("/data/employees/department/:id", (req, res) => {
    try {
        let id = req. params.id;
        // console.log(id, typeof id);
        let empArray = employee_data.employees;
        // console.log(empArray);

        // let depObject = empArray.filter(Obj => {
        //     return Obj.id === id
        // });

        let deptObject = empArray.find(obj => {
        return obj.id === id
        });
        
        console.log(deptObject);
        res.json(deptObject)
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
})

app.use("*", (req, res, next) => {
    res.status(404).send("404 - Not Found");
    next()
})

app.listen(PORT, () => {
    console.log(`Server is Running on ${PORT}`)
})