import { Server } from "http";
import app from "./app";
import config from "./config";
import ensureSuperAdmin from "./DB/seed";

async function NewsServer() {
  await ensureSuperAdmin();
  const server: Server = app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
}

NewsServer();
