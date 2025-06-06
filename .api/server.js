// src/api-server/server.ts
import { loadEnv } from "dotenv-local";
import express from "express";
import * as configure from "@api/configure";
import { handler } from "@api/handler";
import { endpoints } from "@api/routers";
var server = express();
configure.serverBefore?.(server);
var { HOST, PORT } = loadEnv({
  envPrefix: "SERVER_",
  removeEnvPrefix: true,
  envInitial: {
    SERVER_HOST: "127.0.0.1",
    SERVER_PORT: "3000"
  }
});
var SERVER_URL = `http://${HOST}:${PORT}${API_ROUTES.BASE}`;
server.use(API_ROUTES.BASE_API, handler);
server.use(API_ROUTES.BASE, express.static(API_ROUTES.PUBLIC_DIR));
configure.serverAfter?.(server);
var PORT_NRO = parseInt(PORT);
server.listen(PORT_NRO, HOST, () => {
  console.log(`Ready at ${SERVER_URL}`);
  configure.serverListening?.(server, endpoints);
}).on("error", (error) => {
  console.error(`Error at ${SERVER_URL}`, error);
  configure.serverError?.(server, error);
});
