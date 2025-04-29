import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import catchAsync from '../utils/catchAsyncError';


const validateRequest = (schema : AnyZodObject) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        
        await schema.parse({
            body: req.body,
            cookies : req.cookies,
        });

       return next();
})
};

export default validateRequest;