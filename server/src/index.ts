import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";

// Route import
import ruteProiecte from "./rute/ruteProiecte";
import ruteTaskuri from "./rute/ruteTaskuri";
import ruteCautari from "./rute/ruteCautari";
import ruteUtilizatori from "./rute/ruteUtilizatori";
import ruteEchipe from "./rute/ruteEchipe";
import ruteSignup from "./rute/ruteSignup";
import ruteLogin from "./rute/ruteLogin";
import ruteUploadPoza from "./rute/ruteUploadPoza";
import comentariiRouter from "./rute/ruteTaskuri";

// Config
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:3000", // portul frontendului
    credentials: true,
  })
);
app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));
app.use(express.static(path.join(__dirname, "../../public")));

// Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server-ul ruleaza pe portul ${port}`);
});

// Routes
app.get("/", (req, res) => {
  res.send("Ruta Home");
});
app.use("/proiecte", ruteProiecte);
app.use("/taskuri", ruteTaskuri);
app.use("/cauta", ruteCautari);
app.use("/utilizatori", ruteUtilizatori);
app.use("/echipe", ruteEchipe);
app.use("/signup", ruteSignup);
app.use("/login", ruteLogin);
app.use("/upload-poza", ruteUploadPoza);
app.use(comentariiRouter);
