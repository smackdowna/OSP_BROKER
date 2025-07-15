import multer, { memoryStorage } from "multer";


const storage = memoryStorage();

const singleUpload = multer({ storage }).single("file");

const multipleUpload = multer({ storage }).array("files", 10);

export default {singleUpload, multipleUpload};