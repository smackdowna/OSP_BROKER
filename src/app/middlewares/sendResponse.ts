import { Response } from "express";

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T;
};
const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  if (!res || typeof res.status !== "function") {
    throw new Error("Invalid Response object passed to sendResponse");
  }

  res.status(data.statusCode?? 200).json({
    success: data.success,
    message: data.message,
    data: data.data
  });
};

export default sendResponse;