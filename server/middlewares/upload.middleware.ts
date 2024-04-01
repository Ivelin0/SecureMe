import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = "./images";
    const folderName = req.body.fcm_token;
    const folderPath = `${path}/${folderName}`;

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
      console.log(`Folder '${folderName}' created successfully.`);
    } else {
      console.log(`Folder '${folderName}' already exists.`);
    }

    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".png");
  },
});

const upload = multer({ storage: storage });

export default upload;
