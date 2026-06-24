import express from "express";
import authMiddleware from "../middleware/auth.js";
import { placeOrder, verifyOrder, updateStatus, userOrders, cancelOrder, listOrders } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", authMiddleware, verifyOrder);
orderRouter.post("/status", updateStatus);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.post("/cancel", authMiddleware, cancelOrder);
orderRouter.get('/list', listOrders);

export default orderRouter;