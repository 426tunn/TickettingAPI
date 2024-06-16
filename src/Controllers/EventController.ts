import { Request, Response } from "express";
import { EventModel, IEvent } from "../Models/EventModel";
import { EventService } from "../Services/EventService";
import { matchedData, validationResult } from "express-validator";
import { IUser } from "../Models/UserModel";
import {
    IAuthenticatedRequest,
    IEventPaginationAndSortReq,
} from "../Types/RequestTypes";
import { UserRole } from "../Enums/UserRole";
import { EventCategory } from "../Enums/EventCategory";
import { EventTicketTypeService } from "../Services/EventTicketTypeService";
import { EventTicketTypeModel } from "../Models/EventTicketTypeModel";
import { TicketService } from "../Services/TicketService";
import { TicketModel } from "../Models/TicketModel";
import cloudinary from "../Config/cloudinaryConfig";
import { EventStatus } from "../Enums/EventStatus";
import { logger } from "../logging/logger";

export class EventController {
    private eventService: EventService;
    private eventTicketTypeService: EventTicketTypeService;
    private ticketService: TicketService;
    public eventBannerImageFolder = "teeket/event-image/banner";
    public eventMobileImageFolder = "teeket/event-image/mobile";

    constructor() {
        this.eventService = new EventService(EventModel);
        this.eventTicketTypeService = new EventTicketTypeService(
            EventTicketTypeModel,
        );
        this.ticketService = new TicketService(TicketModel);
    }

    public getCategories = async (_req: Request, res: Response) => {
        try {
            return res
                .status(200)
                .json({ eventCategories: Object.values(EventCategory) });
        } catch (error) {
            return res.status(500).json(error);
        }
    };

    public getAllEvents = async (
        req: Request & IEventPaginationAndSortReq,
        res: Response,
    ): Promise<Response<IEvent[] | []>> => {
        try {
            const page = parseInt(req.query.page || "1");
            const perPage = parseInt(req.query.perPage || "9");
            const { sort, order } = req.query;
            const { organizerId } = req.params;

            const events = await this.eventService.getAllEvents({
                sort,
                order,
                page,
                perPage,
                organizerId,
            });

            const totalNoOfPages = Math.ceil(events.length / perPage);
            return res
                .status(200)
                .json({ page, perPage, totalNoOfPages, events });
        } catch (error) {
            return res.status(500).json(error);
        }
    };

    public getOrganizerEvents = async (
        req: IAuthenticatedRequest<IUser> & IEventPaginationAndSortReq,
        res: Response,
    ): Promise<Response<IEvent[] | []>> => {
        try {
            const page = parseInt(req.query.page || "1");
            const perPage = parseInt(req.query.perPage || "9");
            const { sort, order } = req.query;

            const events = await this.eventService.getAllEvents({
                status: Object.values(EventStatus),
                sort,
                order,
                page,
                perPage,
                organizerId: req.user._id.toString(),
                fieldsToSelect:
                    "id name location startDate endDate media status",
            });

            const eventWithTicketDetails = events.map(async (event: IEvent) => {
                const { totalTickets, totalTicketsSold } =
                    await this.ticketService.getTicketSalesDetailsForEvent(
                        event.id,
                    );

                const availableTickets =
                    totalTickets - totalTicketsSold >= 0
                        ? totalTickets - totalTicketsSold
                        : 0;
                return {
                    ...event.toJSON(),
                    totalTickets,
                    totalTicketsSold,
                    availableTickets,
                };
            });

            const totalNoOfPages = Math.ceil(events.length / perPage);
            return res.status(200).json({
                page,
                perPage,
                totalNoOfPages,
                events: await Promise.all(eventWithTicketDetails),
            });
        } catch (error) {
            return res.status(500).json(error);
        }
    };

    public createEvent = async (
        req: IAuthenticatedRequest<IUser>,
        res: Response,
    ): Promise<Response<IEvent>> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const data = matchedData(req);
            const { ticketTypes, ...eventData } = data;
            eventData.organizerId = req.user._id;

            const newEvent = this.eventService.createEvent(eventData as IEvent);

            const today = new Date();
            const eventDateIsPast = today > newEvent.startDate;
            if (eventDateIsPast) {
                return res.status(400).json({
                    error: "The event start date should be in the future",
                });
            }
            if (newEvent.startDate >= newEvent.endDate) {
                return res.status(400).json({
                    error: "The start date should be before the end date",
                });
            }

            // TODO: look into maximum file constraint
            if (eventData?.media?.bannerImage) {
                const { url: bannerURL } = await cloudinary.uploader.upload(
                    `${eventData.media.bannerImage}`,
                    {
                        public_id: `${newEvent.id}`,
                        resource_type: "image",
                        folder: this.eventBannerImageFolder,
                    },
                );
                newEvent.media.bannerImageURL = bannerURL;
            }
            if (eventData?.media?.mobilePreviewImage) {
                const { url: mobilePreviewURL } =
                    await cloudinary.uploader.upload(
                        `${eventData.media.mobilePreviewImage}`,
                        {
                            public_id: `${newEvent.id}`,
                            resource_type: "image",
                            folder: this.eventMobileImageFolder,
                        },
                    );
                newEvent.media.mobilePreviewImageURL = mobilePreviewURL;
            }

