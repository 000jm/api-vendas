
import AppError from "@/common/domain/errors/app-errors";
import { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";

function errorHandle(err:Error, req:Request, res:Response, _next:NextFunction):Response {
    
    if(err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: err.statusCode,
            message: err.message
        })
    }

    if(err instanceof MulterError) {
        return res.status(400).json({
            status: 'error',
            message: err.message
        })
    }

    console.log(err)

    return res
    .status(500)
    .json({ status: 500, message: 'internal server error' })

}

export default errorHandle
