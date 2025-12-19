import { DataTypes } from "sequelize";
import { sequelize } from "../db/index.js";

const EmployeeDocument = sequelize.define(
    "EmployeeDocument",
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

        employeeId: { type: DataTypes.INTEGER, allowNull: false },

        docType: { type: DataTypes.STRING(80), allowNull: false },

        originalName: { type: DataTypes.STRING(255), allowNull: false },
        fileName: { type: DataTypes.STRING(255), allowNull: false },
        filePath: { type: DataTypes.STRING(500), allowNull: false },

        mimeType: { type: DataTypes.STRING(80), allowNull: false },
        fileSize: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
        tableName: "employee_documents",
        timestamps: true,
    }
);

export default EmployeeDocument;
