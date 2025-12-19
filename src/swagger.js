import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Employee CRUD API",
            version: "1.0.0",
            description: "Swagger UI for Employee CRUD operations",
        },
        servers: [
            {
                url: "http://localhost:3000", // ✅ change if your port is different
            },
        ],
        components: {
            schemas: {
                Employee: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        fullName: { type: "string", example: "Mukesh Kumar" },
                        email: { type: "string", example: "mukesh@gmail.com" },
                        phone: { type: "string", example: "9999999999" },
                        designation: { type: "string", example: "Developer" },
                        status: { type: "string", example: "ACTIVE" },
                    },
                },
                EmployeeCreate: {
                    type: "object",
                    required: ["fullName", "email"],
                    properties: {
                        fullName: { type: "string" },
                        email: { type: "string" },
                        phone: { type: "string" },
                        designation: { type: "string" },
                        status: { type: "string", enum: ["ACTIVE", "INACTIVE"] },
                    },
                },
            },
        },
    },

    // ✅ IMPORTANT: This must match your routes folder path
    apis: ["./src/routes/employee.routes.js"],
});
