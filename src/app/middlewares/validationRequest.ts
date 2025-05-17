import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { AnyZodObject } from "zod";

const validationRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await schema.parseAsync({
      body: req.body,
      params:req.params,
      query:req.query,
      cookies: req.cookies
    });
    next();
  });
};
export default validationRequest;
