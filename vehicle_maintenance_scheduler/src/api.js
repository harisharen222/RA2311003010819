import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = "http://20.207.122.201/evaluation-service";

const headers = {
    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
};

// GET DEPOTS
export const getDepots = async () => {
    try {
        const res = await axios.get(`${BASE_URL}/depots`, { headers });
        return res.data.depots;
    } catch (err) {
        console.error("Error fetching depots:", err.message);
        throw err;
    }
};

// GET VEHICLES
export const getVehicles = async () => {
    try {
        const res = await axios.get(`${BASE_URL}/vehicles`, { headers });
        return res.data.vehicles;
    } catch (err) {
        console.error("Error fetching vehicles:", err.message);
        throw err;
    }
};