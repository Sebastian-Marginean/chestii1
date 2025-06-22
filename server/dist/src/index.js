"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
// Route import
const ruteProiecte_1 = __importDefault(require("./rute/ruteProiecte"));
const ruteTaskuri_1 = __importDefault(require("./rute/ruteTaskuri"));
const ruteCautari_1 = __importDefault(require("./rute/ruteCautari"));
const ruteUtilizatori_1 = __importDefault(require("./rute/ruteUtilizatori"));
const ruteEchipe_1 = __importDefault(require("./rute/ruteEchipe"));
const ruteSignup_1 = __importDefault(require("./rute/ruteSignup"));
const ruteLogin_1 = __importDefault(require("./rute/ruteLogin"));
const ruteUploadPoza_1 = __importDefault(require("./rute/ruteUploadPoza"));
const ruteTaskuri_2 = __importDefault(require("./rute/ruteTaskuri"));
// Config
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use((0, morgan_1.default)("common"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)({
    origin: "http://localhost:3000", // portul frontendului
    credentials: true,
}));
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../../uploads")));
app.use(express_1.default.static(path_1.default.join(__dirname, "../../public")));
// Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server-ul ruleaza pe portul ${port}`);
});
// Routes
app.get("/", (req, res) => {
    res.send("Ruta Home");
});
app.use("/proiecte", ruteProiecte_1.default);
app.use("/taskuri", ruteTaskuri_1.default);
app.use("/cauta", ruteCautari_1.default);
app.use("/utilizatori", ruteUtilizatori_1.default);
app.use("/echipe", ruteEchipe_1.default);
app.use("/signup", ruteSignup_1.default);
app.use("/login", ruteLogin_1.default);
app.use("/upload-poza", ruteUploadPoza_1.default);
app.use(ruteTaskuri_2.default);
