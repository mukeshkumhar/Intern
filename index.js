import express from "express";
import { connectDB, sequelize } from "./src/db/index.js";
import employeeRoutes from "./src/routes/employee.routes.js";
import employeeUiRoutes from "./src/routes/employee.ui.routes.js";
import methodOverride from "method-override";
import { engine } from "express-handlebars";
import  Sequelize from "sequelize";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./src/swagger.js";
import path from "path";
import employeeDocumentRoutes from "./src/routes/employeeDocument.ui.routes.js";


const app = express();
app.use(express.json());
app.use(express.static("public"));



// ✅ for HTML form submit (VERY IMPORTANT)
app.use(express.urlencoded({ extended: true }));

// ✅ allow PUT/DELETE from forms
app.use(methodOverride("_method"));

// ✅ public folder for css/js
app.use(express.static("public"));

// ✅ Handlebars setup
app.engine(
    "hbs",
    engine({
        extname: ".hbs",
        defaultLayout: "main",
        layoutsDir: "src/views/layouts",
        partialsDir: "src/views/partials",

        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
        },
        
        helpers: {
            eq: (a, b) => String(a) === String(b),
        },
        
    })
);
app.set("view engine", "hbs");
app.set("views", "src/views");

// await connectDB();
await sequelize.sync();





await connectDB();

// Create table automatically (for learning/dev). Later you can use migrations.
await sequelize.sync();
app.use("/", employeeUiRoutes);

app.use("/api/employees", employeeRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/employees/:employeeId/documents", employeeDocumentRoutes);


app.listen(3000, () => console.log("Server running on http://localhost:3000"));
