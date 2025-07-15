import DataUriParser from "datauri/parser.js";
import { extname } from "path";

const getDataUri = (file: Express.Multer.File) => {
  const parser = new DataUriParser();
  const extName = extname(file.originalname).toString();
  const result= parser.format(extName, file.buffer);
  return{
    content: result.content as string,
    fileName: result.fileName as string
  }
};

export default getDataUri;