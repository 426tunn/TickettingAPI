import router, { type Router } from "express";
import AdminController from "../Controllers/AdminController";

const adminRouter: Router = router();
const adminController = new AdminController();

adminRouter.get("/", adminController.default);

export default adminRouter;
