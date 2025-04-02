const express = require("express");
const cors = require("cors");
const uploadRoutes = require("./routes/upload");
const patientRoutes = require("./routes/patients");
const db = require("./database");
const path = require("path");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));
app.use("/upload", uploadRoutes);
app.use("/patients", patientRoutes);
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));








