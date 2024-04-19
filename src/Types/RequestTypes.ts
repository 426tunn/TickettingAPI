import { Request } from "express";
import { SortOrder } from "mongoose";

export interface PaginationAndSort {
    sort?: "latest" | "popularity";
    order?: SortOrder;
    page?: number;
    perPage?: number;
}

export interface IPaginationAndSortReq {
    query: {
        sort?: "latest" | "popularity";
        order?: SortOrder;
        page?: string;
        perPage?: string;
    };
}

export interface IAuthenticatedRequest<User> extends Request {
    user: User;
}
