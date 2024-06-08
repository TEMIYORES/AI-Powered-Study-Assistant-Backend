import express from "express";
import path from "path";
const app = express();
const port = 3400;
import { fileURLToPath } from "url";
import ejs from "ejs";

// Get the current file's URL
const __filename = fileURLToPath(import.meta.url);

// Get the directory name
import { dirname } from "path";
const __dirname = dirname(__filename);

// Set EJS as the templating engine
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Set the directory where your EJS templates are stored
app.set("views", path.join(__dirname, "views"));

// Define a route
app.get("/", (req, res) => {
  res.render("breakend", { heading: "Break End!", name: "Qayyum" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
