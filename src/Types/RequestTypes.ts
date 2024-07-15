import { EventStatus } from "../Enums/EventStatus";
import { Request } from "express";
import { SortOrder } from "mongoose";

export interface IEventPaginationAndSort {
    sort?: "latest" | "popularity" | "date";
    order?: SortOrder;
    status?: EventStatus | EventStatus[];
    organizerId?: string;
    fieldsToSelect?: string;
    isDeleted?: boolean;
    startDate?: Date;
    endDate?: Date;
}

export interface IEventPaginationAndSortReq {
    query: {
        sort?: "latest" | "popularity" | "date";
        order?: SortOrder;
        page?: string;
        perPage?: string;
        organizerId: string;
        start?: string;
        end?: string;
    };
}

export interface IAuthenticatedRequest<User> extends Request {
    user: User;
}
