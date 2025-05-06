import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import config from "./app/config";
import cookieParser from "cookie-parser";

import router from "./app/routes";
import notFoundHandler from "./app/middlewares/notFoundHandler";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";

const app = express();

// middlewares
app.use(cookieParser());

app.use(
    bodyParser.urlencoded({ 
        limit: (config.MAX_REQUEST_SIZE as string | number) || '100kb', 
        extended: true 
    })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
 next();
});

const corsOptions = {
  origin: ["http://localhost:8080", "https://osp-broker.web.app", "https://osp-broker.firebaseapp.com"],
  credentials: true,
  methods: ["GET", "POST", "DELETE", "PUT"],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); 


app.use(express.json());

if (config.node_env === "development") {
    app.use(morgan("tiny"));
}

// api route
app.get("/", (req, res) => {
    res.send("Welcome to the OSP_broker API");
  });

app.use("/api", router);

app.use(notFoundHandler);

app.use(globalErrorHandler)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${config.port}`);
});
