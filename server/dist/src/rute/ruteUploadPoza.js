"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, "../../public"));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // păstrează numele original
    },
});
const upload = (0, multer_1.default)({ storage });
router.post("/", upload.single("poza"), (req, res) => {
    if (!req.file)
        return res.status(400).json({ message: "Nicio imagine trimisă!" });
    res.json({ nume: req.file.originalname });
});
exports.default = router;
