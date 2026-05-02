import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const LOG_API = "http://20.207.122.201/evaluation-service/logs";

export const Log = async (stack, level, pkg, message) => {
    try {
        const response = await axios.post(
            LOG_API,
            {
                stack,
                level,
                package: pkg,
                message,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
                },
            }
        );

        console.log("Log sent:", response.data);
    } catch (error) {
        console.error(
            "Logging failed:",
            error.response?.data || error.message
        );
    }
};