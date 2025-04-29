import mongoose from "mongoose";
import { TErrorSource, TGenericErrorResponse } from "../interface/error";

const handleValidationError = (err : mongoose.Error.ValidationError): TGenericErrorResponse => {
    const statusCode = 400;
    const errorSources: TErrorSource = Object.values(err.errors).map((val : mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
        return{
            path: val?.path,
            message: val?.message
        }

    }) 

    return{
     statusCode,
     message: "Zod Validation Error.",
     errorSources,
    }
}

export default handleValidationError