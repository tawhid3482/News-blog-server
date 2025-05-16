import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./app/routes";

const app: Application = express();

app.use(cors());
app.use(cookieParser());

// parser

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/s1", router);

app.get("/", async (req: Request, res: Response) => {
  res.status(200).json({
    message: "News Server working....",
  });
});

export default app;
