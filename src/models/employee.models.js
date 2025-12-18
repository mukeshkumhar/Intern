import { DataTypes } from "sequelize";
import { sequelize } from "../db/index.js";

const Employee = sequelize.define(
    "Employee",
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

        fullName: { type: DataTypes.STRING(120), allowNull: false },

        email: {
            type: DataTypes.STRING(120),
            allowNull: false,
            unique: true,
            validate: { isEmail: true },
        },

        phone: { type: DataTypes.STRING(20), allowNull: true },

        designation: { type: DataTypes.STRING(80), allowNull: true },

        status: {
            type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
        },
    },
    {
        tableName: "employees",
        timestamps: true, // createdAt, updatedAt
    }
);

export default Employee;
