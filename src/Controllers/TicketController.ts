import { Request, Response } from "express";
import { TicketModel, ITicket } from "../Models/TicketModel";
import { TicketService } from "../Services/TicketService";
import { matchedData, validationResult } from "express-validator";
import { EventService } from "../Services/EventService";
import { UserService } from "../Services/UserService";
import { IUser, UserModel } from "../Models/UserModel";
import { EventModel } from "../Models/EventModel";
import { IAuthenticatedRequest } from "../Types/RequestTypes";
import { UserRole } from "../Enums/UserRole";
import { EventTicketTypeService } from "../Services/EventTicketTypeService";
import { EventTicketTypeModel } from "../Models/EventTicketTypeModel";

export class TicketController {
    private ticketService: TicketService;
    private eventService: EventService;
    private userService: UserService;
    private eventTicketTypeService: EventTicketTypeService;

    constructor() {
        this.ticketService = new TicketService(TicketModel);
        this.eventService = new EventService(EventModel);
        this.userService = new UserService(UserModel);
        this.eventTicketTypeService = new EventTicketTypeService(
            EventTicketTypeModel,
        );
    }

    public getAllTickets = async (
        _req: Request,
        res: Response,
    ): Promise<Response<ITicket[] | []>> => {
        try {
            const tickets = await this.ticketService.getAllTickets();
            return res.status(200).json({ tickets });
        } catch (error) {
            return res.status(500).json(error);
        }
    };

    public getTicketById = async (
        req: Request,
        res: Response,
    ): Promise<Response<ITicket | null>> => {
        try {
            const ticketId = req.params.ticketId;
            const ticket = await this.ticketService.getTicketById(ticketId);
            if (ticket == null) {
                return res
                    .status(404)
                    .json({ error: "Ticket does not exists" });
            }
            return res.status(200).json(ticket);
        } catch (error) {
            return res.status(500).json(error);
        }
    };

    public getEventTickets = async (
        req: IAuthenticatedRequest<IUser> & { eventId: string },
        res: Response,
    ): Promise<Response<ITicket[] | []>> => {
        try {
            const { eventId } = req.params;
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
            const tickets = await this.ticketService
                .getEventTickets(eventId)
                .populate("buyerId", "username firstname lastname email")
                .populate("eventTicketTypeId");
            return res.status(200).json({ tickets });
        } catch (error) {
            return res.status(500).json(error);
        }
    };

    public getUserEventTicket = async (
        req: Request & { eventId: string; buyerId: string },
        res: Response,
    ): Promise<Response<ITicket[] | []>> => {
        try {
            const { eventId, buyerId } = req.params;
            const event = await this.eventService.getEventById({ eventId });
            const user = await this.userService.getUserById(buyerId);

            if (event == null) {
                return res.status(404).json({ error: "Event does not exists" });
            }
            if (user == null) {
                return res.status(404).json({ error: "User does not exists" });
            }

            const tickets = await this.ticketService.getUserEventTicket(
                buyerId,
                eventId,
            );
            return res.status(200).json({ tickets });
        } catch (error) {
            return res.status(500).json(error);
        }
    };

    public createTicket = async (
        req: IAuthenticatedRequest<IUser>,
        res: Response,
    ): Promise<Response<ITicket>> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { eventTicketTypeId, eventId, quantity, owner } = req.body;
            const event = await this.eventService.getEventById({ eventId });
            const ticketType =
                await this.eventTicketTypeService.getEventTicketTypeById(
                    eventTicketTypeId,
                );

            if (event == null) {
                return res.status(400).json({ error: "Event not found" });
            }

            if (ticketType == null) {
                return res
                    .status(400)
                    .json({ error: "Event ticket Type not found" });
            }

            if (ticketType.eventId.toString() !== event.id) {
                return res
                    .status(400)
                    .json({ error: "Invalid event ticket type" });
            }

            const totalTicketSoldForTicketType =
                await this.ticketService.getTotalEventTicketTypessSold(
                    eventId,
                    eventTicketTypeId,
                );
            if (totalTicketSoldForTicketType + quantity > ticketType.quantity) {
                return res
                    .status(400)
                    .json({ error: "Event ticket type has sold out" });
            }

            const newTicket = await this.ticketService.createTicket({
                eventTicketTypeId: ticketType.id,
                eventId: event.id,
                buyerId: req.user._id as unknown as IUser,
                quantity,
                owner,
            } as ITicket);
            res.status(201).json({ ticket: newTicket });
        } catch (error) {
            res.status(500).json(error);
        }
    };

    public buyTickets = async (
        req: IAuthenticatedRequest<IUser>,
        res: Response,
    ) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            let { ticketsId } = matchedData(req);
            const data = await this.ticketService.buyTickets({
                ticketsId,
                buyer: req.user,
            });

            return res.status(200).json({ data });
        } catch (error) {
            console.error("Error in buyTickets:", error);
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res
                .status(500)
                .json({ message: "An unexpected error occurred" });
        }
    };

    public updateTicketById = async (
        req: Request & { ticketId: string },
        res: Response,
    ): Promise<Response<ITicket | null>> => {
        try {
            const { ticketId } = req.params;

            const ticket = await this.ticketService.getTicketById(ticketId);
            if (ticket == null) {
                return res
                    .status(404)
                    .json({ error: "Ticket does not exists" });
            }

            const ticketUpdate = {
                ...req.body,
                eventId: ticket.eventId,
                buyerId: ticket.buyerId,
            };
            const updatedTicket = await this.ticketService.updateTicketById(
                ticketId,
                ticketUpdate,
            );
            return res.status(200).json({ ticket: updatedTicket });
        } catch (error) {
            return res.status(500).json(error);
        }
    };

    public deleteTicketById = async (
        req: Request & { ticketId: string },
        res: Response,
    ): Promise<Response<null>> => {
        try {
            const { ticketId } = req.params;
            const ticket = await this.ticketService.getTicketById(ticketId);
            if (ticket == null) {
                return res
                    .status(404)
                    .json({ error: "Ticket does not exists" });
            }
            await this.ticketService.deleteTicketById(ticketId);
            return res.status(204).json();
        } catch (error) {
            return res.status(500).json(error);
        }
    };
}
