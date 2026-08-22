import type { Request, Response, NextFunction } from "express";

import { ZodError, type ZodTypeAny } from "zod";

export const validateBody = (schema: ZodTypeAny) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
            return res.status(400).json({
                error: 'Validation Failed',
                details: [{
                    field: 'body',
                    message: 'Request body is required and must be a JSON object.'
                }]
            });
        }

        try{ 
            const validateData = schema.parse(req.body);
            req.body = validateData;
            next();
        } catch(e) {
            if (e instanceof ZodError) {
                return res.status(400).json({
                    error: 'Validation Failed',
                    details: e.issues.map(err => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                })
            }
            next(e)
        }
    }
}

export const validateParams = (schema: ZodTypeAny) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try{ 
            schema.parse(req.params);
            next();
        } catch(e) {
            if (e instanceof ZodError) {
                return res.status(400).json({
                    error: 'Invalid Params',
                    details: e.issues.map(err => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                })
            }
            next(e)
        }
    }
}

export const validateQuery = (schema: ZodTypeAny) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try{ 
            schema.parse(req.query);
            next();
        } catch(e) {
            if (e instanceof ZodError) {
                return res.status(400).json({
                    error: 'Invalid Query',
                    details: e.issues.map(err => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                })
            }
            next(e)
        }
    }
}

export default validateBody;