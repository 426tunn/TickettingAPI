import { Request, Response } from "express";

export default class AdminController {
    public message: string;

    constructor() {
        this.message = "Admin home";
    }

    public default = (_req: Request, res: Response) => {
        const { message } = this;
        return res.status(200).json({ message });
    };
}
