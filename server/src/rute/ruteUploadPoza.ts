import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../public"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // păstrează numele original
  },
});

const upload = multer({ storage });

router.post("/", upload.single("poza"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Nicio imagine trimisă!" });
  res.json({ nume: req.file.originalname });
});

export default router;