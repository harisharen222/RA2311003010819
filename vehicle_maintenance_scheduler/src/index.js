import express from "express";
import dotenv from "dotenv";

import { getDepots, getVehicles } from "./api.js";
import { scheduleVehicles } from "./scheduler.js";
import { Log } from "../../logging_middleware/src/logger.js";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/schedule", async (req, res) => {
    try {
        await Log("backend", "info", "controller", "Schedule API hit");

        const depots = await getDepots();
        const vehicles = await getVehicles();

        const results = [];

        for (const depot of depots) {
            const selected = scheduleVehicles(
                vehicles,
                depot.MechanicHours
            );

            results.push({
                depotID: depot.ID,
                totalVehicles: selected.length,
                selectedVehicles: selected,
            });

            await Log("backend", "info", "service", `Processed depot ${depot.ID}`);
        }

        res.json({
            success: true,
            results,
        });

    } catch (err) {
        await Log("backend", "error", "service", err.message);
        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
});

app.listen(3001, () => {
    console.log("Scheduler running on port 3001");
});