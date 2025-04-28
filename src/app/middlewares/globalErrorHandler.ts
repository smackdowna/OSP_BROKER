import {ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { TErrorSource } from "../interface/error";
import config from "../config";
import handleZodError from "../errors/zodError";
import handleValidationError from "../errors/validationError";
import handleCastError from "../errors/castError";
import AppError from "../errors/appError";


const globalErrorHandler : ErrorRequestHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message ="Something went wrong!";

    
    let errorSourse: TErrorSource = [{
        path: '',
        message: 'Something went wrong!'
    }];

    
    if(err instanceof ZodError){
        const simplifiedError = handleZodError(err);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorSourse = simplifiedError?.errorSources
        
    }else if(err?.name === "ValidationError"){
        const simplifiedError = handleValidationError(err);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorSourse = simplifiedError?.errorSources
    }else if(err?.name === "CastError"){
        const simplifiedError = handleCastError(err);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorSourse = simplifiedError?.errorSources
    }
    else if(err instanceof AppError){
        statusCode = err?.statusCode;
        message = err?.message;
        errorSourse = [{
            path: "",
            message : err?.message
        }]
    }
    else if(err instanceof Error){
        message = err?.message;
        errorSourse = [{
            path: "",
            message : err?.message
        }]
    }

     res.status(statusCode).json({
     success: false,
     message,
     errorSourse,
     stack: config.node_env === "development" ?  err?.stack : null,
    })

    return;
   }

   export default globalErrorHandler;