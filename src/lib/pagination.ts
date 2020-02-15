import { Request } from "express";

/**
 * getPaginationParams
 * @param req - Express.js Request
 */
export function getPaginationParams(req: Request) {
    const page: number = Number(req.query.page) || 0;
    const per_page: number = Number(req.query.per_page) || 300;
    const offset: number = per_page * page;
    return { page, per_page, offset };
}
