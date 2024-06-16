import { EventStatus } from "../Enums/EventStatus";
import { Request } from "express";
import { SortOrder } from "mongoose";

export interface IEventPaginationAndSort {
    sort?: "latest" | "popularity";
    order?: SortOrder;
    page?: number;
    perPage?: number;
    status?: EventStatus | EventStatus[];
    organizerId?: string;
    fieldsToSelect?: string;
    isDeleted?: boolean;
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
