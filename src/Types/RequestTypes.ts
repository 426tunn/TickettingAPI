import { Request } from "express";

export interface IAuthenticatedRequest<User> extends Request {
    user: User;
}

