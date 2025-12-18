import dotenv from "dotenv";
dotenv.config();

import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 3306),
        dialect: "mysql",
        logging: false, // set true if you want to see SQL logs
    }
);

export async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log("✅ MySQL connected successfully!");
    } catch (err) {
        console.error("❌ MySQL connection failed:", err.message);
        process.exit(1);
    }
}
