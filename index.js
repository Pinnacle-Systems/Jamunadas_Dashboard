import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

import { createRequire } from "module";
// import { PrismaClient } from './src/generated/prisma/client.js';

const require = createRequire(import.meta.url);

import { socketMain } from "./src/sockets/socket.js";

import {
  commonMast,
  poRegister,
  supplier,
  poData,
  misDashboard,
  ordManagement,
  misDashboardERP,
  user,
  role,
  freeLookFabric,
  fabricOutward,
  sales,
  jamunasDashboard
} from "./src/routes/index.js";
import { PrismaClient } from "@prisma/client";
import { getJDASConnectionPool } from "./src/constants/db.connection.js";

export const prisma_Connector = new PrismaClient();

const jdasConnectionPool = getJDASConnectionPool();

const gracefulAppShutdown = async () => {
  console.log('Application shutting down...');

  try {
    console.log("Closing database connections... ");
    await jdasConnectionPool.end();
    console.log("Database connections closed succesfully");
    process.exit(0);
  }
  catch(err) {
    console.error("Error during shutdown... ");
    process.exit(1);
  }
}

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const path = __dirname + "/client/build/";

app.use(express.static(path));

app.get("/", function (req, res) {
  res.sendFile(path + "index.html");
});

BigInt.prototype["toJSON"] = function () {
  return parseInt(this.toString());
};

app.use("/poRegister", poRegister);

app.use("/commonMast", commonMast);

app.use("/supplier", supplier);

app.use("/poData", poData);

app.use("/misDashboard", misDashboard);

app.use("/misDashboardERP", misDashboardERP);

app.use("/ordManagement", ordManagement);

app.use("/users", user);

app.use("/role", role);

app.use("/freeLookFabric", freeLookFabric);

app.use("/fabricOutward",fabricOutward)

app.use("/sales", sales);

app.use('/jamunasDashboard',jamunasDashboard)

// const PORT = 9008;
const PORT = process.env.PORT || 9000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", socketMain);
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

process.on('SIGINT', gracefulAppShutdown);
process.on('SIGTERM', gracefulAppShutdown);
