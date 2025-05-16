import { Server } from "http";
import app from "./app";
import config from "./config";

async function NewsServer() {
  const server: Server = app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
}

NewsServer();
