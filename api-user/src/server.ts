import cors from "cors";
import express, { Router, Request, Response } from "express";
import { sequelize } from "./sequelize";

import { AuthRouter } from "./controllers/v0/index.router";

import bodyParser from "body-parser";
import { config } from "./config/config";
import { User } from "./controllers/v0/model.index";

(async () => {
  console.log(process.env.POSTGRES_DB);
  console.log(process.env.POSTGRES_PORT);
  console.log(process.env.POSTGRES_USERNAME);
  console.log(process.env.POSTGRES_PASSWORD);
  console.log(process.env.POSTGRES_HOST);
  await sequelize.addModels([User]);

  console.debug("Initialize database connection...");
  await sequelize.sync();

  const app = express();
  const port = process.env.PORT || 8080;
  const router: Router = Router();

  app.use(bodyParser.json());
  router.use("/auth", AuthRouter);

  router.get("/");

  router.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const item = await User.findByPk(id);
    res.send(item);
  });
  // We set the CORS origin to * so that we don't need to
  // worry about the complexities of CORS this lesson. It's
  // something that will be covered in the next course.
  app.use(
    cors({
      allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "X-Access-Token",
        "Authorization",
      ],
      methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
      preflightContinue: true,
      origin: "*",
    })
  );

  app.use("/", router);

  // Root URI call
  app.get("/", async (req, res) => {
    res.send("/api/v0/users/");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running ${config.url}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
