import express from "express";
import OrderController from "../controllers/OrderController";

const router = express.Router();

// Endpoint để tạo giao dịch thanh toán MoMo
router.post("/momo/create", OrderController.createMoMoPayment);

// Webhook xử lý thông báo từ MoMo
router.post("/momo/webhook", OrderController.momoWebhookHandler);

export default router;
