import express, { Router } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import chalk from "chalk";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(bodyParser.json());
app.use(logMiddleware);

const v1 = Router();
v1.get("/:species(dogs|cats)/breeds/list/all", handleRoute);
v1.get("/:species(dogs|cats)/breeds/:breed/images", handleRoute);
v1.post("/:species(dogs|cats)/breeds", handleRoute);

const v2 = Router();
v2.get("/:species(dogs|cats)/breeds/list/all", handleRoute);

app.use("/v1", v1);
app.use("/v2", v2);

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
function logMiddleware(req, res, next) {
  console.log(
    `${chalk.bgCyan(`[${localDate(new Date(), true)}]`)} ${chalk.yellow(
      req.method
    )} ${chalk.magenta(req.url)}`
  );
  next();
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns {void}
 */
function handleRoute(req, res) {
  const now = new Date();

  res.json({
    method: req.method,
    path: req.route.path,
    params: req.params,
    query: req.query,
    url: req.originalUrl,
    body: req.body,
    timestamp_iso: now.toISOString(),
    timestamp_local: localDate(now),
  });
}

/**
 * @param {Date} date
 * @param {boolean} [timeOnly = false]
 * @returns {string}
 */
function localDate(date, timeOnly = false) {
  return date.toLocaleString(["en-US"], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    ...(timeOnly
      ? null
      : {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          timeZoneName: "short",
        }),
  });
}

app.listen(3333);
