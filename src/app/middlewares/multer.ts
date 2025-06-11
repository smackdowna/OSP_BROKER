// add this middleware in the routes where you want to handle file uploads
import multer, { memoryStorage } from "multer";


const storage = memoryStorage();

const singleUpload = multer({ storage }).single("file");

export default singleUpload;