            newEvent.save();
            await this.eventTicketTypeService.createEventTicketTypes(
                ticketTypes,
                newEvent._id as string,
            );
            return res.status(201).json({ event: newEvent });
        } catch (error) {
            return res.status(500).json(error);
        }
    };

    public getEventById = async (
        req: IAuthenticatedRequest<IUser>,
        res: Response,
    ): Promise<Response<IEvent | null>> => {
        try {
            const eventId = req.params.eventId;
            const event = await this.eventService.getEventById({
                eventId,
            });

            if (event == null) {
                return res.status(404).json({ error: "Event does not exists" });
            }

            if (
                req.user?.role === UserRole.Admin ||
                req.user?._id.toString() === event.organizerId.toString()
            ) {
                return res.status(200).json(event);
            }

            return res
                .status(403)
                .json({ error: "You do not have access to this event" });
        } catch (error) {
            return res.status(500).json(error);
        }
    };

    public getEventDetailsById = async (
        req: IAuthenticatedRequest<IUser>,
        res: Response,
    ): Promise<Response<IEvent | null>> => {
        try {
            const eventId = req.params.eventId;

            const event = await this.eventService.getEventById({ eventId });
            if (event == null) {
                return res.status(404).json({ error: "Event does not exists" });
            }

            const currentUserId = req.user._id.toString();
            const organizerId = event.organizerId.toString();
            if (
                currentUserId !== organizerId &&
                req.user.role === UserRole.User
            ) {
                return res.status(403).json({
                    error: "Only this event organizers and admins can access this endpoint",
                });
            }

            const ticketTypes =
                await this.eventTicketTypeService.getTicketTypesByEventId(
                    eventId,
                );

            const {
                salesByTicketType,
                totalTicketsSold,
                totalTickets,
                totalRevenue,
            } = await this.ticketService.getTicketSalesDetailsForEvent(eventId);

            return res.status(200).json({
                event: event.toJSON(),
                ticketTypes,
                totalRevenue,
                totalTicketsSold,
                totalTickets,
                salesByTicketType,
            });
        } catch (error) {
            return res.status(500).json(error);
        }
    };

    public updateEventById = async (
        req: IAuthenticatedRequest<IUser>,
        res: Response,
    ): Promise<Response<Event | null>> => {
        try {
            const eventId = req.params.eventId;
            const eventUpdate: Partial<IEvent> = req.body;

            const event = await this.eventService.getEventById({ eventId });
            if (event == null) {
                return res.status(404).json({ error: "Event does not exists" });
            }

            const currentUserId = req.user._id.toString();
            const organizerId = event.organizerId.toString();
            if (
                currentUserId !== organizerId &&
                req.user.role === UserRole.User
            ) {
                return res.status(403).json({
                    error: "Only this event organizers and admins can update the event",
                });
            }

            const today = new Date();
            const eventIsInPast = today > event.startDate;
            const updateIsOnEventDay = eventUpdate?.startDate?.getDate()
                ? event.startDate.getDate() !==
                      eventUpdate.startDate.getDate() &&
                  event.startDate.getDate() === today.getDate()
                : false;

            if (eventIsInPast) {
                return res.status(400).json({
                    error: "You cannot modify a past event.",
                });
            }
            if (updateIsOnEventDay) {
                return res.status(400).json({
                    error: "Event day can only be modified before the start day",
                });
            }

            const updatedEvent = await this.eventService.updateEventById(
                eventId,
                eventUpdate,
            );
            return res.status(200).json({ event: updatedEvent });
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    };

    public deleteEventById = async (
        req: Request,
        res: Response,
    ): Promise<Response<null>> => {
        try {
            const eventId = req.params.eventId;
            const event = await this.eventService.getEventById({ eventId });
            if (event == null) {
                return res.status(404).json({ error: "Event does not exists" });
            }
            await this.eventService.deleteEventById(eventId);
            // const eventBannerImage = event?.media?.bannerImageURL;
            // const eventMobileImage = event?.media?.mobilePreviewImageURL;
            //
            // if (eventBannerImage) {
            //     const res = await cloudinary.uploader.destroy(
            //         `${this.eventBannerImageFolder}/${event.id}`,
            //         {
            //             resource_type: "image",
            //         },
            //     );
            //     logger.info(
            //         `Event ${event.id} - ${event.name}: Banner image deleted status -> ${res.result}`,
            //     );
            // }
            //
            // if (eventMobileImage) {
            //     const res = await cloudinary.uploader.destroy(
            //         `${this.eventMobileImageFolder}/${event.id}`,
            //         {
            //             resource_type: "image",
            //         },
            //     );
            //     logger.info(
            //         `Event ${event.id} - ${event.name}: Mobile image deleted status -> ${res.result}`,
            //     );
            // }
            //
            return res.status(204).json();
        } catch (error) {
            return res.status(500).json(error);
        }
    };
}
