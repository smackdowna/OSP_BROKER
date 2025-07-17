import multer, { memoryStorage } from "multer";


const storage = memoryStorage();

export const singleUpload = multer({ storage }).single("file");

export const multipleUpload = multer({ storage }).array("files", 10);
