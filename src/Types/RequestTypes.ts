import { Request } from "express";
import { SortOrder } from "mongoose";

export interface PaginationAndSort {
    sort?: "latest" | "popularity";
    order?: SortOrder;
    page?: number;
    perPage?: number;
}

export interface IPaginationAndSortReq {
    query: PaginationAndSort;
}

export interface IAuthenticatedRequest<User> extends Request {
    user: User;
}
