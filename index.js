import express from "express";
import "dotenv/config";
import cors from "cors";
import { AuthRoutes, ProductRoutes } from "./routes/routes.js";

const app = express();
const PORT = process.env.SERVER_PORT || 3001;
const URL_FRONT = process.env.WEB_FRONT || "*";
const corsOptions = {
  origin: URL_FRONT,
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};


app.use(express.json());
app.use(cors(corsOptions));
app.use("/api", ProductRoutes);
app.use("/auth", AuthRoutes);

app.use((req, res) => {
  res.status(404).send(`
    <h1>Página no encontrada</h1>
    `);
});

app.listen(PORT, () => {
  console.log("Servidor online");
});
