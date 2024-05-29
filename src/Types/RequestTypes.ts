import { EventStatus } from "../Enums/EventStatus";
import { Request } from "express";
import { SortOrder } from "mongoose";

export interface IEventPaginationAndSort {
    sort?: "latest" | "popularity";
    order?: SortOrder;
    page?: number;
    perPage?: number;
    status?: EventStatus;
    organizerId?: string;
    attributesToSelect?: string;
}

export interface IEventPaginationAndSortReq {
    query: {
        sort?: "latest" | "popularity";
        order?: SortOrder;
        page?: string;
        perPage?: string;
        organizerId: string;
    };
}

export interface IAuthenticatedRequest<User> extends Request {
    user: User;
}
