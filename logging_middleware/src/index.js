import express from "express";
import { Log } from "./logger.js";

const app = express();
app.use(express.json());


app.get("/", async (req, res) => {
    await Log("backend", "info", "route", "Root endpoint hit");
    res.send("Server running");
});


const fakeDBCall = async () => {
    await Log("backend", "debug", "db", "Fetching data from DB");

    
    await Log("backend", "warn", "service", "Using fallback data");

    return ["vehicle1", "vehicle2"];
};


app.get("/vehicles", async (req, res) => {
    try {
        await Log("backend", "info", "controller", "Fetching vehicles");

        const data = await fakeDBCall();

        res.json(data);
    } catch (err) {
        await Log("backend", "error", "handler", err.message);
        res.status(500).send("Error fetching vehicles");
    }
});


app.get("/error", async (req, res) => {
    try {
        throw new Error("Something broke");
    } catch (err) {
        await Log("backend", "error", "handler", err.message);
        res.status(500).send("Error occurred");
    }
});

app.get("/fatal", async (req, res) => {
    await Log("backend", "fatal", "db", "Database connection failed");
    res.status(500).send("Fatal error simulated");
});

app.listen(3000, async () => {
    console.log("Server running on port 3000");

    await Log("backend", "info", "service", "Server started successfully");
});